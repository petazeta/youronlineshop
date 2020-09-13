<template>
  <template>
    <div class="alert alertmsg mytable">
      <div>
        <span data-note="relative position container for admn buttons">
          <h1 style="font-size:1.5em" style="display:block;">DELETE</h1>
          <script>
            if (typeof domelementsroot != "undefined") {
              var myContent=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"deletealert"}).getNextChild({"name":"titalert"}).getRelationship({name: "domelementsdata"}).getChild();
              myContent.writeProperty(thisElement);
              //adding the edition pencil
              var launcher = new Node();
              launcher.thisNode = myContent;
              launcher.editElement = thisElement;
              launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
            }
          </script>
        </span>
      </div>
      <span data-note="relative position container for admn buttons">
        <div style="margin:1em;">ATENTION: This element and its descedants will be removed.</div>
        <script>
         //adapted for non domelements table apps
          if (typeof domelementsroot != "undefined") {
            var myContent=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"deletealert"}).getNextChild({"name":"textalert"}).getRelationship({name: "domelementsdata"}).getChild();
            myContent.writeProperty(thisElement);
            //adding the edition pencil
            var launcher = new Node();
            launcher.thisNode = myContent;
            launcher.editElement = thisElement;
            launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
          }
        </script>
      </span>
      <div>
        <span data-note="relative position container for admn buttons">
          <button class="btn">Don't remove</button>
          <script>
            if (typeof domelementsroot != "undefined") {
              var myContent=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"deletealert"}).getNextChild({"name":"dontdelbutton"}).getRelationship({name: "domelementsdata"}).getChild();
              myContent.writeProperty(thisElement);
              //adding the edition pencil
              var launcher = new Node();
              launcher.thisNode = myContent;
              launcher.editElement = thisElement;
              launcher.btposition="btmiddleleft";
              launcher.createInput=true;
              launcher.visibility="visible";
              launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
            }
            //normalize
            var launcher=thisNode;
            thisElement.onclick=function(){
              launcher.hidealert();
            }
          </script>
        </span>
        <span data-note="relative position container for admn buttons">
          <button class="btn">Remove</button>
          <script>
            if (typeof domelementsroot != "undefined") {
              var myContent=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"deletealert"}).getNextChild({"name":"delbutton"}).getRelationship({name: "domelementsdata"}).getChild();
              myContent.writeProperty(thisElement);
              //adding the edition pencil
              var launcher = new Node();
              launcher.thisNode = myContent;
              launcher.editElement = thisElement;
              launcher.createInput=true;
              launcher.visibility="visible";
              launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
            }
            //normalize
            var launcher=thisNode;
            var thisNode=launcher.thisNode;
            thisElement.addEventListener("click", function(ev) {
              ev.preventDefault();
              thisNode.loadfromhttp({action:"delete my tree", user_id: webuser.properties.id}).then(function(myNode){
                myNode.parentNode.removeChild(myNode);
                //for no children add a eventlistener to refreshChildrenView event
                if (myNode.parentNode.childContainer) myNode.parentNode.refreshChildrenView();
                myNode.parentNode.dispatchEvent("deleteNode", [myNode]);
                myNode.dispatchEvent("deleteNode");
              });
              launcher.hidealert();
            });
          </script>
        </span>
      </div>
    </div>
  </template>
  <button title="Remove" style="" class="butdel">
    <img src="css/images/trash.png"/>
  </button>
  <script>
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.thisNode;
    thisElement.onclick=function() {
      var launcher=new Alert();
      //normailize ples
      launcher.thisNode=thisNode;
      launcher.showalert(null, thisElement.parentElement.querySelector("template"));
    }
  </script>
</template>
