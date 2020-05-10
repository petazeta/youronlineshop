<template>
  <div style="text-align:center">
    <form>
      <div>
      <div class="msgbox">
        <table style="margin:auto; text-align:left; margin-bottom:1em;">
          <tr>
            <td>
              <input type="radio" value="text" name="dataoption">
              <span></span>
              <script>
                var title=thisNode.getNextChild({"name":"exptext"}).getRelationship({name:"domelementsdata"}).getChild();
                title.writeProperty(thisElement);
                //adding the edition pencil
                var launcher = new Node();
                launcher.thisNode = title;
                launcher.editElement = thisElement;
                launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
              </script>
            </td>
          </tr>
          <tr>
            <td>
              <input type="radio" value="tit" name="dataoption">
              <span></span>
              <script>
                var title=thisNode.getNextChild({"name":"exptit"}).getRelationship({name:"domelementsdata"}).getChild();
                title.writeProperty(thisElement);
                //adding the edition pencil
                var launcher = new Node();
                launcher.thisNode = title;
                launcher.editElement = thisElement;
                launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
              </script>
            </td>
          </tr>
          <tr>
            <td>
              <input type="radio" value="menus" name="dataoption">
              <span></span>
              <script>
                var title=thisNode.getNextChild({"name":"expmenus"}).getRelationship({name:"domelementsdata"}).getChild();
                title.writeProperty(thisElement);
                //adding the edition pencil
                var launcher = new Node();
                launcher.thisNode = title;
                launcher.editElement = thisElement;
                launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
              </script>
            </td>
          </tr>
          <tr>
            <td>
              <input type="radio" value="catalog" name="dataoption">
              <span></span>
              <script>
                var title=thisNode.getNextChild({"name":"expcatg"}).getRelationship({name:"domelementsdata"}).getChild();
                title.writeProperty(thisElement);
                //adding the edition pencil
                var launcher = new Node();
                launcher.thisNode = title;
                launcher.editElement = thisElement;
                launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
              </script>
            </td>
          </tr>
        </table>
      </div>
      </div>
      <div>
      <div class="msgbox">
        <span></span>
        <script>
          var title=thisNode.getNextChild({"name":"titexp"}).getRelationship({name:"domelementsdata"}).getChild();
          title.writeProperty(thisElement);
          //adding the edition pencil
          var launcher = new Node();
          launcher.thisNode = title;
          launcher.editElement = thisElement;
          launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        </script>
      </div>
      </div>
      <span>
        <button class="btn"></button>
        <script>
        var title=thisNode.getNextChild({"name":"butexp"}).getRelationship({name:"domelementsdata"}).getChild();
        title.writeProperty(thisElement);
        //adding the edition pencil
        var launcher = new Node();
        launcher.thisNode = title;
        launcher.editElement = thisElement;
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        
        //This facility is for export/import the customized data of a shop so we could update the shop software and keep the data
        thisElement.onclick=function(){
          if (thisElement.form.dataoption.value=="menus") {
           exportData(domelementsroot.getRelationship("domelements").getChild({name:"texts"}));
          }
          else if (thisElement.form.dataoption.value=="tit") {
            exportData(domelementsroot.getRelationship("domelements").getChild({name:"labels"}).getRelationship("domelements").getChild({name:"top"}));
          }
          else if (thisElement.form.dataoption.value=="text") {
            exportData(domelementsroot.getRelationship("domelements").getChild({name:"labels"}));
          }
          else if (thisElement.form.dataoption.value=="catalog") {
            var categoriesrootmother=new NodeFemale();
            categoriesrootmother.properties.childtablename="TABLE_ITEMCATEGORIES";
            categoriesrootmother.properties.parenttablename="TABLE_ITEMCATEGORIES";
            categoriesrootmother.loadfromhttp({action:"load root"}, function(){
              exportData(this.getChild());
            });
          }
          function exportData(rootelement){
            //data from the language
            var langdata=languages.toRequestData({action: "add my tree"});
            //data from the structure
            var rootClone=rootelement.cloneNode(null, 0);
            rootClone.loadfromhttp({action: "load my tree"},  function() {
              var datatoinsert={"languages": langdata, "tree": this.toRequestData({action: "add my tree"})};
              thisElement.form.result.value=JSON.stringify(datatoinsert);
            });
          };
          return false;
        };
        </script>
      </span>
      <div style="padding-top: 10px">
        <textarea name="result" rows="10" cols="50"></textarea>
      </div>
      <div class="space"></div>
      <div class="msgbox">
        <span></span>
        <script>
          var title=thisNode.getNextChild({"name":"titimp"}).getRelationship({name:"domelementsdata"}).getChild();
          title.writeProperty(thisElement);
          //adding the edition pencil
          var launcher = new Node();
          launcher.thisNode = title;
          launcher.editElement = thisElement;
          launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        </script>
      </div>
      <div style="padding-top: 10px">
        <textarea name="impdata" rows="10" cols="50"></textarea>
      </div>
      <div style="display:table;">
        <input type="hidden" name="impalertmsg">
        <script>
          var myNode=thisNode.getNextChild({"name":"imploadingmsg"}).getRelationship({name:"domelementsdata"}).getChild();
          myNode.writeProperty(thisElement, null, "value");
          var launcher = new Node();
          launcher.thisNode = myNode;
          launcher.editElement = thisElement;
          launcher.thisAttribute = "value";
          launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
          if (webuser.isWebAdmin()) thisElement.type="input";
        </script>
      </div>
      <div style="display:table;">
        <input type="hidden" name="impnoselection">
        <script>
          var myNode=thisNode.getNextChild({"name":"impnoselection"}).getRelationship({name:"domelementsdata"}).getChild();
          myNode.writeProperty(thisElement, null, "value");
          var launcher = new Node();
          launcher.thisNode = myNode;
          launcher.editElement = thisElement;
          launcher.thisAttribute = "value";
          launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
          if (webuser.isWebAdmin()) thisElement.type="input";
        </script>
      </div>
      <span>
        <button type="button" class="btn"></button>
        <script>
        var title=thisNode.getNextChild({"name":"butimp"}).getRelationship({name:"domelementsdata"}).getChild();
        title.writeProperty(thisElement);
        //adding the edition pencil
        var launcher = new Node();
        launcher.thisNode = title;
        launcher.editElement = thisElement;
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        
        thisElement.onclick=function(){
          var mynoselalert=new Alert();
          mynoselalert.properties.alertclass="alertmsg";
          mynoselalert.properties.timeout=2000;
          mynoselalert.properties.alertmsg=thisElement.form.elements.impnoselection.value;
          if (!thisElement.form.impdata.value) {
            mynoselalert.showalert();
          }
            
          var requestResultData=[]; //Full final request container
          var requestResultActions=[]; //Vars for result 
          
          //We split the languages in one array of langdata for each language
          var data=JSON.parse(thisElement.form.impdata.value);

          var datalang=data.languages;

          var datatree=new NodeMale();
          datatree.load(data.tree);
          var treearray=datatree.arrayFromTree();
          var langnodes=[];
          for (var i=0; i<datalang.children.length; i++) {
            langnodes[i]=new NodeMale();
            langnodes[i].load(data.tree);
            var langarray=langnodes[i].arrayFromTree();
            for (var j=0; j<treearray.length; j++) {
              if (treearray[j].constructor==NodeFemale && treearray[j].properties.language) {
                //The children are the lang conent
                langarray[j].children=[treearray[j].children[i]];
              }
            }
          }
          
          if (!langarray || langarray.length==0) return false;
          //then we insert the tree with just first lang content and for the others
          
          //insert the tree for one lang
          if (thisElement.form.dataoption.value=="menus") {
            impData(domelementsroot.getRelationship("domelements").getChild({name:"texts"}));
          }
          else if (thisElement.form.dataoption.value=="tit") {
            impData(domelementsroot.getRelationship("domelements").getChild({name:"labels"}).getRelationship("domelements").getChild({name:"top"}));
          }
          else if (thisElement.form.dataoption.value=="text") {
            impData(domelementsroot.getRelationship("domelements").getChild({name:"labels"}));
          }
          else if  (thisElement.form.dataoption.value=="catalog") {
            var categoriesrootmother=new NodeFemale();
            categoriesrootmother.properties.childtablename="TABLE_ITEMCATEGORIES";
            categoriesrootmother.properties.parenttablename="TABLE_ITEMCATEGORIES";
            categoriesrootmother.loadfromhttp({action:"load root"}, function(){
              impData(this.getChild());
            });
          }
          else {
          }
          function impData(rootelement){
            var myimpalert=new Alert();
            myimpalert.properties.alertclass="alertmsg";
            myimpalert.properties.alertmsg=thisElement.form.elements.impalertmsg.value;
            myimpalert.showalert();
             //First we add the remove tree request
            requestResultData.push(rootelement.toRequestData({action: "delete my tree"}));
            requestResultActions.push({"action":"delete my tree"});
            requestResultData.push(langnodes[0].toRequestData({action: "add my tree"}));
            requestResultActions.push({"action":"add my tree" , language: languages.children[0].properties.id});
            var loadelement=new Node();

            loadelement.loadfromhttp({"parameters":requestResultActions, "nodes":requestResultData}, function(){
              if (datalang.children.length<2) {
                myimpalert.hidealert();
                return;
              }
              var myNode=new NodeMale();
              myNode.load(loadelement.nodelist[1]);
              //The resulting tree then we will swap the lang content for each language, then insert again but just the lang content
              //We get to the list of nodes
              var newtreearray=myNode.arrayFromTree();
              //console.log(newtreearray, treearray);
              //For each language we swap content
              //Now we add the new language content but now just lang content
              var requestData=[];
              var requestActions=[];
              for (var i=1; i<datalang.children.length; i++) {
                for (var j=0; j<newtreearray.length; j++) {
                  var langarray=langnodes[i].arrayFromTree();
                  if (newtreearray[j].constructor==NodeFemale && newtreearray[j].properties.language) {
                    //console.log(newtreearray[j], langarray[j]);
                    //Swap the other langs content
                    newtreearray[j].children[0].properties=langarray[j].children[0].properties;
                  }
                }
                requestData.push(myNode.toRequestData({action: "add my tree"}));
                requestActions.push({"action":"add my tree", language: languages.children[i].properties.id, justlangcontent:true});
              }
              var nodeRequest=new Node();
              nodeRequest.loadfromhttp({"parameters":requestActions, "nodes":requestData}, function(){
                myimpalert.hidealert();
              });
            }); 
          }
          return false;
        };
        </script>
      </span>
    </form>
  </div>
</template>
