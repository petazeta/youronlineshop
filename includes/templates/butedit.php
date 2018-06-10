<template  id="butedittp">
  <button style="" class="singleadminedit butedit">
    <img src="includes/css/images/pen.png"/>
  </button>
  <script>
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.thisNode;
    var propertyChange=function (thisNode, thisElement) {
      thisElement.setAttribute("contenteditable","false");
      thisElement.className=thisElement.className.replace(/ contenteditableactive/g,'');
      
      if (thisNode.properties[thisElement.editionThisProperty] != thisElement[thisElement.editionThisProperty]) { //just when content change and not void
	var writeNode=new thisNode.constructor();
	writeNode.loadasc(thisNode, 1, ["id", thisElement.editionThisProperty]);
	writeNode.loadfromhttp({action:"edit my properties", user_id: webuser.properties.id}, function(){
	  thisNode.parentNode.updateChild(writeNode);
	  thisNode.dispatchEvent("propertychange", [thisElement.editionThisProperty]);
	});
      }
      //For empty values lets put some content in the element
      if (thisElement[thisElement.editionThisProperty]=="") {
	thisElement[thisElement.editionThisProperty]= emptyValueText;
      }
    };
    thisElement.onclick=function() {
      DomMethods.activeedition(thisNode, launcher.editelement, propertyChange));
      return false;
    };
  </script>
</template>