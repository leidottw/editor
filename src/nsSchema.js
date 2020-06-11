import { schema } from 'prosemirror-schema-basic';
import { Schema } from 'prosemirror-model';
import Color from 'color';

const DEFAULT_COLOR_LIST = ['initial', 'inherit', 'windowtext'];
const newNodes = schema.spec.nodes.update('code_block', {
  content: 'block+',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  parseDOM: [
    { tag: 'pre', preserveWhitespace: 'full' },
    { tag: 'div[data-codeblock]' },
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
      },
      ['code', 0],
    ];
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
    parseDOM: [{ tag: 'sup' }],
    toDOM(node) {
      return ['sup'];
    },
  },
  subscript: {
    parseDOM: [{ tag: 'sub' }],
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
