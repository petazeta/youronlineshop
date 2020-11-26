<form>
  <div id="logform">
    <template>
      <div class="msgbox"  >
        <div data-id="butedit" class="btmiddleright"></div>
        <span></span>
        <script>
          var title=thisNode.getNextChild({"name":"titmsg"}).getRelationship({name:"domelementsdata"}).getChild();
          title.writeProperty(thisElement);
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
      </div>
      <div class="boxframe loginform">
        <div class="form-group" style="position:relative;">
          <div data-id="butedit" class="btmiddleright"></div>
          <label class="form-label" for="new_password"></label>
          <script>
            var myNode=thisNode.getNextChild({name:"newpwd"}).getRelationship("domelementsdata").getChild();
            myNode.writeProperty(thisElement);
            //adding the edition pencil
            if (webuser.isWebAdmin()) {
              DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
              myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            }
          </script>
          <input type="password" class="form-control" placeholder="" name="new_password">
          <script>
            var myNode=thisNode.getNextChild({name:"newpwd"}).getRelationship("domelementsdata").getChild();
            myNode.writeProperty(thisElement, null, "placeholder");
          </script>
        </div>
        <div class="form-group" style="position:relative;">
          <div data-id="butedit" class="btmiddleright"></div>
          <label class="form-label" for="repeat_password"></label>
          <script>
            var myNode=thisNode.getNextChild({name:"repeatpwd"}).getRelationship("domelementsdata").getChild();
            myNode.writeProperty(thisElement);
            //adding the edition pencil
            if (webuser.isWebAdmin()) {
              DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
              myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            }
          </script>
          <input type="password" class="form-control" placeholder="" name="repeat_password">
          <script>
            var myNode=thisNode.getNextChild({name:"repeatpwd"}).getRelationship("domelementsdata").getChild();
            myNode.writeProperty(thisElement, null, "placeholder");
          </script>
        </div>
        <div style="position:relative;">
          <div data-id="butedit" class="btmiddleright"></div>
          <button type="submit" class="btn" data-id="but"></button>
          <script>
            var myNode=thisNode.getNextChild({name:"btsmt"}).getRelationship("domelementsdata").getChild();
            myNode.writeProperty(thisElement);
          </script>
          <input type="hidden" disabled>
          <script>
            var myNode=thisNode.getNextChild({"name":"btsmt"}).getRelationship("domelementsdata").getChild();
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
        </div>
      </div>
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <input type="hidden" name="pwdCharError" disabled>
        <script>
          var myNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"logform"}).getNextChild({name:"pwdCharError"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement, null, "value");
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            thisElement.type="text";
          }
        </script>
      </div>
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <input type="hidden" name="pwdOk" disabled>
        <script>
          var myNode=thisNode.getNextChild({name:"pwdChangeOk"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            thisElement.type="text";
          }
        </script>
      </div>
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <input type="hidden" name="pwdNotOk" disabled>
        <script>
          var myNode=thisNode.getNextChild({name:"pwdChangeError"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            thisElement.type="text";
          }
        </script>
      </div>
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <input type="hidden" name="pwdDoubleError" disabled>
        <script>
          var myNode=thisNode.getNextChild({name:"pwdDoubleError"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            thisElement.type="text";
          }
        </script>
      </div>
      <div class="dashbuttons">
        <div style="position:relative;">
          <div data-id="butedit" class="btmiddleright"></div>
          <button type="button" class="btn" data-id="but"></button>
          <script>
            var bckloginlabel=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"backToLoginLb"});
            bckloginlabel.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
            thisElement.onclick=function(){
              (new Node()).refreshView(document.getElementById("centralcontent"), "templates/loggedindata.php");
            }
          </script>
          <input type="hidden" disabled>
          <script>
            var myNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"backToLoginLb"}).getRelationship("domelementsdata").getChild();
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
        </div>
      </div>
    </template>
  </div>
  <script>
    var pwdform=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"changepwd"});
    pwdform.refreshView(thisElement,thisElement.firstElementChild);
  </script>
</form>
<script>
  thisElement.onsubmit=function(event) {
    event.preventDefault();
    var userdata=new NodeMale();
    userdata.properties.new_password=this.elements.new_password.value;
    if (!DomMethods.checkValidData(userdata)) {
      //Errors in characters
      myalert.properties.alertmsg=this.elements.pwdCharError.value;
      if (this.elements[userdata.extra.errorKey]) this.elements[userdata.extra.errorKey].focus();
      myalert.properties.timeout=3000;
      myalert.showalert();
    }
    if (this.elements.new_password.value!=this.elements.repeat_password.value) {
      //Errors in characters
      myalert.properties.alertmsg=this.elements.pwdDoubleError.value;
      this.elements.repeat_password.focus();
      myalert.properties.timeout=3000;
      myalert.showalert();
    }
    webuser.updatePwd(thisElement.elements.new_password.value).then(function(myNode){
      if (myNode.extra.error) {
        myalert.properties.alertmsg=thisElement.elements.pwdNotOk.value;
        myalert.properties.timeout=3000;
        myalert.showalert();
      }
      myalert.properties.alertmsg=thisElement.elements.pwdOk.value;
      myalert.properties.timeout=3000;
      myalert.showalert();
    });
  }
</script>