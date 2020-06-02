import startDrag from './startDrag';
import submit from './submit';

import 'prismjs/themes/prism-coy.css';

const divImage = document.getElementById('image');

if (localStorage.email) {
  const email = JSON.parse(localStorage.email);
  const {to, subject} = email;

  document.getElementById('to').value = to;
  document.getElementById('subject').value = subject;
}

document.getElementById('file').onchange = function() {
  if (this.value) {
    const reader = new FileReader();

    reader.readAsDataURL(this.files[0]);
    reader.onload = () => {
      const img = document.createElement('img');
  
      img.src = reader.result;
      img.onload = () => {
        divImage.style.backgroundImage = `url(${reader.result})`;
        divImage.style.backgroundSize = 'cover';

        if (img.width > 700) {
          divImage.style.width = '700px';
          divImage.style.height = `${img.height / (img.width / 700)}px`;
        }

        else {
          divImage.style.width = `${img.width}px`;
          divImage.style.height = `${img.height}px`
        }

        if (divImage.offsetWidth % 2 > 0) divImage.style.width = `${divImage.offsetWidth - 1}px`;
        if (divImage.offsetHeight % 2 > 0) divImage.style.height = `${divImage.offsetHeight - 1}px`;
  
        divImage.offsetRight = divImage.offsetLeft + divImage.clientWidth;
        divImage.ondragstart = startDrag;
      }
    }
  }
}

document.onkeydown = e => {
  if (e.keyCode === 46 && document.querySelector('.select')) document.querySelector('.select').remove();
}

document.getElementById('border').onmousedown = e => {
  e.preventDefault();
  
  document.onmousemove = e => {
    if (e.pageX < window.innerWidth - 100 && e.pageX > 100) {
      const image = divImage.parentElement;
      const border = document.getElementById('border');
      const pre = document.getElementById('code').parentElement;
  
      image.style.width = `${e.pageX}px`;
      border.style.left =  `${e.pageX}px`;    
      pre.style.left = `${e.pageX + border.clientWidth}px`;      
      pre.style.width = `calc(100% - ${e.pageX + border.clientWidth}px)`;
    }
  }

  document.onmouseup = () => {
    document.onmousemove = null;
  }
}

document.getElementById('font').onchange = function() {
  const onEdit = document.querySelector('.edit, .select');
  if (onEdit) onEdit.firstChild.style.fontFamily = this.value;
}

document.getElementById('size').onchange = function() {
  const onEdit = document.querySelector('.edit, .select');
  if (onEdit) onEdit.firstChild.style.fontSize = `${this.value}px`;
}

document.getElementById('color').onchange = function() {
  const onEdit = document.querySelector('.edit, .select');
  if (onEdit) onEdit.firstChild.style.color = this.value;
}

document.getElementById('bold').onclick = function(e) {
  e.preventDefault();
  
  const onEdit = document.querySelector('.edit, .select');
  if (onEdit) {
    if (onEdit.firstChild.style.fontWeight === 'bold') {
      this.style.fontWeight = 'normal';
      onEdit.firstChild.style.fontWeight = 'normal';
    }

    else {
      this.style.fontWeight = 'bold';
      onEdit.firstChild.style.fontWeight = 'bold';
    } 
  }
}

document.getElementById('inputLink').onkeyup = e => {  
  document.querySelector('.edit, .select').link = e.currentTarget.value;
}

document.getElementById('btn').onclick = submit;