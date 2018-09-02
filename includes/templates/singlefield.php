<template>
  <div style="padding-right:2.2em;">
    <div class="form-group">
      <template>
	<span class="form-label"></span>
	<script>
	  var propertyName=null;
	  if (typeof domelementsrootmother != "undefined") {
	    var tableProperties=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: thisNode.parentNode.properties.childtablename});
	  }
	  else if (tableProperties) {
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
      </template>
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
	  launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	  if (thisNode.showLabel!==false) thisNode.appendThis(thisElement.parentElement.previousElementSibling, thisElement.parentElement.parentElement.querySelector("template"));
	</script>
      </div>
    </div>
  </div>
</template>