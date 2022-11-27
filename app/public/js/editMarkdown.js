let isFirst = true;

function viewMarkDown(textareaId) {
  const markdownViewId = 'markdown-result';
  const inputEle = document.getElementById(textareaId);
  const texeareaValue = inputEle.value; // テキストエリアの値を取得

  const tarEle = document.getElementById(markdownViewId);
  
  tarEle.innerHTML = DOMPurify.sanitize(marked.parse(texeareaValue));

  if (isFirst) {
    inputEle.addEventListener('change', () => {
      viewMarkDown(textareaId)
    }, false);
  }

  isFirst = false;
}
