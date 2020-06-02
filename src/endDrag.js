import rgbHex from 'rgb-hex';

export default textBox => {
  const body = document.querySelector('body');
  const divHeader = document.getElementById('header');
  const divLeft = document.querySelector('.left');
  const divImage = document.getElementById('image');  
  const selectFont = document.getElementById('font');
  const inputColor = document.getElementById('color');
  const buttonBold = document.getElementById('bold');
  const inputSize = document.getElementById('size');
  const inputLink = document.getElementById('inputLink');  
  const textArea = document.createElement('textarea');  

  const cursor = (el, d) => {
    if (d === 'n' || d === 's' || d === 'w' || d === 'e') el.style.cursor = 'move';
    else if (d) el.style.cursor = `${d}-resize`;
    else el.style.cursor = 'text';
  }
  
  const text = status => {
    Array.prototype.forEach.call(divImage.children, el => {
      el.className = el === textBox ? status : '';
    })

    if (textArea.style.fontFamily) {
      Array.prototype.forEach.call(selectFont, (option, i) => {
        if (option.value === textArea.style.fontFamily.replace(/"/gi, '')) selectFont.selectedIndex = i;
      });      
    }
    else selectFont.value = 'Nanum Gothic';

    inputColor.value = textArea.style.color ? `#${rgbHex(textArea.style.color)}` : '#000000';
    buttonBold.style.fontWeight = textArea.style.fontWeight ? textArea.style.fontWeight : '';
    inputSize.value = textArea.style.fontSize ? parseInt(textArea.style.fontSize) : 16;
    inputLink.value = textBox.link ? textBox.link : '';
  }

  textArea.onfocus = () => text('edit');
  textBox.style.padding = '10px';
  textBox.appendChild(textArea);
  inputLink.value = '';
  textArea.focus();

  textBox.onmousemove = e => {
    const x = e.x - divImage.offsetLeft;
    const y = divLeft.scrollTop + e.y - divHeader.clientHeight;
    
    const {style, offsetLeft, offsetTop, offsetWidth, offsetHeight} = textBox;
    const north = y < offsetTop + 10;
    const south = offsetTop + offsetHeight - 10 < y;
    const east = offsetLeft + offsetWidth - 10 < x;
    const west = x < offsetLeft + 10;    

    let d;

    if (west) d = north ?  'nw' : south ? 'sw' : 'w';
    else if (east) d = north ? 'ne' : south ? 'se' : 'e';
    else if (north) d = 'n';
    else if (south) d = 's';

    cursor(textBox, d);

    textArea.onmousedown = e => {
      e.stopPropagation();
    }

    textBox.onmousedown = e => {
      text('select');

      const startLeft = e.x;
      const startTop = e.y;

      cursor(body, d);

      if (d) {
        document.onmousemove = e => {
          e.preventDefault()
          const x = e.x - divImage.offsetLeft;
          const y = divLeft.scrollTop + e.y - divHeader.clientHeight;

          if (d === 'n' || d === 's' || d === 'w' || d === 'e') {   // move
            const left = offsetLeft + e.x - startLeft;
            const top = offsetTop + e.y - startTop;

            if (e.movementX < 0) {
              if (left < 0) style.left = 0;  
              else if (left + offsetWidth < divImage.offsetWidth) style.left = `${left}px`;
            }            

            else {
              if (left + offsetWidth >= divImage.offsetWidth) style.left = `${divImage.offsetWidth - offsetWidth}px`;
              else if (left >= 0) style.left = `${left}px`;
            }

            if (e.movementY < 0) {              
              if (top < 0) style.top = 0;
              else if (top + offsetHeight < divImage.offsetHeight) style.top = `${top}px`;
            }

            else {
              if (top < 0) style.top = 0;
              else if (top + offsetHeight <= divImage.offsetHeight) style.top = `${top}px`;
            }            
          }

          else {   // resize
            if (d === 'se' || d === 'ne') {
              if (x <= divImage.offsetWidth) style.width = `${x - offsetLeft}px`;
            }
  
            if (d === 'se' || d === 'sw')  {
              if (y <= divImage.offsetHeight) style.height = `${y - offsetTop}px`;
            }          
  
            if (d === 'ne' || d === 'nw') {
              if (y >= 0 && y < offsetTop + offsetHeight - 20) {
                style.top = `${y}px`;
                style.height = `${offsetHeight + startTop - e.y}px`;
              }
            }
  
            if (d === 'nw' || d === 'sw') {
              if (x >= 0 && x < offsetLeft + offsetWidth - 20) {
                style.left = `${x}px`;
                style.width = `${offsetWidth + startLeft - e.x}px`;
              }
            }
          }
        }
      }
  
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        body.style.cursor = 'default';
      }
    }
  }

  document.onmousemove = null;
  document.onmouseup = null;
}