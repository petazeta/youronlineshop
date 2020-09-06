<template>
  <button class="btmiddlecenter" style="opacity: 0" >
    <img src="images/zoom.svg"/>
  </button>
  <script>
    //normalize
    var launcher = thisNode;
    var itemNode = launcher.options.thisNode;
    let prevUrl='?category=' + itemNode.parentNode.partnerNode.parentNode.partnerNode.properties.id;
    prevUrl += '&subcategory=' + itemNode.parentNode.partnerNode.properties.id;
    const url= prevUrl + '&item=' + itemNode.properties.id;
    if (Config.itemExtend_On || webuser.isWebAdmin()) {
      DomMethods.visibleOnMouseOver({element: thisElement, parent: thisElement.parentElement})
    }
    thisElement.addEventListener("click",function(event){
      event.preventDefault();
      itemNode.refreshView(document.getElementById("centralcontent"),"templates/itempicturelarge.php");
      //it doesn't record state when: go back (dont state twice the same url)
      if (!(history.state && history.state.url==url)) history.pushState({url:url}, null, url);
    });

  </script>
</template>