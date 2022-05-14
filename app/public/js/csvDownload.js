const link = 'ws://localhost:5051/'

const ws = new WebSocket(link)

ws.onopen = () => {
  console.log('connected')
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)

  // 小数第二位を四捨五入する
  const percent = Math.round(data.percent * 100)

  if (data.type !== 'error') {
    const progressBar = document.getElementById('progress-bar')
    const progressBarText = document.getElementById('progress-value')
  
    progressBar.style.width = percent + '%'
    progressBarText.innerText = percent + '%'
  }

  if (data.type === 'complete') {
    const completeBox = document.getElementById('complete-box')
    completeBox.style.display = 'block'
  } else if (data.type === 'error') {
    const errorBox = document.getElementById('error-box')
    errorBox.style.display = 'block'
  }
}

ws.onclose = () => {
  console.log('disconnected')
}
