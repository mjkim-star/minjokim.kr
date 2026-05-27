import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const email = Object.entries(opts?.links ?? {})[0]
    const isEnglish = fileData.frontmatter?.language === "en"
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          © {year} 김민조 / All rights reserved
          {email ? (
            <>
              {" / "}
              <a href={email[1]}>{email[0]}</a>
            </>
          ) : null}
        </p>
        {fileData.frontmatter?.type === "published" ? (
          <p class="source-note">
            {isEnglish
              ? "This essay is an original research note by Kim Minjo. If you quote or share part of it, please include the source and original link."
              : "이 글은 김민조 연구노트의 원문입니다. 글의 일부를 인용하거나 공유하실 때에는 출처와 원문 링크를 남겨주세요."}
          </p>
        ) : null}
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
