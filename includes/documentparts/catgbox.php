<table class="box" id="catgbox">
  <?php include("includes/templates/catalog.php"); ?>
  <tr>
    <th class="boxhead">
      <div class="adminsinglelauncher"></div>
      <template>
	<span></span>
	<script>
	  thisElement.textContent=thisNode.properties.innerHTML || labelsRoot.getNextChild({name: "not located"}).getNextChild({name: "emptyvallabel"}).properties.innerHTML;
	</script>
	<div class="btrightedit"></div>
	<script>
	  var addadminbutts=function(){
	    var launcher=new NodeMale();
	    launcher.editpropertyname="innerHTML";
	    launcher.editelement=thisElement.parentElement.firstElementChild;
	    launcher.myNode=thisNode;
	    launcher.myContainer=thisElement;
	    launcher.myTp=document.getElementById("butedittp").content;
	    launcher.refreshView();
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
	  <template>
	    <table style="width:100%"></table>
	    <script>
	      var myform=document.getElementById("formgeneric").cloneNode(true);
	      thisNode.setView(myform);
	      myform.elements.parameters.value=JSON.stringify({action:"load my children"});
	      thisNode.loadfromhttp(myform, function() {
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
		this.refreshChildrenView(thisElement,  document.querySelector("#categoriescontainer template").content);
	      });
	    </script>
	    <template>
	      <tr>
		<td class="row border-bottom">
		  <div class="adminlauncher adminsinglelauncher">
		    <a href=""></a>
		    <script>
		      thisElement.innerHTML=thisNode.properties.cname || labelsRoot.getNextChild({name: "not located"}).getNextChild({name: "emptyvallabel"}).properties.innerHTML;
		      if (thisNode.selected) setSelected.call(closesttagname.call(thisElement, "TR"));
		      thisElement.onclick=function(){
			thisNode.setActive();
			var myform=document.getElementById("formgeneric").cloneNode(true);
			thisNode.relationships[0]=new NodeFemale();
			thisNode.relationships[0].partnerNode=thisNode;
			thisNode.relationships[0].properties.cloneFromArray(thisNode.parentNode.properties);
			thisNode.relationships[0].setView(myform);
			myform.elements.parameters.value=JSON.stringify({action:"load my children"});
			thisNode.relationships[0].loadfromhttp(myform, function(){
			  thisNode.relationships[0].refreshView(document.getElementById("centralcontent"),document.querySelector("#catgbox template"));
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
			  {template: document.getElementById("butaddnodetp")},
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
			    thisNode.setView(thisElement.nextElementSibling);
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
webuser.addEventListener("loadses", function(){
  var cartbox=labelsRoot.getNextChild({"name":"middle"}).getNextChild({"name":"ctgbxtt"});
  cartbox.refreshView(document.querySelector("#catgbox div"), document.querySelector("#catgbox th template"));

  var categoriesrootmother=new NodeFemale();
  categoriesrootmother.properties.childtablename="<?php echo TABLE_CATEGORIES; ?>";
  categoriesrootmother.properties.parenttablename="<?php echo TABLE_CATEGORIES; ?>";
  var myform=document.getElementById("formgeneric").cloneNode(true);
  myform.elements.parameters.value=JSON.stringify({action:"load root"});
  categoriesrootmother.setView(myform);
  categoriesrootmother.loadfromhttp(myform, function(){
    var myform=document.getElementById("formgeneric").cloneNode(true);
    var categoriesroot=this.children[0];
    var myrel=categoriesroot.cloneRelationship();
    
    myrel.refreshView(document.querySelector("#categoriescontainer").rows[1].cells[0],  document.querySelector("#categoriescontainer template").content);

  });
});
</script>