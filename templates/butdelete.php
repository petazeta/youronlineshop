<template>
  <template>
    <div class="alert alertmsg">
      <table class="mytable">
	<tr>
	  <td>
	    <h1 style="font-size:1.5em">DELETE</h1>
	    <div>ATENTION: This element and its descedants will be removed.</div>
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
