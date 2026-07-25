import { useEffect } from "react"

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    if (description) {
      let metaEl = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!metaEl) {
        metaEl = document.createElement("meta")
        metaEl.name = "description"
        document.head.appendChild(metaEl)
      }
      metaEl.content = description
    }

    return () => {
      document.title = previousTitle
    }
  }, [title, description])
}
