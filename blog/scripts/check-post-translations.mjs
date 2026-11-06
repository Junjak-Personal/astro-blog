import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content');
const locales = ['en', 'jp'];
const sourceFilter = new RegExp(process.argv[2] ?? '.');
const failures = [];
let originals = 0;
let translations = 0;

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory()
    ? walk(join(directory, entry.name))
    : [join(directory, entry.name)]);
}

function parse(source) {
  const match = source.match(/^---[^\S\n]*\n([\s\S]*?)\r?\n---[^\S\n]*(?:\n|$)/);
  if (!match)
    throw new Error('Missing YAML frontmatter');
  return { data: load(match[1]), body: source.slice(match[0].length).replace(/\r\n/g, '\n') };
}

function codeBlocks(body) {
  const blocks = [];
  let current;
  for (const line of body.split('\n')) {
    const fence = line.match(/^\s*(`{3,}|~{3,})([^`~].*)?$/);
    if (!current && fence) {
      current = { fence: fence[1], language: (fence[2] ?? '').trim().split(/\s/)[0], lines: [line] };
    }
    else if (current) {
      current.lines.push(line);
      if (fence && fence[1][0] === current.fence[0] && fence[1].length >= current.fence.length && !(fence[2] ?? '').trim()) {
        blocks.push(current);
        current = undefined;
      }
    }
  }
  if (current)
    throw new Error('Unclosed code fence');
  return blocks;
}

function protectedCode(body) {
  return codeBlocks(body).filter((block) => !['lyrics', 'mermaid'].includes(block.language)).map((block) => block.lines.join('\n'));
}

function outsideCode(body) {
  let result = body;
  for (const block of codeBlocks(body)) result = result.replace(block.lines.join('\n'), '');
  return result;
}

function assets(body) {
  return [...body.matchAll(/(?:\/(?:files|images)\/|https?:\/\/)[^\s"'`<>)\]}]+/g)].map((match) => match[0]).sort();
}

function originallyEnglish(value) {
  return typeof value === 'string' && /[A-Z]/i.test(value) && !/[\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7A3]/.test(value);
}

const stableFields = ['category', 'created', 'updated', 'thumbnail', 'techStacks', 'appleMusicUrl', 'youtubeMusicUrl', 'releaseYear', 'lyricsType', 'drinkKind', 'prefecture', 'tokuteiMeisho', 'seimaiBuai', 'alcohol', 'nihonshuDo', 'sando', 'amakara', 'noutan'];
for (const collection of ['blog', 'project', 'playground']) {
  const directory = join(root, collection);
  const files = walk(directory).filter((file) => /\.mdx?$/.test(file) && !/^(?:ko|en|jp)\//.test(relative(directory, file)) && sourceFilter.test(relative(root, file)));
  const sourcePaths = new Set(files.map((file) => relative(directory, file)));
  for (const locale of [...locales, 'ko']) {
    const localeDirectory = join(directory, locale);
    if (!existsSync(localeDirectory))
      continue;
    for (const target of walk(localeDirectory).filter((file) => /\.mdx?$/.test(file))) {
      const sourcePath = relative(localeDirectory, target);
      if (sourceFilter.test(`${collection}/${sourcePath}`) && !sourcePaths.has(sourcePath))
        failures.push(`${relative(root, target)}: translation without a matching original`);
    }
  }
  for (const file of files) {
    originals++;
    const source = parse(readFileSync(file, 'utf8'));
    for (const locale of locales) {
      const targetFile = join(directory, locale, relative(directory, file));
      const label = relative(root, targetFile);
      try {
        const target = parse(readFileSync(targetFile, 'utf8'));
        translations++;
        for (const key of stableFields) {
          if (JSON.stringify(source.data[key]) !== JSON.stringify(target.data[key]))
            failures.push(`${label}: modified stable field ${key}`);
        }
        for (const key of ['title', 'description', 'duration', 'artist', 'album', 'brand', 'brewery']) {
          if (originallyEnglish(source.data[key]) && source.data[key] !== target.data[key])
            failures.push(`${label}: modified original English frontmatter ${key}`);
        }
        for (const tag of source.data.tags ?? []) {
          if (originallyEnglish(tag) && !target.data.tags?.includes(tag))
            failures.push(`${label}: modified original English tag ${tag}`);
        }
        if (JSON.stringify(assets(source.body)) !== JSON.stringify(assets(target.body)))
          failures.push(`${label}: changed/missing asset or external URL`);
        if (JSON.stringify(protectedCode(source.body)) !== JSON.stringify(protectedCode(target.body)))
          failures.push(`${label}: changed code example`);
        const prose = outsideCode(source.body);
        const translatedProse = outsideCode(target.body);
        const englishLines = prose.split('\n').map((line) => line.trim()).filter((line) => /[A-Z]/i.test(line) && !/[\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7A3]/.test(line));
        for (const line of new Set(englishLines)) {
          if (!translatedProse.includes(line))
            failures.push(`${label}: modified original English line ${line.slice(0, 100)}`);
        }
        for (const match of prose.matchAll(/\b(?:title|caption|alt|label)\s*[:=]\s*(["'])([^"'\n]+)\1/g)) {
          if (originallyEnglish(match[2]) && !translatedProse.includes(match[2]))
            failures.push(`${label}: modified original English caption ${match[2]}`);
        }
        if ((prose.match(/^#{1,6} /gm) ?? []).length !== (translatedProse.match(/^#{1,6} /gm) ?? []).length)
          failures.push(`${label}: changed heading count`);
        const koreanLines = translatedProse.split('\n').filter((line) => /[\uAC00-\uD7A3]/.test(line));
        if (koreanLines.length)
          failures.push(`${label}: untranslated Korean outside code (${koreanLines.length} lines)`);
      }
      catch (error) {
        failures.push(`${label}: ${error.message}`);
      }
    }
  }
}

console.log(JSON.stringify({ originals, translations, expected: originals * locales.length, failures: failures.length }, null, 2));
for (const failure of failures) console.error(failure);
if (failures.length)
  process.exitCode = 1;
