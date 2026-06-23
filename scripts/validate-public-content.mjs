import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const contentDir = path.join(root, "content")

const blocked = [
  {
    name: "markdown footnote reference",
    pattern: /\[\^[^\]]+\]/,
    hint: "Use a normal numbered reference list under the article's reference section.",
  },
  {
    name: "generated footnotes heading",
    pattern: /^##\s+(Footnotes|각주|脚注)\s*$/m,
    hint: "Do not keep Quartz/Markdown footnote headings in public article markdown.",
  },
  {
    name: "inline copyright footer",
    pattern: /^©\s+20\d{2}\s+/m,
    hint: "Quartz adds the copyright and source footer automatically.",
  },
  {
    name: "inline source footer",
    pattern: /이 글은 김민조 연구노트의 원문입니다\./,
    hint: "Quartz adds the source footer automatically.",
  },
]

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath)
    }
  }

  return files
}

const files = await walk(contentDir)
const failures = []

for (const file of files) {
  const text = await readFile(file, "utf8")
  const relative = path.relative(root, file).replaceAll(path.sep, "/")

  for (const rule of blocked) {
    if (rule.pattern.test(text)) {
      failures.push({ file: relative, rule })
    }
  }
}

if (failures.length > 0) {
  console.error("Public content validation failed.")
  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.rule.name}`)
    console.error(`  ${failure.rule.hint}`)
  }
  process.exit(1)
}

console.log(`Public content validation passed: ${files.length} markdown files checked.`)
