<template>
  <form>
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
  </form>
  <button id="basic-photo-button" style="background-color:#6772E5;color:#FFF;padding:8px 12px;border:0;border-radius:4px;font-size:1em">Pay</button>
  <script>
    //Thais is stripe implementation but is under construction, due stripe limitations to add pricesId
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
    // Replace with your own publishable key: https://dashboard.stripe.com/test/apikeys
    var PUBLISHABLE_KEY =  myVars.merchantId;
    // Replace with the domain you want your users to be redirected back to after payment
    var DOMAIN = window.location.origin;
    // Replace with a Price for your own product (created either in the Stripe Dashboard or with the API)
    // You can also supply a SKU or Plan ID for 
    var PRICE_ID = myVars.priceId; //Thats a restriction from stripe, we must create prices so it is not working

    var stripe = Stripe(PUBLISHABLE_KEY);

    var basicPhotoButton = document.getElementById("basic-photo-button");

    basicPhotoButton.addEventListener("click", function() {
      // Make the call to Stripe.js to redirect to the checkout page
      // with the current quantity
      stripe
        .redirectToCheckout({
          mode: 'payment',
          lineItems: [{ price: PRICE_ID, quantity: 1 }],
          successUrl: DOMAIN + "/",
          cancelUrl: DOMAIN + "/"
        })
        .then(function(result){
          //We have to save status to payed
          orderpaymenttype.properties.succeed=1;
          orderpaymenttype.loadfromhttp({action: "edit my properties", properties: {succeed: 1}, user_id: webuser.properties.id}).then(function(){
            //We have added the orderpaymenttype to the order
            myalert.properties.alertmsg=thisElement.previousElementSibling.elements.namedItem("succeedNotice").value;
            myalert.properties.timeout=3000;
            myalert.showalert();
            if (result.error) {
              console.log('Stripe error')
              // If `redirectToCheckout` fails due to a browser or network
              // error, display the localized error message to your customer.
            }
          });
        });
    });
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
  let paypalurl='https://js.stripe.com/v3/'; //
  loadScript(paypalurl)
    .then(() => {
      onScriptLoaded();
    })
    .catch(() => console.error('Something went wrong.'))
  </script>
</template>