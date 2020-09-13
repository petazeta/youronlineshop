//Some functions that will be applied to dom elements
DomMethods={
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
        DomMethods.setUnselected(hbutton);
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
        DomMethods.unsetActiveChild(myNode.children[i]);
        var myRel=myNode.children[i].getRelationship(myNode.properties.name);
        DomMethods.unsetActive(myRel);
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
            DomMethods.unsetActiveChild(myNode.parentNode.children[i]);
            var myRel=myNode.parentNode.children[i].getRelationship(myNode.properties.name);
            DomMethods.unsetActive(myRel);
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
        DomMethods.setSelected(hbutton);
      }
    }
  },
  setActive: function(myNode) {
    //we select the node as selected and unselect the brothers:
    DomMethods.setActiveChild(myNode);
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
          DomMethods.unsetActive(mySelected.getRelationship(myParent.properties.name));
        }
        DomMethods.setActiveChild(myPointer);
      }
    }
  },
  getDomElementFromChild(myNode) {
    //We have a child and the container is at the parent
    if (myNode.parentNode) {
      for (var i=0; i<myNode.parentNode.children.length; i++) {
        if (myNode.parentNode.children[i]==myNode) {
          if (myNode.parentNode.childContainer) {
            return myNode.parentNode.childContainer.children[i];
          }
        }
      }
    }
  },
  visibleOnMouseOver: function(arg){
    var parentElement=arg.parent;
    var myElement=arg.element;
    myElement.style.opacity=0;
    myElement.addEventListener("mouseover", function(ev){
      myElement.style.opacity=1;
    });
    myElement.addEventListener("mouseout", function(ev){
     myElement.style.opacity=0;
    });
    parentElement.addEventListener("mouseover", function(ev){
      myElement.style.opacity=1;
    });
    parentElement.addEventListener("mouseout", function(ev){
      myElement.style.opacity=0;
    });
  }
}

function Alert() {
  NodeMale.call(this);
}
Alert.prototype=Object.create(NodeMale.prototype);
Alert.prototype.constructor=Alert;

Alert.prototype.showalert=function(text, tp) {
  return new Promise((resolve, reject) => {
    if (tp == null) tp="templates/alert.php";
    if (text) this.properties.alertmsg=text;
    var alertcontainer=document.createElement("div");
    document.body.appendChild(alertcontainer);
    this.refreshView(alertcontainer, tp).then(function(myNode){
      if (myNode.properties.timeout) {
        alertcontainer.firstElementChild.style.opacity=0;
        alertcontainer.firstElementChild.style.transition="opacity 0.5s";
        window.setTimeout(function(){alertcontainer.firstElementChild.style.opacity=1;},1);
      }
      resolve(myNode);
    });
  });
};
Alert.prototype.hidealert=function() {
  var remove=function(element){
    if (element && element.parentElement) {
      element.parentElement.removeChild(element);
    }
  };
  var myContainer=this.myContainer;
  if (this.properties.timeout>0) {
    window.setTimeout(function(){myContainer.firstElementChild.style.opacity=0;},this.properties.timeout);
    window.setTimeout(function(){remove(myContainer);},this.properties.timeout+500);
  }
  else remove(myContainer);
};

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