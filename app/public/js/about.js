const headerBox = document.getElementById('tree-header');

const mainAboutBox = document.getElementById('main-about-box');

mainAboutBox.style.height = `${window.innerHeight - headerBox.clientHeight}px`;
