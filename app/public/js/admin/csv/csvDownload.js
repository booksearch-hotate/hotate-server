const link = 'ws://localhost:5051/'

const ws = new WebSocket(link)

const headerText = document.getElementById('progress-text')

const linkBox = document.getElementById('link-box')

ws.onopen = () => {
  console.log('connected')
  headerText.innerText = '情報を取得中...'
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  const progress = data.progress // 現在の進捗状況(string)

  if (progress === 'init') {
    headerText.innerText = 'データを初期化中...'
    console.log('init')
  }

  const percent = Math.round(data.data.current / data.data.total * 100)

  if (progress !== 'error') {
    const progressBar = document.getElementById('progress-bar')
  
    progressBar.style.width = percent + '%'
    progressBar.innerText = percent + '%'

    headerText.innerText = `データを取得中... ${data.data.current} / ${data.data.total}`
  }

  if (progress === 'complete') {
    linkBox.classList.add('button-active');
    headerText.innerText = 'データの取得が完了しました'
  } else if (progress === 'error') {
    linkBox.classList.add('button-active');
    headerText.innerText = 'データの取得に失敗しました'
  }
}

ws.onclose = () => {
  console.log('disconnected')
}
