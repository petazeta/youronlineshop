function supportsTemplate() {
  return 'content' in document.createElement('template');
}

function getTpContent(tp) {
  if (supportsTemplate()) return tp.content;
  else return tp;
}