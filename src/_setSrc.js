import beautify from 'js-beautify'
import Prism from 'prismjs';
import Normalizer from 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace'; 
import state from './state';

export default (linkBox) => {
  const path = 'https://www.fasoo.com/edm';
  const divImage =  document.getElementById('image');
  const {files, timestamp} = state;
  const ps = val => (parseInt(val.substr(0, 2)));
  const img = fileName => (`<img style="border:0;display:block;" src="${path}/${timestamp}/${fileName}" />`);
  const lastImg = start => {
    for (let i = start; i < divImage.clientHeight; i = i + 1500) {
      const lastNum = nextNum + 1 < 10 ? '0' + (nextNum + 1) : nextNum + 1;
      src += `<tr><td><img style="border:0;display:block;" src="${path}/${timestamp}/${lastNum + '01.png'}"></td></tr>`;
      nextNum++;
    }    
  }

  let prevNum = 0;
  let nextNum = 0;
  const table = `<table width="${divImage.clientWidth}" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="#fff" style="border-collapse: collapse;">`;
  let src = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8;" /><title></title></head><body align="center">${table}`;

  if (divImage.children.length === 0) {
    lastImg(0)
  }

  else  {
    for (let i = 0; i < divImage.children.length; i++) {
      const num = ps(files[i].fileName);
      let el = img(files[i].fileName);
  
      if (files[i].link) {
        el = `<a style="display:block;" href="${files[i].link ? files[i].link : ''}" target="_blank">${el}</a>`;
      }
  
      if (i < files.length - 1) {
        nextNum = ps(files[i+1].fileName);
      }
      
      if (nextNum > num) {
        if (prevNum < num) {
          if (i !== 0) src += '</tr></table></td></tr>';
          src += `<tr><td>${el}</td>`;
        }
  
        else if (prevNum === num) {
          src += `<td>${el}</td>`;
        }
  
        else {
          src += `<tr><td>${el}</td>`;
        }      
      }
  
      else {
        if (nextNum === num) {
          if (prevNum < num) {
            src += `</tr><tr><td>${table}<tr><td>${el}</td>`;
          }
          
          else {          
            src += `<td>${el}</td>`;
  
            if (i === files.length - 1) {
              if (linkBox.offsetRight < divImage.clientWidth) {
                let rightNum = parseInt(files[i].fileName.substr(2, 2)) + 1;
                rightNum < 10 ? rightNum = '0' + rightNum : rightNum;
  
                src += `<td>${img(files[i].fileName.substr(0,2) + rightNum + '.png')}</td>`;
              }
              src += '</tr></table></td></tr>';
            } 
          }
        }
  
        else {        
          src += '</td></tr></table></td>';
        }
      }
      
      prevNum = num;
    }

    lastImg(linkBox.offsetBottom);
  }

  if (document.getElementById('kor').checked) src += state.footerKor;
  if (document.getElementById('eng').checked) src += state.footerEng;
  
  src += `</table></body></html>`;
  state.html.push(src);
    
  const nw = new Normalizer();  
  const code = nw.normalize(beautify.html(src, {indent_size: 2}));
  const html = Prism.highlight(code, Prism.languages.html, 'html');
  document.getElementById('code').innerHTML = html;
}