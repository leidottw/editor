import React, { useEffect, useRef } from 'react';
import './App.css';

import { nodes, marks } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { DOMParser, Schema } from 'prosemirror-model';

function App() {
  const editor = useRef();

  const newNodes = Object.assign({}, nodes, {
    video: {
      inline: true,
      attrs: { src: {} },
      group: 'inline',
      parseDOM: [
        {
          tag: 'video[src]',
          getAttrs(dom) {
            return { src: dom.getAttribute('src') };
          },
        },
      ],
      toDOM(node) {
        const { src } = node.attrs;
        return ['video', { src, controls: true }];
      },
    },
  });

  const schema = new Schema({ nodes: newNodes, marks });

  useEffect(() => {
    const state = EditorState.create({
      schema,
      doc: schema.node('doc', null, [
        schema.node('paragraph', null, [schema.text('One.')]),
        schema.node('horizontal_rule'),
        schema.node('paragraph', null, [schema.text('Two!')]),
      ]),
      plugins: [
        history(),
        keymap({ 'Mod-z': undo, 'Mod-y': redo }),
        keymap(baseKeymap),
      ],
    });

    const view = new EditorView(editor.current, {
      state,
      dispatchTransaction(transaction) {
        console.log(
          'Document size went from',
          transaction.before.content.size,
          'to',
          transaction.doc.content.size,
        );
        let newState = view.state.apply(transaction);
        view.updateState(newState);
      },
    });
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 10px',
      }}>
      <div
        style={{
          border: '1px solid #2f2f2f',
          padding: '0 10px',
          flexGrow: 1,
          overflowY: 'auto',
        }}>
        <div ref={editor} />
      </div>
      <div style={{ margin: '10px 0' }}>
        <button
          onClick={() => {
            console.log(DOMParser.fromSchema(schema).parse(editor.current));
          }}>
          parse editor
        </button>
      </div>
      <div>
        text
        <video
          src="http://172.17.28.119:8080/video/p/api/video.php?a=display&f=tddM2F&ac=MHwxMDN8NTcxfDA="
          controls
        />
        text
      </div>
    </div>
  );
}

export default App;
