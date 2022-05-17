const link = 'ws://localhost:5051/'

const ws = new WebSocket(link)

ws.onopen = () => {
  console.log('connected')
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  const progress = data.progress // 現在の進捗状況(string)

  const percent = Math.round(data.data.current / data.data.total * 100)

  if (progress !== 'error') {
    const progressBar = document.getElementById('progress-bar')
    const progressBarText = document.getElementById('progress-value')
  
    progressBar.style.width = percent + '%'
    progressBarText.innerText = percent + '%'
  }

  if (progress === 'complete') {
    const completeBox = document.getElementById('complete-box')
    completeBox.style.display = 'block'
  } else if (progress === 'error') {
    const errorBox = document.getElementById('error-box')
    errorBox.style.display = 'block'
  }
}

ws.onclose = () => {
  console.log('disconnected')
}
