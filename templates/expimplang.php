<template>
  <div style="text-align:center">
    <div class="msgbox">
      <span></span>
      <script>
        var title=thisNode.getNextChild({"name":"tit"}).getRelationship({name:"domelementsdata"}).getChild();
        title.writeProperty(thisElement);
        //adding the edition pencil
        var launcher = new Node();
        launcher.thisNode = title;
        launcher.editElement = thisElement;
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
      </script>
    </div>
    <form>
      <div class="msgbox">
        <div style="margin:auto; text-align:left; margin-bottom:1em;"></div>
        <template>
          <input type="checkbox" value="" name="">
          <span></span>
        </template>
        <script>
            var myCheckBox=thisElement.content.children[0];
            var myLabel=thisElement.content.children[1];
            var myWrap=thisElement.parentElement;
            function createLangCheckBoxs(myLangs, container){
              var checkBoxes=[];
              var myLabels=[];
              for (var i=0; i<myLangs.children.length; i++) {
                var newCheckBox=myCheckBox.cloneNode();
                newCheckBox.name=myLangs.children[i].properties.code;
                newCheckBox.value=myLangs.children[i].properties.id;
                checkBoxes.push(newCheckBox);
                var newSpan=myLabel.cloneNode();
                newSpan.textContent=newCheckBox.name;
                myLabels.push(newSpan);
              }
              container.innerHTML="";
              for (var i=0; i<checkBoxes.length; i++) {
                container.appendChild(checkBoxes[i]);
                container.appendChild(myLabels[i]);
              }
            }
            window.createLangCheckBoxs=createLangCheckBoxs;
            createLangCheckBoxs(languages, thisElement.previousElementSibling);
        </script>
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
      <div style="display:table;">
        <input type="hidden" name="errornolangssel">
        <script>
          var myNode=thisNode.getNextChild({"name":"errornolangssel"}).getRelationship({name:"domelementsdata"}).getChild();
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
            var rootelement=domelementsroot.getRelationship("domelements").getChild({name:"labels"});
            //data from the languages
            var langdata=languages.cloneNode();
            var myLangs=thisElement.form.querySelectorAll('input[type="checkbox"]');
            var selectedLangs=[];
            
            for (var i=0; i<myLangs.length; i++) {
              if (myLangs[i].checked) selectedLangs.push(Number(myLangs[i].value));
            }
            
            if (!selectedLangs.length) {
              //send error
              var nolangsalert=new Alert();
              nolangsalert.properties.alertclass="alertmsg";
              nolangsalert.properties.timeout=2000;
              nolangsalert.properties.alertmsg=thisElement.form.elements.errornolangssel.value;
              nolangsalert.showalert();
              return false;
            }
            
            //Now we filter the languages selected from the datalang
            for (var i=0; i<langdata.children.length; i++) {
              if (!selectedLangs.includes(langdata.children[i].properties.id)) {
                langdata.removeChild(langdata.children[i]);
              }
            }
            langdata=langdata.toRequestData({action: "add my tree"});
            //data from the structure
            var rootClone=rootelement.cloneNode(null, 0);
            var myNodes=[];
            var myParams=[];
            for (var i=0; i<langdata.children.length; i++) {
              myNodes.push(rootClone.toRequestData({action: "load my tree"}));
              myParams.push({action: "load my tree", language: langdata.children[i].properties.id});
            }
            var nodeRequest=new Node();
            nodeRequest.loadfromhttp({"parameters":myParams, "nodes":myNodes}, function(){
              var nodesInsert=[];
              for (var i=0; i<this.nodelist.length; i++) {
                //we restables rootnode properties data
                this.nodelist[i].properties=rootClone.properties;
                nodesInsert.push(this.nodelist[i].toRequestData({action: "add my tree"}));
              }
              var datatoinsert={"languages": langdata, "trees": nodesInsert};
              thisElement.form.result.value=JSON.stringify(datatoinsert);
            });

          return false;
        };
        </script>
      </span>
      <div style="padding-top: 10px">
        <textarea name="result" rows="10" cols="50"></textarea>
      </div>
      <div style="display:table;">
        <input type="hidden" name="errornolangsmsg">
        <script>
          var myNode=thisNode.getNextChild({"name":"errornolangs"}).getRelationship({name:"domelementsdata"}).getChild();
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
        <input type="hidden" name="errornodata">
        <script>
          var myNode=thisNode.getNextChild({"name":"errornodata"}).getRelationship({name:"domelementsdata"}).getChild();
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
        <input type="hidden" name="loadedlangs">
        <script>
          var myNode=thisNode.getNextChild({"name":"loadedlangs"}).getRelationship({name:"domelementsdata"}).getChild();
          myNode.writeProperty(thisElement, null, "value");
          var launcher = new Node();
          launcher.thisNode = myNode;
          launcher.editElement = thisElement;
          launcher.thisAttribute = "value";
          launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
          if (webuser.isWebAdmin()) thisElement.type="input";
        </script>
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
      <span>
        <button class="btn"></button>
        <script>
        var title=thisNode.getNextChild({"name":"butload"}).getRelationship({name:"domelementsdata"}).getChild();
        title.writeProperty(thisElement);
        //adding the edition pencil
        var launcher = new Node();
        launcher.thisNode = title;
        launcher.editElement = thisElement;
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        
        thisElement.onclick=function(){
          //We split the languages in one array of langdata for each language
          if (!thisElement.form.impdata.value) {
            //send error
            var nolangsalert=new Alert();
            nolangsalert.properties.alertclass="alertmsg";
            nolangsalert.properties.timeout=2000;
            nolangsalert.properties.alertmsg=thisElement.form.elements.errornodata.value;
            nolangsalert.showalert();
            document.getElementById("butimp").disabled=true;
            return false;
          }
          var data=JSON.parse(thisElement.form.impdata.value);
          window.dataImport=data;

          var datalang=data.languages;
          var datatrees=data.trees;
          
          //Lets check if there are langs
          if (datalang.children.length==0) {
            //send error
            var nolangsalert=new Alert();
            nolangsalert.properties.alertclass="alertmsg";
            nolangsalert.properties.timeout=2000;
            nolangsalert.properties.alertmsg=thisElement.form.elements.errornolangsmsg.value;
            nolangsalert.showalert();
            document.getElementById("butimp").disabled=true;
            return false;
          }
          
          //Now we have to show langs
          createLangCheckBoxs(datalang, document.getElementById("loadedlangscontainer"));
          //Lets put a notice
          var notice=thisNode.getNextChild({"name":"loadedlangs"}).getRelationship({name:"domelementsdata"}).getChild();
          notice.writeProperty(document.getElementById("loadedlangsnotice"));
          
          //Now we have to enable the Import Button
          document.getElementById("butimp").disabled=false;
          return false;
        };
        </script>
      </span>
      <div>
        <div class="msgbox">
          <div style="padding-bottom: 10px;" id="loadedlangsnotice"></div>
          <div id="loadedlangscontainer" style="margin:auto; text-align:left; margin-bottom:1em;"></div>
        </div>
      </div>
      <div style="display:table;">
        <input type="hidden" name="waitimp">
        <script>
          var myNode=thisNode.getNextChild({"name":"waitimp"}).getRelationship({name:"domelementsdata"}).getChild();
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
        <button id="butimp" disabled></button>
        <script>
        var title=thisNode.getNextChild({"name":"butimp"}).getRelationship({name:"domelementsdata"}).getChild();
        title.writeProperty(thisElement);
        //adding the edition pencil
        var launcher = new Node();
        launcher.thisNode = title;
        launcher.editElement = thisElement;
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        
        thisElement.onclick=function(){
          var datalang=new NodeFemale();
          datalang.load(dataImport.languages);
          var datatrees=[];
          for (var i=0; i<dataImport.trees.length; i++) {
            datatrees[i]= new NodeMale();
            datatrees[i].load(dataImport.trees[i]);
          }
          var myLangs=document.getElementById("loadedlangscontainer").querySelectorAll('input[type="checkbox"]');
          var selectedLangs=[];
          for (var i=0; i<myLangs.length; i++) {
            if (myLangs[i].checked) selectedLangs.push(Number(myLangs[i].value));
          }
          if (!datalang || datalang.children.length==0 || selectedLangs.length==0) {
              //send error
              var nolangsalert=new Alert();
              nolangsalert.properties.alertclass="alertmsg";
              nolangsalert.properties.timeout=2000;
              nolangsalert.properties.alertmsg=thisElement.form.elements.errornolangssel.value;
              nolangsalert.showalert();
            return false;
          }
          function replaceMyTreeLangData(candidatesMother) {
            var equivNode=candidatesMother.getChild({"name":this.properties.name});
            if (equivNode) {
              this.getRelationship("domelementsdata").getChild().properties.value=equivNode.getRelationship("domelementsdata").getChild().properties.value;
              for (var i=0;i<this.getRelationship("domelements").children.length; i++) {
                replaceMyTreeLangData.call(this.getRelationship("domelements").children[i], equivNode.getRelationship("domelements"));
              }
            }
          };
          var filterdatatrees=[];
          var filterlangs=[];
          for (var i=0; i<selectedLangs.length; i++) {
            for (var j=0; j<datalang.children.length; j++) {
              if (selectedLangs[i]==datalang.children[j].properties.id) {
                //position is j
                //we need to add the mother
                datatrees[j].parentNode=new NodeFemale();
                datatrees[j].parentNode.addChild(datatrees[j]);
                filterdatatrees.push(datatrees[j]);
                filterlangs.push(datalang.children[j]);
                break;
              }
            }
          }
          var langsToInsert=[];
          for (var i=0; i<filterdatatrees.length; i++) {
            var myLabelNode=domelementsroot.getNextChild({"name":"labels"}).cloneNode();
            var myTextNode=domelementsroot.getNextChild({"name":"texts"}).cloneNode();
            replaceMyTreeLangData.call(myLabelNode, filterdatatrees[i].parentNode);
            var rootNode=domelementsroot.cloneNode(1,1);
            rootNode.getRelationship("domelementsdata").addChild(domelementsroot.getRelationship("domelementsdata").getChild().cloneNode());
            rootNode.getRelationship("domelements").addChild(myTextNode);
            rootNode.getRelationship("domelements").addChild(myLabelNode);
            langsToInsert.push({"lang":filterlangs[i], "domdata": rootNode});
          }
          function createdomnodesarray(myroot) {
            var treearray=myroot.arrayFromTree();
            var domdataarray=[];
            for (var i=0; i<treearray.length;i++) {
              if (treearray[i].constructor.name=="NodeMale") {
                if (treearray[i].parentNode.properties.name=="domelementsdata") {
                  domdataarray.push(treearray[i]);
                }
              }
            }
            return domdataarray;
          }
          function languageAddCloneFirstLang(newLangNode, domdatachildren, listener){
            var newAddedLangNode=newLangNode.cloneNode();
            newAddedLangNode.loadfromhttp({action: "add myself", user_id: webuser.properties.id}, function(){
              //We fill the lang
              var newNode=languages.getChild().cloneNode();
              newNode.loadfromhttp({"action":"load my tree"}, function(){
                this.properties.id=newAddedLangNode.properties.id;
                var loadActions=[];
                var loadRequest=[];
                var datavalue=[];
                var myparameters={"action":"load my tree up"};
                for (var i=0; i<this.relationships.length; i++) {
                  if (this.relationships[i].properties.name=="domelementsdata") {
                    break;
                  }
                  for (var j=0; j<this.relationships[i].children.length; j++) {
                    var myLoadRequestData=this.relationships[i].children[j].toRequestData(myparameters);
                    loadRequest.push(myLoadRequestData);
                    datavalue.push(this.relationships[i].children[j].properties);
                    loadActions.push(myparameters);
                  }
                }
                //Now we have to send the load request and get the result.
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
                    var myparameters={"action":"add myself", language: newAddedLangNode.properties.id, user_id: webuser.properties.id};
                    var myInsertRequestData=this.nodelist[i].toRequestData(myparameters);
                    insertRequest.push(myInsertRequestData);
                    insertActions.push(myparameters);
                  }
                  //Now we add the domelementsdata
                  
                  for (var i=0; i<domdatachildren.length; i++) {
                    var myparameters={"action":"add myself", language: newAddedLangNode.properties.id, user_id: webuser.properties.id};
                    var myInsertRequestData=domdatachildren[i].toRequestData(myparameters);
                    insertRequest.push(myInsertRequestData);
                    insertActions.push(myparameters);
                  }
                  var ielement=new Node();
                  ielement.loadfromhttp({"parameters":insertActions, "nodes":insertRequest}, function(){
                    if (listener) listener.call(this);
                  });
                });
              });
            });
          };
          //Now we have to create the new languageAddCloneFirstLang(newLangNode, domdatachildren, listener)langs
          for (var i=0; i<langsToInsert.length; i++) {
            //Now we have to make the tree to a serial data
            var domdataInsert=createdomnodesarray(langsToInsert[i].domdata);
            //send error
            var waitalert=new Alert();
            waitalert.properties.alertclass="alertmsg";
            waitalert.properties.alertmsg=thisElement.form.elements.waitimp.value;
            waitalert.showalert();
            document.getElementById("butimp").disabled=true;
            languageAddCloneFirstLang(langsToInsert[i].lang, domdataInsert, function(){
              waitalert.hidealert();
              location.reload();
            });
          }
          return false;
        };
        </script>
      </span>
    </form>
  </div>
</template>
