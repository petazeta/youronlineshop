<template id="alerttp">
  <div class="alert"
    data-js='
      thisElement.innerHTML=thisNode.properties.alertmsg;
      if (thisNode.properties.timeout>0) thisNode.hidealert();
    '>
  </div>
</template>
