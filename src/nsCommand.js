import { setBlockType, toggleMark } from 'prosemirror-commands';
import { Slice, Fragment } from 'prosemirror-model';

export const insertPlaceholder = (state, dispatch, view) => {
  let isInListItem = false;
  const { parent } = state.selection.$from;
  state.doc.nodesBetween(
    state.selection.$anchor.pos - 1,
    state.selection.$anchor.pos,
    (targetNode) => {
      if (
        targetNode.type.name == 'list_item' ||
        targetNode.type.name == 'check_list_item'
      )
        isInListItem = true;
    },
  );
  if (state.selection.empty) {
    dispatch(state.tr.insertText(String.fromCharCode(9), state.selection.from));
  } else {
    if (isInListItem) {
      dispatch(
        state.tr.insertText(String.fromCharCode(9), state.selection.from),
      );
    } else {
      const indent = parent.attrs.indent ? parent.attrs.indent + 1 : 1;
      return setBlockType(state.schema.nodeType(parent.type.name), {
        ...parent.attrs,
        indent,
      })(state, dispatch);
    }
  }
  return true;
};

// copy from prosemirror-commands
function markApplies(doc, ranges, type) {
  for (let i = 0; i < ranges.length; i++) {
    let { $from, $to } = ranges[i];
    let can = $from.depth == 0 ? doc.type.allowsMarkType(type) : false;
    doc.nodesBetween($from.pos, $to.pos, (node) => {
      if (can) return false;
      can = node.inlineContent && node.type.allowsMarkType(type);
    });
    if (can) return true;
  }
  return false;
}

export function exclusiveToogleMark(markType, removeMarkType) {
  return (state, dispatch, view) => {
    const { empty, $cursor, ranges, $from, $to } = state.selection;
    if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType))
      return false;
    if (dispatch) {
      if ($cursor) {
        // 檢查是否有互斥mark
        if (removeMarkType.isInSet(state.storedMarks || $cursor.marks())) {
          // 移除互斥mark再套用目標mark
          dispatch(
            state.tr
              .removeStoredMark(removeMarkType)
              .addStoredMark(markType.create()),
          );
        } else {
          // 沒有互斥mark走正常toogleMark
          toggleMark(markType)(state, dispatch);
        }
      } else {
        // 檢查是否有互斥mark
        if (state.doc.rangeHasMark($from.pos, $to.pos, removeMarkType)) {
          // 移除互斥mark再套用目標mark
          dispatch(
            state.tr
              .removeMark($from.pos, $to.pos, removeMarkType)
              .addMark($from.pos, $to.pos, markType.create()),
          );
        } else {
          // 沒有互斥mark走正常toogleMark
          toggleMark(markType)(state, dispatch);
        }
      }
    }
    return true;
  };
}

// from prosemirror-schema-list src/schema-list.js, function splitListItem
// :: (NodeType) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
// Build a command that splits a non-empty textblock at the top level
// of a list item by also splitting that list item.
export function splitCheckListItem(itemType) {
  return function (state, dispatch) {
    let { $from, $to, node } = state.selection;
    if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to))
      return false;
    let grandParent = $from.node(-1);
    if (grandParent.type != itemType) return false;
    if ($from.parent.content.size == 0) {
      // In an empty block. If this is a nested list, the wrapping
      // list item should be split. Otherwise, bail out and let next
      // command handle lifting.
      if (
        $from.depth == 2 ||
        $from.node(-3).type != itemType ||
        $from.index(-2) != $from.node(-2).childCount - 1
      )
        return false;
      if (dispatch) {
        let wrap = Fragment.empty,
          keepItem = $from.index(-1) > 0;
        // Build a fragment containing empty versions of the structure
        // from the outer list item to the parent node of the cursor
        for (
          let d = $from.depth - (keepItem ? 1 : 2);
          d >= $from.depth - 3;
          d--
        )
          wrap = Fragment.from($from.node(d).copy(wrap));
        // Add a second list item with an empty default start node
        wrap = wrap.append(Fragment.from(itemType.createAndFill()));
        let tr = state.tr.replace(
          $from.before(keepItem ? null : -1),
          $from.after(-3),
          new Slice(wrap, keepItem ? 3 : 2, 2),
        );
        tr.setSelection(
          state.selection.constructor.near(
            tr.doc.resolve($from.pos + (keepItem ? 3 : 2)),
          ),
        );
        dispatch(tr.scrollIntoView());
      }
      return true;
    }
    // === target to replace ===
    // let nextType =
    //   $to.pos == $from.end() ? grandParent.contentMatchAt(0).defaultType : null;
    // === replacement ===
    let nextType =
      $to.pos == $from.end()
        ? grandParent.contentMatchAt($from.indexAfter(-1)).defaultType
        : null;
    // =========================
    let tr = state.tr.delete($from.pos, $to.pos);
    // === target to replace ===
    // let types = nextType && [null, { type: nextType }];
    // === replacement ===
    let types = nextType && [{ type: itemType }, { type: nextType }];
    if (!types) types = [{ type: itemType }, null];
    // =========================
    if (!canSplitCheckList(tr.doc, $from.pos, 2, types)) return false;
    if (dispatch) dispatch(tr.split($from.pos, 2, types).scrollIntoView());
    return true;
  };
}

// from: prosemirror-transfrom src/structure.js, function canSplit
// :: (Node, number, number, ?[?{type: NodeType, attrs: ?Object}]) → bool
// Check whether splitting at the given position is allowed.
function canSplitCheckList(doc, pos, depth = 1, typesAfter) {
  let $pos = doc.resolve(pos),
    base = $pos.depth - depth;
  let innerType =
    (typesAfter && typesAfter[typesAfter.length - 1]) || $pos.parent;
  if (
    base < 0 ||
    $pos.parent.type.spec.isolating ||
    !$pos.parent.canReplace($pos.index(), $pos.parent.childCount) ||
    !innerType.type.validContent(
      $pos.parent.content.cutByIndex($pos.index(), $pos.parent.childCount),
    )
  )
    return false;
  for (let d = $pos.depth - 1, i = depth - 2; d > base; d--, i--) {
    let node = $pos.node(d),
      index = $pos.index(d);
    if (node.type.spec.isolating) return false;
    let rest = node.content.cutByIndex(index, node.childCount);
    let after = (typesAfter && typesAfter[i]) || node;
    // 避免自動帶入選取狀態
    // if (after != node)
    //   rest = rest.replaceChild(0, after.type.create(after.attrs));
    if (
      !node.canReplace(index + 1, node.childCount) ||
      !after.type.validContent(rest)
    )
      return false;
  }
  let index = $pos.indexAfter(base);
  let baseType = typesAfter && typesAfter[0];
  return $pos
    .node(base)
    .canReplaceWith(
      index,
      index,
      baseType ? baseType.type : $pos.node(base + 1).type,
    );
}

export function removeFormat(state, view) {
  const tr = state.tr;
  const { $from, $to } = tr.selection;
  tr.removeMark($from.pos, $to.pos);
  tr.setStoredMarks([]);
  view.dispatch(tr);
}
