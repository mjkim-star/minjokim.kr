import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

function explorerSortByRecentDate(a: any, b: any) {
  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    const aSlug = a.slug ?? ""
    const bSlug = b.slug ?? ""
    const aDate =
      a.data?.date?.slice?.(0, 10) ?? `${aSlug}`.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? ""
    const bDate =
      b.data?.date?.slice?.(0, 10) ?? `${bSlug}`.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? ""

    if (aDate !== bDate) {
      return bDate.localeCompare(aDate)
    }

    const aIsTranslation = /_(en|zh)_/.test(aSlug)
    const bIsTranslation = /_(en|zh)_/.test(bSlug)
    if (aIsTranslation !== bIsTranslation) {
      return aIsTranslation ? 1 : -1
    }

    const aKey = `${a.displayName ?? ""}`.toLowerCase()
    const bKey = `${b.displayName ?? ""}`.toLowerCase()
    return aKey.localeCompare(bKey, undefined, {
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
      sortFn: explorerSortByRecentDate,
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
      sortFn: explorerSortByRecentDate,
    }),
  ],
  right: [],
}
