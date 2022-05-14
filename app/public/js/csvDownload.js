const ws = '' // websocket connection

const openWS = link => {
  const ws = new WebSocket(link)
  ws.onopen = () => {
    console.log('connected')
  }
  ws.onmessage = (event) => {
    console.log(event.data)
  }
  ws.onclose = () => {
    console.log('disconnected')
  }
}

const closeWS = () => {
  ws.close()
}

openWS('ws://localhost:5051')