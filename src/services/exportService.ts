import { apiClient, ApiError } from "../lib/apiClient"

function filenameFromDisposition(header: string | undefined, fallback: string): string {
  if (!header) return fallback
  const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(header)
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1])
    } catch {
      return utfMatch[1]
    }
  }
  const plainMatch = /filename="?([^";]+)"?/i.exec(header)
  return plainMatch?.[1] ?? fallback
}

async function downloadBlob(
  path: string,
  params: Record<string, string | number | undefined>,
  fallbackName: string,
): Promise<void> {
  try {
    const { data, headers } = await apiClient.get<Blob>(path, {
      params,
      responseType: "blob",
    })

    if (data.type && data.type.includes("application/json")) {
      const text = await data.text()
      try {
        const parsed = JSON.parse(text) as { error?: { detail?: string; type?: string } }
        throw new ApiError(
          typeof parsed.error?.detail === "string"
            ? parsed.error.detail
            : "Couldn't export Excel. Please try again.",
          400,
          parsed.error?.type ?? "ExportError",
        )
      } catch (err) {
        if (err instanceof ApiError) throw err
        throw new ApiError("Couldn't export Excel. Please try again.", 400, "ExportError")
      }
    }

    const filename = filenameFromDisposition(
      headers["content-disposition"] as string | undefined,
      fallbackName,
    )
    const url = URL.createObjectURL(data)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = filename
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw err
  }
}

export const exportService = {
  journals(params: { date_from?: string; date_to?: string } = {}) {
    return downloadBlob("/export/journals", params, "sentitrack-journals.xlsx")
  },

  weeklySummaries(params: { date_from?: string; date_to?: string } = {}) {
    return downloadBlob("/export/weekly-summaries", params, "sentitrack-weekly-summaries.xlsx")
  },

  monthlySummary(params: { year: number; month: number }) {
    return downloadBlob(
      "/export/monthly-summary",
      params,
      `sentitrack-monthly-summary-${params.year}-${String(params.month).padStart(2, "0")}.xlsx`,
    )
  },
}
