<nav></nav>
<template id="menutp">
  <span class="adminlauncher adminsinglelauncher">
    <a href=""></a>
    <script>
      thisNode.getRelationship("domelementsdata").loadfromhttp({action:"load my children"}, function(){
	thisElement.textContent=this.getChild().properties.value || emptyValueText;
      });
      thisNode.getRelationship().addEventListener("refreshChildrenView", function() {
	if (this.children==0){
	  if (webuser.isWebAdmin()) {
	    //The node and a data node is inserted
	    var childNode=new NodeMale();
	    childNode.parentNode=this;
	    childNode.relationships[0]=this.partnerNode.getRelationship({name: "domelementsdata"}).cloneNode(0);
	    childNode.getRelationship().addChild(new NodeMale());
	    
	    var admnlauncher=new NodeMale();
	    admnlauncher.myNode=childNode;
	    admnlauncher.buttons=[{ template: document.getElementById("butaddnewnodetp")}];
	    admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
	  }
	  else thisElement.innerHTML="";
	}
      });
      thisElement.addEventListener('click', function(event){
	event.preventDefault();
	thisNode.setActive();

	thisNode.getRelationship().loadfromhttp({action: "load my tree"}, function() {
	  this.refreshChildrenView(document.getElementById("centralcontent"), document.querySelector("#domelementtp"));
	});
      });
    </script>
    <div class="bttopadmn" data-info='this is for the open close element'></div>
    <div class="btrightnarrow"></div>
    <script>
      if (webuser.isWebAdmin()) {
	var admnlauncher=new NodeMale();
	admnlauncher.myNode=thisNode;
	admnlauncher.buttons=[
	  { 
	    template: document.getElementById("butedittp"),
	    args:{editpropertyname:"value", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild, dataRelationship: thisNode.getRelationship({name: "domelementsdata"})}
	  },
	  {template: document.getElementById("buthchpostp")},
	  {
	    template: document.getElementById("butaddnewnodetp"),
	    args:{sort_order: thisNode.sort_order + 1, dataRelationship: thisNode.getRelationship({name: "domelementsdata"})}
	  },
	  {template: document.getElementById("butdeletetp")}
	];
	admnlauncher.refreshView(thisElement, document.getElementById("butopentp"));
      }
      webuser.addEventListener("log", function() {
	if (!this.isWebAdmin()) {
	  thisElement.innerHTML="";
	  thisElement.previousElementSibling.innerHTML="";
	}
	else {
	  thisNode.render(thisElement.nextElementSibling);
	}
      }, "category" + thisNode.properties.id);
      thisNode.addEventListener("deleteNode", function() {
	webuser.removeEventListener("log", "category" + thisNode.properties.id);
      });
    </script>
  </span>
</template>

<template id="domelementtp">
  <div class="paragraph">
    <div class="adminlauncher adminsinglelauncher">
      <div></div>
      <script>
	thisElement.innerHTML=thisNode.getRelationship("domelementsdata").getChild().properties.value || emptyValueText;
      </script>
      <div class="btinside"></div>
      <script>
	if (webuser.isWebAdmin()) {
	  var admnlauncher=new NodeMale();
	  admnlauncher.myNode=thisNode;
	  admnlauncher.buttons=[
	    { 
	      template: document.getElementById("butedittp"),
	      args:{editpropertyname:"value", allowedHTML:true, editelement:thisElement.parentElement.firstElementChild, dataRelationship: thisNode.getRelationship({name: "domelementsdata"})}
	    },
	    {template: document.getElementById("butvchpostp")},
	    {
	      template: document.getElementById("butaddnewnodetp"),
	      args:{sort_order: thisNode.sort_order + 1, dataRelationship: thisNode.getRelationship({name: "domelementsdata"})}
	    },
	    {template: document.getElementById("butdeletetp")}
	  ];
	  admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
	}
      </script>
    </div>
  </div>
</template>

<script type="text/javascript">
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  this.getChild().getNextChild({name: "texts"}).loadfromhttp({action:"load my tree", deepLevel: 5}, function(){
    var menusMother=this.getNextChild({name: "nav"}).getRelationship();
    menusMother.addEventListener("refreshChildrenView", function() {
      if (this.children==0){
	var noChildrenLauncher=new NodeMale();
	noChildrenLauncher.args={dataRelationship: this.partnerNode.getRelationship({name: "domelementsdata"})};
	noChildrenLauncher.myNode=this;
	noChildrenLauncher.refreshView(this.childContainer, document.getElementById("nochildrentp"));
      }
    });
    //When admin add a new node it will be selected
    menusMother.addEventListener("addNewNode", function(newnodeadded) {
      newnodeadded.getMyDomNodes()[0].querySelector("a").click();
    });
    //When admin delete a node si estaba seleccionado seleccionamos otro y si era el último borramos lo de la parte central
    menusMother.addEventListener("deleteNode", function(nodedeleted) {
      if (nodedeleted.selected) {
	if (this.children.length>0) {
	  this.children[0].getMyDomNodes()[0].querySelector("a").click();
	}
      }
      if (this.children.length==0) {
	//remove subcategories flaps in case we just remove all categories
	document.getElementById("centralcontent").innerHTML="";
      }
    });
    //showing menus (after the listeners to refreshChildrenView are added). Refreshing first time first menu is clicked
    menusMother.refreshChildrenView(document.querySelector("#menucontainer nav"), document.querySelector("#menucontainer #menutp"), function(){
      if (this.children.length>0 && !webuser.isWebAdmin()) {this.children[0].getMyDomNodes()[0].querySelector("a").click();}
    });
    //to refresh the nochildren element when log
    webuser.addEventListener("log", function(){
      if (menusMother.children.length==0) {
	menusMother.refreshChildrenView();
      }
    });
  });
});
</script>