import state from './state';
import tlwh from './tlwh';
import setSrc from './setSrc';
import setFiles from './setFiles';

export default (beforeBox, linkBox) => {
  const { dragStartTop, files} = state;

  const divImage = document.getElementById('image')
  const inputLink = document.getElementById('inputLink');
  const boxs = divImage.children;

  boxs[boxs.length-1].className ='link selected';
  
  boxs[boxs.length-1].onclick = function() {
    for (let i = 0; i < boxs.length; i++) {
      if (boxs[i].className === 'link selected') boxs[i].className = 'link';
      if (boxs[i] === this) {
        inputLink.value = files[i].link ? files[i].link : '';
      }
    }
    
    this.className = 'link selected';
  }
    
  const arrLink = [];
  const sortTop = arr => (arr.sort((a, b) => (a.offsetTop < b.offsetTop ? -1 : a.offsetTop > b.offsetTop ? 1 : 0)));
  // const sortLeft = arr => (arr.sort((a, b) => (a.offsetLeft < b.offsetLeft ? -1 : a.offsetLeft > b.offsetLeft ? 1 : 0)));
  // const sortArr = arr => (arr.sort((a, b) => (a.offsetTop < b.offsetTop ? -1 : a.offsetTop > b.offsetTop ? 1 : a.offsetLeft < b.offsetLeft ? -1 : a.offsetLeft > b.offsetLeft ? 1 : 0)));
  const boxPosition = box => {
    box.offsetBottom = box.offsetTop + box.offsetHeight;
    box.offsetRight = box.offsetLeft + box.offsetWidth;
  }

  for (let i = 0; i < divImage.children.length; i++) {
    arrLink.push(divImage.children[i])
  }

  sortTop(arrLink);

  for (let j = 0; j < arrLink.length; j++) {    
    const leftFirst = () => {
      tlwh({
        el: document.createElement('div'),
        top: arrLink[j].offsetTop,
        left: 0,
        width: arrLink[j].offsetLeft,
        height: arrLink[j].offsetHeight,
        className: 'left first',
        before: arrLink[j]
      })
    }

    const top = top => {
      tlwh({
        el: document.createElement('div'),
        top: top,
        left: 0,
        width: divImage.clientWidth,
        height: arrLink[j].offsetTop - top,
        className: 'top',
        before: document.querySelector('.left')
      });
    }

    if (j > 0) {
      const afterBox = arrLink[j];
      const beforeBox = arrLink[j-1];
      
      let highestBox = arrLink[0];
      let lowestBox = arrLink[0];

      for (let k = 0; k < arrLink.length; k++) {
        boxPosition(arrLink[k]);
        arrLink[k].index = k;

        if (highestBox.offsetTop > arrLink[k].offsetTop) {
          highestBox = arrLink[k]
        }            

        if (lowestBox.offsetBottom < arrLink[k].offsetBottom) {
          lowestBox = arrLink[k]
        }
      }      

      if (beforeBox.offsetBottom < afterBox.offsetTop) {
        leftFirst();
        top(beforeBox.offsetBottom);    
      }

      if (beforeBox.offsetRight - divImage.offsetLeft < divImage.clientWidth) {
        if (afterBox.offsetTop < beforeBox.offsetBottom) {
          const divTop = () => {
            tlwh({
              el: document.createElement('div'),
              top: beforeBox.offsetTop,
              left: afterBox.offsetLeft,
              width: afterBox.offsetWidth,
              height: afterBox.offsetTop - beforeBox.offsetTop,
              className: 'top'
            });                
          }

          const divBottom = () => {
            tlwh({
              el: document.createElement('div'),
              top: afterBox.offsetBottom,
              left: afterBox.offsetLeft,
              width: afterBox.offsetWidth,
              height: beforeBox.offsetBottom - afterBox.offsetBottom,
              className: 'bottom'
            });
          }    

          if (afterBox.offsetRight < beforeBox.offsetLeft) {
            sortTop(arrLink)

            if (afterBox.offsetBottom < beforeBox.offsetBottom) {
              console.log('1');
              console.log(beforeBox, afterBox);

              tlwh({
                el: document.createElement('div'),
                top: beforeBox.offsetTop,
                left: 0,
                width: afterBox.offsetLeft,
                height: beforeBox.offsetHeight,
                className: 'left',
                before: beforeBox
              });

              tlwh({
                el: document.createElement('div'),
                top: beforeBox.offsetTop,
                left: afterBox.offsetLeft,
                width: afterBox.offsetWidth,
                height: afterBox.offsetTop - beforeBox.offsetTop,
                className: 'top',
                before: beforeBox
              });                             

              tlwh({
                el: document.createElement('div'),
                top: beforeBox.offsetTop,
                left: afterBox.offsetRight,
                width: beforeBox.offsetLeft - afterBox.offsetRight,
                height: beforeBox.offsetHeight,
                className: 'left',
                before: beforeBox
              });

              divBottom();              

              // tlwh({
              //   el: document.createElement('div'),
              //   top: beforeBox.offsetTop,
              //   left: beforeBox.offsetRight,
              //   width: divImage.clientWidth - beforeBox.offsetRight,
              //   height: beforeBox.offsetHeight,
              //   className: 'right'
              // });
            }

            else {
              console.log(2);
              console.log(beforeBox, afterBox);

              tlwh({
                el: document.createElement('div'),
                top: beforeBox.offsetTop,
                left: 0,
                width: afterBox.offsetLeft,
                height: afterBox.offsetBottom - beforeBox.offsetTop,
                className: 'left',
                before: beforeBox
              });

              tlwh({
                el: document.createElement('div'),
                top: beforeBox.offsetTop,
                left: afterBox.offsetLeft,
                width: afterBox.offsetWidth,
                height: afterBox.offsetTop - beforeBox.offsetTop,
                className: 'top',
                before: beforeBox
              });              
  
              tlwh({
                el: document.createElement('div'),
                top: beforeBox.offsetTop,
                left: afterBox.offsetRight,
                width: beforeBox.offsetLeft - afterBox.offsetRight,
                height: afterBox.offsetBottom - beforeBox.offsetTop,
                className: 'left',
                before: beforeBox
              });

              // tlwh({
              //   el: document.createElement('div'),
              //   top: beforeBox.offsetTop,
              //   left: beforeBox.offsetRight,
              //   width: divImage.clientWidth - beforeBox.offsetRight,
              //   height: afterBox.offsetBottom - beforeBox.offsetTop,
              //   className: 'right'
              // });              
  
              tlwh({
                el: document.createElement('div'),
                top: beforeBox.offsetBottom,
                left: beforeBox.offsetLeft,
                width: beforeBox.offsetWidth,
                height: afterBox.offsetBottom - beforeBox.offsetBottom,
                className: 'bottom'
              });
            }
          }

          else {
            if (afterBox.offsetBottom > beforeBox.offsetBottom) {
              console.log(3);

              afterBox.flag = 3;

              const firstBox = arrLink[0];              
              const top = firstBox.offsetTop;            

              // tlwh({
              //   el: document.createElement('div'),
              //   top: beforeBox.offsetTop,
              //   left: 0,
              //   width: beforeBox.offsetLeft,
              //   height: afterBox.offsetBottom - beforeBox.offsetTop,
              //   className: 'left',
              //   before: beforeBox
              // });

              tlwh({
                el: document.createElement('div'),
                top,
                left: beforeBox.offsetRight,
                width: afterBox.offsetLeft - beforeBox.offsetRight,
                height: lowestBox.offsetBottom - top,
                className: 'left'
              });

              tlwh({
                el: document.createElement('div'),
                top,
                left: afterBox.offsetLeft,
                width: afterBox.offsetWidth,
                height: afterBox.offsetTop - top,
                className: 'top'
              });                             

              if (beforeBox.flag !== 4 && lowestBox.offsetBottom > beforeBox.offsetBottom) {
                tlwh({
                  el: document.createElement('div'),
                  top: beforeBox.offsetBottom,
                  left: beforeBox.offsetLeft,
                  width: beforeBox.offsetWidth,
                  height: lowestBox.offsetBottom - beforeBox.offsetBottom,
                  className: 'bottom'
                });
              }

              if (highestBox.offsetBottom > afterBox.offsetBottom) {
                tlwh({
                  el: document.createElement('div'),
                  top: afterBox.offsetBottom,
                  left: afterBox.offsetLeft,
                  width: afterBox.offsetWidth,
                  height: highestBox.offsetBottom - afterBox.offsetBottom,
                  className: 'bottom'
                });
              }              

              // tlwh({
              //   el: document.createElement('div'),
              //   top: beforeBox.offsetTop,
              //   left: afterBox.offsetRight,
              //   width: divImage.clientWidth - afterBox.offsetRight,
              //   height: afterBox.offsetBottom - beforeBox.offsetTop,
              //   className: 'right'
              // });                            
            }

            else {
              console.log(4);

              afterBox.flag = 4;

              const firstBox = arrLink[0];              
              const top = highestBox.offsetTop;

              // tlwh({
              //   el: document.createElement('div'),
              //   top: beforeBox.offsetTop,
              //   left: 0,
              //   width: beforeBox.offsetLeft,
              //   height: beforeBox.clientHeight,
              //   className: 'left',
              //   before: beforeBox
              // });

              if (lowestBox.offsetBottom > beforeBox.offsetBottom && lowestBox.index >= beforeBox.index) {
                console.log('bottom1')
                tlwh({
                  el: document.createElement('div'),
                  top: beforeBox.offsetBottom,
                  left: beforeBox.offsetLeft,
                  width: beforeBox.offsetWidth,
                  height: lowestBox.offsetBottom - beforeBox.offsetBottom,
                  className: 'bottom1'
                });
              }

              tlwh({
                el: document.createElement('div'),
                top,
                left: beforeBox.offsetRight,
                width: afterBox.offsetLeft - beforeBox.offsetRight,
                height: lowestBox.offsetBottom - firstBox.offsetTop,
                className: 'left'
              });

              tlwh({
                el: document.createElement('div'),
                top,
                left: afterBox.offsetLeft,
                width: afterBox.offsetWidth,
                height: afterBox.offsetTop - top,
                className: 'top'
              });

              if (lowestBox.offsetBottom > afterBox.offsetBottom) {
                  if (highestBox.offsetBottom >= lowestBox.offsetBottom || afterBox.index === arrLink.length - 1) {
                  console.log('bottom2')
                  tlwh({
                    el: document.createElement('div'),
                    top: afterBox.offsetBottom,
                    left: afterBox.offsetLeft,
                    width: afterBox.offsetWidth,
                    height: lowestBox.offsetBottom - afterBox.offsetBottom,
                    className: 'bottom2'
                  });
                }
              }
              // tlwh({
              //   el: document.createElement('div'),
              //   top: beforeBox.offsetTop,
              //   left: afterBox.offsetRight,
              //   width: divImage.clientWidth - afterBox.offsetRight,
              //   height: beforeBox.clientHeight,
              //   className: 'right'
              // });
            }
          }  
        }

        else {
          tlwh({
            el: document.createElement('div'),
            top: beforeBox.offsetTop,
            left: beforeBox.offsetRight,
            width: divImage.clientWidth - beforeBox.offsetRight,
            height: beforeBox.clientHeight,
            className: 'right',
            before: document.querySelector('.top')
          });
        }
      }      
    }
  }

  const arr = [];
  for (let i  = 0; i < divImage.children.length; i++) {
    arr.push(divImage.children[i])   
  }

  sortTop(arr);  

  // const lastBox = arr[arr.length-1];
  // lastBox.offsetRight = lastBox.offsetLeft + lastBox.offsetWidth;
  // lastBox.offsetBottom = lastBox.offsetTop + lastBox.offsetHeight;

  // if (lastBox.offsetRight < divImage.clientWidth) {
  //   tlwh({
  //     el: document.createElement('div'),
  //     top: lastBox.offsetTop,
  //     left: lastBox.offsetRight,
  //     width: divImage.clientWidth - lastBox.offsetRight,
  //     height: lastBox.offsetHeight,
  //     className: 'right last'
  //   });
  // }

  // if (lastBox.offsetBottom < divImage.offsetBottom) {
  //   tlwh({
  //     el: document.createElement('div'),
  //     top: lastBox.offsetBottom,
  //     left: 0,
  //     width: divImage.clientWidth,
  //     height: divImage.offsetBottom - lastBox.offsetBottom,
  //     className: 'bottom last'
  //   });
  // }

  // arr.push(divImage.children[divImage.children.length - 2])
  // arr.push(divImage.children[divImage.children.length - 1])

  // setFiles();
  // setSrc();
  console.log(arr)

  document.onmouseup = null;
  document.onmousemove = null;
}