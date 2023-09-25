import config from './cfg/main.mjs';
import {Linker, Node} from './nodes.mjs';
import {setActive} from './activelauncher.mjs';

class Pagination{
  constructor(baseUrl, pageSize, elementsNode, elementsTp){
    this.pageIndexTp='paginationindex';
    this.pageTp='pagination';

    this.elementsTp=elementsTp;
    this.elementsNode=elementsNode;
    this.total=this.elementsNode.props.total;
    this.baseUrl=baseUrl;
    this.pageSize=pageSize;
    this.pageIndex=new Linker();
    this.pageIndex.pagination=this;
  }
  // it needs porps.total to be loaded
  createPageIndex(){
    const pagesNum=Math.ceil(this.total / this.pageSize);
    this.pageIndex.children=[]; //reset children
    for (let i=1; i<=pagesNum; i++) {
      const pageNode=this.createIndexChild(i);
      this.pageIndex.addChild(pageNode);
    }
    return this.pageIndex;
  }

  createIndexChild(i){
    const pageNode=new Node();
    pageNode.props.number=i;
    pageNode.props.href=this.baseUrl + '&page=' + i;
    return pageNode;
  }

  onDeleted(delNode) {
    this.total--;
    if (this.pageIndex.children.length==1) return;
    let currentIndex=this.pageIndex.children.find(child=>child.selected);
    if ((currentIndex.props.number == this.pageIndex.children.length) && (this.total % this.pageSize > 0)) return;
    if (this.total % this.pageSize > 0) {
      currentIndex.indexAction(); // indexAction for content refreshing
      return;
    }
    // removing last index when number of pages decreases
    this.pageIndex.children.pop(); // remove last index
    if (currentIndex.props.number > this.pageIndex.children.length) {
      currentIndex=this.pageIndex.children[this.pageIndex.children.length-1]; // adjust currentIndex
      setActive(currentIndex); // it will produce indexAction at currentIndex when index refreshing at the latter setChildrenView
    }
    this.pageIndex.setChildrenView();
  }

  onAdded(newNode) {
    this.total++;
    if (this.total==1) return;
    let currentIndex=this.pageIndex.children.find(child=>child.selected);
    if ((currentIndex.props.number == this.pageIndex.children.length) && (this.total % this.pageSize != 1)) return;
    if ((currentIndex.props.number < this.pageIndex.children.length) && (this.total % this.pageSize != 1)) {
      if (newNode==newNode.parent.children[newNode.parent.children.length-1]) {
        currentIndex=this.pageIndex.children[currentIndex.props.number]; // adjust currentIndex
      }
      currentIndex.indexAction();
      return;
    }
    this.pageIndex.addChild(this.createIndexChild(this.pageIndex.children.length+1))
    if (newNode==newNode.parent.children[newNode.parent.children.length-1]) {
      //Go next page.
      currentIndex=this.pageIndex.children[currentIndex.props.number]; // adjust currentIndex
      setActive(currentIndex); // it will produce indexAction at currentIndex when index refreshing at the latter setChildrenView
    }
    this.pageIndex.setChildrenView();

  }

  onMoved(change, chNode, changed) {
    if (!changed) return; // no change no need to make operations
    if (this.total <= this.pageSize) return;
    const skey=chNode.parent.getSysKey('sort_order');
    //If it is the last or the first then swap page
    if ( (change > 0 && chNode.props[skey] % this.pageSize == 1) || (change < 0 && chNode.props[skey] % this.pageSize == 0) ){
      let currentIndex=this.pageIndex.children.find(child=>child.selected);
      //chNode.parent.children=chNode.parent.children.sort((a,b)=>a.props[skey]-b.props[skey]); //reorder
      if (change > 0) {
        //Go to next page
        currentIndex=this.pageIndex.children[currentIndex.props.number]; // adjust currentIndex
      }
      else {
        //Go to previous page
        currentIndex=this.pageIndex.children[currentIndex.props.number-2]; // adjust currentIndex
      }
      setActive(currentIndex);
      currentIndex.indexAction(); // indexAction for content refreshing
    }
  }
}

const paginationMap = new Map();

export function createPagination(nodeIndex, ...args) {
  paginationMap.set(nodeIndex, new Pagination(...args));
  return paginationMap.get(nodeIndex);
}

export function getPagination(indexNode) {
  return paginationMap.get(indexNode);
}