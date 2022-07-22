function makeBookItemNode(bookName, id) {
  const div = document.createElement('tr');
  div.classList.add('book-item-box');
  div.setAttribute('id', `book-item-${id}`);
  div.setAttribute('data-bookid', id);

  div.innerHTML = `
  <td>${bookName}</td>
  <td>
    <a onclick="deleteBook('${id}')" class="btn btn-warning">削除</a>
  </td>
  <input type="hidden" value="${id}" name="books[]">
  `;
  return div;
}

async function addBook(recommendationId) {
  const url = document.getElementById('url').value;
  const token = document.head.querySelector("[name=csrfToken][content]").content;
  const data = await fetch(`/api/recommendation/book/add/?_csrf=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({addUrl: url, recommendationId}),
  }).then(res => res.json());

  const alreadyAddBookIds = document.querySelectorAll('[data-bookid]');

  alreadyAddBookIds.forEach((el) => {
    if (el.dataset.bookid === data.book.id) {
      data.status = 'Failue';
      return;
    }
  });

  if (data.status === 'Success' || data.status === 'Exist') {
    const parentElement = document.getElementById('book-title-list-box');

    const tar = makeBookItemNode(data.book.bookName, data.book.id);
    parentElement.appendChild(tar);
  }
}

function deleteBook(bookId) {
  const idElements = document.querySelectorAll('[data-bookid]');
  idElements.forEach((el) => {
    if (el.dataset.bookid === bookId) {
      el.remove();
      return;
    }
  });
}

function toggleSortIndex() {
  const tarEle = document.getElementById('sort-index-box');
  tarEle.classList.toggle('view');
}