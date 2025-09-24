import { initializeDatabase } from "./db"
import { initializeMSW } from "./msw-setup"

let initializationPromise: Promise<void> | null = null

export async function initializeApp() {
  // Return existing promise if already initializing
  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    try {
      // Initialize MSW first to ensure API calls are intercepted
      await initializeMSW()
      console.log("[v0] MSW ready, initializing database...")

      // Then initialize database
      await initializeDatabase()
      console.log("[v0] App initialization complete")
    } catch (error) {
      console.error("[v0] App initialization failed:", error)
      // Reset promise so it can be retried
      initializationPromise = null
      throw error
    }
  })()

  return initializationPromise
}

// Check if initialization is complete
export function isAppInitialized(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.sessionStorage.getItem("db-initialized") === "true" &&
    window.sessionStorage.getItem("msw-initialized") === "true"
  )
}

export { initializeDatabase, initializeMSW }
