import {selectorFromAttr} from "./frontutils.mjs"
export class Pagination{
  constructor(parent, onclick, pageSize=3, pageTp="pagination", pageNum=1){
    this.pageTp = pageTp
    this.onclick = onclick
    this.parent = parent
    this.pageSize = pageSize
    this.indexes
    this.totalParent
    this.itemsWindow = [] // [first element position, last element position]. It starts by 1.
    this.pageNum = pageNum
    this.loaded = false
    this.container
  }
  async init(params={}) {
    await this.getTotal(this.parent, params)
    this.createIndexes()
    this.createItemsWindow()
  }
  createItemsWindow(pageNum){
    if (pageNum)
      this.pageNum = pageNum
    const startIndex = (this.pageNum - 1) * this.pageSize
    const endIndex = startIndex + this.pageSize - 1
    this.itemsWindow = [startIndex + 1, endIndex + 1]
  }
  async loadPageItems(action="get my tree", params={}, pageNum){
    if (pageNum)
      this.pageNum = pageNum
    this.createItemsWindow()
    await this.parent.loadRequest(action, { limit: [this.itemsWindow[0] - 1, this.itemsWindow[1]], ...params }) // loading data
  }
  async getTotal(parent, params={}) {
    this.totalParent = parent.clone()
    this.totalParent.pagination = this
    // In same cases we don't need to make the request because we know total value in advance. In that cases we set it before.
    if (this.totalParent.props.total === undefined) {
      await this.totalParent.loadRequest("get my children", {count: true, ...params})
    }
  }
  createIndexes(){
    const pagesNum = Math.ceil(this.totalParent.props.total / this.pageSize) || 1
    this.indexes = []
    for (let x=1; x<=pagesNum; x++) {
      let index = {value: x, selected: false}
      if (x==1) index.selected = true
      this.indexes.push(index);
    }
    return this.indexes
  }
  async pageView(getTemplate, pageTp=this.pageTp){
    // if (!this.indexes) await this.init() redundante
    const myTp = await getTemplate(pageTp)
    this.container = selectorFromAttr(myTp, "data-container")
    await this.displayButtons(getTemplate)
    return myTp
  }
  async displayButtons(getTemplate) {
    const butsContainer = selectorFromAttr(this.container, "data-indexes")
    butsContainer.innerHTML = ""
    for (const indexobj of this.indexes) {
      butsContainer.appendChild(await this.buttonView(getTemplate, indexobj))
    }
  }
  async buttonView(getTemplate, indexobj, butTp="butindex") {
    const myTp = await getTemplate(butTp)
    const but = selectorFromAttr(myTp, "data-value")
    but.textContent = indexobj.value
    indexobj.but = but
    //const myHref = selectorFromAttr(but, "href")
    //myHref.value = "create params"
    but.addEventListener("click", async (ev)=>{
      ev.preventDefault()
      await this.onclick(indexobj.value)
    })
    if (indexobj.value == this.pageNum)
      but.classList.add("selected")
    return myTp
  }
  /*
  this.makeSelected(this.indexes.find(index=>index.value==this.pageNum))
  makeSelected(mySelected) {
    for (const index of this.indexes) {
      index.selected = false
      index.but.classList.remove("selected")
    }
    mySelected.selected = true
    mySelected.but.classList.add("selected")
  }
  */
}

// -- helpers


