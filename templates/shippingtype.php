<div class="flexbox" style="position:relative;">
  <div>
    <input type="radio" name="shipping">
    <script>
      thisElement.addEventListener("change", function(event) {
        var shippingtypesRel=webuser.getRelationship({name:"orders"}).getChild().getRelationship({name:"ordershippingtypes"});
        shippingtypesRel.children=[]; //In case we already selected
        var orderShippingType=shippingtypesRel.addChild(new NodeMale());
        orderShippingType.properties.cloneFromArray(thisNode.getRelationship({name:"shippingtypesdata"}).getChild().properties);
        orderShippingType.properties.cloneFromArray(thisNode.properties);
        DomMethods.setActive(thisNode);
      });
      //selecting first option
      if (thisNode.parentNode.getChild()==thisNode) {
        thisElement.click();
      }
    </script>
  </div>
  <div style="margin-right:2.2em;">
    <span style="position:relative;">
      <div data-id="butedit" class="btmiddleleft"></div>
      <div data-id="buteditdescription" class="btmiddleright"></div>
      <a href="" data-hbutton="true" title=""></a>
      <script>
        var thisNodeData=thisNode.getRelationship({name: "shippingtypesdata"}).getChild();
        thisNodeData.writeProperty(thisElement, "name");
        thisNodeData.writeProperty(thisElement, "description", "title");
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          thisNodeData.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "name"});
        }
        thisElement.addEventListener("click", function(event) {
          event.preventDefault();
          myalert.properties.alertmsg=thisNodeData.properties.description;
          myalert.showalert();
        });
      </script>
      <input type="hidden" disabled="true">
      <script>
        var myNode=thisNode.getRelationship({name: "shippingtypesdata"}).getChild();
        myNode.writeProperty(thisElement, "description");
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          thisElement.type="text";
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=buteditdescription]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=buteditdescription]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "description"});
        }
      </script>
    <span>
  </div>
  <div style="margin-right:2em">
    <span style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <span></span>
      <script>
        thisNode.writeProperty(thisElement, "delay_hours");
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          thisNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "delay_hours"});
        }
      </script>
    </span>
    <span></span>
    <script>
      var myhours=domelementsrootmother.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"hours"}).getRelationship({name: "domelementsdata"}).getChild();
      myhours.writeProperty(thisElement);
    </script>
  </div>
  <div style="margin-right:2em">
    <span style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <span></span>
      <script>
        thisNode.writeProperty(thisElement, "price");
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          thisNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "price"});
        }
      </script>
    </span>
    <span></span>
    <script>
      var currency=domelementsrootmother.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"currency"}).getRelationship({name: "domelementsdata"}).getChild();
      currency.writeProperty(thisElement);
    </script>
  </div>
  <div data-id="admnbuts" class="btmiddleright">
    <div class="admnbtsgrid"></div>
  </div>
</div>
<script>
  if (webuser.isWebAdmin()) {
    DomMethods.visibleOnMouseOver({element: thisElement.querySelector('[data-id=admnbuts]'), parent: thisElement});
    thisNode.appendThis(thisElement.querySelector('.admnbtsgrid'), "templates/butchpos.php", {position: 'vertical'});
    thisNode.appendThis(thisElement.querySelector('.admnbtsgrid'), "templates/butdelete.php");
    thisNode.parentNode.getNewNode().then((newNode) => {
      newNode.sort_order=thisNode.sort_order + 1;
      thisNode.parentNode.appendThis(thisElement.querySelector('.admnbtsgrid'), "templates/butaddnewnode.php", {newNode: newNode});
    });
  }
  thisElement.addEventListener("click", function(event) {
    thisElement.querySelector("input").click();
  });
</script>