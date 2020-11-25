<div class="boxframe orderframe order">
  <div class="orderitems"></div>
  <script>
    var myorderitems=thisNode.getRelationship({name:"orderitems"});
    myorderitems.refreshChildrenView(thisElement, "templates/orderitem.php");
  </script>
  <div class="shippingitem form-group"></div>
  <script>
    var myordership=thisNode.getRelationship({name:"ordershippingtypes"});
    myordership.refreshChildrenView(thisElement, "templates/ordershipping.php");
  </script>
  <div class="form-group ordertotals">
    <span class="form-label"></span>
    <script>
      //valid also for cart view: checkout1.php and userordersline.php
      var myorderpay=thisNode.getRelationship({name:"orderpaymenttypes"}).getChild();
      if (myorderpay) thisElement.textContent='(' +  myorderpay.properties.name + ')';
    </script>
    <span style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <span class="form-label" style="margin-right:0.5em"></span>
      <script>
        var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
        var total=checkout.getNextChild({"name":"order"}).getNextChild({"name":"total"}).getRelationship({name:"domelementsdata"}).getChild();
        total.writeProperty(thisElement);
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          total.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
        }
      </script>
    </span>
    <span></span>
    <script>
      //valid also for cart view: checkout1.php and userordersline.php
      var myorderitems=thisNode.getRelationship({name:"orderitems"});
      var myordership=thisNode.getRelationship({name:"ordershippingtypes"});
      var sumTotal=function(node) {
        var total=0;
        var i=node.children.length;
        while (i--) {
          var quantity=node.children[i].properties.quantity;
          if (!quantity) quantity=1;
          total=total+quantity * node.children[i].properties.price;
        }
        return total;
      }
      var total=sumTotal(myorderitems) + sumTotal(myordership);
      thisElement.textContent=total;
    </script>
    <span></span>
    <script>
      var currency=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"currency"}).getRelationship({name: "domelementsdata"}).getChild();
      currency.writeProperty(thisElement);
    </script>
  </div>
  <div class="paybutton"></div>
  <script>
    //Show Order payment button when payment not succeed valid also for cart view: checkout1.php and userordersline.php
    var myorderpay=thisNode.getRelationship({name:"orderpaymenttypes"}).getChild();
    if (myorderpay && !myorderpay.properties.succeed) {
      if (myorderpay.properties.details && !myorderpay.properties.template) {
        //we must load payment type details when order has not succeed, if it is checkout proccess details in Null
        let orderpaydata=JSON.parse(myorderpay.properties.details);
        myorderpay.properties.template=orderpaydata.template;
        myorderpay.properties.vars=JSON.stringify(orderpaydata.vars);
      }
      if (myorderpay.properties.template) {
        myorderpay.refreshView(thisElement, myorderpay.properties.template);
      }
    }
  </script>
</div>