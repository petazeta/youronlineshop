<template>
  <template>
    <table class="adminedit">
      <tr>
	<td style="padding:2px"></td>
      </tr>
    </table>
  </template>
  <div></div>
  <script>
  //Gets the a row of objects buttons: [{template: buttp, args: {optional args}}, {...}, ...]
  //Generate the buttons positioned table
  //normalize
  var launcher=thisNode;
  if (supportsTemplate()) { // for IE
    var myTable=getTpContent(thisElement.parentElement.querySelector("template")).querySelector("table").cloneNode(true);
  }
  else {
    var myTable=thisElement.parentElement.querySelector("template").querySelector("table").cloneNode(true);
  }
  var butsContainer=document.createDocumentFragment();
  launcher.buttons.forEach(function(myButton){
    var butlauncher=new NodeMale();
    if (myButton.args) {
      for (var key in myButton.args) {
	butlauncher[key]=myButton.args[key];
      }
    }
    var divWrapper=document.createElement("div"); //To wrap all buttons elements (templates, scripts)
    butlauncher.appendThis(divWrapper, myButton.template);
    butsContainer.appendChild(divWrapper);
  });
  thisElement.appendChild(DomMethods.intoColumns(myTable, butsContainer, 0));
  </script>
</template>