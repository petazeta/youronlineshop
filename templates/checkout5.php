<template>
  <!-- we show order made and give the option to go to the user area-->
  <template>
    <div class="msgbox">
      <span></span>
      <script>
        var title=thisNode.getNextChild({"name":"chkt5add"}).getRelationship({name:"domelementsdata"}).getChild();
        title.writeProperty(thisElement);
        //adding the edition pencil
        var launcher = new Node();
        launcher.thisNode = title;
        launcher.editElement = thisElement;
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
      </script>
    </div>
    <div></div>
    <script>
      //We show the order
      webuser.getRelationship({name:"orders"}).getChild().refreshView(thisElement, "templates/order.php");
    </script>
    <div style="margin:1em auto; display:table;">
      <button class="btn" style="visibility:hidden"></button>
      <script>
        var order=webuser.getRelationship({name:"orders"}).getChild();
        var orderpaymenttype=order.getRelationship({name:"orderpaymenttypes"}).getChild();
        if (orderpaymenttype && orderpaymenttype.properties.vars) {
          thisElement.style.visibility="visible";
          //We create the form
          var f = document.createElement("form");
          f.setAttribute('method',"post");
          var myVars=JSON.parse(orderpaymenttype.properties.vars);
          var sendVars={};
          for (var key in myVars) {
            if (!myVars.hasOwnProperty(key)) continue;
            if (key=='total') {
              //sendVars[myVars[key]]=order.properties.total; //order total need to be executed first order
              var myorderitems=order.getRelationship({name:"orderitems"});
              var myordership=order.getRelationship({name:"ordershippingtypes"});
              var sumTotal=function(node) {
                var total=0;
                var i=node.children.length;
                while (i--) {
                  var quantity=node.children[i].properties.quantity;
                  if (!quantity) quantity=1;
                  total=total+quantity * node.children[i].properties.price;
                }
                return total;
              }
              var total=sumTotal(myorderitems) + sumTotal(myordership);
              sendVars[myVars[key]]=total;
            }
            else if (key=='total_name') {
              var totallabel=thisNode.getNextChild({"name":"order"}).getNextChild({"name":"total"}).getRelationship({name:"domelementsdata"}).getChild();
              sendVars[myVars[key]]=totallabel.properties.value; //order total label value
            }
            else if (key=='action') {
              f.setAttribute('action',myVars[key]); //form url
            }
            else {
              sendVars[key]=myVars[key];
            }
          }
          for (var key in sendVars) {
            //populate form
            var i = document.createElement("input"); //input element, text
            i.setAttribute('type',"text");
            i.setAttribute('name',key);
            i.setAttribute('value',sendVars[key]);
            f.appendChild(i);
          }
          document.getElementsByTagName('body')[0].appendChild(f);
          thisElement.onclick=function(){
            f.submit();
          };

          var paymentlabel=thisNode.getNextChild({"name":"chkt5pay"}).getRelationship({name:"domelementsdata"}).getChild();
          paymentlabel.writeProperty(thisElement);
          //adding the edition pencil
          var launcher = new Node();
          launcher.thisNode = paymentlabel;
          launcher.editElement = thisElement;
          launcher.createInput = true;
          launcher.visibility="visible";
          launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        }
      </script>
    </div>
    <div style="margin:1em auto; display:table;">
      <button class="btn"></button>
      <script>
        var bckloginlabel=thisNode.getNextChild({"name":"chkt4userarea"}).getRelationship({name:"domelementsdata"}).getChild();
        bckloginlabel.writeProperty(thisElement);
        //adding the edition pencil
        var launcher = new Node();
        launcher.thisNode = bckloginlabel;
        launcher.editElement = thisElement;
        launcher.createInput = true;
        launcher.visibility="visible";
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        thisElement.onclick=function(){
          webuser.refreshView(document.getElementById("centralcontent"), "templates/loggedindata.php");
        };
      </script>
    </div>
  </template>
  <div style="text-align:center"></div>
  <script>
    var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
    checkout.refreshView(thisElement,thisElement.previousElementSibling);
  </script>
</template>
