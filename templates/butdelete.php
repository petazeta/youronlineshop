<!--
-->
<button type="button" class="butdel" type="button">
  <template>
    <div class="alert alertmsg mytable">
      <div>
        <span style="position:relative;">
          <div data-id="butedit" class="btmiddleright"></div>
          <h1 style="font-size:1.5em" style="display:block;">DELETE</h1>
          <script>
            if (typeof domelementsroot != "undefined") {
              var myContent=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"deletealert"}).getNextChild({"name":"titalert"}).getRelationship({name: "domelementsdata"}).getChild();
              myContent.writeProperty(thisElement);
              //adding the edition pencil
              if (webuser && webuser.isWebAdmin()) {
                DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
                myContent.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
              }
            }
          </script>
        </span>
      </div>
      <span style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <div style="margin:1em;">ATENTION: This element and its descedants will be removed.</div>
        <script>
         //adapted for non domelements table apps
          if (typeof domelementsroot != "undefined") {
            var myContent=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"deletealert"}).getNextChild({"name":"textalert"}).getRelationship({name: "domelementsdata"}).getChild();
            myContent.writeProperty(thisElement);
            //adding the edition pencil
            if (webuser && webuser.isWebAdmin()) {
              DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
              myContent.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            }
          }
        </script>
      </span>
      <div style="margin:1em;">
        <span style="position:relative;">
          <div data-id="butedit" class="btmiddleleft"></div>
          <button type="button" class="btn"data-id="but" >Don't remove</button>
          <script>
            if (typeof domelementsroot != "undefined") {
              var myContent=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"deletealert"}).getNextChild({"name":"dontdelbutton"}).getRelationship({name: "domelementsdata"}).getChild();
              myContent.writeProperty(thisElement);
            }
            thisElement.onclick=function(){
              thisNode.hidealert();
            }
          </script>
          <input type="hidden" disabled>
          <script>
            if (typeof domelementsroot != "undefined") {
              var myNode=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"deletealert"}).getNextChild({"name":"dontdelbutton"}).getRelationship({name: "domelementsdata"}).getChild();
              myNode.writeProperty(thisElement);
              thisElement.onblur=function(){
                thisElement.type="hidden";
                thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
              }
              //adding the edition pencil
              if (webuser && webuser.isWebAdmin()) {
                DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
                myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
              }
            }
          </script>
        </span>
        <span style="position:relative;">
          <div data-id="butedit" class="btmiddleright"></div>
          <button type="button" class="btn" data-id="but">Remove</button>
          <script>
            if (typeof domelementsroot != "undefined") {
              var myContent=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"deletealert"}).getNextChild({"name":"delbutton"}).getRelationship({name: "domelementsdata"}).getChild();
              myContent.writeProperty(thisElement);
            }
            thisElement.addEventListener("click", function(ev) {
              ev.preventDefault();
              thisParams.dataNode.loadfromhttp({action:"delete my tree"}).then(function(myNode){
                myNode.parentNode.removeChild(myNode);
                //for no children add a eventlistener to refreshChildrenView event
                if (myNode.parentNode.childContainer) myNode.parentNode.refreshChildrenView();
                myNode.parentNode.dispatchEvent("deleteNode", [myNode]);
                myNode.dispatchEvent("deleteNode");
              });
              thisNode.hidealert();
            });
          </script>
          <input type="hidden" disabled>
          <script>
            if (typeof domelementsroot != "undefined") {
              var myNode=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"deletealert"}).getNextChild({"name":"delbutton"}).getRelationship({name: "domelementsdata"}).getChild();
              myNode.writeProperty(thisElement);
              thisElement.onblur=function(){
                thisElement.type="hidden";
                thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
              }
              //adding the edition pencil
              if (webuser && webuser.isWebAdmin()) {
                DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
                myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
              }
            }
          </script>
        </span>
      </div>
    </div>
  </template>
  <div class="delimage"></div>
  <script>
    if (window.getComputedStyle(thisElement).backgroundImage) {
      DomMethods.setSizeFromStyle(thisElement);
    }
  </script>
</button>
<script>
  thisElement.onclick=function() {
    var thisAlert=new Alert();
    thisAlert.showalert(null, thisElement.querySelector("template"), {dataNode: thisNode});
  }
</script>
