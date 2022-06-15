import WebSocket from 'ws';

let wss: WebSocket.Server;

interface broadcastData {
  progress: string,
  data: {
    current: number,
    total: number,
  }
}

export function startWSServer(port: number) {
  wss = new WebSocket.Server({port});
}

export function broadcast(data: broadcastData) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}
