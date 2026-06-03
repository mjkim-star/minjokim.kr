// @ts-ignore
import shareScript from "./scripts/share.inline"
import styles from "./styles/share.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ShareButton: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title ?? fileData.slug ?? "김민조 연구노트"

  return (
    <div class={classNames(displayClass, "share-row")}>
      <button class="share-button" type="button" data-share-title={title}>
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span>공유</span>
      </button>
      <span class="share-status" aria-live="polite"></span>
    </div>
  )
}

ShareButton.beforeDOMLoaded = shareScript
ShareButton.css = styles

export default (() => ShareButton) satisfies QuartzComponentConstructor
