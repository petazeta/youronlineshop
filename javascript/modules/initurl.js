export let initUrl;
export function setInitUrl(url) {
  initUrl=url;
}
export function urlClickAction(partialUrl, clickAction) {
  if (!initUrl) return;
  partialUrl=encodeURIComponent(partialUrl); //Encoding make it easier for regular expresion matches
  let regex = `(.+)${encodeURIComponent('=')}(\\d+)`;
  const componentMatch=partialUrl.match(new RegExp(regex));
  if (!componentMatch) return;
  const nodeId=componentMatch[2] ;
  regex=`${componentMatch[1]}${encodeURIComponent('=')}(\\d+)`;
  const codedInitUrl=encodeURIComponent(initUrl)
  const nodeIdMatch=codedInitUrl.match(new RegExp(regex));
  if (nodeIdMatch && nodeIdMatch[1]==nodeId) {
    if (!codedInitUrl.match(new RegExp(regex + encodeURIComponent('&')))) {
      initUrl=""; //reset initUrl
    }
    else {
      regex = `pageNum${encodeURIComponent('=')}(\\d+)`; //pagination facility
      const pageMatch=codedInitUrl.match(new RegExp(regex));
      if (pageMatch) {
        if (!codedInitUrl.match(new RegExp(regex +  encodeURIComponent('&')))) initUrl=""; //reset initUrl
        clickAction(pageMatch[1]);
        return true;
      }
    }
    clickAction();
    return true;
  }
}