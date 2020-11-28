<div class="productshortcontainer" style="padding-top:10px; color:rgb(40,40,40);">
  <div class="productgrid">
    <div class="productimg" style="position:relative;">
      <div data-id="butedit" class="bttopinsiderightinside"></div>
      <button type="button" class="btmiddlecenter" style="opacity: 0">
        <div class="zoomimage"></div>
        <script>
          if (window.getComputedStyle(thisElement).backgroundImage) {
            DomMethods.setSizeFromStyle(thisElement);
          }
        </script>
      </button>
      <script>
        var prevUrl='?category=' + thisNode.parentNode.partnerNode.parentNode.partnerNode.properties.id;
        prevUrl += '&subcategory=' + thisNode.parentNode.partnerNode.properties.id;
        const url= prevUrl + '&item=' + thisNode.properties.id;
        if (Config.itemExtend_On || webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement, parent: thisElement.parentElement})
        }
        thisElement.addEventListener("click",function(event){
          event.preventDefault();
          thisNode.refreshView(document.getElementById("centralcontent"),"templates/itempicturelarge.php");
          //it doesn't record state when: go back (dont state twice the same url)
          if (!(history.state && history.state.url==url)) history.pushState({url:url}, null, url);
        });
      </script>
      <img class="productimg">
      <script>
        var myImage=thisNode.properties.image || Config.defaultImg;
        thisElement.src="catalog/images/small/" + myImage;
        thisNode.addEventListener("changeProperty", function(property){
          if (property=="image") {
            thisElement.src="catalog/images/small/" + this.properties.image;
          }
        }, "img");
        if (webuser.isWebAdmin()) {
          //For some unknown reason the usual opacity onmouseover makes some not good view effect, we use visibility in this case
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement, method: 'visibility'});
          thisNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "image", thisAttribute: "data-src", autoeditFunc: DomMethods.imageEditFunc, imageElement: thisElement, myNode:thisNode, labelNode: domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "loadImg"})});
        }
      </script>
    </div>
   <div class="textproduct">
      <div class="itemname">
        <h3 style="position:relative; display:inline-block;">
          <div data-id="butedit" class="btmiddleright"></div>
          <a data-button="true" href="" class="tit"></a>
          <script>
            thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "name");
            //adding the edition pencil
            if (webuser.isWebAdmin()) {
              DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
              thisNode.getRelationship("itemsdata").getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "name"});
            }
            // some tasks regarding to history state
            let prevUrl='?category=' + thisNode.parentNode.partnerNode.parentNode.partnerNode.properties.id;
            prevUrl += '&subcategory=' + thisNode.parentNode.partnerNode.properties.id;
            const url= prevUrl + '&item=' + thisNode.properties.id;
            thisElement.setAttribute('href',url);
            thisElement.addEventListener("click",function(event){
              event.preventDefault();
              if (this.isContentEditable==true) {return false;} // The event should not be executed at contentiditable state
              document.getElementById("centralcontent").innerHTML=''; //This is a patch for a problem at reload page, it still keeps the itemproducts short
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
      <div class="itemdescription">
        <div style="display: inline-block; position:relative;">
          <div data-id="butedit" class="btmiddleright"></div>
          <div style="margin-bottom:1em;"></div>
          <script>
            thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "descriptionshort");
            //adding the edition pencil
            if (webuser.isWebAdmin()) {
              DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
              thisNode.getRelationship("itemsdata").getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "descriptionshort"});
            }
          </script>
        </div>
      </div>
    </div>
    <div class="addtocart">
      <form>
        <div class="addtocartgrid">
          <div class="productprice">
            <span style="position:relative;">
              <div data-id="butedit" class="btmiddleright"></div>
              <div style="padding-right: 0.2em"></div>
              <script>
                thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "price");
                //adding the edition pencil
                if (webuser.isWebAdmin()) {
                  DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
                  thisNode.getRelationship("itemsdata").getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "price"});
                }
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
          <div style="position:relative;">
            <div data-id="butedit" class="btmiddleright"></div>
            <button type="button" class="btn" data-id="but">
              <div class="cartplusimage"></div>
              <script>
                if (window.getComputedStyle(thisElement).backgroundImage) {
                  DomMethods.setSizeFromStyle(thisElement);
                }
              </script>
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
            </script>
            <input type="hidden" disabled>
            <script>
              var myNode=domelementsrootmother.getChild().getNextChild({"name":"labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"addcarttt"}).getRelationship("domelementsdata").getChild();
              myNode.writeProperty(thisElement);
              thisElement.onblur=function(){
                thisElement.type="hidden";
                thisElement.parentElement.querySelector('button[data-id=but]').title=thisElement.value;
              }
              //adding the edition pencil
              if (webuser.isWebAdmin()) {
                DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
                myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
              }
            </script>            
          </div>
        </div>
      </form>
    </div>
  </div>
  <div>
    <div data-id="admnbuts">
      <div class="admnbtsgrid"></div>
    </div>
  </div>
  <script>
    if (webuser.isWebAdmin()) {
      DomMethods.visibleOnMouseOver({element: thisElement.querySelector('[data-id=admnbuts]'), parent: thisElement.parentElement});
      thisNode.appendThis(thisElement.querySelector('.admnbtsgrid'), "templates/butchpos.php", {position: 'vertical'});
      thisNode.appendThis(thisElement.querySelector('.admnbtsgrid'), "templates/butdelete.php");
      thisNode.parentNode.getNewNode().then((newNode) => {
        //newNode.getRelationship({name: "itemsdata"}).addChild(new NodeMale());
        newNode.sort_order=thisNode.sort_order + 1;
        thisNode.parentNode.appendThis(thisElement.querySelector('.admnbtsgrid'), "templates/butaddnewnode.php", {newNode: newNode});
      });
    }
  </script>
</div>