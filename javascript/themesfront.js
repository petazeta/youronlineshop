{
  class ThemeFront{
    async loadTree(){
    //load themes scheme
      this.tpList={};
      this.myTreeMum=new NodeFemale();
      await this.myTreeMum.loadRequest("get themes tree");
      return true;
    }
    async start(id){
      if (Config.loadComponentsAtOnce!=false && Config.componentsCacheOn!=false) {
        let myParent=document.createElement("div");
        myParent.innerHTML= await this.loadAllComponents();
        while (myParent.childNodes.length > 0) {
          if (myParent.childNodes[0].tagName=="TEMPLATE") this.tpList[myParent.childNodes[0].id]=myParent.childNodes[0];
          myParent.removeChild(myParent.childNodes[0]);
        }
      }
      this.active=this.findTheme(id);
      if (!this.active) this.active=this.myTreeMum.getChild();
      this.active.themePath=Config.themesPath + '/' + this.active.props.path; //Deprecated
      this.activeStyle=this.active.getRelationship("styles").getChild({id: Config.styleId});
      Theme.applyCommonStyle(this.active);
      Theme.applyCss(Config.themesPath + '/' + this.activeStyle.props.path + '/' + this.activeStyle.props.fileName);
      this.componentsPath=this.active.themePath + '/' + Config.componentsRelativePath + '/'; //OLD
      this.dispatchEvent("loaded");
      return true;
    }
    restart(id){
      let prevTps=document.head.querySelectorAll("template");
      let styles=document.head.querySelectorAll('link[rel=stylesheet]');
      for (let i=0; i<prevTps.length; i++) {
        document.head.removeChild(prevTps[i]);
      }
      for (let i=0; i<styles.length; i++) {
        document.head.removeChild(styles[i]);
      }
      return this.start(id);
    }
    changeTheme(id) {
      return this.restart(id);
    }
    
    static applyCss(href){
      var cssLink=document.createElement("link");
      cssLink.rel="stylesheet";
      cssLink.type="text/css";
      cssLink.href=href;
      document.head.appendChild(cssLink);
    }
    static applyCommonStyle(common){
      while (common) {
        let myNode=null;
        common.getRelationship("styles").children.some(cmNode=>{
          if (cmNode.props.id=="common") {
            myNode=cmNode;
            return true;
          }
        });
        if (myNode) {
          Theme.applyCss(Config.themesPath + '/' + myNode.props.path + '/' + myNode.props.fileName);
          break;
        }
        common=common.parentNode.partnerNode;
      }
    }
    changeStyle(parameter){
      let styleNode=null;
      //removing document styles
      let styles=document.head.querySelectorAll('link[rel=stylesheet]');
      for (let i=0; i<styles.length; i++) {
        if (styles[i].href.indexOf(this.active.getRelationship("styles").getChild({id: "common"}).props.fileName)==-1) document.head.removeChild(styles[i]);
      }
      if (typeof parameter == "number") styleNode= this.active.getRelationship("styles").children[parameter];
      if (typeof parameter == "string") {
        for (const child of  this.active.getRelationship("styles").children) {
          if (child.props.id==parameter) {
            styleNode=child;
            break;
          }
        }
      }
      else {
        //we go walking for every style
        let activeIndex=-1;
        let children=this.active.getRelationship("styles").children;
        let childrenCopy=[];
        for (const child of children) {
          if (child.props.id!='common') { //remove common.css from search
            let index=childrenCopy.push(child)-1;
            if (child==this.activeStyle) activeIndex=index;
          }
        }
        activeIndex++;
        if (activeIndex>=childrenCopy.length) {
          activeIndex=0; //back to begining
        }
        styleNode=childrenCopy[activeIndex];
      }
      //Apply the css
      if (styleNode.props.id!="common") {
        Theme.applyCss(Config.themesPath + '/' + styleNode.props.path + '/' + styleNode.props.fileName);
        this.activeStyle=styleNode;
        return styleNode;
      }
    }
    async loadAllComponents(url){
      if (!url) url=Config.loadAllComponentsFilePath;
      const resTxt= await (await fetch(url, {
        method: 'post',
        body: JSON.stringify({theme_id: Config.themeId}),
      })).text();
      return resTxt;
    }
    static getTpPath(themeNode, id){
      let tpNode=null;
      while (themeNode) {
        for (const child of themeNode.getRelationship("components").children) {
          if (child.props.id==id) {
            tpNode=child;
            break;
          }
        }
        if (tpNode) {
          return Config.themesPath + '/' + tpNode.props.path + '/' + tpNode.props.fileName;
        }
        themeNode=themeNode.parentNode.partnerNode;
      }
    }
    static searchPopState(url) {
      let pop;
      //search if url exists in the list
      for (const myPop of this.popState) {
        if (myPop.url===url) {
          pop=myPop;
          break;
        }
      }
      return pop;
    }
    static setPopState(url, action) {
      if (!this.popState) this.popState=[];
      let pop=Theme.searchPopState(url);
      if (pop) {
        pop.action=action;
        return false;
      }
      else {
        pop={url: url, action: action};
        this.popState.push(pop);
        return true;
      }
    }
    static getPopStateAction(url) {
      if (!this.popState) return;
      const pop=Theme.searchPopState(url);
      if (pop) {
        return pop.action;
      }
    }
  }
  //To extend the class Node to NodeFront
  function extendNode(source, target, avoid) {
    Object.getOwnPropertyNames(source).forEach(mymethod => {
      if (!avoid || avoid.indexOf(mymethod)==-1) {
        target[mymethod]=source[mymethod];
      }
    });
  }
  //We add methods
  extendNode(ThemeFront, Theme, ["length", "prototype", "name"]);
  extendNode(ThemeFront.prototype, Theme.prototype, ["constructor"]);
}