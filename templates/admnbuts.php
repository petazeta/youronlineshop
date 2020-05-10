<template>
  <div class="admnbtsgrid"></div>
  <script>
  //Gets the a row of objects buttons: [{template: buttp, args: {optional args}}, {...}, ...]
  //Generate the buttons positioned table
  //normalize
  var launcher=thisNode;
  launcher.buttons.forEach(function(myButton){
    var butlauncher=new NodeMale();
    if (myButton.args) {
      for (var key in myButton.args) {
	butlauncher[key]=myButton.args[key];
      }
    }
    var divWrapper=document.createElement("div"); //To wrap all buttons elements (templates, scripts)
    butlauncher.appendThis(divWrapper, myButton.template);
    thisElement.appendChild(divWrapper);
  });
  </script>
</template>