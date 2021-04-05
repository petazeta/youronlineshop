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
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  checklength: function(value, min, max){
    if (typeof value=="number") value=value.toString();
    if (typeof value == "string") {
      if (value.length >= min && value.length <= max) return true;
    }
    return false;
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
        var myRel=myNode.children[i].getRelationship(myNode.properties.name);
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
            var myRel=myNode.parentNode.children[i].getRelationship(myNode.properties.name);
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
    var myRoot=myNode.getrootnode();
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
          Node.dom.unsetActive(mySelected.getRelationship(myParent.properties.name));
        }
        Node.dom.setActiveChild(myPointer);
      }
    }
  },
  getDomElementFromChild(myNode) {
    if (!myNode.parentNode || !myNode.parentNode.childContainer) return false;
    //This method only works in wrapped templates
    //We have a child and the container is at the parent.
    for (var i=0; i<myNode.parentNode.children.length; i++) {
      
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
    myElement.addEventListener("mouseover", function(ev){
      myElement.style[arg.method]=valueOn;
    });
    myElement.addEventListener("mouseout", function(ev){
     myElement.style[arg.method]=valueOff;
    });
    parentElement.addEventListener("mouseover", function(ev){
      myElement.style[arg.method]=valueOn;
    });
    parentElement.addEventListener("mouseout", function(ev){
      myElement.style[arg.method]=valueOff;
    });
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
  formToData: function(relationship, myform) {
    var data=new NodeMale();
    relationship.childtablekeys.forEach((key)=>{
      if (key!="id" && myform.elements[key]) {
        data.properties[key]=myform.elements[key].value;
      }
    });
    return data;
  },
  checkDataChange: function(relationship, data) {
    return relationship.childtablekeys.some((key)=>{
      return (key!='id' && data.properties[key]!=relationship.getChild().properties[key]);
    });
  },
  checkValidData: function(data) {
    var myReturn={};
    myReturn.minchar=3;
    myReturn.maxchar=120;
    for (var key in data.properties) {
      var value=data.properties[key];
      if (key=="id") continue;
      if (!value ||
      !Node.dom.checklength(value, myReturn.minchar, myReturn.maxchar)) {
        myReturn.error=true;
        myReturn.errorKey=key;
      }
    }
    return myReturn;
  },
  //showIf, thisParent, refreshOnLog
  adminListenersOld: function(params) {
    if (!params.showIf) {
      params.showIf = () => webuser.isWebAdmin();
    }
    //Lets add the log event
    if (params.refreshOnLog) {
      //to refresh the nochildren element when log
      webuser.addEventListener("log", (myNode) => {
        params.thisParent.setChildrenView();
      }, "childrenrefresh", params.thisParent);
    }
    //adding the only-addbutton when is no records
    params.thisParent.addEventListener("setChildrenView", myNode => {
      //add the add button to the page when no paragraphs
      if (myNode.children.length==0){
        if (params.showIf()) {
          //The node and a data node is inserted
          myNode.getNewNode().then((newNode) => {
            //newNode.loadasc(this, 2, "id");
            myNode.setView(myNode.childContainer, "butaddnewnode", {newNode: newNode});
          });
        }
        //remove the add buton when log after webadmin
        else {
          myNode.childContainer.innerHTML="";
        }
      }
    }, "butaddnewnode");  
    //When admin add a new node it will be selected (what if there is not a menu thing?)
    params.thisParent.addEventListener("addNewNode", (myNode, newnodeadded) => {
      var button=Node.dom.getDomElementFromChild(newnodeadded).querySelector("[data-button]");
      if (button) button.click();
    }, "clicknewnode");
    //When admin delete a node si estaba seleccionado seleccionamos otro y si era el ultimo borramos lo de la parte central
    params.thisParent.addEventListener("deleteNode", (myNode, nodeDeleted) => {
      if (nodeDeleted.selected) {
        if (myNode.children.length>0) {
          var button=null;
          var position=1;
          if (nodeDeleted.sort_order && nodeDeleted.sort_order > 1) position=nodeDeleted.sort_order-1;
          var button=Node.dom.getDomElementFromChild(myNode.children[position-1]).querySelector("[data-button]");
          if (button) button.click();
        }
      }
      if (myNode.children.length==0) {
        //remove the subcontents (only when are displayed)
        if (nodeDeleted.getRelationship() && nodeDeleted.getRelationship().childContainer) nodeDeleted.getRelationship().childContainer.innerHTML="";
        //to show no children when webadmin
        //this.setChildrenView();
      }
    }, "clickanynode");
    params.thisParent.getNewNode=function() {
      return new Promise ((resolve, reject) => {
        var newNode=new NodeMale();
        newNode.parentNode=new NodeFemale;
        newNode.parentNode.load(this, 1, 0, "id");
        //new node comes with relationship attached
        //newNode.addRelationship(thisNode.cloneNode(0, 0));
        newNode.loadRequest("load my relationships").then((myNode) => {
          //We search for a relationship about language so we have to add then language node
          var datarel = myNode.relationships.find(rel => rel.syschildtablekeysinfo.some( syskey => syskey.type=='foreignkey' && syskey.parenttablename=='TABLE_LANGUAGES' ) );
          if (datarel)  datarel.addChild(new NodeMale());
          resolve(myNode);
        });
      });
    }
  },
  //thisNode
  editListenersOld: function(params) {
    //Lets add the log event
    if (params.refreshOnLog) {
      //to refresh the nochildren element when log
      webuser.addEventListener("log", myNode => {
        params.thisNode.setView();
      }, "refresh", params.thisNode);
      //removing the listener when node is deleted
      params.thisNode.addEventListener("deleteNode", function() {
        webuser.removeEventListener("log", "refresh", this);
      }, "deleteEditButton");
    }
  },
  addNewNodeButton: (myNode) => {
    if (myNode.children.length==0) {
      //The node and a data node is inserted
      myNode.createInstanceChild().then(newNode => {
        myNode.setView(myNode.childContainer, "butaddnewnode", {newNode: newNode});
      });
    }
  },
  imageEditFunc: function(myParams){
    //We have to produce a new fileName for when file edition
    var fileName= this.properties.image;
    if (fileName && fileName.search('_')!=-1) {
      //Adding next _number for the image
      var previousNum=0;
      if (fileVerMatch=fileName.match(/_\d/g).length==2) {
        previousNum=fileName.match(/\d+\./)[0];
      }
      previousNum++
      fileName="file_" + this.properties.id + '_' + previousNum;
    }
    else fileName="file_" + this.properties.id;
    var loadImageAlert=new Alert();
    loadImageAlert.showalert(null, "loadimg", {myNode: myParams.myNode, labelNode: myParams.labelNode, fileName: fileName});
    this.addEventListener("loadImage",myNode => {
      if (myNode.error==true) {
        var loadError=myParams.labelNode.getNextChild({name:"loadError"});
        var loadErrorMsg=loadError.getRelationship("domelementsdata").getChild().properties.value;
        alert(loadErrorMsg);
      }
      else {
        myParams.imageElement.setAttribute('data-src', fileName + '.png');
        this.dispatchEvent("finishAutoEdit");
      }
    });
  },
}

class Alert extends NodeMale {
  constructor() {
    super();
  }

  showalert(text, tp, params) {
    return new Promise((resolve, reject) => {
      if (tp == null) tp= "alert";
      if (text) this.properties.alertmsg=text;
      var alertcontainer=document.createElement("div");
      document.body.appendChild(alertcontainer);
      this.setView(alertcontainer, tp, params)
      .then(myNode=>{
        if (myNode.properties.timeout) {
          alertcontainer.firstElementChild.style.opacity=0;
          alertcontainer.firstElementChild.style.transition="opacity 0.5s";
          alertcontainer.firstElementChild.style.opacity=1;
        }
        resolve(myNode);
      });
    });
  }
  hidealert() {
    var remove=(element)=>{
      if (element && element.parentElement) {
        element.parentElement.removeChild(element);
      }
    };
    if (this.properties.timeout>0) {
      window.setTimeout(()=>this.myContainer.firstElementChild.style.opacity=0, this.properties.timeout);
      window.setTimeout(()=>remove(this.myContainer), this.properties.timeout+500);
    }
    else remove(this.myContainer);
  }
}

function createQuantitySelect(limit){
  if (!limit) limit=25;
  var myselect=document.createElement("select");
  for (var i=0; i<limit; i++) {
    var myoption=document.createElement("option");
    myoption.innerHTML=i+1;
    myoption.value=i+1;
    myselect.add(myoption);
  }
  return myselect;
};

//Change the size of a file
//var file = fileInput.files[0];  fd.append(filename, blob, filename + ".png");
function resizeImage(imageFile, imageSizeX, blobResult) {
  var imageType = /image.*/;

  if (imageFile.type.match(imageType)) {
    var reader = new FileReader();
    reader.onload = function() {
      // Create a new image.
      var img = new Image();
      // Set the img src property using the data URL.
      img.src = reader.result;
      img.onload = function() {
        var image=this;
        var max_width=imageSizeX;
	var width = image.width;
	var height = image.height;
	
	if (width > max_width) {
	  height *= max_width / width;
	  width = max_width;
	}
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	canvas.getContext("2d").drawImage(image, 0, 0, width, height);
	var dataUrl = canvas.toDataURL("image/png");
	
	blobResult.push(dataURLtoBlob(dataUrl));

        function dataURLtoBlob(dataURL) {
	  // convert base64/URLEncoded data component to raw binary data held in a string
	  var byteString;
          if (dataURL.split(",")[0].indexOf("base64") >= 0) byteString = atob(dataURL.split(",")[1]);
          else byteString = unescape(dataURL.split(",")[1]);
	  // separate out the mime component
	  var mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
	  // write the bytes of the string to a typed array
	  var ia = new Uint8Array(byteString.length);
	  for (var i = 0; i < byteString.length; i++) {
	    ia[i] = byteString.charCodeAt(i);
	  }
          return new Blob([ia], {type:mimeString});
        }
      };
    }
    reader.readAsDataURL(imageFile); 
  }
  else {
    return false;
  }
}
//This function execs myfunc for each element of an array and return the array result, if async mode the resulting for each array element is sent as argument to the listener function
//function myfunc => function(arg, funcafter){var result=arg + "t"; funafter(result);}
//function reqlistener => function(resultbefore){console.log(resultbefore)}
function execfuncargs(myfunc, argsarray, async, reqlistener) {
  function execfuncargsinter(myfunc, argsarray, resultarray) {
    if (resultarray==null) resultarray=[];
    if (argsarray.length > resultarray.length) {
      var myarg=argsarray[resultarray.length];
      if (async==true) {
        myfunc.call(this, myarg,  function(myresult){resultarray.push(myresult); execfuncargsinter(myfunc, argsarray, resultarray);});
      }
      else {
        var myresult=myfunc.call(this, myarg);
        resultarray.push(myresult);
        execfuncargsinter(myfunc, argsarray, resultarray);
      }
    }
    else {
      if (!async) {
        return resultarray;
      }
      else {
        if (reqlistener) {
          reqlistener(resultarray);
        }
      }
    }
  }
  return execfuncargsinter(myfunc, argsarray);
}

function loadAllTemplatesDeprecated(url){
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