<div class="space"></div>
<div class="sidebox leftsidebox" id="langbox">
  <div class="boxtitle"></div>
  <div class="boxbody"></div>
</div> 
<script> 
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], 
function(){
  var langboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"langboxtt"}).getRelationship("domelementsdata").getChild();
  langboxtt.refreshView(document.querySelector("#langbox .boxtitle"), "templates/boxhead.php");
});
domelementsrootmother.addEventListener("loadLabels", function(){
   languages.loadfromhttp({"action":"load my childtablekeys"}, function(){
      var newNode=new NodeMale();
      newNode.parentNode=new NodeFemale();
      newNode.parentNode=languages;
      this.newNode=newNode;
      this.appendThis(document.querySelector("#langbox .boxbody"), "templates/admnlisteners.php", function() {
        this.refreshChildrenView(document.querySelector("#langbox .boxbody"), "templates/language.php");
      }, "1column");
      //AVOIDREMOVING ALL LANGUAGES
      
      function languageIncrease(newLangNode) {
        var newNode=languages.getChild().cloneNode();
        newNode.loadfromhttp({"action":"load my tree", user_id: webuser.properties.id}, function(){
          this.properties.id=newLangNode.properties.id;
          var loadActions=[];
          var loadRequest=[];
          var datavalue=[];
          var myparameters={"action":"load my tree up"};
          for (var i=0; i<this.relationships.length; i++) {
            for (var j=0; j<this.relationships[i].children.length; j++) {
              var myLoadRequestData=this.relationships[i].children[j].toRequestData(myparameters);
              loadRequest.push(myLoadRequestData);
              datavalue.push(this.relationships[i].children[j].properties);
              loadActions.push(myparameters);
            }
          }
          //Now we have to send the load request and get the result. the usual loadfromhttp method doesnt accept multiple request so we must
          //first develop the request.php file to accept request multiple
          var element=new Node();
          element.loadfromhttp({"parameters":loadActions, "nodes":loadRequest}, function(){
            var insertRequest=[];
            var insertActions=[];
            for (var i=0; i<this.nodelist.length; i++) {
              if (Array.isArray(this.nodelist[i].parentNode)) {
                for (var j=0;j<this.nodelist[i].parentNode.length;j++) {
                  if (this.nodelist[i].parentNode[j].properties.parenttablename!="TABLE_LANGUAGES") {
                    this.nodelist[i].parentNode=this.nodelist[i].parentNode[j];
                    break;
                  }
                }  
              }
              this.nodelist[i].properties=datavalue[i];
              var myparameters={"action":"add myself", language: newLangNode.properties.id, user_id: webuser.properties.id};
              var myInsertRequestData=this.nodelist[i].toRequestData(myparameters);
              insertRequest.push(myInsertRequestData);
              insertActions.push(myparameters);
            }
            var ielement=new Node();
            ielement.loadfromhttp({"parameters":insertActions, "nodes":insertRequest}, function(){
            });
          });
        });
      }
      this.addEventListener("addNewNode", function(newLangNode) {
        languageIncrease(newLangNode);
      }, "addNewNode");
  });
});
</script>
