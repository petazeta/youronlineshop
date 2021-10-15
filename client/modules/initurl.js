export let initUrl;
export function setInitUrl(url) {
  initUrl=url;
}
export function urlClickAction(partialUrl, clickAction) {
  if (!initUrl) return;
  partialUrl=encodeURIComponent(partialUrl); //Encoding make it easier for regular expresion matches
  const componentMatch=partialUrl.match(new RegExp(`(.+)${encodeURIComponent('=')}(\\d+)`));
  if (!componentMatch) return;
  const nodeId=componentMatch[2] ;
  const paramMatchRE=`${componentMatch[1]}${encodeURIComponent('=')}(\\d+)`;
  const codedInitUrl=encodeURIComponent(initUrl)
  const nodeIdMatch=codedInitUrl.match(new RegExp(paramMatchRE));
  if (nodeIdMatch && nodeIdMatch[1]==nodeId) {
    if (!codedInitUrl.match(new RegExp(paramMatchRE + encodeURIComponent('&')))) {
      initUrl=""; //reset initUrl
    }
    else {
      const pageMarchRE = `pageNum${encodeURIComponent('=')}(\\d+)`; //pagination facility
      const pageMatch=codedInitUrl.match(new RegExp(pageMarchRE));
      if (pageMatch) {
        if (!codedInitUrl.match(new RegExp(pageMarchRE +  encodeURIComponent('&')))) initUrl=""; //reset initUrl
        clickAction(pageMatch[1]);
        return true;
      }
    }
    clickAction();
    return true;
  }
}