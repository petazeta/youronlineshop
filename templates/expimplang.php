<!--
-->
<div style="text-align:center">
  <div class="msgbox" style="position:relative;">
    <div data-id="butedit" class="btmiddleright"></div>
    <span></span>
    <script>
      var title=thisNode.getNextChild({"name":"tit"}).getRelationship({name:"domelementsdata"}).getChild();
      title.writeProperty(thisElement);
      //adding the edition pencil
      if (webuser.isWebAdmin()) {
        DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
        title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
      }
    </script>
  </div>
  <form>
    <div class="msgbox" id="containerlangsexp"></div>
    <template id="tplangsexp">
      <div style="margin:auto; text-align:left; margin-bottom:0.2em;">
        <input type="checkbox" value="" name="">
        <script>
          thisNode.writeProperty(thisElement, "id", "value");
          thisNode.writeProperty(thisElement, "code", "name");
        </script>
        <span></span>
        <script>
          thisNode.writeProperty(thisElement, "code");
        </script>
      </div>
    </template>
    <script>
      languages.refreshChildrenView(document.getElementById("containerlangsexp"), document.getElementById("tplangsexp"));
    </script>
    <div>
      <div class="msgbox" style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <span></span>
        <script>
          var title=thisNode.getNextChild({"name":"titexp"}).getRelationship({name:"domelementsdata"}).getChild();
          title.writeProperty(thisElement);
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
      </div>
    </div>
    <div style="display:table; position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="errornolangssel" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"errornolangssel"}).getRelationship({name:"domelementsdata"}).getChild();
        myNode.writeProperty(thisElement, null, "value");
        if (webuser.isWebAdmin()) {
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: "value"});
          thisElement.type="text";
        }
      </script>
    </div>
    <span>
      <div data-id="butedit" class="btmiddleright"></div>
      <button type="button" class="btn" data-id="but"></button>
      <script>
      var title=thisNode.getNextChild({"name":"butexp"}).getRelationship({name:"domelementsdata"}).getChild();
      title.writeProperty(thisElement);
      
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
        var noselectedchildren=[];
        for (var i=0; i<langdata.children.length; i++) {
          if (!selectedLangs.includes(langdata.children[i].properties.id)) {
            noselectedchildren.push(langdata.children[i]);
          }
        }
        for (var i=0; i<noselectedchildren.length; i++) {
          langdata.removeChild(noselectedchildren[i]);
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
        nodeRequest.loadfromhttp({"parameters":myParams, "nodes":myNodes}).then(function(myNode){
          var nodesInsert=[];
          for (var i=0; i<myNode.nodelist.length; i++) {
            //we restables rootnode properties data
            myNode.nodelist[i].properties=rootClone.properties;
            nodesInsert.push(myNode.nodelist[i].toRequestData({action: "add my tree"}));
          }
          var datatoinsert={"languages": langdata, "trees": nodesInsert};
          thisElement.form.result.value=JSON.stringify(datatoinsert);
        });

        return false;
      };
      </script>
      <input type="hidden" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"butexp"}).getRelationship({name:"domelementsdata"}).getChild();
        myNode.writeProperty(thisElement);
        thisElement.onblur=function(){
          thisElement.type="hidden";
          thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
        }
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
        }
      </script>
    </span>
    <div style="padding-top: 10px">
      <textarea name="result" rows="10" cols="50"></textarea>
    </div>
    <div style="display:table; position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="errornolangsmsg" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"errornolangs"}).getRelationship({name:"domelementsdata"}).getChild();
        myNode.writeProperty(thisElement, null, "value");
        if (webuser.isWebAdmin()) {
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: "value"});
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          thisElement.type="text";
        }
      </script>
    </div>
    <div style="display:table; position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="errornodata" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"errornodata"}).getRelationship({name:"domelementsdata"}).getChild();
        myNode.writeProperty(thisElement, null, "value");
        if (webuser.isWebAdmin()) {
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: "value"});
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          thisElement.type="text";
        }
      </script>
    </div>
    <div style="display:table; position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="loadedlangs" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"loadedlangs"}).getRelationship({name:"domelementsdata"}).getChild();
        myNode.writeProperty(thisElement, null, "value");
        if (webuser.isWebAdmin()) {
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: "value"});
          thisElement.type="text";
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
        }
      </script>
    </div>
    <div class="space"></div>
    <div class="msgbox" style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <span></span>
      <script>
        var title=thisNode.getNextChild({"name":"titimp"}).getRelationship({name:"domelementsdata"}).getChild();
        title.writeProperty(thisElement);
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
        }
      </script>
    </div>
    <div style="padding-top: 10px">
      <textarea name="impdata" rows="10" cols="50"></textarea>
    </div>
    <span style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <button type="button" class="btn" data-id="but"></button>
      <script>
      var title=thisNode.getNextChild({"name":"butload"}).getRelationship({name:"domelementsdata"}).getChild();
      title.writeProperty(thisElement);
      //adding the edition pencil
      if (webuser.isWebAdmin()) {
        DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
        title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
      }
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

        var datalang=new NodeFemale();
        datalang.load(data.languages);
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
        datalang.refreshChildrenView(document.getElementById("loadedlangscontainer"), document.getElementById("tplangsexp"));
        //Lets put a notice
        var notice=thisNode.getNextChild({"name":"loadedlangs"}).getRelationship({name:"domelementsdata"}).getChild();
        notice.writeProperty(document.getElementById("loadedlangsnotice"));
        
        //Now we have to enable the Import Button
        document.getElementById("butimp").disabled=false;
        return false;
      };
      </script>
      <input type="hidden" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"butload"}).getRelationship({name:"domelementsdata"}).getChild();
        myNode.writeProperty(thisElement);
        thisElement.onblur=function(){
          thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
        }
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          thisElement.type="text";
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
        }
      </script>
    </span>
    <div>
      <div class="msgbox">
        <div style="padding-bottom: 10px;" id="loadedlangsnotice"></div>
        <div id="loadedlangscontainer" style="margin:auto; text-align:left; margin-bottom:1em;"></div>
      </div>
    </div>
    <div style="display:table; position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="waitimp" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"waitimp"}).getRelationship({name:"domelementsdata"}).getChild();
        myNode.writeProperty(thisElement);
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: "value"});
          thisElement.type="text";
        }
      </script>
    </div>
    <span style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <button type="button" id="butimp" data-id="but" disabled></button>
      <script>
      var title=thisNode.getNextChild({"name":"butimp"}).getRelationship({name:"domelementsdata"}).getChild();
      title.writeProperty(thisElement);
      
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
        //We load domelements textNode data
        var myTextNode=domelementsroot.getNextChild({"name":"texts"}).cloneNode();
        myTextNode.loadfromhttp({action: "load my tree", language: languages.getChild().properties.id}).then(function(myNode){
          for (var i=0; i<filterdatatrees.length; i++) {
            var myLabelNode=domelementsroot.getNextChild({"name":"labels"}).cloneNode();
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
          var languageAddCloneFirstLang=(newLangNode, domdatachildren) => {
            return new Promise((resolve, reject) => {
              var newAddedLangNode=newLangNode.cloneNode();
              newAddedLangNode.loadfromhttp({action: "add myself"}).then(function(){
                //We fill the lang
                var newNode=languages.getChild().cloneNode();
                newNode.loadfromhttp({"action":"load my tree"}).then(function(myNode){
                  myNode.properties.id=newAddedLangNode.properties.id;
                  var loadActions=[];
                  var loadRequest=[];
                  var datavalue=[];
                  var myparameters={"action":"load my tree up"};
                  for (var i=0; i<myNode.relationships.length; i++) {
                    if (myNode.relationships[i].properties.name!="domelementsdata") {
                      for (var j=0; j<myNode.relationships[i].children.length; j++) {
                        var myLoadRequestData=myNode.relationships[i].children[j].toRequestData(myparameters);
                        loadRequest.push(myLoadRequestData);
                        datavalue.push(myNode.relationships[i].children[j].properties);
                        loadActions.push(myparameters);
                      }
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
                      var myparameters={"action":"add myself", language: newAddedLangNode.properties.id};
                      var myInsertRequestData=myNode.nodelist[i].toRequestData(myparameters);
                      insertRequest.push(myInsertRequestData);
                      insertActions.push(myparameters);
                    }
                    //Now we add the domelementsdata
                    
                    for (var i=0; i<domdatachildren.length; i++) {
                      var myparameters={"action":"add myself", language: newAddedLangNode.properties.id};
                      var myInsertRequestData=domdatachildren[i].toRequestData(myparameters);
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
            });
          };
          //Now we have to create the new languageAddCloneFirstLang(newLangNode, domdatachildren, listener)langs
          iterationAddLangs=[];
          for (let i=0; i<langsToInsert.length; i++) {
            //Now we have to make the tree to a serial data
            var domdataInsert=createdomnodesarray(langsToInsert[i].domdata);
            //send error
            var waitalert=new Alert();
            waitalert.properties.alertclass="alertmsg";
            waitalert.properties.alertmsg=thisElement.form.elements.waitimp.value;
            waitalert.showalert();
            document.getElementById("butimp").disabled=true;
            iterationAddLangs.push(languageAddCloneFirstLang(langsToInsert[i].lang, domdataInsert));
          }
          Promise.all(iterationAddLangs).then(function(){
            waitalert.hidealert();
            location.reload();
            //domelementsrootmother.dispatchEvent("loadLabels");
          });
        });
        return false;
      };
      </script>
      <input type="hidden" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"butimp"}).getRelationship({name:"domelementsdata"}).getChild();
        myNode.writeProperty(thisElement);
        thisElement.onblur=function(){
          thisElement.type="hidden";
          thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
        }
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
        }
      </script>
    </span>
  </form>
</div>