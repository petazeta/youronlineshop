//Some functions that will be applied to dom elements
Node.dom={
  setSelected: function(element) {
    element.classList.add("selected");
  },
  setUnselected: function(element) {
    element.classList.remove("selected");
  },
  closesttagname: function(element, tagname, limitElement){ //tagname capitals
    //if !myreturn.parentElement.tagName => document fragment
    var myreturn=element;
    while(myreturn && myreturn.parentElement && myreturn.parentElement.tagName && ( myreturn.parentElement.tagName.toLowerCase() != tagname.toLowerCase() )) {
      myreturn=myreturn.parentElement;
    }
    if (limitElement && myreturn.parentElement==limitElement) return false;
    else if (myreturn.parentElement && (myreturn.parentElement.tagName.toLowerCase()==tagname.toLowerCase())) return myreturn.parentElement;
    else return false;
  },
  validateEmail: function(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  unsetActiveChild: function(myNode) {
    myNode.selected=false;
    var mydom=this.getDomElementFromChild(myNode);
    var hbutton=null;
    if (mydom) {
      if (mydom.getAttribute("data-hbutton")) hbutton=mydom;
      else hbutton=mydom.querySelector("[data-hbutton]");
      if (hbutton) {
        Node.dom.setUnselected(hbutton);
      }
    }
  },
  unsetActive: function(myNode) {
    if (!myNode) return false;
    myNode.activeChildren=null;
    //unselect brothers
    var i= myNode.children.length;
    while(i--) {
      if (myNode.children[i].selected) {
        Node.dom.unsetActiveChild(myNode.children[i]);
        var myRel=myNode.children[i].getRelationship(myNode.props.name);
        Node.dom.unsetActive(myRel);
      }
    }
  },
  setActiveChild: function(myNode) {
    //unselect brothers
    if (myNode.parentNode) {
      var i= myNode.parentNode.children.length;
      while(i--) {
        if (myNode.parentNode.children[i].selected) {
          if (myNode.parentNode.children[i]!=myNode) {
            Node.dom.unsetActiveChild(myNode.parentNode.children[i]);
            var myRel=myNode.parentNode.children[i].getRelationship(myNode.props.name);
            Node.dom.unsetActive(myRel);
          }
        }
      }
      myNode.parentNode.activeChildren=myNode;
    }
    //selection of the node
    myNode.selected=true;
    var mydom=this.getDomElementFromChild(myNode);
    var hbutton=null;
    if (mydom) {
      if (mydom.getAttribute("data-hbutton")) hbutton=mydom;
      else hbutton=mydom.querySelector("[data-hbutton]");
      if (hbutton) {
        Node.dom.setSelected(hbutton);
      }
    }
  },
  setActive: function(myNode) {
    //we select the node as selected and unselect the brothers:
    Node.dom.setActiveChild(myNode);
    //Now we must unselect all the up nodes except its parental branch
    const myRoot=myNode.getrootnode();
    if (myRoot.constructor.name=="NodeFemale") myRoot=myRoot.children[0];
    var myPointer=myNode;
    while (myPointer && myPointer!=myRoot) {
      myParent=myPointer.parentNode;
      mySelf=myPointer
      if (myParent) myPointer=myParent.partnerNode;
      if (myPointer && !myPointer.selected) {
        //uselect selecteds children
        //find the selected
        var mySelected=false;
        var i= myParent.children.length;
        while(i--) {
          if (myParent.children[i].selected==true) {
            mySelected=myParent.children[i];
          }
        }
        if (mySelected!=mySelf) {
          Node.dom.unsetActive(mySelected.getRelationship(myParent.props.name));
        }
        Node.dom.setActiveChild(myPointer);
      }
    }
  },
  getDomElementFromChild(myNode) {
    if (!myNode.parentNode || !myNode.parentNode.childContainer) return false;
    //This method only works in wrapped templates
    //We have a child and the container is at the parent.
    for (const i in myNode.parentNode.children) {
      if (myNode.parentNode.children[i]==myNode) {
        return myNode.parentNode.childContainer.children[i];
      }
    }
  },
  visibleOnMouseOver: function(arg){
    var valueOn=1;
    var valueOff=0;
    if (arg.method=='visibility') {
      valueOn='visible';
      valueOff='hidden';
    }
    else arg.method='opacity';
    var parentElement=arg.parent;
    var myElement=arg.element;
    myElement.style[arg.method]=valueOff;
    const setVisible=function(ev){
      myElement.style[arg.method]=valueOn;
    }
    const setHidden=function(ev){
      myElement.style[arg.method]=valueOff;
    }
    myElement.addEventListener("mouseover", setVisible);
    myElement.addEventListener("mouseout", setHidden);
    parentElement.addEventListener("mouseover", setVisible);
    parentElement.addEventListener("mouseout", setHidden);
  },
  setSizeFromStyle(myElement) {
    var imageSrc=window.getComputedStyle(myElement).backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];
    var image = new Image();
    image.onload = function(){
      var width =image.width;
      var height = image.height;
      if (width && height) {
        myElement.style.width=width + 'px';
        myElement.style.height=height + 'px';
        return true;
      }
    };
    image.src = imageSrc;
  },
  switchVisibility(velement) {
    if (velement.style.visibility=="hidden") {
      velement.style.visibility="visible";
    }
    else {
      velement.style.visibility="hidden";
    }
  },
  //Turn input values to element props
  formToData: function(relationship, myform) {
    var data=new NodeMale();
    relationship.childtablekeys.forEach((key)=>{
      if (key!="id" && myform.elements[key]) {
        data.props[key]=myform.elements[key].value;
      }
    });
    return data;
  },
  checkDataChange: function(relationship, data) {
    return relationship.childtablekeys.some(key=>key!='id' && data.props[key]!=relationship.getChild().props[key]);
  },
  checkValidData: function(data) {
    if (!data) return false;
    let minchar=3;
    let maxchar=120;
    function checklength(value, min, max){
      if (typeof value=="number") value=value.toString();
      if (typeof value == "string") {
        if (value.length >= min && value.length <= max) return true;
      }
      return false;
    };
    for (const key in data.props) {
      const value=data.props[key];
      if (key=="id") continue;
      if (!value ||
      !checklength(value, minchar, maxchar)) {
        return {errorKey: key, minchar: minchar, maxchar: maxchar};
      }
    }
    return true;
  },
  imageEditFunc: function(myParams){
    //myParams=>myNode, labelNode, imageElement
    //We have to produce a new fileName for when file edition
    var fileName= this.props.image;
    if (fileName && fileName.includes('_')) {
      //Adding next _number for the image
      var previousNum=0;
      if (fileVerMatch=fileName.match(/_\d/g).length==2) {
        previousNum=fileName.match(/\d+\./)[0];
      }
      previousNum++;
      fileName="file_" + this.props.id + '_' + previousNum;
    }
    else fileName="file_" + this.props.id;
    (new Alert()).showAlert(null, "loadimg", {myNode: myParams.myNode, labelNode: myParams.labelNode, fileName: fileName});
    this.addEventListener("loadImage", function() {
      if (this.error==true) {
        const loadErrorMsg=myParams.labelNode.getNextChild({name:"loadError"}).getRelationship("domelementsdata").getChild().props.value;
        (new AlertMessage(oadErrorMsg, 3000)).showAlert();
      }
      else {
        myParams.imageElement.setAttribute('data-src', fileName + '.png');
        this.dispatchEvent("finishAutoEdit");
      }
    });
  },
  selectLanguage: function(langParent){
    let webLangs=langParent.children.map(child => child.props.code.toUpperCase());
    let winLangs=window.navigator.languages.map(lang=>{
      if (lang.includes('-')) {
        return lang.split('-')[0].toUpperCase();
      }
      return lang.toUpperCase();
    });
    for (const lang of winLangs) {
      const pos=webLangs.indexOf(lang);
      if (pos !=-1) {
        return langParent.children[pos];
      }
    }
  },
  createQuantitySelect: function(limit){
    if (!limit) limit=25;
    var myselect=document.createElement("select");
    for (var i=0; i<limit; i++) {
      var myoption=document.createElement("option");
      myoption.innerHTML=i+1;
      myoption.value=i+1;
      myselect.add(myoption);
    }
    return myselect;
  },
  createQuantitySelect: function(limit){
    if (!limit) limit=25;
    var myselect=document.createElement("select");
    for (var i=0; i<limit; i++) {
      var myoption=document.createElement("option");
      myoption.innerHTML=i+1;
      myoption.value=i+1;
      myselect.add(myoption);
    }
    return myselect;
  },
  //it uses delNode.parentNode.paginationIndex.createPageIndex and refreshPage
  paginationOnDeleted: (delNode)=>{
    delNode.parentNode.props.total--;
    //If no pagination needed or present page size is not overflow we just refresh the view
    if (!Config.catPageSize) {
      delNode.parentNode.setChildrenView();
      return;
    }
    const delPageNum=Node.dom.paginationCalculatePageNum(delNode);
    
    const total=delNode.parentNode.props.total;
    if (total < Config.catPageSize || (total % Config.catPageSize != 0)) {
      delNode.parentNode.setChildrenView();
      return;
    }
    //If reduce pages number refresh page Index
    if (total % Config.catPageSize == 0) {
      const pages=Math.ceil(total / Config.catPageSize);
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
  },
  //it uses delNode.parentNode.paginationIndex.createPageIndex and refreshPage
  paginationOnAdded: (newNode)=>{
    newNode.parentNode.props.total++;
    //If no pagination needed or present page size is not overflow we just refresh the view
    if (!Config.catPageSize) {
      newNode.parentNode.setChildrenView();
      return;
    }
    const newPageNum=Node.dom.paginationCalculatePageNum(newNode);
    const total=newNode.parentNode.props.total;
    if (total <= Config.catPageSize || newNode.parentNode.children.length < Config.catPageSize) {
      newNode.parentNode.setChildrenView();
      return;
    }
    //If overflow pages number then add new page at the index
    if (total % Config.catPageSize == 1) {
      const pages=Math.ceil(total / Config.catPageSize);
      newNode.parentNode.paginationIndex.createPageIndex(pages); //set pagination
    }
    //If present page is overflow we need to make some arrangments
    if (newNode.parentNode.children.length > Config.catPageSize) {
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
  },
  //it uses delNode.parentNode.paginationIndex.refreshPage
  paginationCalculatePageNum: (child) => {
    const skey=child.parentNode.getMySysKey('sort_order');
    const thisOrder=child.props[skey];
    return Math.ceil(thisOrder / Config.catPageSize);
  },
  paginationOnChgOrder: (chNode, change)=>{
    //If no pagination needed or present page size is not overflow we just refresh the view
    if (!Config.catPageSize) {
      chNode.parentNode.setChildrenView();
      return;
    }
    const total=chNode.parentNode.props.total;
    if (total <= Config.catPageSize) {
      chNode.parentNode.setChildrenView();
      return;
    }
    const newPageNum=Node.dom.paginationCalculatePageNum(chNode);
    const skey=chNode.parentNode.getMySysKey('sort_order');
    chNode.parentNode.children=chNode.parentNode.children.sort((a,b)=>a.props[skey]-b.props[skey]); //reorder
    //If it is the last or the first then swap page
    if ( (change > 0 && chNode.props[skey] % Config.catPageSize == 1) ||
      (change < 0 && chNode.props[skey] % Config.catPageSize == 0) ) {
        //Go to correspondent page. chNode order is already set to newPage
        chNode.parentNode.paginationIndex.refreshPage(newPageNum);
    }
    else {
      chNode.parentNode.setChildrenView();
    }
  },
  //Change the size of a file
  //var file = fileInput.files[0];  fd.append(filename, result, resultPropName, filename + ".png");
  resizeImage: (imageFile, imageSizeX) => {
    return new Promise((resolve, reject) => {
      if (imageFile.type.match(/image.*/)) {
        const reader = new FileReader();
        reader.onload = function() {
          // Create a new image.
          const img = new Image();
          // Set the img src property using the data URL.
          img.src = reader.result;
          img.onload = function() {
            const image=this;
            const max_width=imageSizeX;
            let width = image.width;
            let height = image.height;
            
            if (width > max_width) {
              height *= max_width / width;
              width = max_width;
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            canvas.getContext("2d").drawImage(image, 0, 0, width, height);
            
            resolve(dataURLtoBlob(canvas.toDataURL("image/png")));

            function dataURLtoBlob(dataURL) {
              // convert base64/URLEncoded data component to raw binary data held in a string
              let byteString;
              if (dataURL.split(",")[0].indexOf("base64") >= 0) byteString = atob(dataURL.split(",")[1]);
              else byteString = unescape(dataURL.split(",")[1]);
              // separate out the mime component
              const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
              // write the bytes of the string to a typed array
              const ia = new Uint8Array(byteString.length);
              for (const i in byteString) {
                ia[i] = byteString.charCodeAt(i);
              }
              return new Blob([ia], {type:mimeString});
            }
          };
        }
        reader.readAsDataURL(imageFile); 
      }
      else {
        throw new Error("image type not supported");
      }
    });
  },
}

Node.utils={
  //This function is to detect numbers as arguments that are in string format
  parseNumber:function(x){
    const detectNumber=(x)=>{
      if (!isNaN(x) && !(x.trim())=='') {
        return true;
      }
      return false;
    }
    if (typeof x == "string" && detectNumber(x)) return Number(x);
    if (typeof x == "number") return x;
    return NaN;
  }
}

class Alert extends NodeMale {
  constructor() {
    super();
  }
  async showAlert(text, tp, params) {
    if (tp == null) tp= "alert";
    if (text) this.props.alertmsg=text;
    var alertcontainer=document.createElement("div");
    document.body.appendChild(alertcontainer);
    await this.setView(alertcontainer, tp, params);
    if (this.props.timeout>0) {
      alertcontainer.firstElementChild.style.opacity=0;
      alertcontainer.firstElementChild.style.transition="opacity 0.5s";
      alertcontainer.firstElementChild.style.opacity=1;
      this.hideAlert();
    }
    if (this.props.closeOnClick) {
      alertcontainer.addEventListener("click", (e)=>{
        alertcontainer.firstElementChild.style.transition="opacity 0.5s";
        this.hideAlert();
      });
    }
    return this;
  }
  hideAlert() {
    var remove=(element)=>{
      if (element && element.parentElement) {
        element.parentElement.removeChild(element);
      }
    };
    if (this.props.timeout>0) {
      window.setTimeout(()=>this.myContainer.firstElementChild.style.opacity=0, this.props.timeout);
      window.setTimeout(()=>remove(this.myContainer), this.props.timeout+500);
    }
    else remove(this.myContainer);
  }
}

class AlertMessage extends Alert{
  constructor(msg, timeOut) {
    super();
    if (msg) this.props.alertmsg=msg;
    if (timeOut) this.props.timeout=timeOut;
    this.props.alertclass="alertmsg";
    this.props.closeOnClick=true;
  }
}