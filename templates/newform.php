<form>
  <template>
    <div class="msgbox" style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <span></span>
      <script>
        var title=thisNode.getNextChild({"name":"signuptt"}).getRelationship({name:"domelementsdata"}).getChild();
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
        <div data-id="buteditlabel" class="btmiddleleft"></div>
        <div data-id="butedit" class="btmiddleright"></div>
        <label class="form-label" for="user_name"></label>
        <script>
          var myNode=thisNode.getNextChild({name:"userName"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=buteditlabel]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=buteditlabel]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
        <input class="form-control" placeholder="" name="user_name">
        <script>
          var myNode=thisNode.getNextChild({name:"userName"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement, null, "placeholder");
        </script>
      </div>
      <div class="form-group" style="position:relative;">
        <div data-id="buteditlabel" class="btmiddleleft"></div>
        <div data-id="butedit" class="btmiddleright"></div>
        <label class="form-label" for="user_password"></label>
        <script>
          var myNode=thisNode.getNextChild({name:"password"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=buteditlabel]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=buteditlabel]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
        <input type="password" class="form-control" placeholder="" name="user_password">
        <script>
          var myNode=thisNode.getNextChild({name:"password"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement, null, "placeholder");
        </script>
      </div>
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="submit" class="btn" data-id="but"></button>
        <script>
          var myNode=thisNode.getNextChild({name:"signIn"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
        </script>
        <input type="hidden" disabled>
        <script>
          var myNode=thisNode.getNextChild({name:"signIn"}).getRelationship("domelementsdata").getChild();
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
      <input type="hidden" name="userCharError" disabled>
      <script>
        var myNode=thisNode.getNextChild({name:"userCharError"}).getRelationship("domelementsdata").getChild();
        myNode.writeProperty(thisElement);
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: "value"});
          thisElement.type="text";
        }
      </script>
    </div>
    <div style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="pwdCharError" disabled>
      <script>
        var myNode=thisNode.getNextChild({name:"pwdCharError"}).getRelationship("domelementsdata").getChild();
        myNode.writeProperty(thisElement);
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          thisElement.type="text";
        }
      </script>
    </div>
    <div style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="signedIn" disabled>
      <script>
        var myNode=thisNode.getNextChild({name:"signedIn"}).getRelationship("domelementsdata").getChild();
        myNode.writeProperty(thisElement);
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          thisElement.type="text";
        }
      </script>
    </div>
    <div style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="userExistsError" disabled>
      <script>
        var myNode=thisNode.getNextChild({name:"userExistsError"}).getRelationship("domelementsdata").getChild();
        myNode.writeProperty(thisElement);
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          thisElement.type="text";
        }
      </script>
    </div>
    <div class="dashbuttons">
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="button" class="btn" data-id="but"></button>
        <script>
          var myNode=thisNode.getNextChild({name:"loginBack"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          thisElement.onclick=function(){
            (new NodeMale()).refreshView(document.getElementById("centralcontent"), "templates/loginform.php");
          }
        </script>
        <input type="hidden" disabled>
        <script>
          var myNode=thisNode.getNextChild({name:"loginBack"}).getRelationship("domelementsdata").getChild();
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
  <div id="logform"></div>
  <script>
    var logform=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"logform"});
    logform.refreshView(thisElement,thisElement.previousElementSibling);
  </script>
</form>
<script>
  thisElement.addEventListener("submit", function(e) {
    e.preventDefault();
    
    var userdata=new NodeMale();
    userdata.properties.user_name=this.elements.user_name.value;
    userdata.properties.user_password=this.elements.user_password.value;

    if (!DomMethods.checkValidData(userdata)) {
      //Errors in characters
      if (userdata.extra.errorKey=="user_name") myalert.properties.alertmsg=this.elements.userCharError.value;
      else if (userdata.extra.errorKey=="user_password") myalert.properties.alertmsg=this.elements.pwdCharError.value;
      if (this.elements[userdata.extra.errorKey]) this.elements[userdata.extra.errorKey].focus();
      myalert.properties.timeout=3000;
      myalert.showalert();
      return false;
    }
    webuser.create(thisElement.elements.user_name.value, thisElement.elements.user_password.value).then(function(myNode){
      if (myNode.extra && myNode.extra.error) {
        myalert.properties.alertmsg=thisElement.elements[myNode.extra.errorName].value;
        myalert.properties.timeout=3000;
        myalert.showalert();
        return false;
      }
      myalert.properties.alertmsg=thisElement.elements.signedIn.value;
      myalert.properties.timeout=3000;
      myalert.showalert();
    });
    return false;
  });
</script>