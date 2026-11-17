import { createHash } from 'node:crypto';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { visit } from 'unist-util-visit';

const mermaidBundle = join(dirname(fileURLToPath(import.meta.resolve('mermaid'))), 'mermaid.min.js');
/** @type {Promise<import('@playwright/test').Page> | undefined} */
let rendererPromise;
let renderQueue = Promise.resolve();
/** @type {Map<string, Promise<string>>} */
const svgCache = new Map();

async function getRenderer() {
  rendererPromise ??= (async () => {
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      await page.addScriptTag({ path: mermaidBundle });
      return page;
    }
    catch (error) {
      await browser.close();
      throw error;
    }
  })();
  return rendererPromise;
}

export async function closeMermaidRenderer() {
  const pending = rendererPromise;
  rendererPromise = undefined;
  if (pending) {
    const page = await pending.catch(() => undefined);
    await page?.context().browser()?.close();
  }
}

function renderDiagram(source, id) {
  const cached = svgCache.get(id);
  if (cached)
    return cached;

  const rendering = renderQueue.then(async () => {
    const page = await getRenderer();
    return page.evaluate(async ({ source, id }) => {
      const variants = [];
      for (const theme of ['default', 'dark']) {
        const variant = theme === 'dark' ? 'dark' : 'light';
        const prefix = `${id}-${variant}`;
        window.mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          suppressErrorRendering: true,
          deterministicIds: true,
          deterministicIDSeed: prefix,
          theme,
        });
        const { svg } = await window.mermaid.render(prefix, source);
        // Mermaid's HTML labels can contain <br> rather than XML's <br/>.
        const document = new DOMParser().parseFromString(svg, 'text/html');
        const root = document.querySelector('svg');
        if (!root)
          throw new Error('Mermaid did not produce an SVG');
        const ids = new Map();
        root.querySelectorAll('[id]').forEach((element, index) => {
          ids.set(element.id, `${prefix}-${index}`);
        });
        ids.set(root.id, prefix);

        // Scope IDs and their references across themes and repeated diagrams.
        const selectors = [...ids.keys()].sort((a, b) => b.length - a.length).map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const selectorPattern = new RegExp(`#(${selectors.join('|')})(?![\\w-])`, 'g');
        for (const element of [root, ...root.querySelectorAll('*')]) {
          for (const attribute of [...element.attributes]) {
            let value = attribute.value;
            if (attribute.name === 'id') {
              value = ids.get(value) ?? value;
            }
            else if (attribute.name === 'aria-labelledby' || attribute.name === 'aria-describedby') {
              value = value.split(/\s+/).map((value) => ids.get(value) ?? value).join(' ');
            }
            else {
              value = value.replace(selectorPattern, (match, target) => `#${ids.get(target)}`);
            }
            element.setAttribute(attribute.name, value);
          }
        }
        root.querySelectorAll('style').forEach((style) => {
          style.textContent = style.textContent.replace(selectorPattern, (match, target) => `#${ids.get(target)}`);
        });
        variants.push(`<div class="mermaid-variant--${variant}">${new XMLSerializer().serializeToString(root)}</div>`);
      }
      return `<div class="mermaid-diagram" data-mermaid-static>${variants.join('')}</div>`;
    }, { source, id });
  }).catch(async (error) => {
    svgCache.delete(id);
    await closeMermaidRenderer();
    throw error;
  });
  renderQueue = rendering.then(() => {}, () => {});
  svgCache.set(id, rendering);
  return rendering;
}

export default function remarkMermaidToHtml() {
  return async (tree, file) => {
    const diagrams = [];
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang === 'mermaid' && index != null && parent != null) {
        diagrams.push({ node, index, parent });
      }
    });
    await Promise.all(diagrams.map(async ({ node, index, parent }, occurrence) => {
      const sourcePath = file.path ? relative(process.cwd(), file.path) : 'markdown';
      const hash = createHash('sha256').update(`${sourcePath}\0${occurrence}\0${node.value}`).digest('hex').slice(0, 20);
      try {
        parent.children[index] = {
          type: 'html',
          value: await renderDiagram(node.value, `mermaid-${hash}`),
        };
      }
      catch (error) {
        throw new Error(`Mermaid rendering failed: ${file.path ?? sourcePath}:${node.position?.start.line ?? 1}`, { cause: error });
      }
    }));
  };
}
