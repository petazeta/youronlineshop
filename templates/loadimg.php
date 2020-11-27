<!--
myNode, labelNode:, fileName: 
-->
<div class="alert alertmsg">
  <form action="uploadfile.php" enctype="multipart/form-data" id="form-file">
    <div class="loader" style="visibility:hidden">
      <div class="elementloader"></div>
      <script>
        DomMethods.setSizeFromStyle(thisElement);
      </script>
    </div>
    <div style="display:flex; flex-flow: column; gap: 1em;">
      <div>
        <span style="position:relative;">
          <div data-id="butedit" class="btmiddleright"></div>
          <span></span>
          <script>
            thisParams.labelNode.getNextChild({"name":"headNote"}).getRelationship({name:"domelementsdata"}).getChild().writeProperty(thisElement);
            //adding the edition pencil
            if (webuser.isWebAdmin()) {
              DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
              thisParams.labelNode.getNextChild({"name":"headNote"}).getRelationship({name:"domelementsdata"}).getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            }
          </script>
        </span>
      </div>
      <div>
        <div class="form-group">
          <span style="position:relative;">
            <div data-id="butedit" class="btmiddleright"></div>
            <label class="form-label"></label>
            <script>
              thisParams.labelNode.getNextChild({"name":"file"}).getRelationship({name:"domelementsdata"}).getChild().writeProperty(thisElement);
              //adding the edition pencil
              if (webuser.isWebAdmin()) {
                DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
                thisParams.labelNode.getNextChild({"name":"file"}).getRelationship({name:"domelementsdata"}).getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
              }
            </script>
          </span>
          <input name="fileData" type="file" style="width:100%">
        </div>
      </div>
      <div style="display:flex; gap: 1em; align-self: center;">
        <div style="position:relative;">
          <div data-id="butedit" class="btmiddleleft"></div>
          <button type="button" class="btn" data-id="but"></button>
          <script>
            thisElement.onclick=function(){
              thisNode.hidealert();
            };
            thisParams.labelNode.getNextChild({"name":"cancel"}).getRelationship({name:"domelementsdata"}).getChild().writeProperty(thisElement);
          </script>
          <input type="hidden" disabled>
          <script>
            var myNode=thisParams.labelNode.getNextChild({"name":"cancel"}).getRelationship({name:"domelementsdata"}).getChild();
            myNode.writeProperty(thisElement);
            thisElement.onblur=function(){
              thisElement.type="hidden";
              thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
            }
            //adding the edition pencil
            if (webuser.isWebAdmin()) {
              DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
              myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            }
          </script>
        </div>
        <div style="position:relative;">
          <div data-id="butedit" class="btmiddleright"></div>
          <button type="submit" class="btn" data-id="but"></button>
          <script>
            thisParams.labelNode.getNextChild({"name":"send"}).getRelationship({name:"domelementsdata"}).getChild().writeProperty(thisElement);
          </script>
          <input type="hidden" disabled>
          <script>
            var myNode=thisParams.labelNode.getNextChild({"name":"send"}).getRelationship({name:"domelementsdata"}).getChild();
            myNode.writeProperty(thisElement);
            thisElement.onblur=function(){
              thisElement.type="hidden";
              thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
            }
            //adding the edition pencil
            if (webuser.isWebAdmin()) {
              DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
              myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            }
          </script>
        </div>
      </div>
    </div>
  </form>
  <script>
    var newImageSmall=[];
    var newImageBig=[];

    thisElement.elements.fileData.addEventListener("change", function() {
      resizeImage(this.files[0], 200, newImageSmall);
      resizeImage(this.files[0], 520, newImageBig);
    });
    thisElement.addEventListener("submit", function(ev) {
      ev.preventDefault();
      if (!thisElement.elements.fileData.value) return false;
      var myFormDataSmall=new FormData();
      var myFormDataBig=new FormData();
      myFormDataSmall.append(thisParams.fileName, newImageSmall[0], thisParams.fileName + ".png");
      myFormDataSmall.append('fileSize', 'small');
      myFormDataSmall.action=this.action;
      myFormDataBig.append(thisParams.fileName, newImageBig[0], thisParams.fileName + ".png");
      myFormDataBig.append('fileSize', 'big');
      myFormDataBig.action=this.action;
      thisElement.querySelector('div[class=loader]').style.visibility='visible';
      thisParams.myNode.loadfromhttp(myFormDataSmall).then(function(myNode){
        myNode.loadfromhttp(myFormDataBig).then(function(myNode){
          thisElement.querySelector('div[class=loader]').style.visibility='hidden';
          thisNode.hidealert();
          myNode.dispatchEvent("loadImage");
        });
      });
    });
  </script>
</div>
