<!--
-->
<div style="text-align:center">
  <form>
    <div>
      <div class="msgbox">
        <table style="margin:auto; text-align:left; margin-bottom:1em;">
          <tr>
            <td style="position:relative;">
              <input type="radio" value="tit" name="dataoption">
              <div data-id="butedit" class="btmiddleright"></div>
              <span></span>
              <script>
                if (!webuser.isWebAdmin() && !webuser.isSystemAdmin()) {
                  thisElement.parentElement.parentElement.style.display="none"
                }
                var title=thisNode.getNextChild({"name":"exptit"}).getRelationship({name:"domelementsdata"}).getChild();
                title.writeProperty(thisElement);
                //adding the edition pencil
                if (webuser.isWebAdmin()) {
                  DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
                  title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
                }
              </script>
            </td>
          </tr>
          <tr>
            <td style="position:relative;">
              <input type="radio" value="menus" name="dataoption">
              <div data-id="butedit" class="btmiddleright"></div>
              <span></span>
              <script>
                if (!webuser.isWebAdmin() && !webuser.isSystemAdmin()) {
                  thisElement.parentElement.parentElement.style.display="none"
                }
                var title=thisNode.getNextChild({"name":"expmenus"}).getRelationship({name:"domelementsdata"}).getChild();
                title.writeProperty(thisElement);
                //adding the edition pencil
                if (webuser.isWebAdmin()) {
                  DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
                  title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
                }
              </script>
            </td>
          </tr>
          <tr>
            <td style="position:relative;">
              <input type="radio" value="catalog" name="dataoption">
              <div data-id="butedit" class="btmiddleright"></div>
              <span></span>
              <script>
                if (!webuser.isWebAdmin() && !webuser.isProductAdmin()  && !webuser.isSystemAdmin()) {
                  thisElement.parentElement.parentElement.style.display="none"
                }
                var title=thisNode.getNextChild({"name":"expcatg"}).getRelationship({name:"domelementsdata"}).getChild();
                title.writeProperty(thisElement);
                //adding the edition pencil
                if (webuser.isWebAdmin()) {
                  DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
                  title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
                }
              </script>
            </td>
          </tr>
          <tr>
            <td style="position:relative;">
              <input type="radio" value="users" name="dataoption">
              <div data-id="butedit" class="btmiddleright"></div>
              <span></span>
              <script>
                if (!webuser.isUserAdmin() && !webuser.isSystemAdmin()) {
                  thisElement.parentElement.parentElement.style.display="none"
                }
                var title=thisNode.getNextChild({"name":"expusers"}).getRelationship({name:"domelementsdata"}).getChild();
                title.writeProperty(thisElement);
                //adding the edition pencil
                if (webuser.isWebAdmin()) {
                  DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
                  title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
                }
              </script>
            </td>
          </tr>
        </table>
      </div>
    </div>
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
    <span style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <button type="button" class="btn" data-id="but"></button>
      <script>
      var title=thisNode.getNextChild({"name":"butexp"}).getRelationship({name:"domelementsdata"}).getChild();
      title.writeProperty(thisElement);
      
      //This facility is for export/import the customized data of a shop so we could update the shop software and keep the data
      thisElement.onclick=function(){
        if (thisElement.form.dataoption.value=="menus") {
         exportData(domelementsroot.getRelationship("domelements").getChild({name:"texts"}));
        }
        else if (thisElement.form.dataoption.value=="tit") {
          exportData(domelementsroot.getRelationship("domelements").getChild({name:"labels"}).getRelationship("domelements").getChild({name:"top"}));
        }
        else if (thisElement.form.dataoption.value=="catalog") {
          var categoriesrootmother=new NodeFemale();
          categoriesrootmother.properties.childtablename="TABLE_ITEMCATEGORIES";
          categoriesrootmother.properties.parenttablename="TABLE_ITEMCATEGORIES";
          categoriesrootmother.loadfromhttp({action:"load root"}).then(function(myNode){
            exportData(myNode.getChild());
          });
        }
        else if (thisElement.form.dataoption.value=="users") {
          var usertypemother=new NodeFemale();
          usertypemother.properties.childtablename="TABLE_USERSTYPES";
          usertypemother.loadfromhttp({action:"load all", filter: "type='customer'"}).then(function(myNode){
            myNode.getChild().loadfromhttp({action:"load my tree"}).then(function(myNode){
              var myparams=[];
              var mydatanodes=[];
              var usersrootmother=myNode.getRelationship("users");
              for (var i=0; i<usersrootmother.children.length; i++) {
                myparams.push({action:"load my relationships"});
                mydatanodes.push(usersrootmother.children[i].toRequestData({action:"load my relationships"}));
              }
              var nodeRequest=new Node();
              nodeRequest.loadfromhttp({"parameters":myparams, "nodes":mydatanodes}).then(function(myNode){
                var myparams=[];
                var mydatanodes=[];
                for (var i=0; i<myNode.nodelist.length; i++) {
                  usersrootmother.children[i].load(myNode.nodelist[i]);
                  myparams.push({action:"load my children"});
                  mydatanodes.push(usersrootmother.children[i].getRelationship("usersdata").toRequestData({action:"load my children"}));
                  myparams.push({action:"load my children"});
                  mydatanodes.push(usersrootmother.children[i].getRelationship("addresses").toRequestData({action:"load my children"}));
                }
                var nodeRequest=new Node();
                nodeRequest.loadfromhttp({"parameters":myparams, "nodes":mydatanodes}).then(function(myNode){
                  var arrayusersdata=[];
                  var arrayaddresses=[];
                  for (var i=0; i<myNode.nodelist.length; i++) {
                    if (myNode.nodelist[i].properties.name=="usersdata") {
                      arrayusersdata.push(myNode.nodelist[i]);
                    }
                    else if (myNode.nodelist[i].properties.name=="addresses") {
                       arrayaddresses.push(myNode.nodelist[i]);
                    }
                  }
                  for (var i=0; i<usersrootmother.children.length; i++) {
                    usersrootmother.children[i].getRelationship("usersdata").load(arrayusersdata[i]);
                    usersrootmother.children[i].getRelationship("addresses").load(arrayaddresses[i]);
                  }
                  //Now we charge the userstypes relationship
                  var myparams=[];
                  var mydatanodes=[];
                  for (var i=0; i<usersrootmother.children.length; i++) {
                    myparams.push({action:"load my tree up"});
                    mydatanodes.push(usersrootmother.children[i].toRequestData({action:"load my tree up"}));
                  }
                  var nodeRequest=new Node();
                  nodeRequest.loadfromhttp({"parameters":myparams, "nodes":mydatanodes}).then(function(myNode){
                    for (var i=0; i<myNode.nodelist.length; i++) {
                      usersrootmother.children[i].parentNode=myNode.nodelist[i].parentNode;
                    }
                  });
                  usersrootmother.avoidrecursion();
                  thisElement.form.result.value=JSON.stringify(usersrootmother);
                });
              });
            });
          });
        }
        else {
          //we show the alert message No selection
          var mynoselalert=new Alert();
          mynoselalert.properties.alertclass="alertmsg";
          mynoselalert.properties.timeout=2000;
          mynoselalert.properties.alertmsg=thisElement.form.elements.noselection.value;
          console.log(thisElement.form.elements);
          mynoselalert.showalert();
          return false;
        }
        function exportData(rootelement){
          //data from the language
          var langdata=languages.toRequestData({action: "add my tree"});
          //data from the structure
          var rootClone=rootelement.cloneNode(null, 0);
          rootClone.loadfromhttp({action: "load my tree"}).then(function(myNode) {
            var datatoinsert={"languages": langdata, "tree": myNode.toRequestData({action: "add my tree"})};
            thisElement.form.result.value=JSON.stringify(datatoinsert);
          });
        };
        return false;
      };
      </script>
      <input type="hidden" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"butexp"}).getRelationship({name:"domelementsdata"}).getChild();
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
    <div style="padding-top: 10px">
      <textarea name="result" rows="10" cols="50"></textarea>
    </div>
    <div class="space"></div>
    <div class="msgbox">
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
    <div style="display:table; position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="impalertmsg" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"imploadingmsg"}).getRelationship({name:"domelementsdata"}).getChild();
        myNode.writeProperty(thisElement);
        if (webuser.isWebAdmin()) {
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: "value"});
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          thisElement.type="text";
        }
      </script>
    </div>
    <div style="display:table; position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="noselection" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"noselection"}).getRelationship({name:"domelementsdata"}).getChild();
        myNode.writeProperty(thisElement);
        if (webuser.isWebAdmin()) {
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: "value"});
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          thisElement.type="text";
        }
      </script>
    </div>
    <div style="display:table; position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="impnocontent" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"impnocontent"}).getRelationship({name:"domelementsdata"}).getChild();
        myNode.writeProperty(thisElement);
        if (webuser.isWebAdmin()) {
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: "value"});
          thisElement.type="text";
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
        }
      </script>
    </div>
    <div style="display:table; position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="implangerror" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"implangerror"}).getRelationship({name:"domelementsdata"}).getChild();
        myNode.writeProperty(thisElement, null, "value");
        if (webuser.isWebAdmin()) {
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: "value"});
          thisElement.type="text";
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
        }
      </script>
    </div>
    <span style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <button type="button" data-id="but" class="btn"></button>
      <script>
      var title=thisNode.getNextChild({"name":"butimp"}).getRelationship({name:"domelementsdata"}).getChild();
      title.writeProperty(thisElement);
      
      thisElement.onclick=function(){
        if (!thisElement.form.impdata.value) {
          var nocontentalert=new Alert();
          nocontentalert.properties.alertclass="alertmsg";
          nocontentalert.properties.timeout=2000;
          nocontentalert.properties.alertmsg=thisElement.form.elements.impnocontent.value;
          nocontentalert.showalert();
          return false;
        }
        if (!thisElement.form.dataoption.value){
          //we show the alert message No selection
          var mynoselalert=new Alert();
          mynoselalert.properties.alertclass="alertmsg";
          mynoselalert.properties.timeout=2000;
          mynoselalert.properties.alertmsg=thisElement.form.elements.noselection.value;
          mynoselalert.showalert();
          return false;
        }
        
        if  (thisElement.form.dataoption.value=="users") {
          var myimpalert=new Alert();
          myimpalert.properties.alertclass="alertmsg";
          myimpalert.properties.alertmsg=thisElement.form.elements.impalertmsg.value;
          myimpalert.showalert();
           //First we add the remove tree request
          var usertypemother=new NodeFemale();
          usertypemother.properties.childtablename="TABLE_USERSTYPES";
          usertypemother.loadfromhttp({action:"load all", filter: "type='customer'"}).then(function(myNode){
            myNode.children[0].loadfromhttp({action:"load my tree"}).then(function(myNode){
              myNode.getRelationship("users").loadfromhttp({action:"delete my children"}, function(){
                var newusersmother=new NodeFemale();
                newusersmother.load(JSON.parse(thisElement.form.impdata.value));
                newusersmother.partnerNode.properties.id=usertypemother.children[0].properties.id;
                newusersmother.loadfromhttp({action:"add my children"}, function(){
                  myimpalert.hidealert();
                  location.reload();
                });
              });
            });
          });
          return false;
        }
        var requestResultData=[]; //Full final request container
        var requestResultActions=[]; //Vars for result 
        
        //We split the languages in one array of langdata for each language
        var data=JSON.parse(thisElement.form.impdata.value);

        var datalang=data.languages;
        
        //Now we check that the languages meet the site languages
        var languagesmatch=false;
        if (datalang.children.length==languages.children.length) {
          languagesmatch=true;
          for (var i=0; i<datalang.children.length; i++) {
            if (datalang.children[i].properties.id!=languages.children[i].properties.id) {
              languagesmatch=false;
              break;
            }
          }
        }
        
        if (!languagesmatch) {
          var mylangerror=new Alert();
          mylangerror.properties.alertclass="alertmsg";
          mylangerror.properties.timeout=2000;
          mylangerror.properties.alertmsg=thisElement.form.elements.implangerror.value;
          mylangerror.showalert();
          return false;
        }

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
        else if  (thisElement.form.dataoption.value=="catalog") {
          var categoriesrootmother=new NodeFemale();
          categoriesrootmother.properties.childtablename="TABLE_ITEMCATEGORIES";
          categoriesrootmother.properties.parenttablename="TABLE_ITEMCATEGORIES";
          categoriesrootmother.loadfromhttp({action:"load root"}).then(function(myNode){
            impData(myNode.getChild());
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

          loadelement.loadfromhttp({"parameters":requestResultActions, "nodes":requestResultData}).then(function(){
            if (datalang.children.length<2) {
              myimpalert.hidealert();
              location.reload();
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
            nodeRequest.loadfromhttp({"parameters":requestActions, "nodes":requestData}).then(function(){
              myimpalert.hidealert();
              location.reload();
            });
          }); 
        }
        return false;
      };
      </script>
      <input type="hidden" disabled>
      <script>
        var myNode=thisNode.getNextChild({"name":"butimp"}).getRelationship("domelementsdata").getChild();
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