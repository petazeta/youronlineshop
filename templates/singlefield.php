<template>
  <div style="padding-right:2.2em;">
    <div class="form-group">
      <template>
	<span class="form-label"></span>
	<script>
	  var propertyName=null;
	  if (thisNode.editpropertylabel) { //just a label for information
	    propertyName=new Node();
	    propertyName.properties.value=thisNode.editpropertylabel;
	    propertyName.noeditable=true;
	  }
	  else if (thisNode.editpropertynode) { //the label is editable
	    propertyName=thisNode.editpropertynode;
	  }
	  else if (thisNode.editpropertyname) { //the editproperty means there is an actual property
	    if (typeof domelementsrootmother != "undefined") {
	      var tableProperties=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: thisNode.parentNode.properties.childtablename});
	    }
	    if (tableProperties) {
	      propertyName=tableProperties.getNextChild({name: thisNode.editpropertyname}).getRelationship("domelementsdata").getChild();
	    }
	    else {
	      propertyName=new Node();
	      propertyName.properties.value=thisNode.editpropertyname;
	      propertyName.noeditable=true;
	    }
	  }
	  if (propertyName) {
	    propertyName.writeProperty(thisElement);
	    if (!propertyName.noeditable) {
	      var launcher = new Node();
	      launcher.thisNode = propertyName;
	      launcher.editElement = thisElement;
	      launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	    }
	  }
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
	  launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	  if (thisNode.showLabel!==false) thisNode.appendThis(thisElement.parentElement.previousElementSibling, thisElement.parentElement.parentElement.querySelector("template"));
	</script>
      </div>
    </div>
  </div>
</template>