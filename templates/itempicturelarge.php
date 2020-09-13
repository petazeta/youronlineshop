<template>
  <div class="productlargecontainer rmbox" style="color:rgb(40,40,40);">
    <div class="bttopinsiderightinside">
      <button class="minibtn transp" style="font-size:2em; font-weight: bold">&times;</button>
      <script>
        thisElement.addEventListener("click", function(event){
          //event.preventDefault();
          //Go to subcategory
          var url='?category=' + thisNode.parentNode.partnerNode.parentNode.partnerNode.properties.id + '&subcategory=' + thisNode.parentNode.partnerNode.properties.id;
          var link=document.querySelector("a[href='" + url + "']");
          if (link) {
            if (event.isTrusted) {
              //it doesn't record state when: go back (dont state twice the same url)
              if (!(history.state && history.state.url==url)) history.pushState({url:url}, null, url);
            }
            link.click();
          }
        });
      </script>
    </div>
    <div class="productgrid">
      <div class="productimg">
        <img class="productimg">
        <script>
          var myImage=thisNode.properties.image || Config.defaultImg;
          thisElement.src="catalog/images/big/" + myImage;
          
          thisNode.addEventListener("changeProperty", function(property){
            if (property=="image") {
              thisElement.src="catalog/images/big/" + this.properties.image;
            }
          }, "img");
          
          var launcherImageEdit=new Node();
          launcherImageEdit.args={itemNode: thisNode, imageElement: thisElement, btposition: "btmiddlecenter"};
          launcherImageEdit.appendThis(thisElement.parentElement, "templates/addimageedit.php");
        </script>
      </div>
      <div>
       <div class="textproduct">
          <div>
            <div data-note="relative position container for admn buttons" style="display: inline-block">
              <h3></h3>
              <script>
                thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "name");
                //adding the edition pencil
                var launcher = new Node();
                launcher.editable=thisNode.parentNode.editable;
                launcher.thisNode = thisNode.getRelationship("itemsdata").getChild();
                launcher.thisProperty = "name";
                launcher.editElement = thisElement;
                launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
              </script>
            </div>
          </div>
          <div>
            <div data-note="relative position container for admn buttons" style="display: inline-block">
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
        </div>
        <div style="display:flex;">
          <div class="addtocart" style="margin:auto;">
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
      </div>
    </div>
    <div data-note="relative position container for admn buttons" style="display: inline-block">
      <div style="padding-top: 1em"></div>
      <script>
        thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "descriptionlarge");
        //adding the edition pencil
        var launcher = new Node();
        launcher.editable=thisNode.parentNode.editable;
        launcher.thisNode = thisNode.getRelationship("itemsdata").getChild();
        launcher.thisProperty = "descriptionlarge";
        launcher.editElement = thisElement;
        launcher.inlineEdition=false;
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
      </script>
    </div>
  </div>
</template>
