export default (e, linkBox, dragStartTop, dragStartLeft) => {
  e = e || window.event;
  e.preventDefault();

  const divHeader = document.getElementById('header');
  const divLeft = document.querySelector('.left');
  const divImage =  document.getElementById('image');
  
  const x = e.x - divImage.offsetLeft;
  const y = divLeft.scrollTop + e.y - divHeader.clientHeight;
  const {style} = linkBox;          

  if (x < dragStartLeft) {
    if (x < 0) {      
      style.left = 0;
      style.width = `${dragStartLeft}px`;
    }
    else {
      style.left = `${x < 0 ? 0 : x}px`;
      style.width = `${dragStartLeft - x}px`;
    }
  }

  else {
    style.left = `${dragStartLeft}px`;

    if (x > divImage.clientWidth) {
      style.width = `${divImage.clientWidth - linkBox.offsetLeft}px`
    }

    else {
      style.width = `${x - linkBox.offsetLeft}px`;
    }
  }          

  if (y < dragStartTop - divHeader.clientHeight) {
    if (y < 0) {
      style.top = 0;
      style.height = `${dragStartTop - divHeader.clientHeight}px`;
    }

    else {
      style.top = `${y}px`;            
      style.height = `${dragStartTop - y - divHeader.clientHeight}px`;
    }
  }

  else {
    style.top = `${dragStartTop - divHeader.clientHeight}px`;            

    if (y > divImage.clientHeight) {
      style.height = `${divHeader.clientHeight - dragStartTop}px`;
    }
    
    else {      
      style.height = `${y - linkBox.offsetTop}px`;
    }
  }
}