<template>
  <template>
    <div class="alert alertmsg">
      <table class="mytable">
	<tr>
	  <td>
            <span data-note="relative position container for admn buttons">
              <h1 style="font-size:1.5em">DELETE</h1>
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
            <span data-note="relative position container for admn buttons">
              <div>ATENTION: This element and its descedants will be removed.</div>
              <script>
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
	  </td>
	</tr>
	<tr>
	  <td>
	    <form>
	      <table style="margin:auto;">
		<tr>
		  <td>
		    <input type="button" class="form-btn" value="Don't remove" name="exit">
		  </td>
		  <td><input type="submit" class="form-btn" value="Remove"></td>
		</tr>
	      </table>
	    </form>
	    <script>
	      //normalize
	      var launcher=thisNode;
	      var thisNode=launcher.thisNode;
	      thisElement.addEventListener("submit", function(ev) {
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
	      thisElement.elements.exit.onclick=function(){
		launcher.hidealert();
	      }
	    </script>
	  </td>
	</tr>
      </table>
    </div>
  </template>
  <button title="Remove" href="" style="" class="butdel">
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
