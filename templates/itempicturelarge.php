<div class="productlargecontainer rmbox" style="color:rgb(40,40,40);">
  <div class="bttopinsiderightinside">
    <button type="button" class="closeimage minibtn transp" style="width: 15px; height: 15px;"></button>
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
    <div class="productimg" style="position:relative;">
      <div data-id="butedit" class="btmiddlecenter"></div>
      <img class="productimg">
      <script>
        var myImage=thisNode.properties.image || Config.defaultImg;
        thisElement.src="catalog/images/big/" + myImage;
        
        thisNode.addEventListener("changeProperty", function(property){
          if (property=="image") {
            thisElement.src="catalog/images/big/" + this.properties.image;
          }
        }, "img");
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          thisNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "image", thisAttribute: "data-src", autoeditFunc: DomMethods.imageEditFunc, imageElement: thisElement, myNode:thisNode, labelNode: domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "loadImg"})});
        }
      </script>
    </div>
    <div>
     <div class="textproduct">
        <div class="itemname">
          <div style="display: inline-block; position:relative;">
            <div data-id="butedit" class="btmiddleright"></div>
            <h3></h3>
            <script>
              thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "name");
              //adding the edition pencil
              if (webuser.isWebAdmin()) {
                DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
                thisNode.getRelationship("itemsdata").getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "name"});
              }
            </script>
          </div>
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
      <div style="display:flex;">
        <div class="addtocart" style="margin:auto;">
          <form>
            <div class="addtocartgrid">
              <div class="productprice">
                <span style="position: relative;">
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
                <button type="button" class="btn">
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div style="display: inline-block; position:relative;">
    
    <div class="btmiddleright" style="display:flex;">
      <div data-id="butedit" data-but-name="norm"></div>
      <div data-id="butedit" data-but-name="code"></div>
    </div>
    
    <div data-id='descriptionlarge' style="padding-top: 1em"></div>
    <script>
      thisNode.getRelationship("itemsdata").getChild().writeProperty(thisElement, "descriptionlarge");
      //adding the edition pencil
      if (webuser.isWebAdmin()) {
        DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit][data-but-name=norm]'), parent: thisElement.parentElement});
        thisNode.getRelationship("itemsdata").getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit][data-but-name=norm]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "descriptionlarge", inlineEdition: false, thisAttribute: 'innerHTML'});
        DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit][data-but-name=code]'), parent: thisElement.parentElement});
        thisElement.onblur=function(){
          thisElement.parentElement.querySelector('textarea').value=thisElement.innerHTML;
        }
      }
    </script>
    <textarea style="display:none;" rows="6" cols="80" disabled></textarea>
    <script>
      var myNode=thisNode.getRelationship("itemsdata").getChild();
      myNode.writeProperty(thisElement, "descriptionlarge");
      thisElement.onblur=function(){
        thisElement.parentElement.querySelector('div[data-id=descriptionlarge]').innerHTML=thisElement.value;
        thisElement.style.display="none";
      }
      //adding the edition pencil
      if (webuser.isWebAdmin()) {
        myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit][data-but-name=code]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "descriptionlarge", image: 'code', inlineEdition: false})
        .then(()=>{
          thisElement.parentElement.querySelector('[data-id=butedit][data-but-name=code]').querySelector('button[data-id=codebut]').addEventListener('click', ()=>{
            thisElement.style.display="unset";
            thisElement.focus();
          });
        });
      }
    </script>
  </div>
</div>