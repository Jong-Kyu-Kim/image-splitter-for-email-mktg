import state from './state';
import html2canvas from 'html2canvas';

export default () => {
  return new Promise(resolve => {
    //let i = 0;
    const divHeader = document.querySelector('#header');
    const divImage = document.querySelector('#image');
    const data = {
      timestamp: state.timestamp,
      files: state.files,
      html: state.html[state.html.length - 1],
      to: document.getElementById('to').value,
      subject: document.getElementById('subject').value
    };    
    
    // const pushFiles = () => {
    for (let i = 0; i < divImage.children.length; i++) {
      const {files} = data;
      const box = divImage.children[i];
    
      html2canvas(divImage, {
        backgroundColor: null,
        logging: false,
        width: box.offsetWidth,
        height: box.offsetHeight,
        x: box.offsetLeft + divImage.offsetLeft,
        y: box.offsetTop + divHeader.clientHeight
      })
      .then(canvas => {
        // box.style.backgroundColor = box.className === 'link' ? '#0078d7' : '#000';
        // box.style.opacity = 0.7;
        files[i].dataURL = canvas.toDataURL();
        if (i < divImage.children.length - 1) {
          // i++;
          // pushFiles();
        }
        else {
          resolve(data);
        }
      })
    }
    // pushFiles();
  })
}