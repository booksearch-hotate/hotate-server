const link = 'ws://localhost:5051/download/csv'

const ws = new WebSocket(link)

ws.onopen = () => {
  console.log('connected')
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log(data)
}

ws.onclose = () => {
  console.log('disconnected')
}
