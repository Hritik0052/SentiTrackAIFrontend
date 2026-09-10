type CashfreeMode = "sandbox" | "production"

interface CheckoutOptions {
  paymentSessionId: string
  redirectTarget?: "_self" | "_blank" | "_top"
}

interface CashfreeInstance {
  checkout: (options: CheckoutOptions) => Promise<unknown>
}

declare global {
  interface Window {
    Cashfree?: (options: { mode: CashfreeMode }) => CashfreeInstance
  }
}

const SCRIPT_SRC = "https://sdk.cashfree.com/js/v3/cashfree.js"

function loadCashfreeScript(): Promise<void> {
  if (window.Cashfree) return Promise.resolve()
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error("Failed to load Cashfree SDK")))
    })
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"))
    document.body.appendChild(script)
  })
}

export async function openCashfreeCheckout(params: {
  paymentSessionId: string
  env: string
}): Promise<void> {
  await loadCashfreeScript()
  if (!window.Cashfree) {
    throw new Error("Cashfree SDK unavailable")
  }
  const mode: CashfreeMode = params.env === "production" ? "production" : "sandbox"
  const cashfree = window.Cashfree({ mode })
  await cashfree.checkout({
    paymentSessionId: params.paymentSessionId,
    redirectTarget: "_self",
  })
}
