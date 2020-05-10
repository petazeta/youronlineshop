<template>
  <div style="padding-right:2.2em;">
    <div class="form-group">
      <div style="display:table"></div>
      <div style="display:table">
	<input class="form-field" name="" placeholder="">
	<script>
	  thisNode.writeProperty(thisElement, thisNode.editpropertyname);
          thisElement.attributes.name.value=thisNode.editpropertyname;
          thisElement.attributes.placeholder.value=thisNode.editpropertyname;
	  if (thisNode.showLabel!==false) thisNode.appendThis(thisElement.parentElement.previousElementSibling, "templates/singlelabel.php");
	</script>
      </div>
    </div>
  </div>
</template>