<template>
  <template id="extraedittp">
    <template id="logedittp">
      <div style="display:table;">
        <div></div>
        <script>
          var myNode=thisNode.getRelationship("domelementsdata").getChild();
          var myLabel=thisNode.properties.name;
          myNode.editpropertylabel=myLabel;
          myNode.appendThis(thisElement,"templates/singlefield.php");
        </script>
      </div>
    </template>
    <div>
      <div style="margin:auto; display:table; margin-bottom: 1em;">
	<div class="msgbox"></div>
	<script>
	  var currencyNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "currency"});
	  currencyNode.appendThis(thisElement,document.querySelector("#logedittp"));
	</script>
      </div>
      <div style="margin:auto; display:table; margin-bottom: 1em;">
	<div class="msgbox"></div>
	<script>
	  var logboxNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name: "logbox"});
	  
	  var logboxin=logboxNode.getNextChild({name:"logboxin"});
	  var logboxout=logboxNode.getNextChild({name:"logboxout"});
	  for (var i=0; i<logboxin.getRelationship("domelements").children.length; i++) {
	    var logNode=logboxin.getRelationship("domelements").children[i];
	    logNode.appendThis(thisElement, document.querySelector("#logedittp"));
	  }
	  for (var i=0; i<logboxout.getRelationship("domelements").children.length; i++) {
	    var logNode=logboxout.getRelationship("domelements").children[i];
	    logNode.appendThis(thisElement, document.querySelector("#logedittp"));
	  }
	</script>
      </div>
      <div data-id="containerlogin"></div>
      <script>
	(new Node()).appendThis(thisElement,"templates/loginform.php");
      </script>
      <div data-id="containernew"></div>
      <script>
	(new Node()).appendThis(thisElement,"templates/newform.php");
      </script>
    </div>
  </template>
  <a href="javascript:" class="minibtn"></a>
  <script>
    var extraTxt=thisNode.getRelationship("domelementsdata").getChild();
    extraTxt.writeProperty(thisElement);
    thisElement.onclick=function(){
      document.getElementById("centralcontent").innerHTML="";
      (new Node()).appendThis(document.getElementById("centralcontent"),document.querySelector("#extraedittp"));
      return false;
    }
  </script>
</template>
