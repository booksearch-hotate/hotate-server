import WebSocket from 'ws'

import IDownloadCsv from './IDownloadCsv'

const wss = new WebSocket.Server({ port: 5051 })

export function broadcast (data: IDownloadCsv) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}
