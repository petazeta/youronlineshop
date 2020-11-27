<!-- 
This template shows the user data and user address and allows to save the changes when fieldtyp input.
Param showAddress (if false shows just some data)
Param fieldtype: input / textnode
-->
<form>
  <div class="boxframe" style="align-items: center; display: flex; flex-flow: column; margin: 1em;">
    <div></div>
    <script>
      thisNode.refreshView(thisElement,"templates/userdata.php", thisParams);
      if (thisParams.fieldtype=='input') {
        thisElement.parentElement.querySelector('[data-id=save]').style.display='block';
      }
    </script>
    <div data-id="save" style="display: none;">
      <div style="margin-top:1em;position:relative">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="submit" class="btn" data-id="but"></button>
        <script>
          //Cancelation of submit is important because there could be enter keyboard pressing in fields
          thisElement.form.addEventListener("submit", function(event) {
            event.preventDefault();
          });
          var savelabel=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"not located"}).getNextChild({name:"save"});
          savelabel.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
          thisElement.addEventListener("click", function(event) {
            event.preventDefault();
            var userdata=DomMethods.formToData(thisNode.getRelationship("usersdata"), this.form);
            if (thisParams.showAddress) {
              var addressdata=DomMethods.formToData(thisNode.getRelationship("addresses"), this.form);
            }
            if (!DomMethods.checkValidData(userdata)) {
              //Errors in characters
              myalert.properties.alertmsg=this.form.elements.fieldCharError.value;
              if (this.form.elements[userdata.extra.errorKey]) this.form.elements[userdata.extra.errorKey].focus();
              myalert.properties.timeout=5000;
              myalert.showalert();
            }
            else if (addressdata && !DomMethods.checkValidData(addressdata)) {
              //Errors in characters
              myalert.properties.alertmsg=this.form.elements.fieldCharError.value;
              if (this.form.elements[addressdata.extra.errorKey]) this.form.elements[addressdata.extra.errorKey].focus();
              myalert.properties.timeout=5000;
              myalert.showalert();
            }
            else if (!DomMethods.validateEmail(userdata.properties.email)) {
              //emal format error
              myalert.properties.alertmsg=this.form.elements.emailCharError.value;
              this.form.elements.email.focus();
              myalert.properties.timeout=5000;
              myalert.showalert();
            }
            else {
              myUpdateProp(thisNode.getRelationship("usersdata"), userdata).then(function(){
                if (addressdata) {
                  myUpdateProp(thisNode.getRelationship("addresses"), addressdata).then(function(){
                    var savedlabel=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"not located"}).getNextChild({name:"saved"});
                    myalert.properties.alertmsg=savedlabel.getRelationship("domelementsdata").getChild().properties.value;
                    myalert.properties.timeout=3000;
                    if (event.isTrusted) myalert.showalert();
                    thisNode.dispatchEvent('saveuserdata');
                  });
                }
                else {
                  var savedlabel=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"not located"}).getNextChild({name:"saved"});
                  myalert.properties.alertmsg=savedlabel.getRelationship("domelementsdata").getChild().properties.value;
                  myalert.properties.timeout=3000;
                  if (event.isTrusted) myalert.showalert();
                  thisNode.dispatchEvent('saveuserdata');
                }
              });
            }
            function myUpdateProp(myrel, mydata) {
              return new Promise((resolve, reject)=>{
                if (DomMethods.checkDataChange(myrel, mydata)) {
                  //Now we save the data: save tree
                  myrel.getChild().loadfromhttp({action:"edit my properties", properties: mydata.properties}).then(function(){
                    for (var i=0; i<myrel.childtablekeys.length; i++) {
                      var propname=myrel.childtablekeys[i];
                      if (propname=="id") continue;
                      myrel.getChild().properties[propname]=userdata.properties[propname];
                    }
                    resolve();
                  });
                }
                else {
                  resolve();
                }
              });
            }
          });
        </script>
        <input type="hidden" disabled>
        <script>
          var myNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"not located"}).getNextChild({name:"save"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          thisElement.onblur=function(){
            thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
            thisElement.type="hidden";
          }
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
      </div>
    </div>
  </div>
  <div>
    <div style="position:relative; display: inline-block;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="fieldCharError" disabled>
      <script>
        //This script will show the template
        var userdataform=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"userdataform"});
        var myNode=userdataform.getNextChild({name:"fieldCharError"}).getRelationship("domelementsdata").getChild();
        myNode.writeProperty(thisElement, null, "value");
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: "value"});
          thisElement.type="text";
        }
      </script>
    </div>
  </div>
  <div>
    <div style="position:relative; display: inline-block;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="emailCharError" disabled>
      <script>
        //This script will show the template
        var userdataform=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"userdataform"});
        var myNode=userdataform.getNextChild({name:"emailCharError"}).getRelationship("domelementsdata").getChild();
        myNode.writeProperty(thisElement, null, "value");
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: "value"});
          thisElement.type="text";
        }
      </script>
    </div>
  </div>
</form>