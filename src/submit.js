import getDate from './getDate';

import html2canvas from 'html2canvas';
import beautify from 'js-beautify'
import Prism from 'prismjs';
import Normalizer from 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace'; 
import FileSaver from 'file-saver';

export default e => {
  e.preventDefault();

  const divLeft = document.querySelector('.left');
  const divImage = document.getElementById('image');
  const divHeader = document.getElementById('header');

  const timestamp = new Date().getTime();
  const path = `https://www.fasoo.com/_images/edm/${timestamp}/`;

  const to = document.getElementById('to').value,
        subject = document.getElementById('subject').value;

  if (to && subject) {
    const email = JSON.stringify({ to, subject });

    if (localStorage.email !== email) localStorage.email = email;
  
    const boxs = divImage.children;
    let arrX = [];
    let arrY = [];
  
    // Array.prototype.forEach.call(boxs, box => {
    //   box.style.borderColor = 'transparent';
    //   box.style.backgroundColor = 'transparent';
    //   box.offsetBottom = box.offsetTop + box.offsetHeight;
    //   box.offsetRight = box.offsetLeft + box.offsetWidth;
  
    //   arrX.push(box.offsetLeft);
    //   arrY.push(box.offsetTop);
  
    //   if (box.offsetRight < divImage.offsetWidth) arrX.push(box.offsetRight);
    //   if (box.offsetBottom < divImage.offsetHeight) arrY.push(box.offsetBottom);
    // });
  
    if (boxs.length > 0) {
      let isOverlap = false;
      for (let i = 0; i < boxs.length; i++) {
        //const box = boxs[i];        
    
        boxs[i].style.borderColor = 'transparent';
        boxs[i].style.backgroundColor = 'transparent';
    
        for (let j = 0; j < boxs.length; j++) {
          if (boxs[j].offsetLeft % 2 > 0) {
            boxs[j].style.left = `${boxs[j].offsetLeft + 1}px`;
          }

          if (boxs[j].offsetWidth % 2 > 0) {
            boxs[j].style.width = `${boxs[j].offsetWidth + 1}px`;
          }

          if (boxs[j].offsetTop % 2 > 0) {
            boxs[j].style.top = `${boxs[j].offsetTop + 1}px`;
          }

          if (boxs[j].offsetHeight % 2 > 0) {
            boxs[j].style.height = `${boxs[j].offsetHeight + 1}px`;
          }

          boxs[j].offsetRight = boxs[j].offsetLeft + boxs[j].offsetWidth;
          boxs[j].offsetBottom = boxs[j].offsetTop + boxs[j].offsetHeight;

          
          if (boxs[i].offsetTop < 20) {            
            boxs[i].style.height = `${boxs[i].offsetTop + boxs[i].offsetHeight}px`;
            boxs[i].style.top = 0;
          }

          if (Math.abs((boxs[i].offsetTop + boxs[i].offsetHeight) - boxs[j].offsetBottom) < 20) {
            // boxs[i].style.top = `${boxs[i].offsetTop - ((boxs[i].offsetTop + boxs[i].offsetHeight) - boxs[j].offsetBottom)}px`;
            boxs[i].style.top = `${boxs[j].offsetBottom - boxs[i].offsetHeight}px`;
          }

          if (Math.abs(boxs[i].offsetTop - boxs[j].offsetTop) < 20) {
            boxs[i].style.top = `${boxs[j].offsetTop}px`;

            if (Math.abs(boxs[i].offsetHeight - boxs[j].offsetHeight) < 20) {
              boxs[i].style.height = `${boxs[j].offsetHeight}px`;
            }
          }
    
          const space = boxs[j].offsetTop - boxs[i].offsetTop - boxs[i].offsetHeight;
          if (space > 0 && space < 20) {
            boxs[i].style.height = `${boxs[j].offsetTop - boxs[i].offsetTop}px`;
          }

          const bottomSpace = divImage.offsetHeight - boxs[i].offsetTop - boxs[i].offsetHeight;
          if (bottomSpace > 0 && bottomSpace < 20) {
            boxs[i].style.height = `${divImage.offsetHeight - boxs[i].offsetTop}px`;
          }
    
          const leftOverlap = boxs[i].offsetLeft + boxs[i].offsetWidth > boxs[j].offsetLeft && boxs[i].offsetLeft < boxs[j].offsetLeft,
                topOverlap = boxs[i].offsetTop + boxs[i].offsetHeight > boxs[j].offsetTop && boxs[i].offsetTop < boxs[j].offsetTop,
                rightOverlap = boxs[i].offsetLeft + boxs[i].offsetWidth > boxs[j].offsetRight && boxs[i].offsetLeft < boxs[j].offsetRight,
                bottomOverlap = boxs[i].offsetTop + boxs[i].offsetHeight > boxs[j].offsetBottom && boxs[i].offsetTop < boxs[j].offsetBottom;
    
          if ((leftOverlap && topOverlap) || (leftOverlap && bottomOverlap) || (rightOverlap && topOverlap) || (rightOverlap && bottomOverlap)) {
            isOverlap = true;
          }
        }

        boxs[i].offsetRight = boxs[i].offsetLeft + boxs[i].offsetWidth;
        boxs[i].offsetBottom = boxs[i].offsetTop + boxs[i].offsetHeight;
    
        arrX.push(boxs[i].offsetLeft);
        if (boxs[i].offsetRight < divImage.offsetWidth) arrX.push(boxs[i].offsetRight);
    
        arrY.push(boxs[i].offsetTop);    
        if (boxs[i].offsetBottom < divImage.offsetHeight) arrY.push(boxs[i].offsetBottom);
      }
    
      if (isOverlap) {
        Array.prototype.forEach.call(boxs, el => el.style.borderColor = '#666');
        alert('선택영역이 겹칩니다.');    
        arrX = [];
        arrY = [];
      }
    
      else {
        document.querySelector('body').style.cursor = 'wait';
        divLeft.scrollTop = 0;
        document.getElementById('btn').innerHTML = '0%';    
    
        arrX.sort((a, b) => (a - b));
        arrY.sort((a, b) => (a - b));
      
        const table = `<table width="${divImage.offsetWidth}" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="#fff" style="border-collapse: collapse;table-layout:fixed">`;
        let src = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8;" /><title></title></head><body><div align="center">${table}`;
        let cntBox = 0;
        let cntCvs = 0;
      
        const appendHidden = (name, value) => {
          const inputHidden = document.createElement('input');
          inputHidden.setAttribute('type', 'hidden');
          inputHidden.setAttribute('name', name);
          inputHidden.value = value;
          document.frm.appendChild(inputHidden);    
        }
      
        const tlwh = obj => {
          const el = document.createElement('div');
          const {top, left, width, height, fileName} = obj;
          const {style} = el;
        
          style.top = `${top}px`;
          style.left = `${left}px`;
          style.width = `${width}px`;
          style.height = `${height}px`;
          style.border = 0;
          
          divImage.appendChild(el);
          cntBox--;
      
          html2canvas(divImage, {
            backgroundColor: null,
            logging: false,
            width,
            height,
            x: left + divImage.offsetLeft,
            y: top + divHeader.offsetHeight
          })
          .then(canvas => {
            appendHidden('dataurl', canvas.toDataURL().replace(/^data:image\/png;base64,/, ''));
            appendHidden('filename', fileName);
      
            // const dataURL = canvas.toDataURL('image/png', 1);        
            // const aTag = document.createElement('a');
            // aTag.download = fileName;
            // aTag.href = dataURL;
            // aTag.click();
            
            cntCvs++;
            document.getElementById('btn').innerHTML = `${Math.round(Math.abs(cntCvs/cntBox) * 100)}%`;
      
            if (cntBox + cntCvs === 0) {
              document.querySelector('body').style.cursor = 'default';
              document.frm.submit();
            }
          });
        }
      
        for (let j = 0; j < arrY.length; j ++) {
          const top = arrY[j];
          const height = (j < arrY.length - 1 ? arrY[j+1] : divImage.offsetHeight) - arrY[j];
          
          let prevLeft = 0;
      
          if (j === 0 && top > 0) {
            for (let i = 0; i < top; i = i + 1200) {
              const height = i + 1200 < top ? 1200 : top - i;
              const fileName = `0_${i}`;
              src += `<tr><td width="${divImage.offsetWidth}" height="${height}"><span style="display:block;padding:0;width:100%;height:100%"><img style="display:block;width:100%;height:100%;border:0;" src="${path}${fileName}.png" /></span></td></tr>`;
              tlwh({
                top: i,
                left: 0,
                width: divImage.offsetWidth,
                height,
                fileName
               });
            }
          }
      
          if (j < arrY.length - 1 && arrY[j] === arrY[j+1]) {}
          else {
            for (let k = 0; k < arrX.length; k ++) {
              const left = arrX[k];
              const width = (k < arrX.length - 1 ? arrX[k+1] : divImage.offsetWidth) - arrX[k];
        
              let link = '';
              let nextLink = '';
        
              for (let l = 0; l < boxs.length; l++) {
                const xCon = boxs[l].offsetLeft <= left && boxs[l].offsetRight > left;
                const yCon = boxs[l].offsetTop <= top && boxs[l].offsetBottom > top;
                if (xCon && yCon) link = boxs[l].link;
        
                if (k < arrX.length - 1) {
                  const next = boxs[l].offsetLeft <= arrX[k+1] && boxs[l].offsetRight > arrX[k+1];
                  if (next && yCon) nextLink = boxs[l].link;
                }
              }
      
              const img = fileName => `<img style="display:block;width:100%;height:100%;border:0;" src="${path}${fileName}.png" />`;
              const td = (width, height, fileName) => `<td width="${width}" height="${height}"><span style="display:block;padding:0;width:100%;height:100%">${img(fileName)}</span></td>`;
              const tdLink = (width, height, fileName) => `<td width="${width}" height="${height}"><a href="${link}" target="_blank" style="display:block;padding:0;width:100%;height:100%">${img(fileName)}</a></td>`;

              const fileName = `${j+1}_${k+1}`;
        
              if (k === 0) src += `<tr><td width="${divImage.offsetWidth}">${table}<tr>`;
        
              if (link) {
                if (nextLink) {
                  if (k === 0 && left > 0) { // first            
                    tlwh ({ top, left: 0, width: left, height, fileName });
                    src += td(left, height, fileName);
                    prevLeft = left;
                  }
                }
        
                else {
                  if (k === 0 && left > 0) { // first
                    tlwh({ top, left: 0, width: left, height, fileName: `${j+1}_${k}` });
                    src += td(left, height, `${j+1}_${k}`);
        
                    tlwh({ top, left, width, height, fileName });
                    src += tdLink(width, height, fileName);
                    prevLeft = left + width;
                  }
        
                  else {            
                    tlwh({ top, left: prevLeft, width: left - prevLeft + width, height, fileName });
                    src += tdLink(left - prevLeft + width, height, fileName);
                    prevLeft = left + width;
                  }
                }
              }
        
              else {        
                if (nextLink) {
                  tlwh({ top, left: prevLeft, width: left - prevLeft + width, height, fileName });
                  src += td(left - prevLeft + width, height, fileName);
                  prevLeft = left + width;
                }
        
                else {
                  if (k === arrX.length - 1) {
                    if (left - prevLeft + width >= divImage.offsetWidth) {
                      for (let i = top; i < top + height; i = i + 1200) {
                        tlwh({
                          top: i,
                          left: 0,
                          width: divImage.offsetWidth,
                          height: i + 1200 < top + height ? 1200 : top + height - i,
                          fileName: `${j}_${k}_${i}`
                         });

                         src += td(divImage.offsetWidth, i + 1200 < top + height ? 1200 : top + height - i, `${j}_${k}_${i}`);

                         if (i < top + height - 1200) src += `</tr><tr>`;
                      }
                    }
        
                    else {
                      tlwh({ top, left: prevLeft, width: left - prevLeft + width, height, fileName });
                      src += td(left - prevLeft + width, height, fileName);
                    }
                  }
                }
              }
        
              if (left + width >= divImage.offsetWidth) src += '</tr></table></td></tr>';
            }
          }
        }
      
        src += '</table></div></body></html>';
      
        document.getElementById('html').value = src;
        document.getElementById('timestamp').value = timestamp;
      
        const nw = new Normalizer();  
        const code = nw.normalize(beautify.html(src, {indent_size: 2}));
        const html = Prism.highlight(code, Prism.languages.html, 'html');  
        document.getElementById('code').innerHTML = html;
        
        const blob = new Blob([src], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, `${getDate}_edm.html`);
      }
    }

    else {
      alert('텍스트 또는 링크 영역을 지정하세요.');
    }
  }

  else {
    alert('이메일 정보를 입력하세요.');
  }
}