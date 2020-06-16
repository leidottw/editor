import { JSDOM } from 'jsdom';

export default function transform(html) {
  const dom = new JSDOM(html);

  dom.window.document
    .querySelectorAll('div[data-codeblock]')
    .forEach((codeblock) => {
      let text = '';
      codeblock.querySelectorAll('div[data-plaintext]').forEach((row) => {
        text += row.textContent + '\n';
      });

      const replaceHolder = dom.window.document.createElement('div');
      replaceHolder.dataset.codeblock = true;
      replaceHolder.textContent = text;

      codeblock.replaceWith(replaceHolder);
    });

  return dom.serialize();
}
