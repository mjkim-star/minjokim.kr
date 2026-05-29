import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
function explorerSortByOriginalGroup(a: any, b: any) {
  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    let aKey = `${a.displayName ?? ""}`.toLowerCase()
    let bKey = `${b.displayName ?? ""}`.toLowerCase()
    const aSlug = a.slug ?? ""
    const bSlug = b.slug ?? ""

    if (aSlug.includes("sme-ambidexterity-boundary")) {
      aKey = aSlug.includes("_zh_")
        ? "2026-05-29-01-translation-zh"
        : "2026-05-29-00-original-ko"
    } else if (aSlug.includes("ai-adoption-dynamic-capability-mediation")) {
      aKey = aSlug.includes("_en_")
        ? "2026-05-27-01-translation-en"
        : "2026-05-27-00-original-ko"
    }

    if (bSlug.includes("sme-ambidexterity-boundary")) {
      bKey = bSlug.includes("_zh_")
        ? "2026-05-29-01-translation-zh"
        : "2026-05-29-00-original-ko"
    } else if (bSlug.includes("ai-adoption-dynamic-capability-mediation")) {
      bKey = bSlug.includes("_en_")
        ? "2026-05-27-01-translation-en"
        : "2026-05-27-00-original-ko"
    }

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
