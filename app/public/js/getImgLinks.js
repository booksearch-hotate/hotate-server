const tarEls = document.querySelectorAll('[data-isbn]');
tarEls.forEach(async (el) => {
  // postでfetch
  if (el.dataset.isbn.length < 10) return
  const token = document.head.querySelector("[name=csrfToken][content]").content
  const data = await fetch(`/api/${el.dataset.isbn}/imgLink?_csrf=${token}`, {
    method: 'POST'
  }).then(res => res.json());
  el.src = data.imgLink;
});
