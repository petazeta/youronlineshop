<div class="sidebox" id="langbox">
  <div class="boxtitle"></div>
  <div class="boxbody"></div>
</div>
<template id="langtbxtp">
  <table class="boxlist" style="text-align:center;">
    <tr>
      <td class="boxlist">
      </td>
    </tr>
  </table>
</template>
<script>
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var langboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"langboxtt"}).getRelationship("domelementsdata").getChild();
  langboxtt.refreshView(document.querySelector("#langbox .boxtitle"), "includes/templates/boxhead.php");
});
domelementsrootmother.addEventListener(["loadLabels"], function(){
  var languagesMother=new NodeFemale();
  languagesMother.properties.childtablename="TABLE_LANGUAGES";
  languagesMother.properties.parenttablename="TABLE_LANGUAGES";
  languagesMother.loadfromhttp({action:"load all"}, function(){
    var newNode=new NodeMale();
    newNode.parentNode=new NodeFemale();
    newNode.parentNode.load(languagesMother, 1, 0, "id");
    languagesMother.newNode=newNode;
    languagesMother.addEventListener("refreshChildrenView", function(){
      //to set the result in a one column table
      document.querySelector("#langbox .boxbody").appendChild(DomMethods.intoColumns(getTpContent(document.querySelector("#langtbxtp")).querySelector("table").cloneNode(true), document.querySelector("#langbox .boxbody"), 1));
    });
    languagesMother.appendThis(document.querySelector("#langbox .boxbody"), "includes/templates/admnlisteners.php", function() {
      this.refreshChildrenView(document.querySelector("#langbox .boxbody"),  "includes/templates/language.php");
    });
    
    //AVOIDREMOVING ALL LANGUAGES
    
    
    function languageIncrease(newLangNode, action) {
      myalert.properties.alertmsg="<p>Performing some actions ...</p><p>Please wait</p>";
      myalert.showalert();
      newLangNode.loadfromhttp({action:"load my relationships", user_id: webuser.properties.id}, function(){
	for (var i=0; i<this.relationships.length; i++) {
	  var dataTableName=this.relationships[i].properties.childtablename;
	  for (var j=0; j<this.relationships[i].syschildtablekeys.length; j++) {
	    if (this.relationships[i].syschildtablekeysinfo[j].parenttablename!=this.relationships[i].properties.parenttablename) {
	      var parentTableName=this.relationships[i].syschildtablekeysinfo[j].parenttablename;
	      var elementsMother=new NodeFemale();
	      elementsMother.dataTableName=dataTableName;
	      elementsMother.properties.childtablename=parentTableName;
	      elementsMother.properties.parenttablename=parentTableName;
	      elementsMother.loadfromhttp({action:"load all"}, function(){
		var dataRel=new NodeFemale();
		dataRel.properties.parenttablename=this.properties.childtablename;
		dataRel.properties.childtablename=this.dataTableName;
		dataRel.elementsMother=this;
		dataRel.loadfromhttp({action:"load my childtablekeys", user_id: webuser.properties.id}, function(){
		  for (var k=0; k<this.elementsMother.children.length; k++) {
		    this.elementsMother.children[k].addRelationship(dataRel);
		    if (action=="delete") {
		      this.elementsMother.children[k].getRelationship().loadfromhttp({action:"load my children", language:newLangNode.properties.id, user_id: webuser.properties.id}, function(){
			if (dataRel.elementsMother.dataTableName==newLangNode.relationships[newLangNode.relationships.length-1].properties.childtablename && this.partnerNode.parentNode.children.indexOf(this.partnerNode)==dataRel.elementsMother.children.length-1) {
			  myalert.hidealert(); //as request are asyncronous it doesn't actually mean that the actions have finished
			}
			if (this.getChild()) {
			  this.getChild().loadfromhttp({action:"delete myself", user_id: webuser.properties.id}, function(){
			  });
			}
		      });
		    }
		    else {
		      this.elementsMother.children[k].getRelationship().loadfromhttp({action:"load my children", language:webuser.extra.language.properties.id, user_id: webuser.properties.id}, function(){
			if (dataRel.elementsMother.dataTableName==newLangNode.relationships[newLangNode.relationships.length-1].properties.childtablename && this.partnerNode.parentNode.children.indexOf(this.partnerNode)==dataRel.elementsMother.children.length-1) {
			  myalert.hidealert(); //as request are asyncronous it doesn't actually mean that the actions have finished
			}
			if (this.getChild()) {
			  this.getChild().loadfromhttp({action:"add myself", language:newLangNode.properties.id, user_id: webuser.properties.id}, function(){
			  });
			}
		      });
		    }
		  }
		});
	      });
	    }
	  }
	}
      });
    }
    languagesMother.addEventListener("addNewNode", function(newLangNode) {
      languageIncrease(newLangNode);
    });
    languagesMother.addEventListener("deleteNode", function(newLangNode) {
      languageIncrease(newLangNode, "delete");
    });
  });
});
</script>