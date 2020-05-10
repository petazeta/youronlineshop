Node.prototype.config.onAppend=function(){
  if (window.screen.width<700 && this.myContainer.id=='centralcontent') {
    this.myContainer.scrollIntoView();
  }
}
