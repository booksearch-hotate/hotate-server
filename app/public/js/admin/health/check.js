const token = document.head.querySelector("[name=csrfToken][content]").content

async function checkEqualDbIds () {
  const equDbStatus = document.getElementById('equDbStatus');
  const equDbMes = document.getElementById('equDbMes');

  function makeDupMes(idList) {
    const div = document.createElement('div');
    div.innerHTML += '<p>以下のIDが重複しています。</p>'

    /* リスト形式で重複対象を表示 */
    const list = document.createElement('ul');

    for (let i = 0; i < idList.length; i++) {
      list.innerHTML += `
      <li>${idList[i]}</li>
      `
    }

    div.appendChild(list);

    return div;
  }

  try {
    const data = await fetch(`/api/admin/health/books/equaldbtoes?_csrf=${token}`, {
      method: 'POST'
    }).then(res => res.json());

    const idList = data.notEqualDbIds;
    
    if (idList.length === 0) {
      equDbStatus.innerHTML = '<i class="bi bi-check"></i>';

      equDbMes.innerText = 'Elasticsearchに登録されていないDBのIDは確認されませんでした。';
    } else {
      equDbStatus.innerHTML = '<i class="bi bi-x"></i>';

      equDbMes.innerHTML = makeDupMes(idList).innerHTML;
    }
  } catch (e) {
    equDbStatus.innerText = 'エラー';

    equDbMes.innerText = 'エラーが発生しました。詳しくはコンソールもしくはサーバー側のログを確認してください。';
  }
}

async function checkEqualEsIds () {
  const equEsStatus = document.getElementById('equEsStatus');
  const equEsMes = document.getElementById('equEsMes');

  function makeDupMes(idList) {
    const div = document.createElement('div');
    div.innerHTML += '<p>以下のIDが矛盾しています。</p>'

    /* リスト形式で重複対象を表示 */
    const list = document.createElement('ul');

    for (let i = 0; i < idList.length; i++) {
      list.innerHTML += `
      <li>${idList[i]}</li>
      `
    }

    div.appendChild(list);

    return div;
  }

  try {
    const data = await fetch(`/api/admin/health/books/equalestodb?_csrf=${token}`, {
      method: 'POST'
    }).then(res => res.json());

    const idList = data.notEqualDbIds;
    
    if (idList.length === 0) {
      equEsStatus.innerHTML = '<i class="bi bi-check"></i>';

      equEsMes.innerText = 'DBに登録されていないElasticSearchのIDは確認されませんでした。';
    } else {
      equEsStatus.innerHTML = '<i class="bi bi-x"></i>';

      equEsMes.innerHTML = makeDupMes(idList).innerHTML;
    }
  } catch (e) {
    equEsStatus.innerText = 'エラー';

    equEsMes.innerText = 'エラーが発生しました。詳しくはコンソールもしくはサーバー側のログを確認してください。';
  }
}

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
  await Promise.all([checkDuplicationBooks(), checkEqualDbIds(), checkEqualEsIds()]);
}

init();
