<template id="logedittp">
  <div style="display:table;">
    <div></div>
    <script>
      thisNode.getRelationship("domelementsdata").getChild().refreshView(thisElement,"templates/singlefield.php", {labelName: thisNode.properties.name, typeInput: true});
    </script>
  </div>
</template>
<div>
  <div style="margin:auto; display:table; margin-bottom: 1em;">
    <div class="msgbox">
      <div style="display:table;">
        <div></div>
        <script>
          var titNode=domelementsrootmother.getChild().getNextChild({name: "labels"}).getNextChild({name: "not located"}).getNextChild({name: "pagTit"});
          titNode.getRelationship("domelementsdata").getChild().refreshView(thisElement,"templates/singlefield.php", {labelName: titNode.properties.name, typeInput: true}).then(()=>{
            var titInput=thisElement.getElementsByTagName('input')[0];
            console.log(thisElement, titInput);
            if (!Config.pagTitAsText) {
              titInput.addEventListener('blur', function(){
                document.title=titInput.value;
              });
            }
          });
        </script>
      </div>
    </div>
  </div>
  <div style="margin:auto; display:table; margin-bottom: 1em;">
    <div class="msgbox"></div>
    <script>
      var currencyNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "currency"});
      currencyNode.appendThis(thisElement, document.querySelector("#logedittp"));
    </script>
  </div>
  <div style="margin:auto; display:table; margin-bottom: 1em;">
    <div class="msgbox"></div>
    <script>
      var hoursNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "hours"});
      hoursNode.appendThis(thisElement, document.querySelector("#logedittp"));
    </script>
  </div>
  <div style="margin:auto; display:table; margin-bottom: 1em;">
    <div class="msgbox"></div>
    <script>
      var langnewalert=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"langbox"}).getNextChild({"name":"newlangwait"});
      langnewalert.appendThis(thisElement, document.querySelector("#logedittp"));

      var langchangealert=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"langbox"}).getNextChild({"name":"changelangwait"});
      langchangealert.appendThis(thisElement, document.querySelector("#logedittp"));
    </script>
  </div>
  <div style="margin:auto; display:table; margin-bottom: 1em;">
    <div class="msgbox"></div>
    <script>
      var logboxNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "logbox"});
      
      var logboxin=logboxNode.getNextChild({name:"logboxin"});
      var logboxout=logboxNode.getNextChild({name:"logboxout"});
      for (var i=0; i<logboxin.getRelationship("domelements").children.length; i++) {
        var logNode=logboxin.getRelationship("domelements").children[i];
        logNode.appendThis(thisElement, document.querySelector("#logedittp"));
      }
      for (var i=0; i<logboxout.getRelationship("domelements").children.length; i++) {
        var logNode=logboxout.getRelationship("domelements").children[i];
        logNode.appendThis(thisElement, document.querySelector("#logedittp"));
      }
    </script>
  </div>
  <div data-id="containerlogin"></div>
  <script>
    (new Node()).appendThis(thisElement,"templates/loginform.php");
  </script>
  <div data-id="containernew"></div>
  <script>
    (new Node()).appendThis(thisElement,"templates/newform.php");
  </script>
</div>