const tarEls = document.querySelectorAll('[data-isbn]');
tarEls.forEach(async (el) => {
  // postでfetch
  if (el.dataset.isbn.length < 10) return
  const data = await fetch(`/api/${el.dataset.isbn}/imgLink`, {
    method: 'POST'
  }).then(res => res.json());
  el.src = data.imgLink;
});
