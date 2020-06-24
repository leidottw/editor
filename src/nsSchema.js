import { schema, nodes } from 'prosemirror-schema-basic';
import { Schema } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import Color from 'color';

const DEFAULT_COLOR_LIST = ['initial', 'inherit', 'windowtext'];
let newNodes = addListNodes(schema.spec.nodes, 'paragraph block*', 'block');
newNodes = newNodes
  .update('paragraph', {
    content: 'inline*',
    group: 'block',
    attrs: {
      textAlign: {
        default: 'left',
      },
      indent: {
        default: 0,
      },
    },
    parseDOM: [
      { tag: 'p' },
      {
        tag: 'div',
        getAttrs(dom) {
          if (dom.dataset.codeblock) return false;
          const textAlign = dom.style.textAlign;
          const matches = dom.style.paddingLeft.match(/^(\d+)px$/);
          const indent = (matches && +matches[1] / 40) || 0;
          return { textAlign, indent };
        },
      },
    ],
    toDOM(node) {
      return [
        'div',
        {
          class: 'para',
          style: `
            text-align: ${node.attrs.textAlign};
            padding-left: ${node.attrs.indent * 40}px;
          `,
        },
        0,
      ];
    },
  })
  .update(
    'heading',
    Object.assign({}, nodes.heading, {
      attrs: {
        level: {
          default: 1,
        },
        textAlign: {
          default: 'left',
        },
      },
      parseDOM: [
        {
          tag: 'h1',
          getAttrs(dom) {
            const textAlign = dom.style.textAlign;
            return { level: 1, textAlign };
          },
        },
        {
          tag: 'h2',
          getAttrs(dom) {
            const textAlign = dom.style.textAlign;
            return { level: 2, textAlign };
          },
        },
        {
          tag: 'h3',
          getAttrs(dom) {
            const textAlign = dom.style.textAlign;
            return { level: 3, textAlign };
          },
        },
        {
          tag: 'h4',
          getAttrs(dom) {
            const textAlign = dom.style.textAlign;
            return { level: 4, textAlign };
          },
        },
        {
          tag: 'h5',
          getAttrs(dom) {
            const textAlign = dom.style.textAlign;
            return { level: 5, textAlign };
          },
        },
        {
          tag: 'h6',
          getAttrs(dom) {
            const textAlign = dom.style.textAlign;
            return { level: 6, textAlign };
          },
        },
      ],
      toDOM(node) {
        return [
          'h' + node.attrs.level,
          {
            style: `text-align: ${node.attrs.textAlign};`,
          },
          0,
        ];
      },
    }),
  )
  .update(
    'code_block',
    Object.assign({}, nodes.code_block, {
      parseDOM: [
        { tag: 'pre', preserveWhitespace: 'full' },
        { tag: 'div[data-codeblock]', preserveWhitespace: 'full' },
      ],
      toDOM() {
        return [
          'pre',
          {
            style: `
              padding: 8px;
              border: 1px solid rgba(0,0,0,.14902);
              background: #fbfaf8;
              font-size: 12px;
              color: #333;
              border-radius: 4px;
              overflow: auto;
            `,
            spellcheck: false,
          },
          ['code', 0],
        ];
      },
    }),
  )
  .update(
    'bullet_list',
    Object.assign({}, newNodes.get('bullet_list'), {
      parseDOM: [
        {
          tag: 'ul',
          getAttrs(dom) {
            if (dom.dataset.todo !== undefined) return false;
          },
        },
      ],
    }),
  )
  .update(
    'list_item',
    Object.assign({}, newNodes.get('list_item'), {
      parseDOM: [
        {
          tag: 'li',
          getAttrs(dom) {
            if (dom.dataset.checked !== undefined) return false;
          },
        },
      ],
    }),
  )
  .append({
    check_list: {
      content: '(check_list | check_list_item)+',
      group: 'block',
      attrs: {
        todo: { default: 'undefined' },
      },
      parseDOM: [
        {
          tag: 'ul',
          getAttrs(dom) {
            return { todo: dom.dataset.todo };
          },
        },
      ],
      toDOM(node) {
        return [
          'ul',
          {
            'data-todo': node.attrs.todo,
            style: 'list-style-type: none;',
          },
          0,
        ];
      },
    },
  })
  .append({
    check_list_item: {
      content: 'paragraph block*',
      attrs: { checked: { default: undefined } },
      parseDOM: [
        {
          tag: 'li',
          getAttrs(dom) {
            return { checked: dom.dataset.checked };
          },
        },
      ],
      toDOM(node) {
        return ['li', { 'data-checked': node.attrs.checked }, 0];
      },
    },
  });

