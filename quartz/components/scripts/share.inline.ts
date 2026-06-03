document.addEventListener("nav", () => {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".share-button")

  for (const button of buttons) {
    const row = button.closest(".share-row")
    const status = row?.querySelector<HTMLElement>(".share-status")

    async function onClick() {
      const title = button.dataset.shareTitle || document.title
      const url = window.location.href

      try {
        if (navigator.share) {
          await navigator.share({ title, url })
          if (status) status.textContent = "공유창을 열었습니다"
        } else {
          await navigator.clipboard.writeText(url)
          if (status) status.textContent = "링크를 복사했습니다"
        }
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") return

        try {
          await navigator.clipboard.writeText(url)
          if (status) status.textContent = "링크를 복사했습니다"
        } catch {
          if (status) status.textContent = "주소창의 링크를 복사해 주세요"
        }
      }

      if (status) {
        window.setTimeout(() => {
          status.textContent = ""
        }, 2200)
      }
    }

    button.addEventListener("click", onClick)
    window.addCleanup(() => button.removeEventListener("click", onClick))
  }
})
