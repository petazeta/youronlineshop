<!--
It recieves thisNode, myTp and myContainer. and make a frame that removes myContainer content when clicking close button.
After closing it fires the event closewindow.
-->
<div class="rmbox">
  <div class="bttopinsiderightinside">
    <button type="button" class="closeimage minibtn transp" style="width: 15px; height: 15px;"></button>
    <script>
      var myContainer=thisParams.myContainer;
      thisElement.onclick=function(){
        myContainer.innerHTML="";
        thisNode.dispatchEvent("closewindow");
      }
    </script>
  </div>
  <div></div>
  <script>
    thisNode.refreshView(thisElement, thisParams.myTp, thisParams.myParams);
  </script>
</div>