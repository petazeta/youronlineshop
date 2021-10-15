export function onPopState(event) {
  if (!event.state) return;
  /*
  let link=document.querySelector("a[href='" + event.state.url + "']");
  if (!link) link=document.querySelector("*[data-href='" + event.state.url + "']");
  if (link) link.click();
  */
  const unpaginatedUrl=event.state.url.replace(/&page=\d+/, '');
  const action=getPopStateAction(unpaginatedUrl);

  if (typeof action=="function")  {
    const pageMatch=window.location.search.match(/&page=(\d+)/);
    if (pageMatch) {
      action(pageMatch[1]);
    }
    else {
      action();
    }
  }
}

export const availableStates=new Map();

export function setPopState(url, action) {
  return availableStates.set(url, action);
}
export function getPopStateAction(url) {
  return availableStates.get(url);
}