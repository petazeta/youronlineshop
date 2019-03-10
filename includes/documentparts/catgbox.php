<div class="sidebox" id="catalogbox">
  <div class="boxtitle"></div>
  <div class="boxbody"></div>
</div>
<div id="extraedition"></div>
<template id="categorytbxtp">
  <table class="boxlist">
    <tr>
      <td class="boxlist"></td>
    </tr>
  </table>
</template>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var catgboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"ctgbxtt"}).getRelationship({name: "domelementsdata"}).getChild();
  catgboxtt.refreshView(document.querySelector("#catalogbox .boxtitle"), "includes/templates/boxhead.php");

  var categoriesrootmother=new NodeFemale();
  categoriesrootmother.properties.childtablename="TABLE_ITEMCATEGORIES";
  categoriesrootmother.properties.parenttablename="TABLE_ITEMCATEGORIES";
  categoriesrootmother.loadfromhttp({action:"load root"}, function(){
    var categoriesroot=this.getChild();
    categoriesroot.loadfromhttp({action: "load my tree", deepLevel: 3, language: webuser.extra.language.properties.id}, function() {
      var categoriesMother=this.getRelationship();
      var newNode=new NodeMale();
      newNode.parentNode=new NodeFemale();
      newNode.parentNode.load(categoriesMother, 1, 0, "id");
      //new node comes with datarelationship attached
      newNode.addRelationship(categoriesMother.partnerNode.getRelationship("itemcategories").cloneNode(0, 0));
      newNode.addRelationship(categoriesMother.partnerNode.getRelationship("itemcategoriesdata").cloneNode(0, 0));
      newNode.addRelationship(categoriesMother.partnerNode.getRelationship("items").cloneNode(0, 0));
      newNode.getRelationship("itemcategoriesdata").addChild(new NodeMale());
      categoriesMother.newNode=newNode;
      categoriesMother.addEventListener("refreshChildrenView", function(){
	//to set the result in a one column table
	document.querySelector("#catalogbox .boxbody").appendChild(DomMethods.intoColumns(getTpContent(document.querySelector("#categorytbxtp")).querySelector("table").cloneNode(true), document.querySelector("#catalogbox .boxbody"), 1));
      }, "1column");
      categoriesMother.appendThis(document.querySelector("#catalogbox .boxbody"), "includes/templates/admnlisteners.php", function() {
	this.refreshChildrenView(document.querySelector("#catalogbox .boxbody"),  "includes/templates/category.php", function(){
	  if (window.location.search) {
	    regex = /category=(\d+)/;
	    if (window.location.search.match(regex)) var id = window.location.search.match(regex)[1];
	    if (id) {
	      var link=document.querySelector("a[href='?category=" + id + "']");
	      if (link) {
		link.click();
		return;
	      }
	    }
	  }
	  //We add the currency symbol editor and extra pages
	  function showExtraEdition(){ 
	    var containerExtraNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "extraEdition"});
	    var containerExtra=document.querySelector("#extraedition");
	    containerExtraNode.appendThis(containerExtra,"includes/templates/extraedition.php");
	  }
	  if (webuser.isWebAdmin()) {
	    showExtraEdition();
	  }
	  webuser.addEventListener("log",
	    function() {
	      if (!this.isWebAdmin()) {
		//to remove the openbutton when logs after webadmin
		var containerExtra=document.querySelector("#extraedition");
		containerExtra.innerHTML="";
	      }
	      else {
		showExtraEdition();
	      }
	    },
	    "extraButton"
	  );
	});
      });
    });
  });
});
</script>