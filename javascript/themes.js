class Theme extends Node{
  //load themes scheme
  constructor(treeMother, id){
    super();
    this.tpList={};
    this.myTreeMum=treeMother;
  }
  static load(){
    return new Promise((resolve, reject) => {
      var treeMother=new NodeFemale();
      treeMother.loadRequest("load themes tree")
      .then(myNode => {
        resolve(myNode);
      })
      .catch(error => {
        console.error('Error: loading theme');
        reject(error);
      });
    });
  }
  start(id){
    return new Promise((resolve, reject) => {
      this.loadAllTemplates()
      .then(res => {
        let myParent=document.createElement("div");
        myParent.innerHTML=res;
        while (myParent.childNodes.length > 0) {
          if (myParent.childNodes[0].tagName=="TEMPLATE") this.tpList[myParent.childNodes[0].id]=myParent.childNodes[0];
          myParent.removeChild(myParent.childNodes[0]);
        }
      })
      .finally(()=>{
        this.active=this.find(id);
        if (!this.active) this.active=this.myTreeMum.getChild();
        this.active.themePath=Config.themesPath + '/' + this.active.properties.path; //Deprecated
        this.activeStyle=this.active.getRelationship("styles").getChild(Config.styleId);
        Theme.applyCss(Config.themesPath + '/' + this.activeStyle.properties.path + '/' + this.activeStyle.properties.fileName);
        Theme.applyCommonStyle(this.active);
        this.templatesPath=this.active.themePath + '/' + Config.templatesRelativePath + '/'; //OLD
        resolve(this);
        this.dispatchEvent("loaded");
      });
    });
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
  createTreeDeprecated(data){
    var treeMother=new NodeFemale();
    treeMother.properties.name="descendants";
    function innerCreate(themes, parent) {
      for (let key in themes) {
        let myChild=new NodeMale();
        parent.addChild(myChild);
        myChild.properties.id=key;
        if (parent.partnerNode) myChild.properties.path=parent.partnerNode.properties.path + '/children/' + key;
        else myChild.properties.path=key; //is root
        
        let myBranch=new NodeFemale();
        myBranch.properties.name="descendants";
        myChild.addRelationship(myBranch);
        
        let stylesBranch=new NodeFemale();
        stylesBranch.properties.name="styles";
        myChild.addRelationship(stylesBranch);
        if (themes[key][Config.cssRelPath]) {
          for (let cssKey in themes[key][Config.cssRelPath]) {
            if (typeof themes[key][Config.cssRelPath][cssKey]=="string") {
              let cssNode=new NodeMale();
              cssNode.properties.fileName=themes[key][Config.cssRelPath][cssKey];
              let dot=cssNode.properties.fileName.lastIndexOf('.');
              if (dot!=-1) cssNode.properties.id=cssNode.properties.fileName.substring(0, dot);
              stylesBranch.addChild(cssNode);
            }
          }
        }
        
        if ("children" in themes[key]) {
          innerCreate(themes[key].children, myBranch);
        }
      }
    }
    innerCreate(data, treeMother);
    return treeMother;
  }
  
  find(search){
    if (typeof search== "string") search={id: search};
    if (!search) {
      return this.myTreeMum.getChild();
    }
    function innerFind(search, myTreeMum) {
      for (let key in search) {
        if (myTreeMum.partnerNode && myTreeMum.partnerNode.properties[key]==search[key]) {
          return myTreeMum.partnerNode;
        }
      }
      for (let i=0; i<myTreeMum.children.length; i++) {
        let result=innerFind(search, myTreeMum.children[i].getRelationship());
        if (result) return result;
      }
      return false
    }
    return innerFind(search, this.myTreeMum);
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
        if (cmNode.properties.id=="common") {
          myNode=cmNode;
          return true;
        }
      });
      if (myNode) {
        Theme.applyCss(Config.themesPath + '/' + myNode.properties.path + '/' + myNode.properties.fileName);
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
      if (styles[i].href.indexOf(this.active.getRelationship("styles").getChild("common").properties.fileName)==-1) document.head.removeChild(styles[i]);
    }
    if (typeof parameter == "number") styleNode= this.active.getRelationship("styles").children[parameter];
    if (typeof parameter == "string") {
      this.active.getRelationship("styles").children.some(myNode=>{
        if (myNode.properties.id==parameter) {
          styleNode=myNode;
          return true;
        }
      });
    }
    else {
      //we go walking for every style
      let activeIndex=-1;
      let children=this.active.getRelationship("styles").children;
      let childrenCopy=[];
      for (let i=0; i<children.length; i++) {
        if (children[i].properties.id!='common') { //remove common.css from search
          let index=childrenCopy.push(children[i])-1;
          if (children[i]==this.activeStyle) activeIndex=index;
        }
      }
      activeIndex++;
      if (activeIndex>=childrenCopy.length) {
        activeIndex=0; //back to begining
      }
      styleNode=childrenCopy[activeIndex];
    }
    //Apply the css
    if (styleNode.properties.id!="common") {
      Theme.applyCss(Config.themesPath + '/' + styleNode.properties.path + '/' + styleNode.properties.fileName);
      this.activeStyle=styleNode;
      return styleNode;
    }
  }
  loadAllTemplates(url){
    if (!url) url=Config.loadAllTemplatesFilePath;
    return new Promise((resolve, reject) => {
      if (Config.loadTemplatesAtOnce==false || Config.templatesCacheOn==false) resolve("");
      fetch(url, {
        method: 'post',
        body: JSON.stringify({theme_id: Config.themeId}),
      })
      .then(res => res.text())
      .then(result => {
        resolve(result);
      })
      .catch(error => console.error('Error: load All templates', error))
    });
  }
  /*DEPRECATED*/
  getParentTpFilePath(tpFilePath){
    //here we should extract the active themeId and tp name from tp string
    //then we have to make a new getTp for the parent theme so make a new tp string for it
    //if the themeId is the root then we end it up
    var re =/[^/]+$/;
    var tpFileName=re.exec(tpFilePath)[0];
    var pattern= Config.themesPath.replaceAll("/", "\/") + ".+/([^/]+)\/" + Config.templatesRelativePath.replaceAll("/", "\/");
    re =new RegExp(pattern);
    var id=re.exec(tpFilePath)[1];
    //search by themePath
    var myTheme=this.find(id);
    return Config.themesPath + '/' + myTheme.parentNode.partnerNode.properties.path + '/' + Config.templatesRelativePath + '/' + tpFileName;
  }
  static getTpPath(themeNode, id){
    let tpNode=null;
    while (themeNode) {
      themeNode.getRelationship("templates").children
      .some(myNode=>{
        if (myNode.properties.id==id) {
          tpNode=myNode;
          return true;
        }
      });
      if (tpNode) {
        return Config.themesPath + '/' + tpNode.properties.path + '/' + tpNode.properties.fileName;
      }
      themeNode=themeNode.parentNode.partnerNode;
    }
  }
}