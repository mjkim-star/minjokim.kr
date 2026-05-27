import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"
export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)
    const author = String(fileData.frontmatter?.author ?? "김민조")
    const isHome = fileData.slug === "index"
    const isArticle = !isHome && fileData.slug !== "404"

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconVersion = "20260527-mono-smile"
    const iconPath = `${joinSegments(baseDir, "static/icon.png")}?v=${iconVersion}`
    const faviconPath = `${joinSegments(baseDir, "static/favicon-mono-smile.png")}?v=${iconVersion}`

    // Url of current page
    const socialUrl =
      fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)
    const canonicalUrl = socialUrl
    const datePublished =
      fileData.frontmatter?.published?.toString() ?? fileData.dates?.published?.toISOString()
    const dateModified =
      fileData.frontmatter?.modified?.toString() ??
      fileData.frontmatter?.published?.toString() ??
      fileData.dates?.modified?.toISOString()
    const tags = fileData.frontmatter?.tags ?? []
    const jsonLd = isArticle
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: fileData.frontmatter?.title ?? title,
          description,
          author: {
            "@type": "Person",
            name: author,
            jobTitle: "경영학박사, 경영지도사",
          },
          publisher: {
            "@type": "Person",
            name: "김민조",
          },
          datePublished,
          dateModified,
          inLanguage: cfg.locale,
          mainEntityOfPage: canonicalUrl,
          url: canonicalUrl,
          keywords: Array.isArray(tags) ? tags.join(", ") : String(tags),
        }
      : {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: cfg.pageTitle,
          description,
          url: canonicalUrl,
          inLanguage: cfg.locale,
          author: {
            "@type": "Person",
            name: "김민조",
            jobTitle: "경영학박사, 경영지도사",
          },
        }
    const jsonLdText = JSON.stringify(jsonLd).replace(/</g, "\\u003c")

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content={isArticle ? "article" : "website"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />
        <meta name="author" content={author} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta
          name="naver-site-verification"
          content="6b07382a210e109afcc2be2e14c1167ab34e8a45"
        />
        {isArticle && datePublished && (
          <meta property="article:published_time" content={datePublished} />
        )}
        {isArticle && dateModified && <meta property="article:modified_time" content={dateModified} />}
        {isArticle && <meta property="article:author" content={author} />}
        {isArticle &&
          Array.isArray(tags) &&
          tags.map((tag) => <meta property="article:tag" content={String(tag)} />)}

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link rel="icon" href={faviconPath} type="image/png" />
        <link rel="shortcut icon" href={faviconPath} />
        <link rel="apple-touch-icon" href={iconPath} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText }} />

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
