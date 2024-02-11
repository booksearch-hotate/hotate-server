/**
 * サムネイルを表示するカードを生成する関数
 * @param {string} fileName ファイル名
 * @returns サムネイルを表示するカードの要素の文字列
 */
function makeThumbnailCard (fileName) {
  return `
  <div class="thumbnail-card-item-box" id="${fileName}-box">
    <input type="radio" id="${fileName}-input" class="thumbnail-button" name="thumbnailName" value="${fileName}">
    <label for="${fileName}-input" class="choice-thumbnail-label">
      <img src="/thumbnail/${fileName}.png" class="choice-thumbnail-img" />
      <div class="thumbnail-delete-box">
        <a href="javascript:void(0);" onclick="deleteThumbnail('${fileName}')">
          <i class="bi bi-trash"></i>
        </a>
      </div>
    </label>
  </div>
  `
}

function deleteThumbnail(thumbnailName) {
  const token = document.head.querySelector("[name=csrfToken][content]").content;
  
  fetch(`/api/recommendation/thumbnail/delete?_csrf=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({deleteFileName: thumbnailName}),
  }).catch(e => {
    throw e;
  }).then((val) => {
    if (!val.ok) return;

    document.getElementById(`${thumbnailName}-box`).remove();
  });
}

document.getElementById('thumbnailFile').addEventListener('input', async (value) => {
  const token = document.head.querySelector("[name=csrfToken][content]").content;
  const fd = new FormData();
  const fileData = document.getElementById('thumbnailFile').files[0];
  fd.append('imgFile', fileData);
  const res = await fetch(`/api/recommendation/thumbnail/add?_csrf=${token}`, {
    method: 'POST', 
    body: fd,
  }).then((res) => res.json());

  if (res.status === 'success') {
    const element = makeThumbnailCard(res.fileName);
    
    document.getElementById('existThumbnail').innerHTML = document.getElementById('existThumbnail').innerHTML + element;
  }
});
