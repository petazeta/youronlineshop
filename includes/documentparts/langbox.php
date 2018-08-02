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
  var langboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"langboxtt"}).getRelationship({name: "domelementsdata"}).getChild();
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
  });
});
</script>