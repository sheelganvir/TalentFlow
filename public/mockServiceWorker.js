/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (2.6.4).
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = "26357c79639bfa20d64c0efca2a87423"
const IS_MOCKED_RESPONSE = Symbol("isMockedResponse")
const activeClientIds = new Set()

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener("message", async (event) => {
  const clientId = event.source.id

  if (!clientId || !event.data) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: "window",
  })

  switch (event.data.type) {
    case "KEEPALIVE_REQUEST": {
      sendToClient(event.source, {
        type: "KEEPALIVE_RESPONSE",
      })
      break
    }

    case "INTEGRITY_CHECK_REQUEST": {
      sendToClient(event.source, {
        type: "INTEGRITY_CHECK_RESPONSE",
        payload: INTEGRITY_CHECKSUM,
      })
      break
    }

    case "MOCK_ACTIVATE": {
      activeClientIds.add(clientId)

      sendToClient(event.source, {
        type: "MOCKING_ENABLED",
        payload: true,
      })
      break
    }

    case "MOCK_DEACTIVATE": {
      activeClientIds.delete(clientId)
      break
    }

    case "CLIENT_CLOSED": {
      activeClientIds.delete(clientId)

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId
      })

      // Unregister itself when there are no more clients
      if (remainingClients.length === 0) {
        self.registration.unregister()
      }

      break
    }
  }
})

self.addEventListener("fetch", (event) => {
  const { request } = event

  // Bypass server-sent events.
  if (request.headers.get("accept") === "text/event-stream") {
    return
  }

  // Bypass navigation requests.
  if (request.mode === "navigate") {
    return
  }

  // Opening the DevTools triggers the "only-if-cached" request
  // that cannot be handled by the worker. Bypass such requests.
  if (request.cache === "only-if-cached" && request.mode !== "same-origin") {
    return
  }

  // Bypass all requests when there are no active clients.
  // Prevents the self-unregistered worked from handling requests
  // after it's been deleted (still remains active until the next reload).
  if (activeClientIds.size === 0) {
    return
  }

  // Generate unique request ID.
  const requestId = crypto.randomUUID()

  event.respondWith(
    handleRequest(event, requestId).catch((error) => {
      if (error.name === "NetworkError") {
        console.warn(
          "Detected a NetworkError, you most likely encountered a CORS issue. " +
            "Read more: https://mswjs.io/docs/messages/networkError",
        )
      }

      throw error
    }),
  )
})

async function handleRequest(event, requestId) {
  const client = await resolveMainClient(event)
  const response = await getResponse(event, client, requestId)

  // Send back the response clone for the "response:*" life-cycle events.
  // Ensure MSW is active and ready to handle the message, otherwise
  // this message will pend indefinitely.
  if (client && activeClientIds.has(client.id)) {
    ;(async () => {
      const responseClone = response.clone()
      sendToClient(client, {
        type: "RESPONSE",
        payload: {
          requestId,
          isMockedResponse: IS_MOCKED_RESPONSE in response,
          type: responseClone.type,
          status: responseClone.status,
          statusText: responseClone.statusText,
          body: responseClone.body === null ? null : await responseClone.text(),
          headers: Object.fromEntries(responseClone.headers.entries()),
        },
      })
    })()
  }

  return response
}

// Resolve the main client for the given event.
// Client that issues a request doesn't necessarily equal the client
// that registered the worker. It's with the latter the worker should
// communicate with during the response resolving phase.
async function resolveMainClient(event) {
  const url = new URL(event.request.url)

  // If the request URL is an absolute URL, resolve the main client
  // relative to the request URL's origin.
  if (url.origin !== self.location.origin) {
    const allClients = await self.clients.matchAll({
      type: "window",
    })

    return allClients.find((client) => {
      const clientUrl = new URL(client.url)
      return clientUrl.origin === url.origin
    })
  }

  return self.clients.get(event.clientId)
}

async function getResponse(event, client, requestId) {
  const { request } = event

  // Clone the request because it might've been already used
  // (i.e. its body has been read and sent to the client).
  const requestClone = request.clone()

  function passthrough() {
    const headers = Object.fromEntries(requestClone.headers.entries())

    // Remove MSW-specific request headers so the bypassed requests
    // comply with the server's CORS preflight check.
    // Operate with the headers as an object because request "Headers"
    // are immutable.
    delete headers["x-msw-intention"]

    return fetch(requestClone, { headers })
  }

  // Bypass mocking when the client is not active.
  if (!client) {
    return passthrough()
  }

  // Bypass initial page load requests (i.e. static assets).
  // The absence of the immediate/parent client in the map of the active clients
  // means that MSW hasn't dispatched the "MOCK_ACTIVATE" event yet
  // and is not ready to handle requests.
  if (!activeClientIds.has(client.id)) {
    return passthrough()
  }

  // Notify the client that a request has been intercepted.
  const requestBuffer = await requestClone.arrayBuffer()
  const clientMessage = await sendToClient(
    client,
    {
      type: "REQUEST",
      payload: {
        id: requestId,
        url: requestClone.url,
        mode: requestClone.mode,
        method: requestClone.method,
        headers: Object.fromEntries(requestClone.headers.entries()),
        cache: requestClone.cache,
        credentials: requestClone.credentials,
        destination: requestClone.destination,
        integrity: requestClone.integrity,
        redirect: requestClone.redirect,
        referrer: requestClone.referrer,
        referrerPolicy: requestClone.referrerPolicy,
        body: requestBuffer,
        keepalive: requestClone.keepalive,
      },
    },
    5000,
  )

  switch (clientMessage.type) {
    case "MOCK_RESPONSE": {
      return respondWithMock(clientMessage.data)
    }

    case "MOCK_NOT_FOUND": {
      return passthrough()
    }

    case "NETWORK_ERROR": {
      const { name, message } = clientMessage.data
      const networkError = new Error(message)
      networkError.name = name

      // Rejecting a "respondWith" promise is equivalent to throwing an exception
      // from the service worker, which will result in a network error.
      throw networkError
    }
  }

  return passthrough()
}

function sendToClient(client, message, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(new Error(event.data.error))
      }

      resolve(event.data)
    }

    client.postMessage(message, [channel.port2])

    setTimeout(() => {
      reject(new Error("Failed to receive a timely response from the client"))
    }, timeout)
  })
}

function respondWithMock(response) {
  // Setting response status code to 0 is not supported.
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#status
  if (response.status === 0) {
    response.status = 200
  }

  const mockedResponse = new Response(response.body, response)

  Reflect.defineProperty(mockedResponse, IS_MOCKED_RESPONSE, {
    value: true,
    enumerable: true,
  })

  return mockedResponse
}
