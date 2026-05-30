import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

function explorerSortByRecentDate(a: any, b: any) {
  const aSlug = `${a.slug ?? ""}`
  const bSlug = `${b.slug ?? ""}`

  if (a.isFolder && b.isFolder) {
    let aRank: number | undefined
    let bRank: number | undefined

    if (aSlug === "research/index") aRank = 0
    if (aSlug === "papers-and-books/index") aRank = 1
    if (aSlug === "papers-and-books/papers/index") aRank = 0
    if (aSlug === "papers-and-books/books/index") aRank = 1

    if (bSlug === "research/index") bRank = 0
    if (bSlug === "papers-and-books/index") bRank = 1
    if (bSlug === "papers-and-books/papers/index") bRank = 0
    if (bSlug === "papers-and-books/books/index") bRank = 1

    if (aRank !== undefined || bRank !== undefined) {
      return (aRank ?? 99) - (bRank ?? 99)
    }
  }

  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    const aFm = a.data?.frontmatter?.translationKey
    const bFm = b.data?.frontmatter?.translationKey
    const aGroup =
      typeof aFm === "string" && aFm.length > 0
        ? aFm
        : aSlug
            .replace(/^research\//, "")
            .replace(/^\d{4}-\d{2}-\d{2}_/, "")
            .replace(/^published_/, "")
            .replace(/^(en|zh)_/, "")
    const bGroup =
      typeof bFm === "string" && bFm.length > 0
        ? bFm
        : bSlug
            .replace(/^research\//, "")
            .replace(/^\d{4}-\d{2}-\d{2}_/, "")
            .replace(/^published_/, "")
            .replace(/^(en|zh)_/, "")

    const aLang = `${a.data?.frontmatter?.language ?? ""}`.toLowerCase()
    const bLang = `${b.data?.frontmatter?.language ?? ""}`.toLowerCase()
    const aIsT = (aLang && aLang !== "ko" && aLang !== "ko-kr") || /_(en|zh)_/.test(aSlug)
    const bIsT = (bLang && bLang !== "ko" && bLang !== "ko-kr") || /_(en|zh)_/.test(bSlug)

    if (aGroup === bGroup) {
      if (aIsT !== bIsT) return aIsT ? 1 : -1
      return aSlug.localeCompare(bSlug, undefined, { numeric: true, sensitivity: "base" })
    }

    const aDate = a.data?.date?.slice?.(0, 10) ?? aSlug.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? ""
    const bDate = b.data?.date?.slice?.(0, 10) ?? bSlug.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? ""
    if (aDate !== bDate) return bDate.localeCompare(aDate)

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
  if (node.slugSegment === "papers-and-books") {
    node.displayName = "Papers & Books"
  }
  if (node.slugSegment === "papers") {
    node.displayName = "Papers"
  }
  if (node.slugSegment === "books") {
    node.displayName = "Books"
  }
}

// Hide the legacy `papers-and-books/` redirect folder from the explorer.
// The folder still exists for alias / 404-prevention but should not be navigable.
function explorerFilter(node: any): boolean {
  const slug = `${node.slug ?? ""}`
  if (slug === "research/papers-and-books" || slug.startsWith("research/papers-and-books/")) {
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
