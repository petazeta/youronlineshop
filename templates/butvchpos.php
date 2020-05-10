<template>
  <table style="margin-top:1px" class="arrows">
    <tbody>
      <tr>
	<td style="
	  background: url('css/images/uarrow.png') no-repeat 2px 1px transparent;
	  min-width: 12px;
	  height: 6px;
	  padding:0px;
	">
	  <div style="display:block;height:100%;"></div>
	  <script>
	    //normalize
	    var launcher=thisNode;
	    var thisNode=launcher.thisNode;
	    var leftLauncher=new Node();
	    leftLauncher.orderchange=-1;
	    leftLauncher.thisNode=launcher.thisNode;
	    leftLauncher.appendThis(thisElement, "templates/changeorder.php");
	  </script>
	</td>
      </tr>
      <tr>
	<td style="height:3px; padding:0px;">
	</td>
      <tr>
	<td style="
	  background: url('css/images/darrow.png') no-repeat 2px 1px transparent;
	  min-width: 11px;
	  height: 6px;
	  padding:0px;
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