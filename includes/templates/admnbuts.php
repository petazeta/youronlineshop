<template id="admnbutstp">
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
  var thisNode=launcher.myNode;
  var myTable=thisElement.parentElement.querySelector("template").content.querySelector("table").cloneNode(true);
  var butsContainer=document.createDocumentFragment();
  launcher.buttons.forEach(function(myButton){
     var butlauncher=new NodeMale();
    butlauncher.myNode=thisNode;
    if (myButton.args) {
      for (var key in myButton.args) {
	butlauncher[key]=myButton.args[key];
      }
    }
    var divWrapper=document.createElement("div"); //To wrap all buttons elements (templates, scripts)
    butlauncher.appendThis(divWrapper, myButton.template);
    butsContainer.appendChild(divWrapper);
  });
  thisElement.appendChild(intoColumns(myTable, butsContainer, 0));
  </script>
</template>