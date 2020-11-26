<!--
-->
<tr>
  <td>
    <span></span>
    <script>
      thisNode.writeProperty(thisElement, "creationdate");
    </script>
  </td>
  <td>
    <a href=""></a>
    <script>
      var thisUser=webuser; //When it is not orders administrator
      if (webuser.getUserType()=="orders administrator") {
      //Complit user information
        thisUser=thisNode.parentNode.partnerNode;
        thisUser.loadfromhttp({action: "load my relationships"}).then(function(myNode) {          
          myNode.getRelationship({name:"usersdata"}).loadfromhttp({action: "load my children"}).then(function(myNode) {
            thisElement.textContent=myNode.getChild().properties.name + " " + myNode.getChild().properties.surname;
          });
        });
      }
      else {
        thisElement.textContent=webuser.getRelationship({name:"usersdata"}).getChild().properties.name + " " + webuser.getRelationship({name:"usersdata"}).getChild().properties.surname;
      }
      if (webuser.getUserType()=="orders administrator") {
       var fieldtype='input';
      }
      else {
        var fieldtype='textnode';
      }
      var showAddress=false;
      if (Config.chktaddressOn) showAddress=true;
      thisElement.addEventListener('click', function(event){
        event.preventDefault();
        var thisRow=DomMethods.closesttagname(thisElement, "TR");
        var thisTable=DomMethods.closesttagname(thisElement, "TABLE");
        myrow=thisTable.insertRow(thisRow.rowIndex+1);
        mycell=myrow.insertCell(0);
        mycell.colSpan=thisTable.tHead.rows[0].cells.length;
        thisUser.refreshView(mycell, "templates/rmbox.php", {myTp: "templates/useraddressview.php", removeContainer: myrow, myParams: {fieldtype: fieldtype, showAddress: showAddress}});
      });
    </script>
  </td>
  <td class="containerbuttons">
    <button type="button" class="iconbuttons">
      <div class="viewinimage"></div>
      <script>
        if (window.getComputedStyle(thisElement).backgroundImage) {
          DomMethods.setSizeFromStyle(thisElement);
        }
      </script>
    </button>
    <script>
      thisElement.addEventListener('click', function(event){
        event.preventDefault();
        thisNode.loadfromhttp({action: "load my tree"}).then(function(myNode) {
          var thisRow=DomMethods.closesttagname(thisElement, "TR");
          var thisTable=DomMethods.closesttagname(thisElement, "TABLE");
          myrow=thisTable.insertRow(thisRow.rowIndex+1);
          mycell=myrow.insertCell(0);
          mycell.colSpan=thisTable.tHead.rows[0].cells.length;
          thisNode.refreshView(mycell, "templates/rmbox.php", {myTp: "templates/order.php", removeContainer: myrow});
        });
      });
    </script>
  </td>
  <template>
    <td class="containerbuttons" style="position:relative;">
      <div class="admnbtsgrid"></div>
      <script>
        if (webuser.isOrdersAdmin()) {
          var myNewStatus=1;
          if (thisNode.properties.status==1) myNewStatus=0;
          thisNode.appendThis(thisElement, "templates/butsuccessorder.php", {newStatus: myNewStatus});
          thisNode.appendThis(thisElement, "templates/butdelete.php");
        }
      </script>
    </td>
  </template>
</tr>
<script>
  if (webuser.isOrdersAdmin()) {
    thisNode.appendThis(thisElement, thisElement.querySelector('template'))
  }
</script>