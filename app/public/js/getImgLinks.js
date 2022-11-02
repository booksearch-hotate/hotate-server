const tarEls = document.querySelectorAll('[data-isbn]');
tarEls.forEach(async (el) => {
  // postでfetch
  const isbn = el.dataset.isbn.length < 10 ? 'NO_ISBN' : el.dataset.isbn;
  const token = document.head.querySelector("[name=csrfToken][content]").content
  const data = await fetch(`/api/${isbn}/imgLink?_csrf=${token}`, {
    method: 'POST'
  }).then(res => res.json());
  el.src = data.imgLink;
});
