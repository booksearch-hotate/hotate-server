const cardList = document.getElementById('campaign-box');
const paginationBox = document.getElementById('card-pagination-box');

const cardChildren = cardList.children;

const cardWidth = cardChildren[0].clientWidth;

let cardMargin = 0;

if (cardChildren.length > 1) {
  cardMargin = cardChildren[1].getBoundingClientRect().left - cardChildren[0].getBoundingClientRect().left;
}

const viewCardCount = Math.floor(window.innerWidth / cardWidth);
const maxMoveCount = cardChildren.length - viewCardCount;

let nowIndex = 0;

function moveCard(index) {
  if (index > maxMoveCount) nowIndex = 0;
  else if (index < 0) nowIndex = maxMoveCount;
  else nowIndex = index;

  cardList.style.right = `${cardMargin * nowIndex}px`;
}

function forwardCard() {
  moveCard(nowIndex + 1);
}

function backCard() {
  moveCard(nowIndex - 1);
}

function renderPagination() {
  const forwardCircle = document.createElement('div');
  forwardCircle.innerHTML = '<i class="bi bi-chevron-left campaign-card-pagination-icon"></i>';
  forwardCircle.addEventListener('click', () => {backCard()});

  const circleList = [];
  for (let i = 0; i <= maxMoveCount; i++) {
    const circle = document.createElement('div');
    circle.innerHTML = '<i class="bi bi-circle-fill campaign-card-pagination-icon"></i>';
    circle.addEventListener('click', () => {moveCard(i)});

    circleList.push(circle);
  }

  const backCircle = document.createElement('div');
  backCircle.innerHTML = '<i class="bi bi-chevron-right campaign-card-pagination-icon"></i>';
  backCircle.addEventListener('click', () => {forwardCard()});

  if (maxMoveCount >= 1) paginationBox.append(forwardCircle, ...circleList, backCircle);
}

renderPagination();
