<template>
  <template>
    <table style="width:100%">
      <tr>
	<td>
	</td>
      </tr>
    </table>
  </template>
  <div></div>
  <script>
    thisNode.addEventListener("changeProperty", function(propertyname){
      if (propertyname=="quantity" || propertyname=="price") {
	thisNode.parentNode.refreshView();
      }
    }, "reCaluculate");
    thisNode.showLabel=false;
    thisNode.appendProperties(thisElement,"includes/templates/singlefield.php",function(){
      thisElement.lastElementChild.querySelector("span").parentElement.appendChild(document.createTextNode(" €"));
      thisElement.appendChild(DomMethods.intoColumns(thisElement.previousElementSibling.content.querySelector("table").cloneNode(true), thisElement, 0));
      thisElement.querySelector("table").rows[0].cells[0].style.width="2em";
      thisElement.querySelector("table").rows[0].cells[2].style.width="7em";
    });
  </script>
</template>