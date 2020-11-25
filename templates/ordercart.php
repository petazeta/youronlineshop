<div class="boxframe ordercartframe ordercart">
  <div class="ordercartitems"></div>
  <script>
    var myorderitems=thisNode.getRelationship({name:"cartboxitem"});
    myorderitems.refreshChildrenView(thisElement, "templates/orderitem.php");
  </script>
  <div class="form-group ordercarttotals" style="position:relative;">
    <div data-id="butedit" class="btmiddleright"></div>
    <span class="form-label"></span>
    <script>
      var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
      var total=checkout.getNextChild({"name":"order"}).getNextChild({"name":"subtotal"}).getRelationship({name:"domelementsdata"}).getChild();
      total.writeProperty(thisElement);
      //adding the edition pencil
      if (webuser.isWebAdmin()) {
        DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
        total.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
      }
    </script>
    <span></span>
    <script>
      var myorderitems=thisNode.getRelationship({name:"cartboxitem"});
      myorderitems.sumTotal=function() {
        var total=0;
        var i=this.children.length;
        while (i--) {
          total=total+this.children[i].properties.quantity * this.children[i].properties.price;
        }
        return total;
      }
      thisElement.textContent=myorderitems.sumTotal();
    </script>
    <span></span>
    <script>
      var currency=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"currency"}).getRelationship({name: "domelementsdata"}).getChild();
      currency.writeProperty(thisElement);
    </script>
  </div>
</div>