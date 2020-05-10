<template>
  <table style="margin-top:4px;" class="arrows">
    <tbody>
      <tr>
	<td style="
	  background: url('css/images/larrow.png') no-repeat 2px 1px transparent;
	  min-width: 8px;
	  height: 11px;
	">
	  <div style="display:block;height:100%;"></div>
	  <script>
	    //normalize
	    var launcher=thisNode;
	    var thisNode=launcher.thisNode;
	    var leftLauncher=new Node();
	    leftLauncher.orderchange=-1;
	    leftLauncher.thisNode=launcher.thisNode;
	    leftLauncher.appendThis(thisElement, "templates/changeorder.php");;
	  </script>
	</td>
	<td style="min-width:2px">
	</td>
	<td style="
	  background: url('css/images/rarrow.png') no-repeat 2px 1px transparent;
	  min-width: 8px;
	  height: 11px;
	">
	  <div style="display:block;height:100%;"></div>
	  <script>
	    //normalize
	    var launcher=thisNode;
	    var thisNode=launcher.thisNode;
	    var rightLauncher=new Node();
	    rightLauncher.orderchange=1;
	    rightLauncher.thisNode=launcher.thisNode;
	    rightLauncher.appendThis(thisElement, "templates/changeorder.php");
	  </script>
	</td>
      </tr>
    </tbody>
  </table>
</template>