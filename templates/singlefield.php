<template>
  <div style="padding-right:2.2em;">
    <div class="form-group">
      <div style="display:table"></div>
      <div style="display:table">
	<span></span>
	<script>
	  thisNode.writeProperty(thisElement, thisNode.editpropertyname);
	  //adding the edition pencil
	  var launcher = new Node();
	  launcher.thisNode = thisNode;
	  launcher.editElement = thisElement;
	  launcher.thisProperty = thisNode.editpropertyname;
	  if (Array.isArray(thisNode.editable)) {
	    if (thisNode.editable.indexOf(launcher.thisProperty)!=-1) {
	      launcher.editable=true;
	    }
	  }
	  else if (typeof thisNode.editable == "boolean") {
	    launcher.editable=thisNode.editable;
	  }
	  launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	  if (thisNode.showLabel!==false) thisNode.appendThis(thisElement.parentElement.previousElementSibling, "templates/singlelabel.php");
	</script>
      </div>
    </div>
  </div>
</template>