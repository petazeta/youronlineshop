<template id="catalogtp">
  <table class="catalog">
    <tr>
      <td>
	<div class="flapscontainer">
	  <div style="display:inline;"></div>
	  <script>
	    thisNode.addEventListener("refreshChildrenView", function() {
	      if (this.children==0){
		var element=this.addChild(new NodeMale());
		element.myTp=document.getElementById("nochildrentp").content;
		element.myContainer=this.childContainer;
		element.refreshView();
	      }
	    });
	    thisNode.addEventListener("addNewNode", function(newnodeadded) {
	      newnodeadded.getMyDomNodes()[0].querySelector("a").click();
	    });
	    //When admin delete a node si estaba seleccionado seleccionamos otro y si era el último borramos lo de la parte central
	    thisNode.addEventListener("deleteNode", function(nodedeleted) {
	      if (nodedeleted.selected) {
		if (this.children.length>0 && this.children[0].properties.id) {
		  this.children[0].getMyDomNodes()[0].querySelector("a").click();
		}
	      }
	      if (this.children.length==1 && !this.children[0].properties.id) {
		//remove products in case we just remove all subcategories flaps
		var itemContainer=closesttagname.call(thisElement, 'TD').querySelector('div.productscontainer');
		itemContainer.innerHTML="";
	      }
	    });
	    //showing flaps (after the listeners to refreshChildrenView are added) after refreshing first time we choose the first tab
	    thisNode.refreshChildrenView(thisElement, thisElement.parentElement.querySelector("template"), function(){
	      if (this.children.length>0) this.children[0].getMyDomNodes()[0].querySelector("a").click();
	    });
	  </script>
	  <template id="flaptp">
	    <table class="flap" style="position:relative;">
	      <tr>
		<td class="tl"></td>
		<td class="t"></td>
		<td class="tr"></td>
	      </tr>
	      <tr>
		<td class="ml"></td>
		<td class="m">
		  <div class="adminlauncher adminsinglelauncher">
		    <a href=""></a>
		    <script>
		      thisElement.textContent=thisNode.properties.name || emptyValueText;
		      thisElement.onclick=function() {
			thisNode.setActive();
			thisNode.loadfromhttp({action:"load my tree"}, function(){
			  var items=thisNode.getRelationship({name:"items"});
			  //lets search for the table that will contain the products
			  items.addEventListener("refreshChildrenView", function() {
			    if (this.children==0){
			      var element=this.addChild(new NodeMale());
			      element.refreshView(this.childContainer, document.getElementById("nochildrentp"));
			    }
			    var columns=Math.round((window.screen.width-524)/500);
			    if (columns < 1) columns=1;
			    this.childContainer.appendChild(intoColumns(document.getElementById('producttabletp').content.querySelector('table').cloneNode(true), this.childContainer, columns));
			  
			  });
			  items.refreshChildrenView(document.getElementById('producttabletp').parentElement.querySelector("div.productscontainer"), document.getElementById('producttp'));
			});
			return false;
		      };
		    </script>
		    <div class="bttopadmn"></div>
		    <div class="btrightnarrow"></div>
		    <script>
		      if (webuser.isWebAdmin()) {
			var admnlauncher=new NodeMale();
			admnlauncher.myNode=thisNode;
			admnlauncher.buttons=[
			  { 
			    template: document.getElementById("butedittp"),
			    args:{editpropertyname:"cname", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
			  },
			  {template: document.getElementById("buthchpostp")},
			  {template: document.getElementById("butaddnewnodetp"), args:{sort_order: thisNode.sort_order + 1}},
			  {template: document.getElementById("butdeletetp")}
			];
			admnlauncher.refreshView(thisElement, document.getElementById("butopentp"));
		      }
		    </script>
		  </div>
		</td>
		<td class="mr"></td>
	      </tr>
	    </table>
	  </template>
	</div>
	<div class="productscontainer"></div>
	<template id="producttabletp">
	  <table class="product">
	    <tr>
	      <td class="product" style="position:relative"></td>
	    </tr>
	  </table>
	</template>
	<template id="producttp">
	  <div class="adminlauncher" style="width:100%;">
	    <div style="
	    position: absolute;
	    right: 0px;
	    bottom:0px;
	    ">
	    </div>
	    <script>
	      if (webuser.isWebAdmin()) {
		var admnlauncher=new NodeMale();
		admnlauncher.myNode=thisNode;
		admnlauncher.buttons=[
		  {template: document.getElementById("butvchpostp")},
		  {template: document.getElementById("butaddnewnodetp"), args:{sort_order: thisNode.sort_order + 1}},
		  {template: document.getElementById("butdeletetp")}
		];
		admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
	      }
	    </script>
	    <table style="width:100%;position:relative;">
	      <tr>
		<td class="productimg">
		  <div class="adminlauncher adminsinglelauncher">
		    <img class="productimg">
		    <script>
		    var img=thisNode.properties.image || "noimg.png";
		    thisElement.src="catalog/images/small/" + img;
		    </script>
		    <div class="btinside"></div>
		    <script>
		      if (webuser.isWebAdmin()) {
			var launcher=new NodeMale();
			launcher.editpropertyname="name";
			launcher.editelement=thisElement.parentElement.firstElementChild;
			launcher.myNode=thisNode;
			launcher.myContainer=thisElement;
			launcher.myTp="includes/templates/buteditimg.php";
			launcher.refreshView(thisElement, "includes/templates/buteditimg.php");
		      }
		    </script>
		  </div>
		</td>
		<td style="width:100%">
		  <table class="textproduct">
		    <tr>
		      <td>
			<div class="adminlauncher adminsinglelauncher">
			  <h3></h3>
			  <script>
			    thisElement.textContent=thisNode.properties.name || emptyValueText;
			  </script>
			  <div class="btrightedit">
			  </div>
			  <script>
			    if (webuser.isWebAdmin()) {
			      var admnlauncher=new NodeMale();
			      admnlauncher.myNode=thisNode;
			      admnlauncher.buttons=[{
				template: document.getElementById("butedittp"),
				args: {editpropertyname:"name", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
			      }];
			      admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
			    }
			  </script>
			</div>
			<div>
			  <div class="adminlauncher adminsinglelauncher">
			    <div style="margin-bottom:1em;"></div>
			    <script>
			      thisElement.innerHTML=thisNode.properties.descriptionshort || emptyValueText;
			    </script>
			    <div class="btrightedit">
			    </div>
			    <script>
			      if (webuser.isWebAdmin()) {
				var admnlauncher=new NodeMale();
				admnlauncher.myNode=thisNode;
				admnlauncher.buttons=[{
				  template: document.getElementById("butedittp"),
				  args: {editpropertyname:"descriptionshort", allowedHTML:true, editelement:thisElement.parentElement.firstElementChild}
				}];
				admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
			      }
			    </script>
			  </div>
			</div>
		      </td>
		    </tr>
		    <tr>
		      <td>
			<table class="addtocart">
			  <tr>
			    <td style="position:relative;">
			      <div class="adminlauncher adminsinglelauncher">
				<div style="padding-right:1em;">
				  <span data-js='
				      thisElement.textContent=thisNode.properties.price || emptyValueText;
				    '>
				  </span>
				  <span> &euro;</span>
				    <div class="btrightedit">
				  </div>
				  <script>
				    if (webuser.isWebAdmin()) {
				      var admnlauncher=new NodeMale();
				      admnlauncher.myNode=thisNode;
				      admnlauncher.buttons=[{
					template: document.getElementById("butedittp"),
					args: {editpropertyname:"price", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
				      }];
				      admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
				    }
				  </script>
				</div>
			      </div>
			    </td>
			    <td>
			      <a href="" title="" class="btn">
				<img src="includes/css/images/cart.png"/>
			      </a>
			      <script>
				thisElement.title=labelsRoot.getNextChild({"name":"middle"}).getNextChild({"name":"addcarttt"}).properties.innerHTML;
				thisElement.onclick=function(){
				  mycart.additem(thisNode);
				  return false;
				}
			      </script>
			    </td>
			  </tr>
			</table>
		      </td>
		    </tr>
		  </table>
		</td>
	      </tr>
	    </table>
	  </div>
	</template>
      </td>
    </tr>
  </table>
</template>