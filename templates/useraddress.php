<template>
  <div style="display:inline-grid; grid-template-columns: auto auto; width:40em;" class="formtable"></div>
  <script>
    /* This template is about to shoe the user data and address.
    If thisNode.formMode is true, the data is in form fields way.
    There is the user.checkValidData function added to webuser so it can be called once loaded this page to check vaild data when formMode is true.*/

    //there are two options for editing form fields, one is form mode and the other is text mode
    var myaddressFieldTp="templates/singlefield.php";
    var myaddressInputTp="templates/singleinput.php";
    var myaddressTp=myaddressFieldTp;
    if (thisNode.formMode) {
      myaddressTp=myaddressInputTp;
    }
    thisNode.getRelationship("usersdata").loadfromhttp({action: "load my children", user_id: thisNode.properties.id}, function() {
      this.getChild().editable=thisNode.editable;
      this.getChild().appendProperties(thisElement, myaddressTp);
      if (Config.chktaddressOn) {
        thisNode.getRelationship("addresses").loadfromhttp({action: "load my children", user_id: thisNode.properties.id}, function() {
          this.getChild().editable=thisNode.editable;
          this.getChild().appendProperties(thisElement, myaddressTp);
          //Resset addressFieldTp
          thisNode.addressFieldTp=null;
        });
      }
    });
    //Check data valideza and save in userdata and addressdata if formMode
    thisNode.checkValidData=function(myform) {
      var result=new NodeMale();
      result.extra={};
      var minchar=3;
      var maxchar=120;
      //check data and if formMode is true, it save the form data in webuser as webuser.userdata and webuser.addressdata
      var addressdata=thisNode.getRelationship({"name":"addresses"}).children[0];
      var userdata=thisNode.getRelationship({"name":"usersdata"}).children[0];
      if (thisNode.formMode) {
        //We will create a data from the fields
        userdata=new NodeMale();
        addressdata=new NodeMale();
        for (var i=0; i<thisNode.getRelationship("usersdata").childtablekeys.length; i++) {
          var propname=thisNode.getRelationship("usersdata").childtablekeys[i];
          if (propname=="id") continue;
          userdata.properties[propname]=myform.elements[propname].value;
        }
        if (Config.chktaddressOn) {
          for (var i=0; i<thisNode.getRelationship("addresses").childtablekeys.length; i++) {
            var propname=thisNode.getRelationship("addresses").childtablekeys[i];
            if (propname=="id") continue;
            addressdata.properties[propname]=myform.elements[propname].value;
          }
          //We save this result for later use
          thisNode.addressdata=addressdata;
        }
        thisNode.userdata=userdata;
      }
      function checkInput(data, fieldCharError) {
        for (var key in data.properties) {
          var value=data.properties[key];
          if(!data.properties.hasOwnProperty(key)) continue;
          if (key=="id") continue;
          if (!value ||
          (!DomMethods.checklength(value, minchar, maxchar))) {
            result.extra.charsNum=0;
            result.extra.error=true;
            result.extra.errorkey=key;
            var errorkey=key;
            result.extra.errorvalue=value;
            result.extra.errormsg=eval(fieldCharError);
            break;
          }
        }
      }
      function checkEmail(myemail, emailCharError){
        if (!DomMethods.validateEmail(myemail)) {
          result.extra.error=true;
          result.extra.errorkey="email";
          result.extra.errormsg=emailCharError;
        }
      }
      checkInput(userdata, myform.elements.fieldCharError.value);
      if (!result.extra.error) checkInput(addressdata, myform.elements.fieldCharError.value);
      if (!result.extra.error) {
        if (!DomMethods.validateEmail(userdata.properties.email)) {
          result.extra.error=true;
          result.extra.errorkey="email";
          result.extra.errormsg=myform.elements.emailCharError.value;
        }
      }
      if (result.extra.error) {
        myalert.properties.alertmsg=result.extra.errormsg;
        myalert.properties.timeout=5000;
        myalert.showalert();
        return false;
      }
      return true;
    };
  </script>
  <template>
    <div style="display:table;">
      <input type="hidden" name="fieldCharError">
      <script>
        var myNode=thisNode.getNextChild({name:"fieldCharError"}).getRelationship("domelementsdata").getChild();
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
      <input type="hidden" name="emailCharError">
      <script>
        var myNode=thisNode.getNextChild({name:"emailCharError"}).getRelationship("domelementsdata").getChild();
        myNode.writeProperty(thisElement, null, "value");
        var launcher = new Node();
        launcher.thisNode = myNode;
        launcher.editElement = thisElement;
        launcher.thisAttribute = "value";
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        if (webuser.isWebAdmin()) thisElement.type="input";
      </script>
    </div>
  </template>
  <div></div>
  <script>
    //This script will show the template
    var userdataform=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"userdataform"});
    userdataform.refreshView(thisElement,thisElement.previousElementSibling);
  </script>
</template>