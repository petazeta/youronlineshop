<div class="sidebox" id="langbox">
  <div class="boxtitle">
  </div>
  <div class="boxbody">
  </div>
</div>
<template id="langboxheadtp">
  <span data-note="relative position container for admn buttons">
    <span></span>
    <script>
      thisNode.writeProperty(thisElement);
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = thisNode;
      launcher.editElement = thisElement;
      launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
    </script>
  </span>
</template>
<template id="categorytbtp">
  <table class="boxlist">
    <tr>
      <td class="boxlist">
      </td>
    </tr>
  </table>
</template>
<template id="categorytp">
  <span style="z-index:1">
    <a href=""></a>
    <script>
      thisNode.getRelationship({name: "itemlanguagesdata"}).loadfromhttp({action: "load my children", language: webuser.extra.language.properties.id}, function(){
	this.getChild().writeProperty(thisElement);
	var launcher = new Node();
	launcher.thisNode = this.getChild();
	launcher.editElement = thisElement;
	launcher.btposition="btmiddleleft";
	launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	var admnlauncher=new Node();
	admnlauncher.thisNode=thisNode;
	admnlauncher.editElement = thisElement;
	admnlauncher.btposition="btmiddleright";
	admnlauncher.elementsListPos="vertical";
	admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
	admnlauncher.newNode.loadasc(thisNode, 2, "id"); //the parent is not the same
	admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
	admnlauncher.appendThis(thisElement.parentElement, "includes/templates/addadmnbuts.php");
      });
      thisElement.addEventListener("click", function(event) {
	event.preventDefault();
	DomMethods.setActive(thisNode);
	thisNode.getRelationship().loadfromhttp({action:"load my tree", deepLevel: 2}, function(){
	  this.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
	  this.newNode.parentNode=new NodeFemale(); //the parentNode is not the same
	  this.newNode.parentNode.load(this, 1, 0, null, "id");
	  this.appendThis(document.getElementById("centralcontent"), "includes/templates/admnlisteners.php");
	  this.refreshView(document.getElementById("centralcontent"),"includes/templates/catalog.php");
	});
	return false;
      });
    </script>
  </span>
</template>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var langboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"langboxtt"}).getRelationship({name: "domelementsdata"}).getChild();
  cartboxtt.refreshView(document.querySelector("#langbox .boxtitle"), document.querySelector("#langboxheadtp"));

  var languagesMother=new NodeFemale();
  languagesMother.properties.childtablename="TABLE_LANGUAGES";
  languagesMother.properties.parenttablename="TABLE_LANGUAGES";
  languagesMother.loadfromhttp({action:"load all"}, function(){
      var newNode=new NodeMale();
      newNode.parentNode=new NodeFemale();
      newNode.parentNode.load(languagesMother, 1, 0, "id");
      //new node comes with datarelationship attached
      newNode.addRelationship(languagesMother.partnerNode.getRelationship("itemlanguages").cloneNode(0, 0));
      newNode.addRelationship(languagesMother.partnerNode.getRelationship("itemlanguagesdata").cloneNode(0, 0));
      newNode.addRelationship(languagesMother.partnerNode.getRelationship("items").cloneNode(0, 0));
      newNode.getRelationship("itemlanguagesdata").addChild(new NodeMale());
      languagesMother.newNode=newNode;
      languagesMother.appendThis(document.querySelector("#catalogbox .boxbody"), "includes/templates/admnlisteners.php");
      languagesMother.addEventListener("refreshChildrenView", function(){
	//to set the result in a one column table
	document.querySelector("#catalogbox .boxbody").appendChild(DomMethods.intoColumns(getTpContent(document.querySelector("#categorytbtp")).querySelector("table").cloneNode(true), document.querySelector("#catalogbox .boxbody"), 1));
      });
      languagesMother.refreshChildrenView(document.querySelector("#catalogbox .boxbody"),  document.querySelector("#categorytp"), function(){
      });
    });
  });
});
</script>