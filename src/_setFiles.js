import state from './state';

export default () => {
  const divImage = document.getElementById('image');
  let row = 0;
  let col = 0;
  
  //const files = [];

  if (divImage.children.length === 0) {
    state.files.push({
      fileName: '0101.png'
    });
  }

  else {
    for (let i = 0; i < divImage.children.length; i++) {
      const box = divImage.children[i];
  
      col += 1;
      if (box.className === 'top' || box.classList[0] === 'first' || box.className === 'bottom') {
        row += 1;
        col = 1;
      }
  
      const isLink = box.classList.contains('insert') ? '_insert' : '';
      const fileName = `${row < 10 ? `0${row}` : row}${col < 10 ? `0${col}` : col}${isLink}.png`;
  
      if (state.files[i]) {
        state.files[i].fileName = fileName;
      }
  
      else {
        state.files.push({fileName});
      }
  
      //files.push({fileName})
    }
  }

  // return files;
}