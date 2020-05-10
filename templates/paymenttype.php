<template>
  <tr>
    <td>
      <input type="radio" name="payment">
      <script>
        thisElement.addEventListener("change", function(event) {
          var paymenttypesRel=webuser.getRelationship({name:"orders"}).getChild().getRelationship({name:"orderpaymenttypes"});
          paymenttypesRel.children=[]; //In case we already selected
          var orderPaymentType=paymenttypesRel.addChild(new NodeMale());
          orderPaymentType.properties.cloneFromArray(thisNode.getRelationship({name:"paymenttypesdata"}).getChild().properties);
          orderPaymentType.properties.cloneFromArray(thisNode.properties);
          DomMethods.setActive(thisNode);
        });
        //selecting first option
        if (thisNode.parentNode.getChild()==thisNode) {
          thisElement.click();
        }
      </script>
    </td>
    <td>
      <div style="margin-right:2.2em">
        <a href="" data-hbutton="true" title=""></a>
        <script>
          thisNodeData=thisNode.getRelationship({name: "paymenttypesdata"}).getChild();
          thisNodeData.writeProperty(thisElement, "name");
          thisNodeData.writeProperty(thisElement, "description", "title");
          var launcher = new Node();
          launcher.thisNode = thisNodeData;
          launcher.editElement = thisElement;
          launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
          if (webuser.isWebAdmin()) {
            //We add a table cell for description to be editable
            var myRow=DomMethods.closesttagname(thisElement, "TR");
            var myCell = myRow.insertCell(2);
            var myDiv = document.createElement('div');
            myDiv.style.marginRight="2.2em";
            var mySpan=document.createElement('span');
            myDiv.appendChild(mySpan);
            myCell.appendChild(myDiv);
            thisNodeData.writeProperty(mySpan, "description");
            var description_launcher = new Node();
            description_launcher.thisNode = thisNodeData;
            description_launcher.thisProperty = "description";
            description_launcher.editElement = mySpan;
            description_launcher.appendThis(myDiv, "templates/addbutedit.php");
            
            //We add a table cell for vars to be editable
            var myRow=DomMethods.closesttagname(thisElement, "TR");
            var myCell = myRow.insertCell(2);
            var myDiv = document.createElement('div');
            myDiv.style.marginRight="2.2em";
            var mySpan=document.createElement('span');
            myDiv.appendChild(mySpan);
            myCell.appendChild(myDiv);
            thisNode.writeProperty(mySpan, "vars");
            var description_launcher = new Node();
            description_launcher.thisNode = thisNode;
            description_launcher.thisProperty = "vars";
            description_launcher.editElement = mySpan;
            description_launcher.appendThis(myDiv, "templates/addbutedit.php");
          }
          
          thisElement.addEventListener("click", function(event) {
            event.preventDefault();
            myalert.properties.alertmsg=thisNodeData.properties.description;
            myalert.showalert();
          });
        </script>
      </div>
    </td>
  </tr>
  <script>
    var admnlauncher=new Node();
    admnlauncher.thisNode=thisNode;
    admnlauncher.editElement = thisElement;
    admnlauncher.btposition="btmiddleright";
    admnlauncher.elementsListPos="vertical";
    admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
    admnlauncher.newNode.loadasc(thisNode, 2, "id"); //the parent is not the same
    admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
    admnlauncher.appendThis(thisElement.lastElementChild, "templates/addadmnbuts.php");
    thisElement.addEventListener("click", function(event) {
      thisElement.querySelector("input").click();
    });
  </script>
</template>
