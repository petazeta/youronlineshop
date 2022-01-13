import config from './../cfg/main.js';
import {NodeFemale} from './nodesfront.js';

export class PaginationIndex extends NodeFemale{
  constructor(){
    super();
    this.refreshPage=null; //refreshPage(pageNum)
    this.createPageIndex=null; //createPageIndex(pages)
  }
}

//it uses delNode.parentNode.paginationIndex.createPageIndex and refreshPage
export function paginationOnDeleted(delNode) {
  delNode.parentNode.props.total--;
  //If no pagination needed or present page size is not overflow we just refresh the view
  if (!config.catPageSize) {
    delNode.parentNode.setChildrenView();
    return;
  }
  const delPageNum=paginationCalculatePageNum(delNode);
  
  const total=delNode.parentNode.props.total;
  if (total < config.catPageSize || (total % config.catPageSize != 0)) {
    delNode.parentNode.setChildrenView();
    return;
  }
  //If reduce pages number refresh page Index
  if (total % config.catPageSize == 0) {
    const pages=Math.ceil(total / config.catPageSize);
    delNode.parentNode.paginationIndex.createPageIndex(pages); //set pagination
  }
  let pageNum=delPageNum;
  //If present page is underflow we need to make some arrangments
  if (delNode.parentNode.children.length == 0) {
    //go previous page
    pageNum--;
  }
  //load items again
  delNode.parentNode.paginationIndex.refreshPage(pageNum);
}

//it uses delNode.parentNode.paginationIndex.createPageIndex and refreshPage
export function paginationOnAdded(newNode) {
  newNode.parentNode.props.total++;
  //If no pagination needed or present page size is not overflow we just refresh the view
  if (!config.catPageSize) {
    newNode.parentNode.setChildrenView();
    return;
  }
  const newPageNum=paginationCalculatePageNum(newNode);
  const total=newNode.parentNode.props.total;
  if (total <= config.catPageSize || newNode.parentNode.children.length < config.catPageSize) {
    newNode.parentNode.setChildrenView();
    return;
  }
  //If overflow pages number then add new page at the index
  if (total % config.catPageSize == 1) {
    const pages=Math.ceil(total / config.catPageSize);
    newNode.parentNode.paginationIndex.createPageIndex(pages); //set pagination
  }
  //If present page is overflow we need to make some arrangments
  if (newNode.parentNode.children.length > config.catPageSize) {
    //Reorder to set the last element as the last order one
    const skey=newNode.parentNode.getMySysKey('sort_order');
    newNode.parentNode.children=newNode.parentNode.children.sort((a,b)=>a.props[skey]-b.props[skey]); //reorder
    if (newNode==newNode.parentNode.children[newNode.parentNode.children.length-1]) {
      //Go next page. Next page is pageNum cause newNode order == pageSize + 1
      newNode.parentNode.paginationIndex.refreshPage(pageNum);
    }
    else {
      //remove lasting element child
      newNode.parentNode.children.pop(); //remove last
      newNode.parentNode.setChildrenView();
    }
  }
}
  
  //it uses delNode.parentNode.paginationIndex.refreshPage
  export function paginationCalculatePageNum(child) {
    const skey=child.parentNode.getMySysKey('sort_order');
    const thisOrder=child.props[skey];
    return Math.ceil(thisOrder / config.catPageSize);
  }
  
  export function paginationOnChgOrder(chNode, change){
    //If no pagination needed or present page size is not overflow we just refresh the view
    if (!config.catPageSize) {
      chNode.parentNode.setChildrenView();
      return;
    }
    const total=chNode.parentNode.props.total;
    if (total <= config.catPageSize) {
      chNode.parentNode.setChildrenView();
      return;
    }
    const newPageNum=paginationCalculatePageNum(chNode);
    const skey=chNode.parentNode.getMySysKey('sort_order');
    chNode.parentNode.children=chNode.parentNode.children.sort((a,b)=>a.props[skey]-b.props[skey]); //reorder
    //If it is the last or the first then swap page
    if ( (change > 0 && chNode.props[skey] % config.catPageSize == 1) ||
      (change < 0 && chNode.props[skey] % config.catPageSize == 0) ) {
        //Go to correspondent page. chNode order is already set to newPage
        chNode.parentNode.paginationIndex.refreshPage(newPageNum);
    }
    else {
      chNode.parentNode.setChildrenView();
    }
  }