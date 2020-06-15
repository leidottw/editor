import React from 'react';
import { Plugin } from 'prosemirror-state';

const isInLink = (state) => {
  const { empty, from, $from, to } = state.selection;
  if (empty) {
    return state.schema.marks.link.isInSet(state.storedMarks || $from.marks());
  }
  return state.doc.rangeHasMark(from, to, state.schema.marks.link);
};

const updateLinkTooltip = (view, setTooltip) => {
  if (isInLink(view.state)) {
    let coords;
    const node = view.state.doc.nodeAt(view.state.selection.$anchor.pos);
    if (node && node.type.name === 'image') {
      coords = view
        .domAtPos(view.state.selection.$anchor.pos)
        .node.getBoundingClientRect();
    } else {
      coords = view
        .domAtPos(view.state.selection.$anchor.pos)
        .node.parentNode.getBoundingClientRect();
    }

    setTooltip({
      top: coords.bottom,
      left: coords.left,
    });
  } else {
    setTooltip(null);
  }
};

export const linkTooltip = (setTooltip) =>
  new Plugin({
    view: (view) => ({
      update: () => {
        if (!view.hasFocus()) return;

        updateLinkTooltip(view, setTooltip);
      },
    }),
  });

export const Link = ({ top, left }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
      }}>
      123
    </div>
  );
};

export class LinkView {
  constructor(node, view, getPos) {
    this.dom = document.createElement('a');
    this.dom.setAttribute('href', node.attrs.href);
    this.dom.setAttribute('title', node.attrs.title);
  }
  update(node, decorations) {
    console.log(node, decorations);
    console.log('update');
    return true;
    // return false;
  }
  selectNode() {
    this.dom.classList.add('ProseMirror-selectednode');
    console.log('1234');
    console.log(arguments);
  }
  deselectNode() {
    this.dom.classList.remove('ProseMirror-selectednode');
  }
  setSelection(anchor, head, root) {
    console.log(anchor, head);
  }
  destroy() {
    console.log('destroy');
  }
}
