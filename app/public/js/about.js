const headerBox = document.getElementById('tree-header');

const mainAboutBox = document.getElementById('main-about-box');

mainAboutBox.style.height = `${window.innerHeight - headerBox.clientHeight}px`;

const bgImgBox = document.getElementById('bg-img-box');

const bgImgChildren = Array.from(bgImgBox.children);


let counter = 0;

function changeImg() {
  const beforeCounter = counter - 1 < 0 ? bgImgChildren.length - 1 : counter - 1;
  bgImgChildren[beforeCounter].style.opacity = 0;
  bgImgChildren[counter].style.opacity = 1;
  counter = counter + 1 >= bgImgChildren.length ? 0 : counter + 1;
}

changeImg();

/* aboutのメイン箇所のimg */
setInterval(()=> {changeImg()}, 10 * 1000);

window.onload = () => {
  document.getElementById('load-box').style.opacity = 0;
  setTimeout(() => {document.getElementById('load-box').remove()}, 1000);
};
