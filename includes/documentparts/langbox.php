<div class="space"></div>
<div class="sidebox leftsidebox" id="langbox">
  <div class="boxtitle"></div>
  <div class="boxbody"></div>
</div> 
<script> 
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var langboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"langbox"}).getNextChild({"name":"langboxtt"}).getRelationship("domelementsdata").getChild();
  langboxtt.refreshView(document.querySelector("#langbox .boxtitle"), "templates/boxhead.php");
});
domelementsrootmother.addEventListener("loadLabels", function(){
   languages.loadfromhttp({"action":"load my childtablekeys"}).then(function(myNode){
      var newNode=new NodeMale();
      newNode.parentNode=new NodeFemale();
      newNode.parentNode=languages;
      myNode.newNode=newNode;
      myNode.appendThis(document.querySelector("#langbox .boxbody"), "templates/admnlisteners.php").then(function(myNode) {
        myNode.refreshChildrenView(document.querySelector("#langbox .boxbody"), "templates/language.php");
      });
      function languageIncreaseCloneFirstLang(newAddedLangNode, listener){
        return new Promise((resolve, reject) => {
          var newNode=languages.getChild().cloneNode();
          newNode.loadfromhttp({"action":"load my tree"}).then(function(myNode){
            myNode.properties.id=newAddedLangNode.properties.id;
            var loadActions=[];
            var loadRequest=[];
            var datavalue=[];
            var myparameters={"action":"load my tree up"};
            for (var i=0; i<myNode.relationships.length; i++) {
              for (var j=0; j<myNode.relationships[i].children.length; j++) {
                var myLoadRequestData=myNode.relationships[i].children[j].toRequestData(myparameters);
                loadRequest.push(myLoadRequestData);
                datavalue.push(myNode.relationships[i].children[j].properties);
                loadActions.push(myparameters);
              }
            }
            //Now we have to send the load request and get the result.
            var element=new Node();
            element.loadfromhttp({"parameters":loadActions, "nodes":loadRequest}).then(function(myNode){
              var insertRequest=[];
              var insertActions=[];
              for (var i=0; i<myNode.nodelist.length; i++) {
                if (Array.isArray(myNode.nodelist[i].parentNode)) {
                  for (var j=0;j<myNode.nodelist[i].parentNode.length;j++) {
                    if (myNode.nodelist[i].parentNode[j].properties.parenttablename!="TABLE_LANGUAGES") {
                      myNode.nodelist[i].parentNode=myNode.nodelist[i].parentNode[j];
                      break;
                    }
                  }  
                }
                myNode.nodelist[i].properties=datavalue[i];
                var myparameters={"action":"add myself", language: newAddedLangNode.properties.id, user_id: webuser.properties.id};
                var myInsertRequestData=myNode.nodelist[i].toRequestData(myparameters);
                insertRequest.push(myInsertRequestData);
                insertActions.push(myparameters);
              }
              var ielement=new Node();
              ielement.loadfromhttp({"parameters":insertActions, "nodes":insertRequest}).then(function(myNode){
                resolve(myNode);
              });
            });
          });
        });
      };
      myNode.addEventListener("addNewNode", function(newLangNode) {
        //We show the msg for waiting
        var myalert=new Alert();
        myalert.properties.alertclass="alertmsg";
        var wailtlangoperations=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"langbox"}).getNextChild({"name":"newlangwait"}).getRelationship("domelementsdata").getChild();
        myalert.properties.alertmsg=wailtlangoperations.properties.value;
        myalert.showalert();
        languageIncreaseCloneFirstLang(newLangNode).then(function(myNode){
          myalert.hidealert();
        });
      }, "addNewNode");
  });
});
</script>