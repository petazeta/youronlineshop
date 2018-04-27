<table id="footer" style="width:100%;">
  <tr style="
  	background-color:#7d6c41;
	color:#fff;height:35px;">
    <td style="padding:10px;"></td>
    <template>
      <div class="adminsinglelauncher">
	<span></span>
	<script>thisElement.textContent=thisNode.properties.innerHTML</script>
	<div class="btrightedit"> </div>
	<script>
	  var addadminbutts=function(){
	    var launcher=new NodeMale();
	    launcher.editpropertyname="innerHTML";
	    launcher.editelement=thisElement.parentElement.firstElementChild;
	    launcher.myNode=thisNode;
	    launcher.myContainer=thisElement;
	    launcher.myTp=document.getElementById("butedittp").content;
	    launcher.refreshView();  
	  }
	  if (webuser.isWebAdmin()) {
	    addadminbutts();
	  }
	  webuser.addEventListener("log", function() {
	    if (!this.isWebAdmin()) {
	      thisElement.innerHTML='';
	    }
	    else {
	      addadminbutts();
	    }
	  });
	</script>
      </div>
    </template>
    <td style="padding:10px;text-align:right;"></td>
    <template>
      <div class="adminsinglelauncher">
	<span></span>
	<script>thisElement.textContent=thisNode.properties.innerHTML</script>
	<div class="btleftedit"> </div>
	<script>
	  var addadminbutts=function(){
	    var launcher=new NodeMale();
	    launcher.editpropertyname="innerHTML";
	    launcher.editelement=thisElement.parentElement.firstElementChild;
	    launcher.myNode=thisNode;
	    launcher.myContainer=thisElement;
	    launcher.myTp=document.getElementById("butedittp").content;
	    launcher.refreshView();  
	  }
	  if (webuser.isWebAdmin()) {
	    addadminbutts();
	  }
	  webuser.addEventListener("log", function() {
	    if (!this.isWebAdmin()) {
	      thisElement.innerHTML='';
	    }
	    else {
	      addadminbutts();
	    }
	  });
	</script>
      </div>
    </template>
  </tr>
</table>
<script type="text/javascript">
webuser.addEventListener("loadses", function(){
  var bottomsection=websectionsroot.getRelationship({"name":"websections"}).getChild({"name":"bottom"});
  var license=bottomsection.getRelationship({"name":"websections_domelements"}).getChild({"name":"license"});
  var licensecontainer=document.getElementById("footer").rows[0].cells[0];
  license.refreshView(licensecontainer, licensecontainer.nextElementSibling.content);
  var designed=bottomsection.getRelationship({"name":"websections_domelements"}).getChild({"name":"designed"});
  var designedcontainer=document.getElementById("footer").rows[0].cells[1];
  designed.refreshView(designedcontainer, designedcontainer.nextElementSibling.content);
});
</script>