import { Plugin } from 'prosemirror-state';

const isInLink = (state) => {
  const { empty, from, $from, to } = state.selection;
  if (empty) {
    return (
      state.schema.marks.link.isInSet(state.storedMarks || $from.marks()) ||
      ($from.nodeAfter &&
        state.schema.marks.link.isInSet($from.nodeAfter.marks)) ||
      ($from.nodeBefore &&
        state.schema.marks.link.isInSet($from.nodeBefore.marks))
    );
  }
  return state.doc.rangeHasMark(from, to, state.schema.marks.link);
};

const updateLinkTooltip = (view) => {
  if (isInLink(view.state)) {
    console.log('show tooltip');
  }
};

export const linkTooltip = () =>
  new Plugin({
    view: (view) => ({
      update: () => {
        if (!view.hasFocus()) return;

        updateLinkTooltip(view);
      },
    }),
  });
