<div class="flexbox" style="position:relative;">
  <div>
    <input type="radio" name="payment">
    <script>
      thisElement.addEventListener("change", function(event) {
        var paymenttypesRel=webuser.getRelationship({name:"orders"}).getChild().getRelationship({name:"orderpaymenttypes"});
        paymenttypesRel.children=[]; //In case we already selected
        var orderPaymentType=paymenttypesRel.addChild(new NodeMale());
        orderPaymentType.properties.cloneFromArray(thisNode.getRelationship({name:"paymenttypesdata"}).getChild().properties);
        orderPaymentType.properties.cloneFromArray(thisNode.properties);
        DomMethods.setActive(thisNode);
      });
      //selecting first option
      if (thisNode.parentNode.getChild()==thisNode) {
        thisElement.click();
      }
    </script>
  </div>
  <div style="margin-right:2.2em">
    <div style="display:inline-block; position:relative;">
      <div data-id="butedit" class="btmiddleleft"></div>
      <div data-id="buteditdescription" class="btmiddleright"></div>
      <a href="" data-hbutton="true" title=""></a>
      <script>
        var thisNodeData=thisNode.getRelationship({name: "paymenttypesdata"}).getChild();
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
        var myNode=thisNode.getRelationship({name: "paymenttypesdata"}).getChild();
        myNode.writeProperty(thisElement, "description");
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          thisElement.type="text";
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=buteditdescription]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=buteditdescription]'), "templates/butedit.php", {editElement: thisElement, thisProperty: "description"});
        }
      </script>
    </div>
  </div>
  <div data-id="admnbuts" class="btmiddleright">
    <div class="admnbtsgrid"></div>
  </div>
  <template>
    <div style="margin-right:2.2em">
      <div style="display:inline-block; position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <input disabled="true">
        <script>
          thisNode.writeProperty(thisElement, thisParams.thisProperty);
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            thisNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisProperty: thisParams.thisProperty});
          }
        </script>
      </div>
    </div>
  </template>
</div>
<script>
  if (webuser.isWebAdmin()) {
    //We add a table cell for active
    thisNode.appendThis(thisElement, thisElement.querySelector("template"), {thisProperty: "active"});
    //We add a table cell for from vars to be editable
    thisNode.appendThis(thisElement, thisElement.querySelector("template"), {thisProperty: "vars"});
    //We add a table cell for template file to be editable
    thisNode.appendThis(thisElement, thisElement.querySelector("template"), {thisProperty: "template"});
    
    DomMethods.visibleOnMouseOver({element: thisElement.querySelector('[data-id=admnbuts]'), parent: thisElement});
    thisNode.appendThis(thisElement.querySelector('.admnbtsgrid'), "templates/butchpos.php", {position: 'vertical'});
    thisNode.appendThis(thisElement.querySelector('.admnbtsgrid'), "templates/butdelete.php");
    thisNode.parentNode.getNewNode().then((newNode) => {
      newNode.sort_order=thisNode.sort_order + 1;
      thisNode.parentNode.appendThis(thisElement.querySelector('.admnbtsgrid'), "templates/butaddnewnode.php", {newNode: newNode});
    });
  }
  else {
    //remove if it is not active
    if (!thisNode.properties.active) {
      thisElement.style.display="none";
    }
  }
  thisElement.addEventListener("click", function(event) {
    thisElement.querySelector("input").click();
  });
</script>