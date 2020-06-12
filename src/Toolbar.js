import React from 'react';
import 'styled-components/macro';
import { toggleMark } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';

const Toolbar = ({ state, view }) => {
  if (!state || !view) return null;

  return (
    <div style={{ display: 'flex' }}>
      <MenuButton
        select={toggleMark(state.schema.marks.strong)(state)}
        active={(() => {
          const { from, $from, to, empty } = state.selection;
          if (empty) {
            return state.schema.marks.strong.isInSet(
              state.storedMarks || $from.marks(),
            );
          }
          return state.doc.rangeHasMark(from, to, state.schema.marks.strong);
        })()}
        onClick={(e) => {
          toggleMark(state.schema.marks.strong)(state, view.dispatch);
          view.focus();
        }}>
        <b>B</b>
      </MenuButton>
      <MenuButton
        select={toggleMark(state.schema.marks.em)(state)}
        active={(() => {
          const { from, $from, to, empty } = state.selection;
          if (empty) {
            return state.schema.marks.em.isInSet(
              state.storedMarks || $from.marks(),
            );
          }
          return state.doc.rangeHasMark(from, to, state.schema.marks.em);
        })()}
        onClick={(e) => {
          toggleMark(state.schema.marks.em)(state, view.dispatch);
          view.focus();
        }}>
        <i>I</i>
      </MenuButton>
      <MenuButton
        select={toggleMark(state.schema.marks.u)(state)}
        active={(() => {
          const { from, $from, to, empty } = state.selection;
          if (empty) {
            return state.schema.marks.u.isInSet(
              state.storedMarks || $from.marks(),
            );
          }
          return state.doc.rangeHasMark(from, to, state.schema.marks.u);
        })()}
        onClick={(e) => {
          toggleMark(state.schema.marks.u)(state, view.dispatch);
          view.focus();
        }}>
        <span style={{ textDecoration: 'underline' }}>U</span>
      </MenuButton>
      <MenuButton
        select={wrapInList(state.schema.nodes.ordered_list)(state)}
        // active={(() => {
        //   console.log(state);
        //   const { from, $from, to, empty } = state.selection;
        //   // console.log(state.doc.nodeAt(from));
        //   console.log($from);
        //   if (empty) {
        //   }
        //   return false;
        // })()}
        onClick={(e) => {
          wrapInList(state.schema.nodes.ordered_list)(state, view.dispatch);
          view.focus();
        }}>
        ol
      </MenuButton>
      <MenuButton
        select={wrapInList(state.schema.nodes.bullet_list)(state)}
        // active={(() => {
        //   console.log(state);
        //   const { from, $from, to, empty } = state.selection;
        //   if (empty) {
        //   }
        //   return true;
        // })()}
        onClick={(e) => {
          wrapInList(state.schema.nodes.bullet_list)(state, view.dispatch);
          view.focus();
        }}>
        ul
      </MenuButton>
    </div>
  );
};

const MenuButton = ({ ...rest }) => (
  <button
    {...rest}
    css={`
      outline: none;
      border: 1px solid #2f2f2f;
      width: 24px;
      height: 24px;
      margin: 2px;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #2f2f2f;

      &:hover {
        background: #ffcc00;
      }

      &:active {
        background: #ffee00;
      }

      ${({ select }) => !select && `color: gray;`}
      ${({ active }) => active && `color: #ff0000;`}
    `}></button>
);

export default Toolbar;
