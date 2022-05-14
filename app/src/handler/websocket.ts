import WebSocket from 'ws'

let wss: WebSocket.Server

export function startWSServer (port: number) {
  wss = new WebSocket.Server({ port })
}

export function broadcast (data: { type: string, percent: number }) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}
