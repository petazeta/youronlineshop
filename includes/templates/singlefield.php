<template>
  <div style="padding-right:1em;">
    <div class="form-group">
      <div style="display:table">
	<span class="form-label"></span>
	<script>
	  var propertyName=new Node();
	  var tableProperties=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: thisNode.parentNode.properties.childtablename});
	  if (tableProperties) {
	    var propertyData=tableProperties.getNextChild({name: thisNode.editpropertyname});
	    if (propertyData) {
	      propertyName=propertyData.getRelationship("domelementsdata").getChild();
	      var launcher = new Node();
	      launcher.thisNode = propertyName;
	      launcher.editElement = thisElement;
	      launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	    }
	  }
	  if (!propertyName) {
	    propertyName=new Node();
	    propertyName.properties.value=thisNode.editpropertyname;
	  }
	  propertyName.writeProperty(thisElement);
	</script>
      </div>
      <div style="display:table">
	<span></span>
	<script>
	  thisNode.writeProperty(thisElement, thisNode.editpropertyname);
	  //adding the edition pencil
	  var launcher = new Node();
	  launcher.thisNode = thisNode;
	  launcher.editElement = thisElement;
	  launcher.thisProperty = thisNode.editpropertyname;
	  launcher.editable = true;
	  launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	</script>
      </div>
    </div>
  </div>
</template>