const newMarks = schema.spec.marks.append({
  u: {
    parseDOM: [
      { tag: 'u' },
      {
        tag: 'span',
        getAttrs(dom) {
          const style = dom.getAttribute('style');
          if (!style) return false;
          if (style.indexOf('underline') !== -1) {
            return true;
          }
          return false;
        },
      },
    ],
    toDOM() {
      return ['u'];
    },
  },
  del: {
    parseDOM: [
      { tag: 's' },
      { tag: 'strike' },
      { tag: 'del' },
      {
        tag: 'span',
        getAttrs(dom) {
          const style = dom.getAttribute('style');
          if (!style) return false;
          if (style.indexOf('line-through') !== -1) {
            return true;
          }
          return false;
        },
      },
    ],
    toDOM() {
      return ['s'];
    },
  },
  superscript: {
    parseDOM: [
      { tag: 'sup' },
      {
        tag: 'span',
        getAttrs(dom) {
          const style = dom.getAttribute('style');
          if (!style) return false;
          if (style.indexOf('super') !== -1) {
            return true;
          }
          return false;
        },
      },
    ],
    toDOM(node) {
      return ['sup'];
    },
  },
  subscript: {
    parseDOM: [
      { tag: 'sub' },
      {
        tag: 'span',
        getAttrs(dom) {
          const style = dom.getAttribute('style');
          if (!style) return false;
          if (style.indexOf('sub') !== -1) {
            return true;
          }
          return false;
        },
      },
    ],
    toDOM(node) {
      return ['sub'];
    },
  },
  fontSize: {
    attrs: {
      fontSize: { default: 16 },
    },
    parseDOM: [
      {
        tag: 'span',
        getAttrs(dom) {
          if (!dom.hasAttribute('style')) return false;
          if (!dom.style.fontSize) return false;
          return {
            fontSize: Number(
              dom.style.fontSize.replace('pt', '').replace('px', ''),
            ),
          };
        },
      },
    ],
    toDOM(node) {
      return ['span', { style: `font-size: ${node.attrs.fontSize}px` }];
    },
  },
  color: {
    attrs: {
      color: { default: null },
    },
    parseDOM: [
      {
        tag: 'span',
        getAttrs(dom) {
          if (!dom.hasAttribute('style')) return false;
          if (!dom.style.color) return false;
          return {
            color: Color(
              DEFAULT_COLOR_LIST.some((i) => i === dom.style.color)
                ? '#000'
                : dom.style.color,
            ).string(),
          };
        },
      },
    ],
    toDOM(node) {
      return ['span', { style: `color: ${node.attrs.color}` }];
    },
  },
  bg: {
    attrs: {
      color: { default: null },
    },
    parseDOM: [
      {
        tag: 'span',
        getAttrs(dom) {
          if (!dom.hasAttribute('style')) return false;
          if (!dom.style.backgroundColor) return false;
          return {
            color: Color(
              DEFAULT_COLOR_LIST.some((i) => i === dom.style.backgroundColor)
                ? '#fff'
                : dom.style.backgroundColor,
            ).string(),
          };
        },
      },
    ],
    toDOM(node) {
      return ['span', { style: `background-color: ${node.attrs.color}` }];
    },
  },
});

const nsSchema = new Schema({
  nodes: newNodes,
  marks: newMarks,
});

export default nsSchema;
