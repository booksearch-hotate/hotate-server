const link = 'ws://localhost:5051/'

const ws = new WebSocket(link)

const headerText = document.getElementById('header-text')

const linkBox = document.getElementById('link-box')

ws.onopen = () => {
  console.log('connected')
  headerText.innerText = '情報を取得中...'
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  const progress = data.progress // 現在の進捗状況(string)

  console.log(data)

  if (progress === 'init') {
    headerText.innerText = 'データを初期化中...'
    console.log('init')
  }

  const percent = Math.round(data.data.current / data.data.total * 100)

  if (progress !== 'error') {
    const progressBar = document.getElementById('progress-bar')
    const progressBarText = document.getElementById('progress-value')
  
    progressBar.style.width = percent + '%'
    progressBarText.innerText = percent + '%'

    headerText.innerText = `データを取得中... ${data.data.current} / ${data.data.total}`
  }

  if (progress === 'complete') {
    linkBox.style.display = 'block'
    headerText.innerText = 'データの取得が完了しました'
  } else if (progress === 'error') {
    linkBox.style.display = 'block'
    headerText.innerText = 'データの取得に失敗しました'
  }
}

ws.onclose = () => {
  console.log('disconnected')
}
