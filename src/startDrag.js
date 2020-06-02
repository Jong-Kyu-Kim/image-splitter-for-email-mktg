import onDrag from './onDrag';
import endDrag from './endDrag';

export default e => {
  e = e || window.event;
  e.preventDefault();
  
  const divImage = document.getElementById('image');
  const x = e.x - divImage.offsetLeft;
  const y = document.querySelector('.left').scrollTop + e.y;
  const createBox = document.createElement('div');
  const divSelect = document.querySelector('.select');
  if (divSelect) divSelect.classList.remove('select');

  createBox.style.left = `${x}px`;
  createBox.style.top = `${y}px`;
  createBox.className = 'select';
  
  const dragStartLeft = x;
  const dragStartTop = y;

  divImage.appendChild(createBox);

  document.onmousemove = e => {
    onDrag(e, createBox, dragStartTop, dragStartLeft);
  }

  document.onmouseup = e => {
    endDrag(createBox)
  }

  // const insertLinkBox = () => {
  //   divImage.appendChild(createBox);

  //   document.onmousemove = e => {
  //     onDrag(e, createBox, dragStartTop, dragStartLeft);
  //   }
  
  //   document.onmouseup = e => {
  //     endDrag(createBox)
  //   }
  // }

  // if (divImage.children.length > 0) {
  //   const prevBox = divImage.lastChild;
  //   prevBox.offsetRight = prevBox.offsetLeft + prevBox.offsetWidth;
  //   prevBox.offsetBottom = prevBox.offsetTop + prevBox.offsetHeight;

  //   if (dragStartLeft > prevBox.offsetRight) {
  //     if (dragStartTop > prevBox.offsetTop) insertLinkBox(prevBox);
  //   }

  //   else {
  //     if (dragStartTop > prevBox.offsetBottom) insertLinkBox(prevBox);
  //   }
  // }
  
  // else insertLinkBox();
}