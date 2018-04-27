<template id="cartboxtp">
  <table class="box">
    <tr>
       <th>
        <div class="adminsinglelauncher">
          <a href="" data-js='
            thisElement.innerHTML=thisNode.getRelationship({name: "websections_domelements"}).getChild({name: "crtbxtt"}).properties.innerHTML || websectionsroot.getRelationship({name: "websections_domelements"}).getChild({name: "emptyvallabel"}).properties.innerHTML;
            thisElement.onclick=function() {
              return false;
            };
           '>
          </a>
          <div style="
            position: absolute;
            left: 126px;
            top:-14px;
            "
            data-js='
              var editbuton=new NodeMale();
              editbuton.editpropertyname="innerHTML";
              editbuton.editelement=thisElement.parentElement.firstElementChild;
              editbuton.myNode=thisNode.getRelationship({name: "websections_domelements"}).getChild({name: "crtbxtt"});
              editbuton.myContainer=thisElement;
              editbuton.myTp=document.getElementById("butedittp").content;
              var refreshAdminButon=function() {
                if (!webuser.isWebAdmin()) {
                  while (editbuton.myContainer.firstChild) editbuton.myContainer.removeChild(editbuton.myContainer.firstChild);
                }
                else editbuton.refreshView();
              }
              //For when load first time and there is user logged in
              if (webuser.loadedses) {
                refreshAdminButon();
              }
              webuser.addEventListener("onLoadFromHTTP", refreshAdminButon);
          '>
          </div>
        </div>
       </th>
    </tr>
    <tr>
      <td class="content">
        <table class="boxInside">
          <tr>
             <td class="rowborder border-bottom">
             </td>
          </tr>
          <tr>
            <td>
              <table style="width:100%" data-js='
                var cartboxitems=mycart.getRelationship({name:"cartbox"}).children[0].getRelationship({name:"cartboxitem"});
                cartboxitems.refreshChildrenView(thisElement, document.getElementById("itemlisttp").content);
              '>
              </table>
            </td>
          </tr>
          <tr>
             <td class="rowborder">
             </td>
          </tr>
        </table>
      </td>
    </tr>                                  
  </table>
  <div class="space"></div>
  <table class="box">
    <tr>
      <th class="button">
        <div class="adminsinglelauncher">
          <a href="" data-js='
            var checkoutnode=thisNode.getRelationship({name: "websections_domelements"}).getChild({"name":"ckouttt"}) || websectionsroot.getRelationship({name: "websections_domelements"}).getChild({name: "emptyvallabel"}).properties.innerHTML;
            thisElement.innerHTML=checkoutnode.properties.innerHTML;
            checkoutnode.editpropertyname="innerHTML";
            checkoutnode.editelement=thisElement;
            thisElement.onmouseover=function(){
              checkoutnode.editpropertyname="name";
              checkoutnode.editelement=thisElement;
            };
            thisElement.onclick=function(){  
              if (mycart.getRelationship({name:"cartitem"}).children.length==0) {
                myalert.load({properties:{alertmsg: "Cart is empty", timeout:2000}});
                myalert.showalert();
                return false;
              }
              if (!webuser.properties.id) {
                webuser.loginbutton="checkout";
                webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loginform.php");
                return false;
              }
              else {
                webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/checkout1.php");
                return false;
              }
              return false;
            }
          '>
          </a>
          <div style="
            position: absolute;
            left: 126px;
            top:-14px;
            "
            data-js='
              var editbuton=new NodeMale();
              editbuton.editpropertyname="innerHTML";
              editbuton.editelement=thisElement.parentElement.firstElementChild;
              editbuton.myNode=thisNode.getRelationship({name: "websections_domelements"}).getChild({"name":"ckouttt"});
              editbuton.myContainer=thisElement;
              editbuton.myTp=document.getElementById("butedittp").content;
              var refreshAdminButon=function() {
                if (!webuser.isWebAdmin()) {
                  while (editbuton.myContainer.firstChild) editbuton.myContainer.removeChild(editbuton.myContainer.firstChild);
                }
                else editbuton.refreshView();
              }
              //For when load first time and there is user logged in
              if (webuser.loadedses) {
                refreshAdminButon();
              }
              webuser.addEventListener("onLoadFromHTTP", refreshAdminButon);
          '>
          </div>
        </div>
      </th>
    </tr>
  </table>
</template>