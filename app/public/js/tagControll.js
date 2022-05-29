/* urlの一番最後がidなのでそれを取得する */
/* GETの部分は取り除く */
const url = location.href;
const lastPath = url.split('/').pop();
const bookId = lastPath.split('?')[0];

const tagElement = document.getElementById('add-tag');

const resBoxEle = document.getElementById('tag-result-box');
const resEle = document.getElementById('tag-result');

async function addTag() {
  const tag = tagElement.value;
  const res = await fetch(`/api/${bookId}/tag`, {
    method: 'POST',
    body: JSON.stringify({ name: tag }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json());
  
  resBoxEle.style.display = 'block';
  switch (res.status) {
    case 'success':
      resEle.innerText = `${tag}を追加しました`;
      break;
    case 'duplicate':
      resEle.innerText = `${tag}は既に登録されています`;
      break;
    case 'error':
      resEle.innerText = `${tag}を追加できませんでした`;
      break;
  }
}