<template>
  <template id="flaptp">
    <table class="flap" style="position:relative;" data-hbutton="true">
      <tr>
	<td class="tl"></td>
	<td class="t"></td>
	<td class="tr"></td>
      </tr>
      <tr>
	<td class="ml"></td>
	<td class="m">
	  <div style="display:inline-block; z-index: 2">
	    <a href="javascript:" data-button="true"></a>
	    <script>
	      var prevUrl='?category=' + thisNode.parentNode.partnerNode.properties.id;
	      var url= prevUrl + '&subcategory=' + thisNode.properties.id;
	      thisElement.href=url;
	      //function to show the openclosebutton
	      function showOpenButton() {
		var openlauncher=new Node();
		openlauncher.appendThis(thisElement.parentElement.querySelector("[data-id=containeropen]"), "templates/butopen.php", function(){
		  var openclosebutton=thisElement.parentElement.querySelector("[data-id=containeropen]").querySelector("[data-id=openclose]");
		  //The on mouse over facility
		  openclosebutton.style.opacity=0;
		  thisElement.addEventListener("mouseover", function(ev){
		    openclosebutton.style.opacity=1;
		  });
		  thisElement.addEventListener("mouseout", function(ev){
		    openclosebutton.style.opacity=0;
		  });
		  openclosebutton.addEventListener("mouseover", function(ev){
		    openclosebutton.style.opacity=1;
		  });
		  openclosebutton.addEventListener("mouseout", function(ev){
		    openclosebutton.style.opacity=0;
		  });
		});
	      }
	      thisNode.getRelationship("itemcategoriesdata").loadfromhttp({action: "load my children", language: webuser.extra.language.properties.id}, function(){
		this.getChild().writeProperty(thisElement);
		var launcher = new Node();
		launcher.thisNode = this.getChild();
		launcher.editElement = thisElement;
		launcher.btposition="btbottomcenter";
		launcher.visibility="hidden";
		launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
		var admnlauncher=new Node();
		admnlauncher.thisNode=thisNode;
		admnlauncher.editElement = thisElement;
		admnlauncher.visibility="hidden";
		admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
		admnlauncher.newNode.loadasc(thisNode, 2, "id"); //the parent is not the same
		admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
		admnlauncher.appendThis(thisElement.parentElement, "templates/addadmnbuts.php");
	      });
	      thisNode.addEventListener("deleteNode", function(nodedeleted){
		//Remove the productscontainer content
		if (this.parentNode.children.length==0) {
		  this.getRelationship("items").childContainer.innerHTML="";
		}
	      });
	      thisNode.getRelationship("items").addEventListener("refreshChildrenView", function() {
		var columns=Math.round((window.screen.width-524)/500);
		if (columns < 1) columns=1;
		this.childContainer.appendChild(DomMethods.intoColumns(getTpContent(document.getElementById('producttabletp')).querySelector('table').cloneNode(true), this.childContainer, columns));
	      }, "intoColumns");
	      thisElement.addEventListener("click", function(event) {
		event.preventDefault();
		DomMethods.setActive(thisNode);
		thisNode.getRelationship("items").loadfromhttp({action:"load my tree", language: webuser.extra.language.properties.id}, function(){
		  var newNode=new NodeMale(); //new Item
		  newNode.parentNode=new NodeFemale();
		  newNode.parentNode.load(thisNode.getRelationship("items"), 1, 0, "id");
		  //new node comes with datarelationship attached
		  var itemDataRel=new NodeFemale();
		  itemDataRel.properties.childtablename="TABLE_ITEMSDATA";
		  itemDataRel.properties.parenttablename="TABLE_ITEMS";
		  itemDataRel.loadfromhttp({action:"load this relationship"}, function() {
		    newNode.addRelationship(this);
		    newNode.getRelationship("itemsdata").addChild(new NodeMale());
		    thisNode.getRelationship("items").newNode=newNode;
		    thisNode.getRelationship("items").appendThis(document.getElementById('producttabletp').parentElement.querySelector("div.productscontainer"), "templates/admnlisteners.php");
		    thisNode.getRelationship("items").refreshChildrenView(document.getElementById('producttabletp').parentElement.querySelector("div.productscontainer"), document.querySelector("#producttp"));
		  });
		});
		//it doesn't record when go back or when it is the subcategory selected by default
		if (history.state && history.state.url==url || history.state && history.state.url==prevUrl && thisNode.parentNode.children[0]==thisNode) return; //we dont grab if it is selected by default after category clicking
		history.pushState({url:url}, null, url);
	      });
	      //we add the adit buttons show button
	      if (webuser.isWebAdmin()) {
		showOpenButton();
	      }
	    </script>
	    <div class="btmiddleright" data-id="containeropen"></div>
	  </div>
	</td>
	<td class="mr"></td>
      </tr>
    </table>
  </template>
  <table class="catalog">
    <tr>
      <td>
	<div class="flapscontainer"></div>
	<script>
	  thisNode.refreshChildrenView(thisElement, document.querySelector("#flaptp"), function(){
	    if (window.location.search) {
	      regex = /subcategory=(\d+)/;
	      if (window.location.search.match(regex)) var id = window.location.search.match(regex)[1];
	      if (id) {
		var link=document.querySelector("a[href='?subcategory=" + id + "']");
		if (link) {
		  link.click();
		  return;
		}
	      }
	    }
	    if (this.children.length > 0) {
	      var button=null;
	      this.getChild().getMyDomNodes().every(function(domNode){
		button=domNode.querySelector("[data-button]");
		if (button) return false;
	      });
	      if (button) button.click();
	    }
	  });
	</script>
	<div class="productscontainer"></div>
	<template id="producttabletp">
	  <table class="product">
	    <tr>
	      <td class="product" style="position:relative"></td>
	    </tr>
	  </table>
	</template>
	<template id="producttp">
	  <div style="width:100%;">
	    <table style="width:100%">
	      <tr>
		<td class="productimg">
		  <div style="display:table">
		    <img class="productimg">
		    <script>
		      thisNode.writeProperty(thisElement, "image", "src", Config.defaultImg)
		      thisElement.src="catalog/images/small/" + thisElement.getAttribute("src");
		      //adding the edition pencil
		      thisNode.addEventListener("changeProperty", function(property){
			if (property=="image") {
			  thisElement.src="catalog/images/small/" + this.properties.image;
			  thisElement.src += "?" + new Date().getTime(); //we force the browser tu update picture
			}
		      }, "img");
		      var launcher = new Node();
		      launcher.btposition="bttopinsideleftinside";
		      launcher.thisNode = thisNode;
		      launcher.editElement = thisElement;
		      launcher.thisProperty="image";
		      launcher.thisAttribute="src";
		      var autoeditFunc=function(){
			var autolauncher=new Node();
			autolauncher.fileName="file_" + thisNode.properties.id;
			autolauncher.appendThis(thisElement.parentElement, "templates/loadimg.php");
			autolauncher.addEventListener("loadImage",function(){
			  if (this.extra && this.extra.error==true) {
			    var loadError=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loadImgError"});
			    var loadErrorMsg=loadError.getRelationship("domelementsdata").getChild().properties.value;
			    alert(loadErrorMsg);
			  }
			  else {
			    thisElement[launcher.thisAttribute]=this.fileName + ".png";
			    thisNode.dispatchEvent("finishAutoEdit");
			  }
			});
		      };
		      launcher.autoeditFunc=autoeditFunc;
		      launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
		    </script>
		  </div>
		</td>
		<td style="width:100%">
		  <table class="textproduct">
		    <tr>
		      <td>
			<div style="display:table">
			  <h3 style="display:inline-block"></h3>
			  <script>
			    thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "name");
			    //adding the edition pencil
			    var launcher = new Node();
			    launcher.thisNode = thisNode.getRelationship("itemsdata").getChild();
			    launcher.thisProperty = "name";
			    launcher.editElement = thisElement;
			    launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
			  </script>
			</div>
			<div style="display:table">
			  <div style="margin-bottom:1em;display:inside-block;"></div>
			  <script>
			    thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "descriptionshort");
			    //adding the edition pencil
			    var launcher = new Node();
			    launcher.thisNode = thisNode.getRelationship("itemsdata").getChild();
			    launcher.thisProperty = "descriptionshort";
			    launcher.editElement = thisElement;
			    launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
			  </script>
			</span>
		      </td>
		    </tr>
		    <tr>
		      <td>
			<table class="addtocart">
			  <tr>
			    <td>
			      <div style="display:table">
				<span data-note="relative position container for admn buttons">
				  <span></span>
				  <script>
				    thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "price");
				    //adding the edition pencil
				    var launcher = new Node();
				    launcher.thisNode = thisNode.getRelationship("itemsdata").getChild();
				    launcher.thisProperty = "price";
				    launcher.editElement = thisElement;
				    launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
				  </script>
				</span>
				  <span></span>
				  <script>
				    var currency=domelementsrootmother.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"currency"}).getRelationship({name: "domelementsdata"}).getChild();
				    currency.writeProperty(thisElement);
				  </script>
			      </div>
			    </td>
			    <td>
			      <div style="padding-left:1em;">
				<button class="btn">
				  <img src="css/images/cart.png"/>
				</button>
				<script>
				  var myTitle=domelementsrootmother.getChild().getNextChild({"name":"labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"addcarttt"}).getRelationship("domelementsdata").getChild();
				  myTitle.writeProperty(thisElement,null,"title");
				  thisElement.addEventListener("click",function(event){
				    mycart.additem(thisNode.getRelationship("itemsdata").getChild());
				  });
				  //adding the edition pencil
				  var launcher = new Node();
				  launcher.thisNode = myTitle;
				  launcher.createInput = true;
				  launcher.editElement = thisElement;
				  launcher.thisAttribute = "title";
				  launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
				</script>
			      </div>
			    </td>
			  </tr>
			</table>
		      </td>
		    </tr>
		  </table>
		</td>
	      </tr>
	    </table>
	    <script>
	      var admnlauncher=new Node();
	      admnlauncher.thisNode=thisNode;
	      admnlauncher.editElement = thisElement;
	      admnlauncher.btposition="btbottominsiderightinside";
	      admnlauncher.elementsListPos="vertical";
	      //We create a schematic node to add also a domelementsdata child node to the database
	      admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
	      admnlauncher.newNode.loadasc(thisNode, 2, "id")
	      admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
	      admnlauncher.appendThis(thisElement.parentElement, "templates/addadmnbuts.php");
	    </script>
	  </div>
	</template>
      </td>
    </tr>
  </table>
</template>