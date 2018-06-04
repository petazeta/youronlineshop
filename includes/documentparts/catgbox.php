<table class="box">
  <tr>
    <th class="boxhead">
      <div class="adminlauncher adminsinglelauncher"></div>
      <template id="catgboxheadtp">
	<span></span>
	<script>
	  thisElement.textContent=thisNode.properties.innerHTML || labelsRoot.getNextChild({name: "not located"}).getNextChild({name: "emptyvallabel"}).properties.innerHTML;
	</script>
	<div class="btrightedit"></div>
	<script>
	  var addadminbutts=function(){
	    var admnlauncher=new NodeMale();
	    admnlauncher.myNode=thisNode;
	    admnlauncher.buttons=[{
	      template: document.getElementById("butedittp"),
	      args: {editpropertyname:"innerHTML", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
	    }];
	    admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
	  }
	  if (webuser.isWebAdmin()) {
	    addadminbutts();
	  }
	  webuser.addEventListener("log", function() {
	    if (!this.isWebAdmin()) {
	      thisElement.innerHTML='';
	    }
	    else {
	      addadminbutts();
	    }
	  });
	</script>
      </template>
    </th>
  </tr>
  <tr>
    <td class="content">
      <table class="boxInside" id="categoriescontainer">
	<tr>
	  <td class="rowborder border-bottom">
	  </td>
	</tr>
	<tr>
	  <td></td>
	  <template id="categoriestp">
	    <table style="width:100%"></table>
	    <script>
	      thisNode.loadfromhttp({action:"load my children"}, function() {
		this.addEventListener("refreshChildrenView", function() {
		  if (this.children==0){
		    //Add the nochildren node that will be the container of the addnode button in case user is web admin
		    var element=this.addChild(new NodeMale());
		    element.myTp=document.getElementById("nochildrentp").content;
		    element.myContainer=this.childContainer;
		    element.refreshView();
		  }
		});
		//When admin add a new node it will be selected
		this.addEventListener("addNewNode", function(newnodeadded) {
		  newnodeadded.getMyDomNodes()[0].querySelector("a").click();
		});
		//When admin delete a node si estaba seleccionado seleccionamos otro y si era el último borramos lo de la parte central
		this.addEventListener("deleteNode", function(nodedeleted) {
		  if (nodedeleted.selected) {
		    if (this.children.length>0 && this.children[0].properties.id) {
		      this.children[0].getMyDomNodes()[0].querySelector("a").click();
		    }
		  }
		  if (this.children.length==1 && !this.children[0].properties.id) {
		    //remove subcategories flaps in case we just remove all categories
		    document.getElementById("centralcontent").innerHTML='';
		  }
		});
		//showing categories
		this.refreshChildrenView(thisElement,  document.querySelector("#categorytp"));
		//to refresh the nochildren element when log
		webuser.addEventListener("log", function(){
		  if (thisNode.children.length==1 && !thisNode.children[0].properties.id) {
		    thisNode.children=[];
		    thisNode.refreshChildrenView();
		  }
		});
	      });
	    </script>
	    <template id="categorytp">
	      <tr>
		<td class="row border-bottom">
		  <div class="adminlauncher adminsinglelauncher">
		    <a href=""></a>
		    <script>
		      thisElement.innerHTML=thisNode.properties.cname || labelsRoot.getNextChild({name: "not located"}).getNextChild({name: "emptyvallabel"}).properties.innerHTML;
		      if (thisNode.selected) setSelected.call(closesttagname.call(thisElement, "TR"));
		      thisElement.onclick=function(){
			thisNode.setActive();
			var myrel=thisNode.cloneRelationship();
			myrel.loadfromhttp({action:"load my children"}, function(){
			  this.refreshView(document.getElementById("centralcontent"),"includes/templates/catalog.php");
			});
			return false;
		      };
		    </script>
		    <div class="btrightadmn"></div>
		    <script>
		      if (webuser.isWebAdmin()) {
			var admnlauncher=new NodeMale();
			admnlauncher.myNode=thisNode;
			admnlauncher.buttons=[
			  {
			    template: document.getElementById("butedittp"),
			    args:{editpropertyname:"cname", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
			  },
			  {template: document.getElementById("butvchpostp")},
			  {template: document.getElementById("butaddnewnodetp"), args:{sort_order: thisNode.sort_order + 1}},
			  {template: document.getElementById("butdeletetp")}
			];
			admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
		      }
		      var listenerId=thisNode.parentNode.properties.childtablename + "-" + thisNode.properties.id;
		      webuser.addEventListener("log", function() {
			  if (!this.isWebAdmin()) {
			    thisElement.innerHTML='';
			  }
			  else {
			    thisNode.render(thisElement.nextElementSibling);
			  }
		      }, listenerId);
		      thisNode.addEventListener("deleteNode", function() {
			webuser.removeEventListener("log", listenerId);
		      });
		    </script>
		  </div>
		</td>
	      </tr>
	    </template>
	  </template>
	</tr>
	<tr>
	  <td class="rowborder">
	  </td>
	</tr>
      </table>
    </td>
  </tr>                                  
</table>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var cartbox=labelsRoot.getNextChild({"name":"middle"}).getNextChild({"name":"ctgbxtt"});
  cartbox.refreshView(document.querySelector("#catgboxheadtp").previousElementSibling, document.querySelector("#catgboxheadtp"));

  var categoriesrootmother=new NodeFemale();
  categoriesrootmother.properties.childtablename="TABLE_ITEMCATEGORIES";
  categoriesrootmother.properties.parenttablename="TABLE_ITEMCATEGORIES";
  categoriesrootmother.loadfromhttp({action:"load root"}, function(){
    var categoriesroot=this.children[0];
    var myrel=categoriesroot.cloneRelationship();
    myrel.refreshView(document.querySelector("#categoriestp").previousElementSibling,  document.querySelector("#categoriestp"));

  });
});
</script>