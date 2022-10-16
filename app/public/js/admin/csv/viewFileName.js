const INPUT_FILE_ID = 'formFile' // inputに設定したID
const VIEW_ID = 'viewFileName';
const SUBMIT_ID = 'submitButton';

/**
 * 入力されたファイルのファイル名を取得する関数
 */
const viewFileName = () => {
  const element = document.getElementById(INPUT_FILE_ID); // fileのエレメント取得
  const value = element.value; // ファイル名を取得

  const fileName = value.substring(value.lastIndexOf('\\') + 1); // C:/fakepath/という接頭辞が存在するので、それを切り取り

  const viewElement = document.getElementById(VIEW_ID);
  viewElement.innerText = fileName.length === 0 ? 'ファイルが選択されていません' : fileName;

  const submitElement = document.getElementById(SUBMIT_ID);
  submitElement.disabled = fileName.length === 0;
}

/* inputのファイルが変更されたときに発火してviewFileName関数が実行される */
document.getElementById(INPUT_FILE_ID).addEventListener('input', () => viewFileName());