// we are experimenting with dialog tag for a substitution but looks it is still not so good

const transitionTime=0.5

function fadeIn(elm){
  elm.style.transition=`opacity ${transitionTime}s`
  elm.style.opacity=1
}

function fadeOut(elm){
  elm.style.transition=`opacity ${transitionTime}s`
  elm.style.opacity=0
}

export class Alert extends HTMLElement {
  constructor() {
    super()
    this._loadedContent=false
  }
  // tpContent: a template content or an element, timeout ms: it will desapear after that time, closeOnClick, close on click inside
  showAlert(tpContent, timeout, closeOnClick) {
    if (!this._loadedContent) {
      this.appendChild(tpContent)
      this._loadedContent=true
    }
    document.body.appendChild(this)
    fadeIn(this.firstElementChild)
    if (timeout>0) {
      setTimeout(()=>fadeOut(this.firstElementChild), timeout)
      setTimeout(()=>this.hideAlert(), timeout + transitionTime * 1000)
    }
    if (closeOnClick) {
      this.addEventListener("click", (e)=>{
        fadeOut(this.firstElementChild)
        setTimeout(()=>this.hideAlert(), transitionTime * 1000)
      })
    }
    return this
  }
  hideAlert() {
    document.body.removeChild(this)
  }
}