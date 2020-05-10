<template id="producttp">
  <div style="padding-top:10px; color:rgb(40,40,40);">
    <div class="productgrid">
      <div class="productimg">
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
            launcher.editable=thisNode.parentNode.editable;
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
      <div class="textproduct">
        <div data-note="relative position container for admn buttons">
          <h3></h3>
          <script>
            thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "name");
            //adding the edition pencil
            var launcher = new Node();
            launcher.editable=thisNode.parentNode.editable;
            if (webuser.isProductSeller()) {
              //we check if the product belongs to the user
              launcher.editable=true;
            }
            launcher.thisNode = thisNode.getRelationship("itemsdata").getChild();
            launcher.thisProperty = "name";
            launcher.editElement = thisElement;
            launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
          </script>
        </div>
        <div data-note="relative position container for admn buttons">
          <div style="margin-bottom:1em;"></div>
          <script>
            thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "descriptionshort");
            //adding the edition pencil
            var launcher = new Node();
            launcher.editable=thisNode.parentNode.editable;
            launcher.thisNode = thisNode.getRelationship("itemsdata").getChild();
            launcher.thisProperty = "descriptionshort";
            launcher.editElement = thisElement;
            launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
          </script>
        </div>
      </div>
      <div class="addtocart">
        <form>
          <div class="addtocartgrid">
            <div class="productprice">
              <span data-note="relative position container for admn buttons">
                <div style="padding-right: 0.2em"></div>
                <script>
                  thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "price");
                  //adding the edition pencil
                  var launcher = new Node();
                  launcher.editable=thisNode.parentNode.editable;
                  launcher.thisNode = thisNode.getRelationship("itemsdata").getChild();
                  launcher.thisProperty = "price";
                  launcher.editElement = thisElement;
                  launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
                </script>
              </span>
              <div></div>
              <script>
                var currency=domelementsrootmother.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"currency"}).getRelationship({name: "domelementsdata"}).getChild();
                currency.writeProperty(thisElement);
              </script>
            </div>
            <div class="quantityselect"></div>
            <script>
              var myselect=createQuantitySelect();
              myselect.style.color="#666";
              myselect.name="pquantity";
              thisElement.appendChild(myselect);
            </script>
            <div>
              <button class="btn">
                <img src="css/images/cart.png"/>
              </button>
              <script>
                var myTitle=domelementsrootmother.getChild().getNextChild({"name":"labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"addcarttt"}).getRelationship("domelementsdata").getChild();
                myTitle.writeProperty(thisElement,null,"title");
                thisElement.addEventListener("click",function(event){
                  event.preventDefault();
                  var quantity=1;
                  if (thisElement.form.elements["pquantity"]) quantity=thisElement.form.elements["pquantity"].value;
                  mycart.additem(thisNode.getRelationship("itemsdata").getChild(), quantity);
                  return false;
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
          </div>
        </form>
      </div>
    </div>
    <script>
      var admnlauncher=new Node();
      admnlauncher.thisNode=thisNode;
      admnlauncher.editElement = thisElement;
      admnlauncher.btposition="btrel";
      admnlauncher.elementsListPos="vertical";
      //We create a schematic node to add also a domelementsdata child node to the database
      admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
      admnlauncher.newNode.loadasc(thisNode, 2, "id")
      admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
      if (webuser.isProductAdmin()) {
        admnlauncher.editable=true;
      }
      if (webuser.isProductSeller()) {
        admnlauncher.editable=true;
      }
      admnlauncher.appendThis(thisElement.parentElement, "templates/addadmnbuts.php");
    </script>
  </div>
</template>
