const token = document.head.querySelector("[name=csrfToken][content]").content

let DbIdList = []; // Elasticsearchに登録されていないDBのIDリスト
let EsIdList = [];

const equDbDocuments = {
  status: document.getElementById('equDbStatus'),
  mes: document.getElementById('equDbMes')
};

const equEsDocuments = {
  status: document.getElementById('equEsStatus'),
  mes: document.getElementById('equEsMes')
};

async function checkEqualDbIds () {
  const equDbStatus = equDbDocuments.status;
  const equDbMes = equDbDocuments.mes;

  function makeDupMes(idList) {
    const addBtnDiv = document.createElement('div');
    addBtnDiv.classList.add('d-flex', 'justify-content-center');
    const addBtn = document.createElement('button');
    addBtn.innerText = 'Elasitcsearchに登録';
    addBtn.classList.add('btn', 'btn-primary', 'my-3');
    addBtn.id = 'addToEsBtn';
    addBtnDiv.appendChild(addBtn);

    const div = document.createElement('div');

    div.appendChild(addBtn);

    div.innerHTML += '<p>以下のIDがElasticsearchにはありませんでした</p>'

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

      document.getElementById('addToEsBtn').addEventListener('click', addBooksToEs);

      DbIdList = idList;
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
    div.innerHTML += '<p>以下のIDがMySQLにありませんでした</p>'

    /* リスト形式で重複対象を表示 */
    const list = document.createElement('ul');

    for (let i = 0; i < idList.length; i++) {
      list.innerHTML += `
      <li>${idList[i]}</li>
      `
    }

    const addBtnDiv = document.createElement('div');
    addBtnDiv.classList.add('d-flex', 'justify-content-center');
    const addBtn = document.createElement('button');
    addBtn.innerText = 'Elasticsearchから削除';
    addBtn.classList.add('btn', 'btn-danger', 'my-3');
    addBtn.id = 'deleteToEsBtn';
    addBtnDiv.appendChild(addBtn);

    div.appendChild(addBtnDiv);

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
      EsIdList = idList;

      document.getElementById('deleteToEsBtn').addEventListener('click', deleteBooksToEs);
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

/**
 * DBに登録されているがElasticsearchに登録されていないIDをElasticsearchに登録する
 */
async function addBooksToEs () {
  try {
    const sliceLen = 1000;

    equDbDocuments.status.innerHTML = '<i class="bi bi-arrow-repeat"></i>';
    equDbDocuments.mes.innerText = 'Elasticsearchに登録中...';

    for (let i = 0; i < DbIdList.length; i += sliceLen) {
      const sliceList = DbIdList.slice(i, i + sliceLen);

      await fetch(`/api/admin/health/books/add-es?_csrf=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idList: sliceList })
      });
    }

    equDbDocuments.status.innerHTML = '<i class="bi bi-check"></i>';
    equDbDocuments.mes.innerText = '5秒後に再度チェックします。そのままお待ちください。';

    setTimeout(async () => {
      await checkEqualDbIds();
    }, 5000);
  } catch (e) {
    console.error(e);

    equDbDocuments.status.innerText = `<i class="bi bi-x"></i>`;
    equDbDocuments.mes.innerText = 'エラーが発生しました。詳しくはコンソールもしくはサーバー側のログを確認してください。';
  }
}

async function deleteBooksToEs () {
  try {
    const sliceLen = 1000;

    equEsDocuments.status.innerHTML = '<i class="bi bi-arrow-repeat"></i>';
    equEsDocuments.mes.innerText = 'Elasticsearchから削除中...';

    for (let i = 0; i < EsIdList.length; i += sliceLen) {
      const sliceList = EsIdList.slice(i, i + sliceLen);

      await fetch(`/api/admin/health/books/delete-books-to-es?_csrf=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idList: sliceList })
      });
    }

    equEsDocuments.status.innerHTML = '<i class="bi bi-check"></i>';
    equEsDocuments.mes.innerText = '5秒後に再度チェックします。そのままお待ちください。';

    setTimeout(async () => {
      await checkEqualEsIds();
    }, 5000);
  } catch (e) {
    console.error(e);

    equEsDocuments.status.innerText = `<i class="bi bi-x"></i>`;
    equEsDocuments.mes.innerText = 'エラーが発生しました。詳しくはコンソールもしくはサーバー側のログを確認してください。';
  }
}

/**
 * Elasticsearchに登録されているがDBに登録されていないIDをElasitcsearchから削除する
 */

async function init() {
  await Promise.all([checkDuplicationBooks(), checkEqualDbIds(), checkEqualEsIds()]);
}

init();
