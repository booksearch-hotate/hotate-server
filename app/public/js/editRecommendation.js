function makeBookItemNode(bookName, id) {
  const div = document.createElement('div');
  div.classList.add('book-item-box');
  div.setAttribute('id', `book-item-${id}`);
  div.setAttribute('data-bookid', id);

  div.innerHTML = `
    <p>${bookName}</p>
    <input type="hidden" value="${id}" name="books[]">
    <a onclick="deleteBook('${id}')" class="btn btn-warning">削除</a>
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

  if (data.status === 'Success') {
    const parentElement = document.getElementById('book-title-list-box');

    const tar = makeBookItemNode(data.book.bookName, data.book.id);
    parentElement.appendChild(tar);
  }
}