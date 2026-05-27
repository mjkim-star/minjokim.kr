import playwright from "file:///C:/Users/%EA%B9%80%EB%AF%BC%EC%A1%B0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.js"
import fs from "node:fs/promises"

const { chromium } = playwright

const baseUrl = "http://localhost:8080"
const outDir = "C:/tmp/minjokim-mobile-check"

const pages = [
  { name: "home", path: "/" },
  {
    name: "article",
    path: "/research/2026-05-27_published_ai-adoption-dynamic-capability-mediation",
  },
]

const viewports = [
  { name: "small", width: 360, height: 800 },
  { name: "iphone", width: 390, height: 844 },
  { name: "large", width: 430, height: 932 },
  { name: "tablet", width: 768, height: 1024 },
]

await fs.mkdir(outDir, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
})
const results = []

for (const pageInfo of pages) {
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: viewport.width < 768,
    })

    const url = `${baseUrl}${pageInfo.path}`
    await page.goto(url, { waitUntil: "networkidle" })

    const screenshot = `${outDir}/${pageInfo.name}-${viewport.name}-${viewport.width}x${viewport.height}.png`
    await page.screenshot({ path: screenshot, fullPage: false })

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement
      const overflowing = [...document.querySelectorAll("body *")]
        .map((el) => {
          const rect = el.getBoundingClientRect()
          return {
            tag: el.tagName.toLowerCase(),
            className: String(el.className || ""),
            text: String(el.textContent || "").trim().slice(0, 80),
            right: Math.round(rect.right),
            left: Math.round(rect.left),
            width: Math.round(rect.width),
          }
        })
        .filter((item) => item.width > 0 && (item.right > doc.clientWidth + 1 || item.left < -1))
        .slice(0, 8)

      return {
        clientWidth: doc.clientWidth,
        scrollWidth: doc.scrollWidth,
        hasHorizontalOverflow: doc.scrollWidth > doc.clientWidth + 1,
        overflowing,
      }
    })

    results.push({ page: pageInfo.name, viewport, screenshot, ...metrics })
    await page.close()
  }
}

await browser.close()

console.log(JSON.stringify(results, null, 2))
