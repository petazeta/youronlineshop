<template id="catalogtp">
  <table class="catalog">
    <tr>
      <td>
	<div class="flapscontainer">
	  <div style="display:inline;"></div>
	  <script>
	    thisNode.addEventListener("refreshChildrenView", function() {
	      if (this.children==0){
		var noChildrenLauncher=new NodeMale();
		noChildrenLauncher.args={dataRelationship: this.partnerNode.getRelationship({name: "itemcategoriesdata"})};
		noChildrenLauncher.myNode=this;
		noChildrenLauncher.refreshView(this.childContainer, document.getElementById("nochildrentp"));
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
	      if (this.children.length==0) {
		//remove products in case we just remove all subcategories flaps
		var itemContainer=closesttagname.call(thisElement, 'TD').querySelector("div.productscontainer");
		itemContainer.innerHTML="";
	      }
	    });
	    //showing flaps (after the listeners to refreshChildrenView are added) after refreshing first time we choose the first tab
	    thisNode.refreshChildrenView(thisElement, document.querySelector("#flaptp"), function(){
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
		      thisNode.getRelationship("itemcategoriesdata").loadfromhttp({action: "load my children", language: webuser.extra.language}, function(){
			thisElement.textContent=this.getChild().properties.name || emptyValueText;
		      });
		      thisNode.getRelationship("items").addEventListener("refreshChildrenView", function() {
			if (this.children==0){
			  //There is no rel like this present
			  var noChild=new NodeMale();
			  noChild.parentNode=this;
			  noChild.loadfromhttp({action: "load my relationships"}, function(){
			    var noChildrenLauncher=new NodeMale();
			    noChildrenLauncher.args={dataRelationship: this.getRelationship()};
			    noChildrenLauncher.myNode=this.parentNode;
			    noChildrenLauncher.refreshView(this.parentNode.childContainer, document.getElementById("nochildrentp"));
			  });
			}
			var columns=Math.round((window.screen.width-524)/500);
			if (columns < 1) columns=1;
			this.childContainer.appendChild(intoColumns(document.getElementById('producttabletp').content.querySelector('table').cloneNode(true), this.childContainer, columns));
		      });
		      thisElement.addEventListener("click", function(event) {
			event.preventDefault();
			thisNode.setActive();
			thisNode.getRelationship("items").loadfromhttp({action:"load my tree", language: webuser.extra.language}, function(){

			  this.refreshChildrenView(document.getElementById('producttabletp').parentElement.querySelector("div.productscontainer"), document.getElementById('producttp'));
			});
			return false;
		      });
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
			    args:{editpropertyname:"name", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild, dataRelationship: thisNode.getRelationship({name: "itemcategoriesdata"})}
			  },
			  {template: document.getElementById("buthchpostp")},
			  {
			    template: document.getElementById("butaddnewnodetp"),
			    args:{sort_order: thisNode.sort_order + 1, dataRelationship: thisNode.getRelationship({name: "itemcategoriesdata"})}
			  },
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
		  {
		    template: document.getElementById("butaddnewnodetp"),
		    args:{sort_order: thisNode.sort_order + 1, dataRelationship: thisNode.getRelationship({name: "itemsdata"})}
		  },
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
		    var img=thisNode.getRelationship("itemsdata").getChild().properties.image || "noimg.png";
		    thisElement.src="catalog/images/small/" + img;
		    </script>
		    <div class="btinside"></div>
		    <script>
		      if (webuser.isWebAdmin()) {
			var launcher=new NodeMale();
			launcher.editpropertyname="name";
			launcher.editelement=thisElement.parentElement.firstElementChild;
			launcher.myNode=thisNode.getRelationship("itemsdata").getChild();
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
			    thisElement.textContent=thisNode.getRelationship("itemsdata").getChild().properties.name || emptyValueText;
			  </script>
			  <div class="btrightedit">
			  </div>
			  <script>
			    if (webuser.isWebAdmin()) {
			      var admnlauncher=new NodeMale();
			      admnlauncher.myNode=thisNode.getRelationship("itemsdata").getChild();
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
			      thisElement.innerHTML=thisNode.getRelationship("itemsdata").getChild().properties.descriptionshort || emptyValueText;
			    </script>
			    <div class="btrightedit">
			    </div>
			    <script>
			      if (webuser.isWebAdmin()) {
				var admnlauncher=new NodeMale();
				admnlauncher.myNode=thisNode.getRelationship("itemsdata").getChild();
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
				  <span></span>
				  <script>
				    thisElement.textContent=thisNode.getRelationship("itemsdata").getChild().properties.price || emptyValueText;
				  </script>
				  <span> &euro;</span>
				    <div class="btrightedit">
				  </div>
				  <script>
				    if (webuser.isWebAdmin()) {
				      var admnlauncher=new NodeMale();
				      admnlauncher.myNode=thisNode.getRelationship("itemsdata").getChild();
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
				thisElement.title=domelementsrootmother.getChild().getNextChild({"name":"labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"addcarttt"}).getRelationship("domelementsdata").getChild().properties.value;
				thisElement.addEventListener("click",function(event){
				  event.preventDefault();
				  mycart.additem(thisNode.getRelationship("itemsdata").getChild());
				  return false;
				});
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