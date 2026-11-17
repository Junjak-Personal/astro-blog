import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import { afterAll, it } from 'vitest';
import * as plugin from './remarkMermaidToHtml.mjs';

afterAll(async () => plugin.closeMermaidRenderer());

const source = 'flowchart TB\n  A["Astro & React"] --> B["준비 완료<br/>Ready"]';

function diagramTree(value = source) {
  return { type: 'root', children: [{ type: 'code', lang: 'mermaid', value }] };
}

it('embeds light and dark SVGs without a browser-side loader', async () => {
  const tree = diagramTree();
  await plugin.default()(tree, { path: '/content/project/crowfoot.mdx' });
  const html = tree.children[0].value;

  assert.equal(tree.children[0].type, 'html');
  assert.equal((html.match(/<svg\b/g) ?? []).length, 2);
  assert.match(html, /mermaid-variant--light/);
  assert.match(html, /mermaid-variant--dark/);
  assert.match(html, /준비 완료/);
  assert.doesNotMatch(html, /<script\b|<pre\b|Loading diagram/);
});

it('preserves authored MDX labels with HTML line breaks', async () => {
  const post = await readFile(new URL('../content/project/crowfoot.mdx', import.meta.url), 'utf8');
  const source = post.match(/```mermaid\n([\s\S]*?)\n```/)[1];
  const tree = diagramTree(source);
  await plugin.default()(tree, { path: '/content/project/authored-crowfoot.mdx' });
  assert.doesNotMatch(tree.children[0].value, /parsererror/);
  assert.match(tree.children[0].value, /Crowfoot CLI/);
  assert.match(tree.children[0].value, /<br\s*\//);
});

it('namespaces SVG ids across themes, repeated fences, and locale files', async () => {
  const ko = diagramTree();
  ko.children.push({ ...ko.children[0] });
  const en = diagramTree();
  await plugin.default()(ko, { path: '/content/project/crowfoot.mdx' });
  await plugin.default()(en, { path: '/content/project/en/crowfoot.mdx' });
  const html = [...ko.children, ...en.children].map((node) => node.value).join('');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);

  assert.ok(ids.length > 6);
  assert.equal(new Set(ids).size, ids.length);
  for (const match of html.matchAll(/marker-(?:start|end)="url\(#([^)]+)\)"/g)) {
    assert.ok(ids.includes(match[1]), `missing SVG reference: ${match[1]}`);
  }
});

it('fails with a source location and can render again after invalid syntax', async () => {
  const invalid = diagramTree('this is not a diagram');
  await assert.rejects(plugin.default()(invalid, { path: '/content/invalid.mdx' }), /invalid\.mdx:1/);
  const valid = diagramTree('flowchart LR\n  Recovery --> Ready');
  await plugin.default()(valid, { path: '/content/recovery.mdx' });
  assert.match(valid.children[0].value, /<svg\b/);
});

it('leaves ordinary source-code examples untouched', async () => {
  const code = { type: 'code', lang: 'astro', value: '```mermaid\nA --> B\n```' };
  const tree = { type: 'root', children: [code] };
  await plugin.default()(tree, { path: '/content/example.mdx' });
  assert.equal(tree.children[0], code);
});
