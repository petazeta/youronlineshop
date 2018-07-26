<template>
  <template>
    <div class="alert">
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
		thisNode.loadfromhttp({action:"delete my tree", user_id: webuser.properties.id}, function(){
		  this.parentNode.removeChild(this);
		  //for no children add a eventlistener to refreshChildrenView event
		  if (this.parentNode.childContainer) this.parentNode.refreshChildrenView();
		  this.parentNode.dispatchEvent("deleteNode", [this]);
		  this.dispatchEvent("deleteNode");
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
    <img src="includes/css/images/trash.png"/>
  </button>
  <script>
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.thisNode;
    thisElement.onclick=function() {
      var launcher=new Alert();
      launcher.myTp=thisElement.parentElement.querySelector("template").content;
      //normailize
      launcher.thisNode=thisNode;
      launcher.showalert();
    }
  </script>
</template>