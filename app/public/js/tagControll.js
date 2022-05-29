/* urlの一番最後がidなのでそれを取得する */
/* GETの部分は取り除く */
const url = location.href;
const lastPath = url.split('/').pop();
const bookId = lastPath.split('?')[0];

const tagElement = document.getElementById('add-tag');

async function addTag() {
  const tag = tagElement.value;
  await fetch(`/api/${bookId}/tag`, {
    method: 'POST',
    body: JSON.stringify({ name: tag }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}