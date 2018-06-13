<script>
  var newNode=thisNode.newNode;
  //Lets add the log event
  var pointer=thisElement;
  while (pointer && pointer != document.getElementById("centralcontent")) {
    pointer=DomMethods.closesttagname(pointer, "div");
  }
  if (pointer != document.getElementById("centralcontent")) {
    //to refresh the nochildren element when log
    webuser.addEventListener("log", function(){
      if (thisNode.children.length==0) {
	thisNode.refreshChildrenView();
      }
    });
  }
  //adding the only-addbutton when is no records
  thisNode.addEventListener("refreshChildrenView", function() {
    //add the add button to the page when no paragraphs
    if (this.children.length==0){
      if (webuser.isWebAdmin()) {
	//The node and a data node is inserted
	var admnlauncher=new Node();
	admnlauncher.buttons=[{
	  template: document.getElementById("butaddnewnodetp"),
	  args: {thisParent: this, newNode: newNode}
	}];
	admnlauncher.refreshView(this.childContainer, document.getElementById("nochildrentp"));
      }
      //remove the add buton when log after webadmin
      else {
	this.childContainer.innerHTML="";
      }
    }
  });  
  //When admin add a new node it will be selected (what if there is not a menu thing?)
  thisNode.addEventListener("addNewNode", function(newnodeadded) {
    //we must add relationship domelements
    var button=null;
    newnodeadded.getMyDomNodes().forEach(function(domNode){
      button=domNode.querySelector("[data-button]");
    });
    if (button) button.click();
  });
  //When admin delete a node si estaba seleccionado seleccionamos otro y si era el último borramos lo de la parte central
  thisNode.addEventListener("deleteNode", function(nodeDeleted) {
    if (nodeDeleted.selected) {
      if (this.children.length>0) {
	var button=null;
	this.children[this.children.length - 1].getMyDomNodes().forEach(function(domNode){
	  button=domNode.querySelector("[data-button]");
	});
	if (button) button.click();
      }
    }
    if (this.children.length==0) {
      //remove the subcontents (only when are displayed)
      if (nodeDeleted.getRelationship() && nodeDeleted.getRelationship().childContainer) nodeDeleted.getRelationship().childContainer.innerHTML="";
      //to show no children when webadmin
      this.refreshChildrenView();
    }
  });
</script>