import React, { useEffect, useRef, useState } from 'react';
import 'styled-components/macro';
import './App.css';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { DOMParser } from 'prosemirror-model';

import nsSchema from './nsSchema';
import { linkTooltip } from './nsPlugin';
import Toolbar from './Toolbar';

function App() {
  const editor = useRef();
  const [pmState, setPmState] = useState();
  const [pmView, setPmView] = useState();

  useEffect(() => {
    const plugins = [
      history(),
      keymap({ ...baseKeymap, 'Mod-z': undo, 'Mod-y': redo }),
      linkTooltip(),
    ];

    const state = EditorState.create({
      schema: nsSchema,
      doc: nsSchema.nodeFromJSON(
        JSON.parse(
          '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"u"}],"text":"fej"},{"type":"text","marks":[{"type":"em"},{"type":"u"}],"text":"fo"},{"type":"text","marks":[{"type":"u"}],"text":"w"},{"type":"text","marks":[{"type":"strong"},{"type":"u"}],"text":"ief"},{"type":"text","text":"11111"}]},{"type":"paragraph","content":[{"type":"text","text":"vgod-vim-cheat-sheet-full.pdf"}]},{"type":"paragraph","content":[{"type":"text","text":"263.64KB"}]},{"type":"paragraph","content":[{"type":"text","text":"lllll"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"u"}],"text":"ftp://www.youtube.com/watch?v=04jAYEp11gQ"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"http://localhost:8080/","title":"http://localhost:8080/"}},{"type":"u"}],"text":"http://localhost:8080/"}]},{"type":"paragraph","content":[{"type":"text","text":"ewfwfew"},{"type":"text","marks":[{"type":"superscript"}],"text":"4444"},{"type":"text","text":"ffewfe"},{"type":"text","marks":[{"type":"subscript"}],"text":"43434"},{"type":"text","text":"djsfldjsfos"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"fontSize","attrs":{"fontSize":36}}],"text":"fefwe"},{"type":"text","marks":[{"type":"fontSize","attrs":{"fontSize":36}},{"type":"color","attrs":{"color":"rgb(255, 0, 42)"}}],"text":"few"},{"type":"text","marks":[{"type":"fontSize","attrs":{"fontSize":36}}],"text":"fwe"},{"type":"text","marks":[{"type":"fontSize","attrs":{"fontSize":36}},{"type":"bg","attrs":{"color":"rgb(255, 239, 158)"}}],"text":"fe"},{"type":"text","marks":[{"type":"fontSize","attrs":{"fontSize":36}},{"type":"color","attrs":{"color":"rgb(87, 21, 198)"}},{"type":"bg","attrs":{"color":"rgb(255, 239, 158)"}}],"text":"fe"},{"type":"text","marks":[{"type":"fontSize","attrs":{"fontSize":36}},{"type":"color","attrs":{"color":"rgb(87, 21, 198)"}}],"text":"ef"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"color","attrs":{"color":"rgb(226, 115, 0)"}}],"text":"fwefwefefwfef"},{"type":"text","text":"fw"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"color","attrs":{"color":"rgb(226, 115, 0)"}}],"text":"fwefwefefwfef"},{"type":"text","text":"fw"}]}]}',
        ),
      ),
      // doc: nsSchema.node('doc', null, [
      //   nsSchema.node('paragraph', null, [nsSchema.text('One.')]),
      //   nsSchema.node('horizontal_rule'),
      //   nsSchema.node('paragraph', null, [nsSchema.text('Two!')]),
      // ]),
      plugins,
    });
    setPmState(state);

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

        setPmState(newState);
        setPmView(view);
      },
    });
    setPmView(view);
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 10px',
      }}>
      <Toolbar state={pmState} view={pmView} />
      <div
        style={{
          border: '1px solid #2f2f2f',
          padding: '0 10px',
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
        }}
        css={`
          .ProseMirror {
            flex-grow: 1;
          }
        `}
        ref={editor}
      />
      <div style={{ margin: '10px 0' }}>
        <button
          onClick={() => {
            console.log(DOMParser.fromSchema(nsSchema).parse(editor.current));
            console.log(
              JSON.stringify(
                DOMParser.fromSchema(nsSchema).parse(editor.current).toJSON(),
              ),
            );
          }}>
          parse editor
        </button>
      </div>
    </div>
  );
}

export default App;
