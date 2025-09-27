import { setupWorker } from "msw/browser"
import { handlers } from "./handlers"

console.log("[v0] MSW: Setting up worker with handlers:", handlers.length)

export const worker = setupWorker(...handlers)

worker.events.on("request:start", ({ request }) => {
  console.log("[v0] MSW: Intercepting request:", request.method, request.url)
})

worker.events.on("request:match", ({ request }) => {
  console.log("[v0] MSW: Request matched handler:", request.method, request.url)
})

worker.events.on("request:unhandled", ({ request }) => {
  console.log("[v0] MSW: Unhandled request:", request.method, request.url)
})
