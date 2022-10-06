/**
 *
 * 全てのファイルに適用されるjsファイル
 *
*/

/**
 * 各ラベルの属性をまとめた配列
 * 
 * {
 *  idPhrase: ラベルのID
 *  themeColor: ラベルのテーマカラー
 *  element: ラベルのIDに対応したHTMLエレメント。初期化時に設定
 *  message: ラベルを選択したときにコンテンツの上部に表示されるコメントの内容
 * }
 */
 const itemContentList = [
  {
    idPhrase: "amb",
    themeColor: "#6E927A",
    element: null,
    message: "キーワードを入力して検索します"
  },
  {
    idPhrase: "abs",
    themeColor: "#97C0A5",
    element: null,
    message: "キーワードと完全一致で検索されます"
  },
   {
    idPhrase: "tag",
    themeColor: "#BEE5CB",
    element: null,
    message: "タグで検索します"
   }
];

const searchContentEle = document.getElementById('searchContentBox'); // コンテンツのエレメント
const searchMessageEle = document.getElementById('contentMessage'); // メッセージのエレメント

/**
 * クリックされたときに実行される関数
 *
 * @param {*} clickId クリックした要素のid
 */
function itemClickEvent(clickId) {
  for (let i = 0; i < itemContentList.length; i++) {
    const item = itemContentList[i];

    if (item.idPhrase === clickId) {
      item.element.style.zIndex = itemContentList.length + 1; // z-indexが一番上になるように設定
      searchContentEle.style.backgroundColor = item.themeColor;
      searchMessageEle.innerText = item.message;

      /* その他の属性のz-indexの調整 */
      if (i !== 0) {
        for (let k = 0; k < i; k++) {
          const otherItem = itemContentList[k];

          otherItem.element.style.zIndex = k;
        }
      }

      if (i !== itemContentList.length - 1) {
        for (let k = i + 1; k < itemContentList.length; k++) {
          const otherItem = itemContentList[k];

          otherItem.element.style.zIndex = itemContentList.length - k;
        }
      }
    }
  }
}


/* 初期化 */
for (let i = 0; i < itemContentList.length; i++) {
  /* オブジェクトの初期化 */
  itemContentList[i].element = document.getElementById(itemContentList[i].idPhrase);

  /* スタイルの初期化 */
  const ele = itemContentList[i].element;
  ele.style.zIndex = itemContentList.length - i;
  ele.style.backgroundColor = itemContentList[i].themeColor;
  const moveLeft = 20; // 左へずらす量
  ele.style.left = `-${moveLeft * i}px`;

  if (i === 0) {
    searchContentEle.style.backgroundColor = itemContentList[i].themeColor;
    searchMessageEle.innerText = itemContentList[i].message;
    
  }

  ele.addEventListener('click', (e) => itemClickEvent(e.target.id)); // イベントリスナーの設定
}

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

const searchBox = document.getElementById('search-view-box')

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

  const tagLabelElement = document.getElementById('tag');

  if (type !== 'book') {
    tagLabelElement.classList.add('remove-label');

    const formElement = document.getElementById('searchForm'); // formのエレメントを取得
    if (formElement.elements['mode'].value === 'tag') {
      itemClickEvent('amb');
      const bookButton = document.getElementById('normalSearch');
      bookButton.checked = true;
    }
  } else {
    tagLabelElement.classList.remove('remove-label');
  }
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
  if (ele.target.id === 'stateAlert')ele.target.remove();
})