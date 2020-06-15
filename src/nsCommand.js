import { setBlockType, toggleMark } from 'prosemirror-commands';

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
