import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// Returns the date string (YYYY-MM-DD) used for sorting.
function nodeDate(n: any): string {
  const slug = n.slug ?? ""
  return n.data?.date?.slice?.(0, 10) ?? `${slug}`.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? ""
}

// Detect translation by frontmatter language first, then fall back to slug pattern.
function isTranslation(n: any): boolean {
  const lang = `${n.data?.frontmatter?.language ?? ""}`.toLowerCase()
  if (lang && lang !== "ko" && lang !== "ko-kr") return true
  const slug = n.slug ?? ""
  return /_(en|zh)_/.test(slug)
}

// Translation group key — prefer explicit frontmatter, fall back to slug normalization.
function translationGroupKey(n: any): string {
  const fm = n.data?.frontmatter?.translationKey
  if (typeof fm === "string" && fm.length > 0) return fm
  const slug = `${n.slug ?? ""}`
  return slug
    .replace(/^\d{4}-\d{2}-\d{2}_/, "")
    .replace(/^published_/, "")
    .replace(/^(en|zh)_/, "")
}

function explorerSortByRecentDate(a: any, b: any) {
  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    const aGroup = translationGroupKey(a)
    const bGroup = translationGroupKey(b)

    if (aGroup === bGroup) {
      const aIsT = isTranslation(a)
      const bIsT = isTranslation(b)
      if (aIsT !== bIsT) return aIsT ? 1 : -1
      const aSlug = `${a.slug ?? ""}`
      const bSlug = `${b.slug ?? ""}`
      return aSlug.localeCompare(bSlug, undefined, { numeric: true, sensitivity: "base" })
    }

    const aDate = nodeDate(a)
    const bDate = nodeDate(b)
    if (aDate !== bDate) return bDate.localeCompare(aDate)

    const aIsT = isTranslation(a)
    const bIsT = isTranslation(b)
    if (aIsT !== bIsT) return aIsT ? 1 : -1

    const aKey = `${a.displayName ?? ""}`.toLowerCase()
    const bKey = `${b.displayName ?? ""}`.toLowerCase()
    return aKey.localeCompare(bKey, undefined, { numeric: true, sensitivity: "base" })
  }

  if (!a.isFolder && b.isFolder) {
    return 1
  } else {
    return -1
  }
}

function explorerDisplayNames(node: any) {
  if (node.slugSegment === "papers") {
    node.displayName = "Papers (논문)"
  }
  if (node.slugSegment === "books") {
    node.displayName = "Books (저서)"
  }
}

// Hide the legacy `papers-and-books/` redirect folder from the explorer.
// The folder still exists for alias / 404-prevention but should not be navigable.
function explorerFilter(node: any): boolean {
  const slug = `${node.slug ?? ""}`
  if (slug === "research/papers-and-books" || slug.startsWith("research/papers-and-books/")) {
    return false
  }
  if (node.slugSegment === "papers-and-books") {
    return false
  }
  return true
}

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      "mjkim@bridge-abm.com": "mailto:mjkim@bridge-abm.com",
    },
  }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      folderDefaultState: "open",
      useSavedState: false,
      sortFn: explorerSortByRecentDate,
      mapFn: explorerDisplayNames,
      filterFn: explorerFilter,
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      folderDefaultState: "open",
      useSavedState: false,
      sortFn: explorerSortByRecentDate,
      mapFn: explorerDisplayNames,
      filterFn: explorerFilter,
    }),
  ],
  right: [],
}
