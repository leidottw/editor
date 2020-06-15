import React, { useEffect, useRef, useState } from 'react';
import 'styled-components/macro';
import './App.css';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, chainCommands } from 'prosemirror-commands';
import {
  liftListItem,
  sinkListItem,
  splitListItem,
} from 'prosemirror-schema-list';
import { DOMParser } from 'prosemirror-model';
import { JSDOM } from 'jsdom';

import nsSchema from './nsSchema';
import { insertPlaceholder } from './nsCommand';
import { linkTooltip, Link, LinkView } from './linkPlugin';

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
          baseKeymap['Enter'],
        ),
        Tab: chainCommands(
          sinkListItem(nsSchema.nodes.list_item),
          insertPlaceholder,
        ),
        'Shift-Tab': liftListItem(nsSchema.nodes.list_item),
        'Mod-z': undo,
        'Mod-y': redo,
      }),
      linkTooltip(setTooltip),
    ];

    // evernote
    const dom = new JSDOM(
      `<meta charset='utf-8'><h1 data-pm-slice="0 0 []" data-en-clipboard="true">各種元素</h1><h2>文字Mark</h2><div style="padding-left:40px;"><span data-fontfamily="handwritten">字型</span></div><div style="padding-left:40px;"><span style="font-size: 30px;">字體30</span></div><div style="padding-left:40px;"><b>粗體</b></div><div style="padding-left:40px;"><i>斜體</i></div><div style="padding-left:40px;"><u>底線</u></div><div style="padding-left:40px;"><span style="color:rgb(255, 0, 42);">紅字</span></div><div style="padding-left:40px;"><span data-highlight="red" style="background-color: #fec1d0;">紅底</span></div><div style="padding-left:40px;"><s>刪除線</s></div><div style="padding-left:40px;">內文<sup>上標</sup></div><div style="padding-left:40px;">內文<sub>下標</sub></div><div><br></div><h2>對齊</h2><div>置左</div><div style="text-align:center;">置中</div><div style="text-align:right;">置右</div><div><br></div><h2>分隔線</h2><hr><div><br></div><h2>表格</h2><table><colgroup><col style="width: 190px;"><col style="width: 190px;"></colgroup><tbody><tr><td style="border-color:#ccc;border-width:1px;border-style:solid;padding:10px;"><div><br></div></td><td style="border-color:#ccc;border-width:1px;border-style:solid;padding:10px;"><div><br></div></td></tr><tr><td style="border-color:#ccc;border-width:1px;border-style:solid;padding:10px;"><div><br></div></td><td style="border-color:#ccc;border-width:1px;border-style:solid;padding:10px;"><div><br></div></td></tr></tbody></table><h2>連結</h2><div><a href="http://localhost:8080/" rev="en_rl_none" textcontent="http://localhost:8080/">http://localhost:8080/</a></div><div><a href="ftp://www.youtube.com/watch?v=04jAYEp11gQ" rev="en_rl_none" textcontent="ftp://www.youtube.com/watch?v=04jAYEp11gQ">ftp://www.youtube.com/watch?v=04jAYEp11gQ</a></div><div><br></div><h2>序列元素</h2><ul><li><div>無序1</div></li><ul><li><div>無序2</div></li><li><div>無序3</div></li><ul><li><div>無序4</div></li></ul></ul></ul><div><br></div><ol><li><div>有序1</div></li><ol><li><div>有序2</div></li><li><div>有序3</div></li><ol><li><div>有序4</div></li></ol></ol></ol><div><br></div><ul data-todo="true"><li><div>task1</div></li><ul data-todo="true"><li data-checked="false"><div>task2</div></li><li data-checked="false"><div>task3</div></li><ul data-todo="true"><li data-checked="false"><div>task4</div></li></ul></ul></ul><div><br></div><h2>相片</h2><img data-hash="986e3980dd62f5bc0c3aca9c4b750fc0" filename="截圖 2020-06-10 下午3.22.54.png" filesize="42258" recognition="[object Object]" data-url="https://www.evernote.com/shard/s599/res/55795bd0-78e0-754c-b87c-eb09fa409929" isink="false" data-natural-width="847" data-natural-height="718" data-type="image/png" src="https://www.evernote.com/shard/s599/res/55795bd0-78e0-754c-b87c-eb09fa409929"><div><br></div><h2>程式碼</h2><div data-codeblock="true" style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, &quot;Courier New&quot;, monospace; font-size: 12px; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902); background-position: initial initial; background-repeat: initial initial;"><div data-plaintext="true">function App() {</div><div data-plaintext="true">  const editor = useRef();</div><div data-plaintext="true">  const [pmState, setPmState] = useState();</div><div data-plaintext="true">  const [pmView, setPmView] = useState();</div><div data-plaintext="true">  const [tooltip, setTooltip] = useState(null);</div><div data-plaintext="true"><br></div><div data-plaintext="true">  useEffect(() =&gt; {</div><div data-plaintext="true">    const plugins = [</div><div data-plaintext="true">      history(),</div><div data-plaintext="true">      keymap({</div><div data-plaintext="true">        ...baseKeymap,</div><div data-plaintext="true">        Enter: chainCommands(</div><div data-plaintext="true">          splitListItem(nsSchema.nodes.list_item),</div><div data-plaintext="true">          newlineInCode,</div><div data-plaintext="true">          createParagraphNear,</div><div data-plaintext="true">          liftEmptyBlock,</div><div data-plaintext="true">          splitBlock,</div><div data-plaintext="true">        ),</div><div data-plaintext="true">        Tab: chainCommands(</div><div data-plaintext="true">          sinkListItem(nsSchema.nodes.list_item),</div><div data-plaintext="true">          insertPlaceholder,</div><div data-plaintext="true">        ),</div><div data-plaintext="true">        'Shift-Tab': liftListItem(nsSchema.nodes.list_item),</div><div data-plaintext="true">        'Mod-z': undo,</div><div data-plaintext="true">        'Mod-y': redo,</div><div data-plaintext="true">      }),</div><div data-plaintext="true">      // linkTooltip(setTooltip),</div><div data-plaintext="true">    ];</div><div data-plaintext="true"><br></div><div data-plaintext="true">  ...</div><div data-plaintext="true">}</div></div><div><br></div>`,
    );

    const state = EditorState.create({
      schema: nsSchema,
      // from dom
      doc: DOMParser.fromSchema(nsSchema).parse(dom.window.document.body),
      // from json
      // doc: nsSchema.nodeFromJSON(
      //   JSON.parse(
      //     '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"u"}],"text":"fej"},{"type":"text","marks":[{"type":"em"},{"type":"u"}],"text":"fo"},{"type":"text","marks":[{"type":"u"}],"text":"wief"},{"type":"text","text":"11111"}]},{"type":"paragraph","content":[{"type":"text","text":"vg"},{"type":"text","marks":[{"type":"del"}],"text":"od-vim-cheat-sheet-full.pdf"}]},{"type":"ordered_list","attrs":{"order":1},"content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","text":"fwefwefwf"}]}]}]},{"type":"paragraph","content":[{"type":"hard_break"},{"type":"hard_break"}]},{"type":"ordered_list","attrs":{"order":1},"content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"del"}],"text":"f3423411111111"}]},{"type":"ordered_list","attrs":{"order":1},"content":[{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"del"}],"text":"434"}]}]},{"type":"list_item","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"del"}],"text":"2333"}]}]}]}]}]},{"type":"paragraph","content":[{"type":"text","text":"263.64KB"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"fontSize","attrs":{"fontSize":64}}],"text":"      lllll"}]},{"type":"paragraph","content":[{"type":"hard_break"},{"type":"hard_break"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"ftp://www.youtube.com/watch?v=04jAYEp11gQ","title":"null"}}],"text":"ftp://www.youtube.com/watch?v=04jAYEp11gQ"}]},{"type":"paragraph","content":[{"type":"text","text":"        "},{"type":"text","marks":[{"type":"link","attrs":{"href":"http://localhost:8080/","title":"null"}}],"text":"http://localhost:8080/"}]},{"type":"paragraph","content":[{"type":"hard_break"},{"type":"hard_break"}]},{"type":"paragraph","content":[{"type":"text","text":"ewfwfew"},{"type":"text","marks":[{"type":"superscript"}],"text":"4444"},{"type":"text","text":"ffewfe"},{"type":"text","marks":[{"type":"subscript"}],"text":"43434"},{"type":"text","text":"djsfldjsfos"}]},{"type":"paragraph","content":[{"type":"hard_break"},{"type":"hard_break"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"http://1111","title":"null"}},{"type":"fontSize","attrs":{"fontSize":36}}],"text":"fefwefewfwe"},{"type":"text","marks":[{"type":"link","attrs":{"href":"http://1111","title":"null"}},{"type":"fontSize","attrs":{"fontSize":36}},{"type":"bg","attrs":{"color":"rgb(255, 239, 158)"}}],"text":"fefe"},{"type":"text","marks":[{"type":"link","attrs":{"href":"http://1111","title":"null"}},{"type":"fontSize","attrs":{"fontSize":36}}],"text":"ef"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"color","attrs":{"color":"rgb(226, 115, 0)"}}],"text":"fwefwefefwfef"},{"type":"text","text":"fw"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"color","attrs":{"color":"rgb(226, 115, 0)"}}],"text":"fwefwefefwfef"},{"type":"text","text":"fw"}]},{"type":"paragraph","content":[{"type":"hard_break"},{"type":"hard_break"}]},{"type":"code_block","content":[{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"code code code"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"    code code"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"        code"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"    code code"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"code code code"}]},{"type":"paragraph","content":[{"type":"text","marks":[{"type":"code"}],"text":"    fewfwefewf"}]}]},{"type":"paragraph","content":[{"type":"hard_break"},{"type":"hard_break"}]}]}',
      //   ),
      // ),
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
      }}>
      <h1 style={{ flexShrink: 0, padding: '0 40px', textAlign: 'center' }}>
        ProseMirror Sandbox
      </h1>
      <Toolbar state={pmState} view={pmView} editorRef={editor} />
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
    </div>
  );
}

export default App;
