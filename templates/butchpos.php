<!--
  thisNode node to change order
  thisParams.position: 'vertical'/'horizontal'
-->
<div style="display:flex" class="butarrows">
  <div>
    <a style="display:block;height:100%;" href="javascript:void(0)"></a>
    <script>
      //normalize
      thisElement.onclick=function() {
        var newSortOrder=thisNode.sort_order -1;
        if (newSortOrder < 1 || newSortOrder > thisNode.parentNode.children.length) return false;
        thisNode.loadfromhttp({action:"edit my sort_order", newsort_order: newSortOrder}).then(function(myNode){
          var updatedChild=new NodeMale();
          updatedChild.properties.id=myNode.properties.id;
          updatedChild.sort_order=newSortOrder;
          myNode.parentNode.updateChild(updatedChild); //it will refresh children sort_orders
          myNode.parentNode.refreshChildrenView();
        });
        return false;
      }
    </script>
  </div>
  <script>
    if (thisParams.position=='vertical'){
      thisElement.classList.add('arrowupimage');
    }
    else {
      thisElement.classList.add('arrowleftimage');
    }
    if (window.getComputedStyle(thisElement).backgroundImage) {
      DomMethods.setSizeFromStyle(thisElement);
    }
  </script>
  <div>
    <a style="display:block;height:100%;" href="javascript:void(0)"></a>
    <script>
      //normalize
      thisElement.onclick=function() {
        var newSortOrder=thisNode.sort_order + 1;
        if (newSortOrder < 1 || newSortOrder > thisNode.parentNode.children.length) return false;
        thisNode.loadfromhttp({action:"edit my sort_order", newsort_order: newSortOrder}).then(function(myNode){
          var updatedChild=new NodeMale();
          updatedChild.properties.id=myNode.properties.id;
          updatedChild.sort_order=newSortOrder;
          myNode.parentNode.updateChild(updatedChild); //it will refresh children sort_orders
          myNode.parentNode.refreshChildrenView();
        });
        return false;
      }
    </script>
  </div>
  <script>
    if (thisParams.position=='vertical'){
      thisElement.classList.add('arrowdownimage');
    }
    else {
      thisElement.classList.add('arrowrightimage');
    }
    if (window.getComputedStyle(thisElement).backgroundImage) {
      DomMethods.setSizeFromStyle(thisElement);
    }
  </script>
</div>