import React from 'react';
import 'styled-components/macro';
import { toggleMark } from 'prosemirror-commands';
import { DOMParser } from 'prosemirror-model';
import { wrapInList } from 'prosemirror-schema-list';
import { exclusiveToogleMark } from './nsCommand';

const Toolbar = ({ state, view, editorRef }) => {
  if (!state || !view) return null;

  return (
    <div
      style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        height: 50,
        borderTop: '1px solid #dfdfdf',
        borderBottom: '1px solid #dfdfdf',
      }}>
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
        select={toggleMark(state.schema.marks.del)(state)}
        active={(() => {
          const { from, $from, to, empty } = state.selection;
          if (empty) {
            return state.schema.marks.del.isInSet(
              state.storedMarks || $from.marks(),
            );
          }
          return state.doc.rangeHasMark(from, to, state.schema.marks.del);
        })()}
        onClick={(e) => {
          toggleMark(state.schema.marks.del)(state, view.dispatch);
          view.focus();
        }}>
        <span style={{ textDecoration: 'line-through' }}>S</span>
      </MenuButton>
      <MenuButton
        select={exclusiveToogleMark(state.schema.marks.superscript)(state)}
        active={(() => {
          const { from, $from, to, empty } = state.selection;
          if (empty) {
            return state.schema.marks.superscript.isInSet(
              state.storedMarks || $from.marks(),
            );
          }
          return state.doc.rangeHasMark(
            from,
            to,
            state.schema.marks.superscript,
          );
        })()}
        onClick={(e) => {
          exclusiveToogleMark(
            state.schema.marks.superscript,
            state.schema.marks.subscript,
          )(state, view.dispatch);
          view.focus();
        }}>
        X<sup>2</sup>
      </MenuButton>
      <MenuButton
        select={exclusiveToogleMark(state.schema.marks.subscript)(state)}
        active={(() => {
          const { from, $from, to, empty } = state.selection;
          if (empty) {
            return state.schema.marks.subscript.isInSet(
              state.storedMarks || $from.marks(),
            );
          }
          return state.doc.rangeHasMark(from, to, state.schema.marks.subscript);
        })()}
        onClick={(e) => {
          exclusiveToogleMark(
            state.schema.marks.subscript,
            state.schema.marks.superscript,
          )(state, view.dispatch);
          view.focus();
        }}>
        X<sub>2</sub>
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
      <MenuButton
        select={true}
        onClick={() => {
          const editor = DOMParser.fromSchema(state.schema).parse(
            editorRef.current,
          );
          console.log(editor, JSON.stringify(editor.toJSON()));
        }}>
        Parse
      </MenuButton>
    </div>
  );
};

const MenuButton = ({ ...rest }) => (
  <button
    {...rest}
    css={`
      outline: 0;
      border: 0;
      width: 24px;
      height: 24px;
      font-size: 20px;
      cursor: pointer;
      color: #2f2f2f;
      background: none;

      &:hover {
        opacity: 0.5;
      }

      ${({ select }) => !select && `color: gray;`}
      ${({ active }) => active && `color: #00ce70;`}
    `}></button>
);

export default Toolbar;
