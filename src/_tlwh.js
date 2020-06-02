export default obj => {
  const divImage =  document.getElementById('image');
  const {el, top, left, width, height, className, before} = obj;
  const {style} = el;

  style.top = `${top}px`;
  style.left = left ? `${left}px` : 0;
  style.width = width ? `${width}px` : '100%';
  style.height = `${height}px`;
  
  if (className) el.className = className;
  before ? divImage.insertBefore(el, before) : divImage.appendChild(el);
}