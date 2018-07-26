<template>
  <table style="margin-top:4px;" class="arrows">
    <tbody>
      <tr>
	<td style="
	  background: url('includes/css/images/larrow.png') no-repeat 2px 1px transparent;
	  min-width: 8px;
	  height: 11px;
	">
	  <?php 
	    $orderchange="-1";
	    include "changeorder.php";
	  ?>
	</td>
	<td style="min-width:2px">
	</td>
	<td style="
	  background: url('includes/css/images/rarrow.png') no-repeat 2px 1px transparent;
	  min-width: 8px;
	  height: 11px;
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