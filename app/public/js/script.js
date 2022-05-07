/**
 *
 * 全てのファイルに適用されるjsファイル
 *
*/

function makePhrase () {
  const phrases = ['少女', '工業高校', '冒険', '歴史']
  const randomNum = Math.floor(Math.random() * 3) + 1
  const alreadyChoiceIndex = []
  let resWords = ''
  for (let i = 0; i < randomNum; i++) {
    while (true) {
      const index = Math.floor(Math.random() * phrases.length)
      if (!alreadyChoiceIndex.includes(index)) {
        alreadyChoiceIndex.push(index)
        resWords += phrases[index] + ' '
        break
      }
    }
  }
  // 最後のスペースを削除
  return resWords.slice(0, -1)
}

function viewSearchBox (searchBoxId) {
  const searchBox = document.getElementById(searchBoxId)
  searchBox.classList.add('is-active')

  /* 検索のプレースホルダーの内容をランダムに切り替え */
  const searchInput = document.getElementById('search-input')
  searchInput.placeholder = `ex. ${makePhrase()}`
}

function hideSearchBox (searchBoxId) {
  const searchBox = document.getElementById(searchBoxId)
  searchBox.classList.remove('is-active')
}

document.getElementById('search-button-text').addEventListener('click', () => { viewSearchBox('search-box') })
document.getElementById('close-button').addEventListener('click', () => { hideSearchBox('search-box') })