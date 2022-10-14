const makeCardElement = (id, len) => {
  const CARD_ELEMENT = `
  <div class="col p-4" id="${id}">
    <div class="book-card-box">
      <h3>${len}冊目</h3>
      <div class="mb-3">
        <div class="tree-form-item mb-0">
          <label for="isbn" class="tree-label">ISBN</label>
          <input class="tree-input" type="text" id="isbn" name="isbn[]" placeholder="ISBN">
        </div>
        <p class="tree-input-info">ISBNは本の画像を取得する際に使用されます</p>

        <div class="tree-form-item">
          <label for="book" class="tree-label">書名</label>
          <input class="tree-input" type="text" id="book" name="bookName[]" placeholder="書名" required>
        </div>

        <div class="tree-form-item">
          <label for="bookSubName" class="tree-label">副題</label>
          <input class="tree-input" type="text" id="bookSubName" name="bookSubName[]" placeholder="副題">
        </div>

        <div class="tree-form-item">
          <label for="authorName" class="tree-label">著者名</label>
          <input class="tree-input" type="text" id="authorName" name="authorName[]" placeholder="著者名">
        </div>

        <div class="tree-form-item">
          <label for="publisherName" class="tree-label">出版社名</label>
          <input class="tree-input" type="text" id="publisherName" name="publisherName[]" placeholder="出版社名">
        </div>

        <div class="tree-form-item">
          <label for="ndc" class="tree-label">日本十進分類法</label>
          <input class="tree-input" type="text" id="ndc" name="ndc[]" placeholder="日本十進分類法">
        </div>

        <div class="tree-form-item">
          <label for="year" class="tree-label">出版年</label>
          <input class="tree-input" type="number" id="year" name="year[]" placeholder="出版年">
        </div>

        <div class="tree-form-item">
          <label for="bookContent" class="tree-label">内容</label>
          <textarea class="tree-input tree-textarea" id="bookContent" name="content[]"></textarea>
        </div>
      </div>
    </div>
  </div>
  `;

  const tempEl = document.createElement('div');
  tempEl.innerHTML = CARD_ELEMENT;

  return tempEl.firstElementChild;
}

const CARD_BOX_ID = 'card-box';
const CARD_BOX_ELEMENT = document.getElementById(CARD_BOX_ID);

const CARD_ID_LIST = []; // 現在表示しているカードのidを格納する配列
const MAX_CARD_LEN = 10;

function addCard() {
  if (CARD_ID_LIST.length > MAX_CARD_LEN) return;

  const id = Math.random().toString(32).substring(2);
  CARD_ID_LIST.push(id);

  CARD_BOX_ELEMENT.appendChild(makeCardElement(id, CARD_ID_LIST.length));
}

function deleteCard(id) {
  const idIndex = CARD_ID_LIST.indexOf(id);
  if (idIndex === -1) return;

  document.getElementById(id).remove();

  CARD_ID_LIST.splice(idIndex, 1);
}

function deleteLastCard() {
  if (CARD_ID_LIST.length === 1) return;

  const id = CARD_ID_LIST[CARD_ID_LIST.length - 1];
  deleteCard(id);
}

addCard(); // 最初の要素を追加
