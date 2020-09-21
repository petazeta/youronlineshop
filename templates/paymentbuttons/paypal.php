<template>
  <div style="display:table;">
    <input type="hidden" name="succeedNotice">
    <script>
      var myNode=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"}).getNextChild({"name":"order"}).getNextChild({"name":"paysucceed"}).getRelationship({name: "domelementsdata"}).getChild();
      myNode.writeProperty(thisElement, null, "value");
      var launcher = new Node();
      launcher.thisNode = myNode;
      launcher.editElement = thisElement;
      launcher.thisAttribute = "value";
      launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
      if (webuser.isWebAdmin()) thisElement.type="input";
    </script>
  </div>
  <div id="paypal-button-container"></div>
  <script>
    var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
    var orderpaymenttype=thisNode;
    var order=orderpaymenttype.parentNode.partnerNode;
    var myVars=JSON.parse(orderpaymenttype.properties.vars);
    var myorderitems=order.getRelationship({name:"orderitems"});
    var myordership=order.getRelationship({name:"ordershippingtypes"});
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
    var mytotal=sumTotal(myorderitems) + sumTotal(myordership);
    
  onScriptLoaded=function(){
    paypal.Buttons({
        style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal',
            
        },
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: mytotal,
                        currency_code: myVars.currencyCode
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
              //We have to save status to payed
              orderpaymenttype.properties.succeed=1;
              orderpaymenttype.loadfromhttp({action: "edit my properties", properties: {succeed: 1}, user_id: webuser.properties.id}).then(function(){
                //We have added the orderpaymenttype to the order
                myalert.properties.alertmsg=thisElement.previousElementSibling.querySelector('[name=succeedNotice]').value;
                myalert.properties.timeout=3000;
                myalert.showalert();
              });
            });
        }
    }).render('#paypal-button-container');
  }
    /**
   * Loads a JavaScript file and returns a Promise for when it is loaded
   */
  const loadScript = src => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.onload = resolve
      script.onerror = reject
      script.src = src
      document.head.append(script)
    })
  }
  let paypalurl='https://www.paypal.com/sdk/js' + '?' + 'client-id=' + myVars.merchantId + '&' + 'currency=' +  myVars.currencyCode;
  loadScript(paypalurl)
    .then(() => {
      onScriptLoaded();
    })
    .catch(() => console.error('Something went wrong.'))
  </script>
</template>