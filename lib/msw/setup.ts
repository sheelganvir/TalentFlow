export async function enableMocking() {
  if (typeof window === "undefined") {
    // Server-side: use Node.js MSW
    console.log("[v0] MSW: Initializing server-side MSW")
    const { server } = await import("./server")
    server.listen()
  } else {
    // Client-side: use browser MSW
    console.log("[v0] MSW: Initializing browser MSW")
    try {
      const { worker } = await import("./browser")
      console.log("[v0] MSW: Worker imported successfully")

      console.log("[v0] MSW: Starting worker with service worker at /mockServiceWorker.js")

      await worker.start({
        onUnhandledRequest: "warn", // Changed from bypass to warn for better debugging
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
        waitUntilReady: true, // Wait for service worker to be ready
      })
      console.log("[v0] MSW: Browser worker started successfully")

      const { handlers } = await import("./handlers")
      console.log("[v0] MSW: Total handlers registered:", handlers.length)

      setTimeout(async () => {
        try {
          console.log("[v0] MSW: Testing with a simple request...")
          const testResponse = await fetch("/api/candidates?test=true")
          console.log("[v0] MSW: Test request successful:", testResponse.status)
        } catch (error) {
          console.error("[v0] MSW: Test request failed:", error)
        }
      }, 1000)
    } catch (error) {
      console.error("[v0] MSW: Failed to start browser worker:", error)
      throw error
    }
  }
}
