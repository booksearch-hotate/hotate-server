import WebSocket from 'ws'

import { IBroadcastData } from './IBoadcastData'

let wss: WebSocket.Server

export function startWSServer (port: number) {
  wss = new WebSocket.Server({ port })
}

export function broadcast (data: IBroadcastData) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}
