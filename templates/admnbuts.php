<div class="admnbtsgrid"></div>
<script>
//Gets the a row of objects buttons: [{template: buttp, args: {optional args}}, {...}, ...]
//Generate the buttons positioned table
//normalize
thisParams.buttons.forEach(function(myButton){
  var divWrapper=document.createElement("div"); //To wrap all buttons elements (templates, scripts)
  thisNode.appendThis(divWrapper, myButton.template, myButton.args);
  thisElement.appendChild(divWrapper);
});
</script>