<template>
  <div style="padding-top:0.5em; text-align: center; color: #666;" class="boxtext">
    <div style="display:inline-block;">
      <span></span>
      <script>
        var myNode=thisNode.getChild({name:"online"}).getRelationship({name: "domelementsdata"}).getChild();
        myNode.writeProperty(thisElement);
        //adding the edition pencil
        var launcher = new Node();
        launcher.thisNode = myNode;
        launcher.editElement = thisElement;
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
      </script>
    </div>
    <span>:</span>
    <span></span>
    <script>
      var setliveusersnum=function(num){
        var myNode=new NodeMale();
        myNode.properties.num=num;
        myNode.writeProperty(thisElement);
      }
      webuser.addEventListener("getliveusers", function() {
        setliveusersnum(this.extra.liveusersnum);
      }, "setliveusersnum");
      get_liveusers();
    </script>
  </div>
</template>
