<template>
  <label for="" class="form-label"></label>
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
      thisElement.attributes.for.value=thisNode.editpropertyname;
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