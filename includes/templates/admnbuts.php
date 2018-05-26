<template id="admnbutstp">
  <template>
    <tr></tr>
  </template>
  <template>
    <td style="padding:2px"></td>
  </template>
  <table class="adminedit"></table>
  <script>
  //Gets the a row of objects buttons: [{template: buttp, args: {optional args}}, {...}, ...]
  //Gets the colsnum
  //Generate the buttons positioned table
  //normalize
  var launcher=thisNode;
  var thisNode=launcher.myNode;
  var tableRow=thisElement.parentElement.querySelectorAll("template")[0].content.querySelector("tr").cloneNode(true);
  launcher.buttons.forEach(function(myButton){
    var tableCell=thisElement.parentElement.querySelectorAll("template")[1].content.querySelector("td").cloneNode(true);
    var butlauncher=new NodeMale();
    butlauncher.myNode=thisNode;
    if (myButton.args) {
      for (var key in myButton.args) {
	butlauncher[key]=myButton.args[key];
      }
    }
    butlauncher.refreshView(tableCell, myButton.template);
    tableRow.appendChild(tableCell);
  });
  thisElement.appendChild(tableRow);
  if (launcher.colsnum) {
    var myTable=intoColumns.apply(tableRow, [colsnum]);
    tableRow.innerHTML='';
    var myCell = thisElement.insertCell();
    myCell.appendChild(myTable);
  }
  </script>
</template>