import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const email = Object.entries(opts?.links ?? {})[0]
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
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
