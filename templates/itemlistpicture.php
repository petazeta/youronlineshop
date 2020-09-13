<template>
  <div style="padding-top:10px; color:rgb(40,40,40);">
    <div class="productgrid">
      <div class="productimg">
        <img class="productimg">
        <script>
          var myImage=thisNode.properties.image || Config.defaultImg;
          thisElement.src="catalog/images/small/" + myImage;
          thisNode.addEventListener("changeProperty", function(property){
            if (property=="image") {
              thisElement.src="catalog/images/small/" + this.properties.image;
            }
          }, "img");
          
          var launcherImageEdit=new Node();
          launcherImageEdit.args={itemNode: thisNode, imageElement: thisElement, btposition: "bttopinsideleftinside"};
          launcherImageEdit.appendThis(thisElement.parentElement, "templates/addimageedit.php");
          
          //We add the zoom extend buton.
          thisNode.appendThis(thisElement.parentElement, "templates/butextend.php");
        </script>
      </div>
      <div class="textproduct">
        <div>
          <div data-note="relative position container for admn buttons" style="display: inline-block">
            <h3>
              <a data-button="true" href="" class="tit"></a>
              <script>
                thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "name");
                //adding the edition pencil
                var launcher = new Node();
                launcher.editable=thisNode.parentNode.editable;
                launcher.thisNode = thisNode.getRelationship("itemsdata").getChild();
                launcher.thisProperty = "name";
                launcher.editElement = thisElement;
                launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
                // some tasks regarding to history state
                let prevUrl='?category=' + thisNode.parentNode.partnerNode.parentNode.partnerNode.properties.id;
                prevUrl += '&subcategory=' + thisNode.parentNode.partnerNode.properties.id;
                const url= prevUrl + '&item=' + thisNode.properties.id;
                thisElement.setAttribute('href',url);
                thisElement.addEventListener("click",function(event){
                  event.preventDefault();
                  thisNode.refreshView(document.getElementById("centralcontent"),"templates/itempicturelarge.php");
                  if (event.isTrusted) {
                    //it doesn't record state when: go back (dont state twice the same url)
                    if (!(history.state && history.state.url==url)) history.pushState({url:url}, null, url);
                  }
                });
                //We click if the url is for this product
                if (window.location.search) {
                  var regex = new RegExp('item=(\\d+)');
                  if (window.location.search.match(regex)) var id = window.location.search.match(regex)[1];
                  if (id==thisNode.properties.id) {
                    var link=thisElement;
                    if (link) {
                      link.click();
                      return; //Finish here
                    }
                  }
                }
                
                //Now we click the item selected at the parameters send by the url
                if (window.location.search) {
                  var regex = /item=(\d+)/;
                  var itemIdMatch=window.location.search.match(regex);
                  if (itemIdMatch) {
                    if (itemIdMatch[1]==thisNode.properties.id) {
                      thisElement.click();
                    }
                  }
                }
                else {
                  //Now we click some menu at page start (if no url)
                  if (Config.startItemNum) { //When webadmin is logged we dont click because we have to wait for the login to be effect I think
                    var startItem=thisNode.parentNode.children[Config.startItemNum-1];
                    if (startItem==thisNode) {
                      thisElement.click();
                    }
                  }
                }
              </script>
            </h3>
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
    <div></div>
    <script>
      var admnlauncher=new Node();
      admnlauncher.thisNode=thisNode;
      admnlauncher.editElement = thisElement.previousElementSibling;
      admnlauncher.btposition="bttopinsideleftinside";
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
      admnlauncher.appendThis(thisElement, "templates/addadmnbuts.php");
    </script>
  </div>
</template>
