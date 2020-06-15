import React, { useEffect, useRef, useState } from 'react';
import 'styled-components/macro';
import './App.css';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import {
  baseKeymap,
  chainCommands,
  newlineInCode,
  createParagraphNear,
  liftEmptyBlock,
  splitBlock,
  setBlockType,
} from 'prosemirror-commands';
import {
  liftListItem,
  sinkListItem,
  splitListItem,
} from 'prosemirror-schema-list';
import { DOMParser } from 'prosemirror-model';
import { JSDOM } from 'jsdom';

import nsSchema from './nsSchema';
import { linkTooltip } from './nsPlugin';
import Toolbar from './Toolbar';

function App() {
  const editor = useRef();
  const [pmState, setPmState] = useState();
  const [pmView, setPmView] = useState();
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const plugins = [
      history(),
      keymap({
        ...baseKeymap,
        Enter: chainCommands(
          splitListItem(nsSchema.nodes.list_item),
          newlineInCode,
          createParagraphNear,
          liftEmptyBlock,
          splitBlock,
        ),
        Tab: chainCommands(
          sinkListItem(nsSchema.nodes.list_item),
          insertPlaceholder,
        ),
        'Shift-Tab': liftListItem(nsSchema.nodes.list_item),
        'Mod-z': undo,
        'Mod-y': redo,
      }),
      // linkTooltip(setTooltip),
    ];

    const dom = new JSDOM(
      `<meta charset='utf-8'><div data-pm-slice="0 0 []" data-en-clipboard="true"><u>fej</u><i><u>fo</u></i><u>wief</u>11111</div><div>vg<s>od-vim-cheat-sheet-full.pdf</s></div><div><s><span data-markholder="true"></span></s></div><ol><li><div>fwefwefwf</div></li></ol><div><br></div><ol><li><div><s>f3423411111111</s></div></li><ol><li><div><s>434</s></div></li><li><div><s>2333</s></div></li></ol></ol><div><s><span data-markholder="true"></span></s></div><div>263.64KB</div><div><span style="font-size: 64px;">&nbsp; &nbsp; &nbsp; lllll</span></div><div><br></div><div><a href="ftp://www.youtube.com/watch?v=04jAYEp11gQ" rev="en_rl_none" textcontent="ftp://www.youtube.com/watch?v=04jAYEp11gQ">ftp://www.youtube.com/watch?v=04jAYEp11gQ</a></div><div><u><span data-markholder="true"></span></u></div><div style="padding-left:40px;">&nbsp; &nbsp; &nbsp; &nbsp; <a href="http://localhost:8080/" rev="en_rl_none" textcontent="http://localhost:8080/">http://localhost:8080/</a></div><div><br></div><div>ewfwfew<sup>4444</sup>ffewfe<sub>43434</sub>djsfldjsfos</div><div><br></div><div><span style="font-size: 36px;"><a href="http://1111" rev="en_rl_none" textcontent="fefwefewfwe">fefwefewfwe</a><span data-highlight="yellow" style="background-color: #ffef9e;"><a href="http://1111" rev="en_rl_none" textcontent="fefe">fefe</a></span><a href="http://1111" rev="en_rl_none" textcontent="ef">ef</a></span></div><div><span style="color:#e27300;">fwefwefefwfef</span>fw</div><div><span style="color:rgb(226, 115, 0);">fwefwefefwfef</span>fw</div><div><br></div><div data-codeblock="true" style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, &quot;Courier New&quot;, monospace; font-size: 12px; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902); background-position: initial initial; background-repeat: initial initial;"><div data-plaintext="true">code code code</div><div data-plaintext="true">    code code</div><div data-plaintext="true">        code</div><div data-plaintext="true">    code code</div><div data-plaintext="true">code code code</div><div data-plaintext="true">    fewfwefewf</div></div><div><br></div>`,
    );

    const state = EditorState.create({
      schema: nsSchema,
      doc: DOMParser.fromSchema(nsSchema).parse(dom.window.document.body),
      // doc: nsSchema.nodeFromJSON(
      //   JSON.parse(
      //     '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"u"}],"text":"fej"},{"type":"text","marks":[{"type":"em"},{"type":"u"}],"text":"fo"},{"type":"text","marks":[{"type":"u"}],"text":"wief"},{"type":"text","text":"11111"}]},{"type":"paragraph","content":[{"type":"text","text":"vg"},{"type":"text","marks":[{"type":"del"}],"text":"od-vim-cheat-sheet-full.pdf"}]},{"type":"ordered_list","attrs":{"order":1},"content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"fwefwefwf"}]}]}]},{"type":"paragraph","content":[{"type":"hard_break"},{"type":"hard_break"}]},{"type":"ordered_list","attrs":{"order":1},"content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"del"}],"text":"f3423411111111"}]},{"type":"ordered_list","attrs":{"order":1},"content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"del"}],"text":"434"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"del"}],"text":"2333"}]}]}]}]}]},{"type":"paragraph","content":[{"type":"text","text":"263.64KB"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"fontSize","attrs":{"fontSize":64}}],"text":"      lllll"}]},{"type":"paragraph","content":[{"type":"hard_break"},{"type":"hard_break"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"ftp://www.youtube.com/watch?v=04jAYEp11gQ","title":"null"}}],"text":"ftp://www.youtube.com/watch?v=04jAYEp11gQ"}]},{"type":"paragraph","content":[{"type":"text","text":"        "},{"type":"text","marks":[{"type":"link","attrs":{"href":"http://localhost:8080/","title":"null"}}],"text":"http://localhost:8080/"}]},{"type":"paragraph","content":[{"type":"hard_break"},{"type":"hard_break"}]},{"type":"paragraph","content":[{"type":"text","text":"ewfwfew"},{"type":"text","marks":[{"type":"superscript"}],"text":"4444"},{"type":"text","text":"ffewfe"},{"type":"text","marks":[{"type":"subscript"}],"text":"43434"},{"type":"text","text":"djsfldjsfos"}]},{"type":"paragraph","content":[{"type":"hard_break"},{"type":"hard_break"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"http://1111","title":"null"}},{"type":"fontSize","attrs":{"fontSize":36}}],"text":"fefwefewfwe"},{"type":"text","marks":[{"type":"link","attrs":{"href":"http://1111","title":"null"}},{"type":"fontSize","attrs":{"fontSize":36}},{"type":"bg","attrs":{"color":"rgb(255, 239, 158)"}}],"text":"fefe"},{"type":"text","marks":[{"type":"link","attrs":{"href":"http://1111","title":"null"}},{"type":"fontSize","attrs":{"fontSize":36}}],"text":"ef"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"color","attrs":{"color":"rgb(226, 115, 0)"}}],"text":"fwefwefefwfef"},{"type":"text","text":"fw"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"color","attrs":{"color":"rgb(226, 115, 0)"}}],"text":"fwefwefefwfef"},{"type":"text","text":"fw"}]},{"type":"paragraph","content":[{"type":"hard_break"},{"type":"hard_break"}]},{"type":"code_block","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"code code code"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"    code code"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"        code"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"    code code"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"code code code"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"    fewfwefewf"}]}]},{"type":"paragraph","content":[{"type":"hard_break"},{"type":"hard_break"}]}]}',
      //   ),
      // ),
      // doc: nsSchema.node('doc', null, [
      //   nsSchema.node('paragraph', null, [nsSchema.text('One.')]),
      //   nsSchema.node('horizontal_rule'),
      //   nsSchema.node('paragraph', null, [nsSchema.text('Two!')]),
      // ]),
      plugins,
    });
    setPmState(state);

    const view = new EditorView(
      { mount: editor.current },
      {
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
        nodeViews: {
          link: (node, view, getPos) => new LinkView(node, view, getPos),
        },
        transformPastedHTML(text) {
          console.log(text);
          return text;
        },
      },
    );
    setPmView(view);
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h1 style={{ flexShrink: 0, padding: '0 40px', textAlign: 'center' }}>
        ProseMirror Sandbox
      </h1>
      <Toolbar state={pmState} view={pmView} />
      <div
        style={{
          padding: '20px 40px',
          flexGrow: 1,
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
        }}
        css={`
          & p {
            margin: 0;
            line-height: 1.5;
          }
        `}
        ref={editor}
      />
      {tooltip ? <Link {...tooltip} /> : null}
      <div id="popupContainer" />
      <div style={{ margin: '10px 0' }}>
        <button
          onClick={() => {
            console.log(DOMParser.fromSchema(nsSchema).parse(editor.current));
            console.log(
              JSON.stringify(
                DOMParser.fromSchema(nsSchema).parse(editor.current).toJSON(),
              ),
            );
          }}
        >
          parse editor
        </button>
      </div>
    </div>
  );
}

export default App;

const Link = ({ top, left }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
      }}
    >
      123
    </div>
  );
};

class LinkView {
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

const insertPlaceholder = (state, dispatch, view) => {
  let isInListItem = false;
  const { nodeBefore, nodeAfter, parent: node } = state.selection.$from;
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
      const indent = node.attrs.indent ? node.attrs.indent + 1 : 1;
      return setBlockType(state.schema.nodeType(node.type.name), {
        ...node.attrs,
        indent,
      })(state, dispatch);
    }
  }
  return true;
};
