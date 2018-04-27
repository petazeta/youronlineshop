<template id="butvchpostp">
  <table style="margin-top:1px" class="arrows">
    <tbody>
      <tr>
	<td style="
	  background: url('includes/css/images/uarrow.png') no-repeat 2px 1px transparent;
	  min-width: 12px;
	  height: 6px;
	  padding:0px;
	">
	  <?php
	    $orderchange="-1";
	    include "changeorder.php";
	  ?>
	</td>
      </tr>
      <tr>
	<td style="height:3px; padding:0px;">
	</td>
      <tr>
	<td style="
	  background: url('includes/css/images/darrow.png') no-repeat 2px 1px transparent;
	  min-width: 11px;
	  height: 6px;
	  padding:0px;
	">
	  <?php 
	    $orderchange="+1";
	    include "changeorder.php";
	  ?>
	</td>
      </tr>
    </tbody>
  </table>
</template>