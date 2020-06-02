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
  const path = `https://www.fasoo.com/edm/${timestamp}/`;
  // const path = './';

  const footerKor = '<tr><td align="center"><img style="display:block;" src="https://www.fasoo.com/letter/img/2013EDM.gif" border="0" usemap="#fasooMap"><map name="fasooMap"><area shape="rect" coords="205,44,245,60" href="mailto:newsletter@fasoo.com"></map></td></tr>';
  const footerEng = '<tr><td align="center" height="30" style="font-size:12px;">To unsubscribe from receiving future mailings from Fasoo, please <a href="mailto:newsletter@fasoo.com">click here.</a></td></tr>';

  const to = document.getElementById('toUser').value,
        subject = document.getElementById('subject').value;

  if (to && subject) {
    const boxs = divImage.children;
    const email = JSON.stringify({ to, subject });

    if (localStorage.email !== email) localStorage.email = email;    
  
    if (boxs.length > 0) {
      document.querySelector('body').style.cursor = 'wait';
      divLeft.scrollTop = 0;
      document.getElementById('btn').innerHTML = '0%';    

      const table = `<table width="${divImage.offsetWidth}" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="#fff" style="border-collapse: collapse;">`;
      let src = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8;" /><title></title></head><body align="center">${table}`;
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
          // aTag.click();f
          
          cntCvs++;
          document.getElementById('btn').innerHTML = `${Math.round(Math.abs(cntCvs/cntBox) * 100)}%`;
    
          if (cntBox + cntCvs === 0) {
            document.querySelector('body').style.cursor = 'default';
            document.frm.submit();
          }
        });
      }

      let top = 0;
      while (top < divImage.offsetHeight) {
        let height = 1500;
        let map = `<map name="Map${top}" id="Map${top}">`;

        for (let j = 0; j < boxs.length; j++) {
          boxs[j].style.borderColor = 'transparent';
          
          const con = top === 0 ? 1500 : top;
          const {offsetTop, offsetLeft, offsetWidth, offsetHeight, link} = boxs[j];

          if (offsetTop < con && offsetTop + offsetHeight > con) {
            height = offsetTop;
          }

          if (offsetTop >= top && offsetTop + offsetHeight <= top + height) {
            map += `<area shape="rect" coords="${offsetLeft}, ${offsetTop - top}, ${offsetLeft + offsetWidth}, ${offsetTop - top + offsetHeight}" href="${link}" target="_blank" />`
          }
        }

        map += '</map>';

        const fileName = top;
        const isMap = map !== `<map name="Map${top}" id="Map${top}"></map>`;
        const img = `<img src="${path}${fileName}.png" style="border:0;display:block;" ${isMap ? `usemap="#Map${top}"` : ''} />`;
        const td = `<td>${img}${isMap ? map : ''}</td>`;

        tlwh({
          top,
          left: 0,
          width: divImage.offsetWidth,
          height: top + height < divImage.offsetHeight ? height : divImage.offsetHeight - top,
          fileName
        });

        src += `<tr>${td}</tr>`;
        top += height;
      }    
    
      if (document.getElementById('kor').checked) src += footerKor;
      if (document.getElementById('eng').checked) src += footerEng;
    
      src += '</table></body></html>';
    
      document.getElementById('html').value = src;
      document.getElementById('timestamp').value = timestamp;
    
      const nw = new Normalizer();  
      const code = nw.normalize(beautify.html(src, {indent_size: 2}));
      const html = Prism.highlight(code, Prism.languages.html, 'html');  
      document.getElementById('code').innerHTML = html;
      
      const blob = new Blob([src], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, `${getDate}_edm.html`);
    }

    else {
      alert('텍스트 또는 링크 영역을 지정하세요.');
    }
  }

  else {
    alert('이메일 정보를 입력하세요.');
  }
}