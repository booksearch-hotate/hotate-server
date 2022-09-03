/**
 *
 * 全てのファイルに適用されるjsファイル
 *
*/

const CONFIRM_ID_PHRASE = 'confirm-box' // 確認画面で用いるidの固定値
let CONFIRM_TARGET_INFO = {
  id: '',
  formName: ''
}

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

const searchBox = document.getElementById('search-box')

function viewSearchBox () {
  searchBox.classList.add('is-active')

  /* 検索のプレースホルダーの内容をランダムに切り替え */
  const searchInput = document.getElementById('search-input')
  searchInput.placeholder = `ex. ${makePhrase()}`
}

function hideSearchBox () {
  searchBox.classList.remove('is-active')
}

async function changeSearchType(type) {
  // typeに指定されるべき値
  const searchTypeList = ['book', 'author', 'publisher'];

  if (searchTypeList.indexOf(type) === -1) throw new Error('Invalid search type.');

  const tagButton = document.getElementById('tagSearchButton');

  if (type !== 'book') {
    tagButton.style.opacity = 0;
  } else {
    tagButton.style.opacity = 1;
  }

  /* 背景のロゴのアニメーション処理 */
  searchTypeList.forEach((item) => {
    document.getElementById(`${item}BgIcon`).classList.remove('search-type-icon-active');
  });

  await new Promise(resolve => setTimeout(resolve, 500));

  document.getElementById(`${type}BgIcon`).classList.add('search-type-icon-active');
}

async function removeConfirmBox (confirmId) {
  if (confirmId !== CONFIRM_TARGET_INFO.id) throw new Error('Invalid id of confirm.');

  CONFIRM_TARGET_INFO = {};

  document.getElementById(CONFIRM_ID_PHRASE).classList.remove('is-active');

  await new Promise(resolve => setTimeout(resolve, 500));

  document.getElementById(CONFIRM_ID_PHRASE).remove();
}

async function admitConfirm (confirmId) {
  if (confirmId !== CONFIRM_TARGET_INFO.id) throw new Error('Invalid id of confirm.');
  
  document[CONFIRM_TARGET_INFO.formName].submit();

  await removeConfirmBox(confirmId);
}

async function createConfirmBox(formName, message = '') {
  // 既に表示されていたら
  if (document.getElementById(CONFIRM_ID_PHRASE) !== null) {
    if (typeof CONFIRM_TARGET_INFO.id === 'undefined') document.getElementById(CONFIRM_ID_PHRASE).remove();
    else await removeConfirmBox(CONFIRM_TARGET_INFO.id);
  }

  const div = document.createElement('div');
  div.classList.add('confirm-box');
  div.setAttribute('id', 'confirm-box');

  const id = Math.random().toString(32).substring(2);

  CONFIRM_TARGET_INFO.id = id;
  CONFIRM_TARGET_INFO.formName = formName;

  div.innerHTML = `
  <div class="confirm-content-box">
    <h3>確認</h3>
    <p>${message}</p>
    <div class="confirm-button-box">
      <button class="btn btn-outline-success" onclick="removeConfirmBox('${id}')">戻る</button>
      <button class="btn btn-outline-danger" onclick="admitConfirm('${id}')">確認</button>
    </div>
  </div>
  `;

  const bodyEle = document.getElementsByTagName('body')[0];

  bodyEle.appendChild(div);

  await new Promise(resolve => setTimeout(resolve, 100));

  document.getElementById(CONFIRM_ID_PHRASE).classList.add('is-active');
}

function showDetail(showId, hideId = '') {
  const showEle = document.getElementById(showId);

  showEle.style.height = '100%';

  if (hideId === '') return;

  const hideEle = document.getElementById(hideId);

  hideEle.remove();
}


document.addEventListener('animationend', ele => {
  ele.target.remove();
})