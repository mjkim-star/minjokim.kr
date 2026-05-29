import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FileTrieNode } from "./quartz/util/fileTrie"

const explorerSortByOriginalGroup = (a: FileTrieNode, b: FileTrieNode) => {
  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    const key = (node: FileTrieNode) => {
      const slug = node.slug ?? ""
      const title = node.displayName ?? ""

      if (slug.includes("sme-ambidexterity-boundary")) {
        if (slug.includes("_zh_")) return "2026-05-29-01-translation-zh"
        return "2026-05-29-00-original-ko"
      }

      if (slug.includes("ai-adoption-dynamic-capability-mediation")) {
        if (slug.includes("_en_")) return "2026-05-27-01-translation-en"
        return "2026-05-27-00-original-ko"
      }

      return `${title}`.toLowerCase()
    }

    return key(a).localeCompare(key(b), undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }

  if (!a.isFolder && b.isFolder) {
    return 1
  } else {
    return -1
  }
}

// components shared across all pages
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

// components for pages that display a single page (e.g. a single note)
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
      sortFn: explorerSortByOriginalGroup,
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
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
      sortFn: explorerSortByOriginalGroup,
    }),
  ],
  right: [],
}
