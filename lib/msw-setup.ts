import { jobsHandlers } from "./msw-handlers"

let worker: any = null

export async function initializeMSW() {
  if (typeof window !== "undefined") {
    // Check if already initialized in this session
    if (window.sessionStorage.getItem("msw-initialized")) {
      console.log("[v0] MSW already initialized")
      return
    }

    try {
      console.log("[v0] Starting MSW initialization...")
      const { setupWorker } = await import("msw/browser")
      worker = setupWorker(...jobsHandlers)

      console.log("[v0] MSW worker created, starting...")
      await worker.start({
        onUnhandledRequest: "warn", // Changed from bypass to warn to see unhandled requests
        quiet: false, // Enable logging to debug issues
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
      })

      await new Promise((resolve) => setTimeout(resolve, 100))

      // Mark as initialized for this session
      window.sessionStorage.setItem("msw-initialized", "true")
      console.log("[v0] MSW initialized successfully and ready to intercept API calls")

      console.log("[v0] MSW handlers registered:", jobsHandlers.length)
    } catch (error) {
      console.error("[v0] MSW initialization failed:", error)
      throw error
    }
  }
}

export { worker }
