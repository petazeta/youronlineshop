<!--
-->
<div class="centerelements">
  <template>
    <div class="msgbox" style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <span></span>
      <script>
        var title=thisNode.getNextChild({"name":"chkt1add"}).getRelationship({name:"domelementsdata"}).getChild();
        title.writeProperty(thisElement);
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
        }
      </script>
    </div>
    <div></div>
    <script>
      //First we must create a clone of mycart to not modify mycart.
      var ordercart=mycart.cloneNode();
      var cartboxitems=ordercart.getRelationship({name:"cartbox"}).children[0];
      cartboxitems.refreshView(thisElement, "templates/ordercart.php");
    </script>
    <div class="dashbuttons">
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="button" class="btn" data-id="but"></button>
        <script>
          var buttonLabel=thisNode.getNextChild({"name":"chkt1next"}).getRelationship({name:"domelementsdata"}).getChild();
          buttonLabel.writeProperty(thisElement);
          //First we create a clone of mycart to not include modifications made at mycart.
          var ordercart=mycart.cloneNode();
          
          thisElement.onclick=function(){
            var insertuser=webuser.cloneNode();
            //Now we start to load rels so webuser clon: insertuser will be empty of any data
            insertuser.loadfromhttp({action: "load my relationships"}).then(function(myNode){
              myNode.properties.id=webuser.properties.id;
              myNode.getRelationship({name:"orders"}).addChild(new NodeMale());
              myNode.getRelationship({name:"orders"}).getChild().loadfromhttp({action: "load my relationships"}).then(function(myNode){
                var myordercartitems=ordercart.getRelationship({name:"cartbox"}).getChild().getRelationship({name:"cartboxitem"}).children;
                for (var i=0; i<myordercartitems.length; i++) {
                  var myorderitemdata=myordercartitems[i].cloneNode(0);
                  delete myorderitemdata.properties.id; //orderitem id is not from orderitem but from item
                  myNode.getRelationship({name:"orderitems"}).addChild(myorderitemdata);
                }
                //lets try to insert the order
                //This request adds descendents
                myNode.loadfromhttp({action: "add my tree"}).then(function(myNode){
                  //We add the order to the user so it will be accesible later on
                  webuser.getRelationship({"name":"orders"}).children=[];
                  webuser.getRelationship({"name":"orders"}).addChild(myNode);
                  //Lets got to the next step
                  (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout2.php");
                  //We remove the items from the cart
                  mycart.getRelationship({name:"cartitem"}).children=[];
                  mycart.refreshcartbox();
                  document.getElementById("cartbox").style.visibility="hidden";
                });
              });
            });
            return false;
          };
        </script>
        <input type="hidden" disabled>
        <script>
          var myNode=thisNode.getNextChild({"name":"chkt1next"}).getRelationship({name:"domelementsdata"}).getChild();
          myNode.writeProperty(thisElement);
          thisElement.onblur=function(){
            thisElement.type="hidden";
            thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
          }
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
      </div>
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="button" class="btn" data-id="but"></button>
        <script>
          var logOut=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"checkout"}).getNextChild({name:"chktDiscard"});
          logOut.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
          thisElement.onclick=function(){
            mycart.getRelationship({name:"cartitem"}).children=[];
            mycart.refreshcartbox();
            (new Node()).refreshView(document.getElementById("centralcontent"),'templates/loggedindata.php');
          }
        </script>
        <input type="hidden" disabled>
        <script>
          var myNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"checkout"}).getNextChild({name:"chktDiscard"}).getRelationship({name:"domelementsdata"}).getChild();
          myNode.writeProperty(thisElement);
          thisElement.onblur=function(){
            thisElement.type="hidden";
            thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
          }
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
      </div>
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="button" class="btn" data-id="but"></button>
        <script>
          var buttonLabel=thisNode.getNextChild({"name":"chktback"}).getRelationship({name:"domelementsdata"}).getChild();
          buttonLabel.writeProperty(thisElement);
          thisElement.onclick=function(){
            window.history.back();
          };
        </script>
        <input type="hidden" disabled="true">
        <script>
          var myNode=thisNode.getNextChild({"name":"chktback"}).getRelationship({name:"domelementsdata"}).getChild();
          myNode.writeProperty(thisElement);
          thisElement.onblur=function(){
            thisElement.type="hidden";
            thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
          }
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
      </div>
    </div>
  </template>
</div>
<script>
  var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
  checkout.refreshView(thisElement,thisElement.firstElementChild).then(function(){
    var url='?checkout=1';
    if (history.state && history.state.url==url) {
      return;
    }
    history.pushState({url:url}, null, url);
  });
</script>