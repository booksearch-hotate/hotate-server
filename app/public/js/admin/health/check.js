const token = document.head.querySelector("[name=csrfToken][content]").content

async function checkDuplicationBooks () {
  const dupStatus = document.getElementById('dupStatus');
  const dupMes = document.getElementById('dupMes');

  function makeDupMes(dupList) {
    const div = document.createElement('div');
    div.innerHTML += '<p>以下の書名が重複しています。</p>'

    /* リスト形式で重複対象を表示 */
    const list = document.createElement('ul');

    for (let i = 0; i < dupList.length; i++) {
      list.innerHTML += `
      <li>${dupList[i]}</li>
      `
    }

    div.appendChild(list);

    return div;
  }

  try {
    const data = await fetch(`/api/admin/health/books/duplication?_csrf=${token}`, {
      method: 'POST'
    }).then(res => res.json());

    const dupList = data.bookNames;
    
    if (dupList.length === 0) {
      dupStatus.innerText = '重複なし';

      dupMes.innerText = '本の書名に重複はありませんでした。';
    } else {
      dupStatus.innerText = `${dupList.length}件の重複を確認`;

      dupMes.innerHTML = makeDupMes(dupList).innerHTML;
    }
  } catch (e) {
    dupStatus.innerText = 'エラー';

    dupMes.innerText = 'エラーが発生しました。詳しくはコンソールもしくはサーバー側のログを確認してください。';
  }
}

async function init() {
  await checkDuplicationBooks();
}

init();
