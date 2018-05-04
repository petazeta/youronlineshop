<div></div>
<template>
  <table class="box" id="cartbox">
    <tr>
      <th class="boxhead">
        <div class="adminsinglelauncher">
          <a href=""></a>
          <script>
            thisElement.textContent=thisNode.getRelationship({name: "websections_domelements"}).getChild({name: "crtbxtt"}).properties.innerHTML || websectionsroot.getRelationship({name: "websections_domelements"}).getChild({name: "emptyvallabel"}).properties.innerHTML;
            thisElement.onclick=function(){  
	      mycart.tocheckout();
              return false;
            }
          </script>
          <div class="btrightedit"></div>
          <script>
	    var addadminbutts=function(){
	      var launcher=new NodeMale();
	      launcher.editpropertyname="innerHTML";
	      launcher.editelement=thisElement.parentElement.firstElementChild;
	      launcher.myNode=thisNode.getRelationship({name: "websections_domelements"}).getChild({name: "crtbxtt"});
	      launcher.myContainer=thisElement;
	      launcher.myTp=document.getElementById("butedittp").content;
	      launcher.refreshView();   
	    }
	    if (webuser.isWebAdmin()) {
	      addadminbutts();
	    }
	    webuser.addEventListener("log", function() {
	      if (!webuser.isWebAdmin()) {
		thisElement.innerHTML='';
	      }
	      else {
		addadminbutts();
	      }
	    });
          </script>
        </div>
       </th>
    </tr>
    <tr>
      <td class="content">
        <table class="boxInside">
          <tr>
             <td class="rowborder border-bottom">
             </td>
          </tr>
          <tr>
            <td>
	      <template id="itemlisttp">
		<tr class="product">
		  <td class="row border-bottom">
		    <a href=""></a>
		    <script>
		      thisElement.innerHTML=thisNode.properties.quantity;
		      thisElement.onclick=function(){
			mycart.additem(thisNode,-thisNode.properties.quantity);
			mycart.refreshcartbox();
			return false;
		      };
		      thisElement.onmouseover=function(){
			this.innerHTML="X";
		      };
		      thisElement.onmouseout=function(){
			this.innerHTML=thisNode.properties.quantity;
		      };
		    </script>
		    <a title="+ Info" href="#" data-js='
		      thisElement.innerHTML=thisNode.properties.name;
		    '></a>
		    <span data-js='
		      thisElement.innerHTML=thisNode.properties.price;
		    '></span>
		    <span> €</span>
		  </td>
		</tr>
	      </template>
              <table style="width:100%"></table>
              <script>
                var cartboxitems=mycart.getRelationship({name:"cartbox"}).children[0].getRelationship({name:"cartboxitem"});
                cartboxitems.refreshChildrenView(thisElement, thisElement.parentElement.querySelector("template"));
              </script>
            </td>
          </tr>
          <tr>
             <td class="rowborder">
             </td>
          </tr>
          <tr>
             <td style="text-align:center;">
		<div class="adminsinglelauncher" style="text-align:center;">
		<a href="" class="btn"></a>
		<script>
		  var checkoutnode=thisNode.getRelationship({name: "websections_domelements"}).getChild({"name":"ckouttt"});
		  thisElement.textContent=checkoutnode.properties.innerHTML || websectionsroot.getRelationship({name: "websections_domelements"}).getChild({name: "emptyvallabel"}).properties.innerHTML;
		  thisElement.onclick=function(){  
		    mycart.tocheckout();
		    return false;
		  }
		</script>
		<div class="btrightedit"></div>
		<script>
		  var addadminbutts=function(){
		    var launcher=new NodeMale();
		    launcher.editpropertyname="innerHTML";
		    launcher.editelement=thisElement.parentElement.firstElementChild;
		    launcher.myNode=thisNode.getRelationship({name: "websections_domelements"}).getChild({name: "ckouttt"});
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
	      </div>
	    </td>
          </tr>
          <tr>
	    <td class="rowborder">
	    </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>
<script>
var mycart=new cart();
webuser.addEventListener("loadses", function(){
  var cartbox=websectionsroot.getRelationship({"name":"websections"}).getChild({"name":"middle"}).getRelationship({"name":"websections"}).getChild({"name":"cartbox"});
  cartbox.refreshView(document.querySelector("#cartcontainer > div"), document.querySelector("#cartcontainer > template").content);
});
</script>