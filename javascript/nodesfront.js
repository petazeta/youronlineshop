/*
  nodesfront.js
  It adds NodeFront methods to Node class
*/
{//FrontEnd facility
  class NodeFront{
    
    //It loads (ajax) a template replacing container content and executing the scripts. If Config.CacheOn=true, it could take the template from the present document
    setView(container, tp, params) {
      return new Promise((resolve, reject) => {
        if (!container) container=this.myContainer; //Default value for container
        else this.myContainer=container; //Update default
        if (!tp) tp=this.myTp; //Default value for
        else this.myTp=tp; //Update default
        if (!container || !tp) reject('No data');
        if (container.nodeType==1) container.classList.add("setviewloader");
        var removecontent=(myNode, container) => container.innerHTML='';
        this.addEventListener('justBeforeAppendView', removecontent, null, null, true); //It removes the content of the container before the loading but it does it just at the last moment
        this.appendView(container, tp, params)
        .then(myNode=>{
          resolve(myNode);
        })
        .catch(error=>{
          console.error(error);
          container.textContent="Error Loading";
        })
        .finally(()=>{
          this.dispatchEvent("setView");
          if (container.nodeType==1) container.classList.remove("setviewloader");
        });
      });
    }
    //Static version (no data in the node) for setView
    static setViewNew(container, tp, params) {
      var launcher=new Node();
      return launcher.setView(container, tp, params);
    }
    //Similar to setView. It is the actual loader. It doesnt not replace but add the content to the container
    appendView(container, tp, params) {
      return new Promise((resolve, reject) => {
        if (!container) container=this.myContainer; //Default value for container
        else this.myContainer=container; //Update default
        var innerAppend=tp => {
          var clone=this.prerender(tp, params); //It gets tp content modifying scripts to adapt to needs and making it able to executing
          this.dispatchEvent("justBeforeAppendView", container);
          container.appendChild(clone);
          if (typeof theme.nodeOnAppend == 'function') {
            theme.nodeOnAppend(this);
          }
          resolve(this);
          this.dispatchEvent("appendView");
          theme.dispatchEvent("setTp", this); //This way we save the last node that has a view
        };
        var getTpAndInnerAppend=tpPath=>{
          Node.getTp(tpPath)
          .then(tp => innerAppend(tp))
          .catch(err=>{
            reject(err);
            console.error(err)
          });
        }
        if (typeof tp=="string") {
          getTpAndInnerAppend(tp);
        }
        else { //tp==element. It is already loaded
          innerAppend(tp);
        }
      });
    }
    //static version for appendView
    static appendViewNew(container, tp, params) {
      var launcher=new Node();
      return launcher.appendView(container, tp, params);
    }
    //Similar to setView but refering to node children
    setChildrenView(container, tp, params) {
      return new Promise((resolve, reject) => {
        if (!container) container=this.childContainer; //Default value for container
        else this.childContainer=container; //Update default
        if (!tp) tp=this.myChildTp; //Default value
        else this.myChildTp=tp; //Update default
        if (!container || !tp) reject('No data');
        if (container.nodeType==1) container.classList.add("setchildrenloader");
        var removecontent=(myNode, container)=>container.innerHTML='';
        this.addEventListener('justBeforeAppendChildren', removecontent, null, null, true);
        this.appendChildrenView(container, tp, params).
        then(myNode=>{
          resolve(myNode);
        })
        .catch(error=>{
          console.error("my404", error);
          container.textContent="Error Loading";
        })
        .finally(()=>{
          this.dispatchEvent("setChildrenView");
          if (container.nodeType==1) container.classList.remove("setchildrenloader");
        });
      });
    }
    //It is the atual loader of setChildrenView. It doesn't replace, it adds the content
    appendChildrenView(container, tp, params) {
      return new Promise((resolve, reject) => {
        if (!container) container=this.childContainer; //Default value for container
        else this.childContainer=container; //Update default
        var innerAppend=tp=>{
          this.dispatchEvent("justBeforeAppendChildren", container);
          if (this.children.length>0) {
            this.children=this.children.sort((a,b)=>a.sort_order-b.sort_order);
            var renderedChildren=document.createDocumentFragment();
            this.children.forEach((child)=>renderedChildren.appendChild(child.prerender(tp, params)))
          }
          if (renderedChildren) {
            container.appendChild(renderedChildren);
          }
          if (typeof theme.nodeOnAppend == 'function') {
            theme.nodeOnAppend(this);
          }
          resolve(this);
          this.dispatchEvent("appendChildrenView");
          theme.dispatchEvent("setTp", this); //This way we save the last node that has a view
        };
        var getTpAndInnerAppend=tpPath=>{
          Node.getTp(tpPath)
          .then(tp => innerAppend(tp))
          .catch(err=>{
            reject(err);
            console.error(err)
          });
        }
        if (typeof tp=="string") {
          getTpAndInnerAppend(tp);
        }
        else {
          innerAppend(tp);
        }
      });
    }

    // This is the function that actually gets a template from file.
    // Templates cache can be filled completely at the first load by php config LOAD_TEMPLATES_AT_ONCE
    // It contains a promise : so we must call method then();
    static getTp(tpName) {
      return new Promise((resolve, reject) => {
        if (Config.templatesCacheOn!==false) {
          var tpid="tp" +  tpName;
          if (tpid in theme.tpList) {
            var newElement=theme.tpList[tpid].cloneNode(true);
            newElement.id=null;
            resolve(newElement.content); //tp is type template
            return;
          }
        }
        let tpPath=Theme.getTpPath(theme.active, tpName);
        const innerGetTp = (tpHref) =>{
          fetch(tpHref)
          .then(res => {
            if (!res.ok) {
              return res.status; //It could return 404
            }
            return res.text();
          })
          .then(result => {
            if (Number.isInteger(result)) { //The template doesn't exists, we try from the parent theme
              throw new Error(result);
            }
            var myTp=document.createElement("template");
            myTp.innerHTML=result;
            // We save the template at the document head
            if (Config.templatesCacheOn!==false) {
              myTp.id="tp" + tpHref.match(/(\w+)\.\w+/, '$1')[1];
              theme.tpList[myTp.id]=myTp;
            }
            resolve(myTp.content);
          })
          .catch(error => {console.error(error); reject(error)});
        }
        innerGetTp(tpPath);
      });
    }
    
    //This function serves to add "scope" and prepare an html template or a dom element.
    //In case is a dom element it will actually render scripts but if it is a template is prerender untill it is actually inserted as a dom
    //node.render(domelement), node.render(scriptelement)
    prerender(tp, params) {
      if (!params) params={}; //Default
      if (!tp) tp=this.myTp; //Default
      if (!tp) throw new Error('tp is not valid');
      if (tp.nodeType==1 && tp.tagName=="TEMPLATE") {
        tp=tp.content; //templates are not valid just its content
      }
      //for the templates we let original unmodified
      if (tp.nodeType==11) tp=tp.cloneNode(true);
      var elementsToBeModified=[];
      var scriptElements=[];
      if (tp.tagName=="SCRIPT") scriptElements.push(tp); //For when there is no descendents
      else scriptElements=Array.from(tp.querySelectorAll("SCRIPT")); //inner elements
      scriptElements.forEach(scriptElement => {
        //To avoid script execution limitation for the request we make a copy of the script to a "brand new" script node
        //Also to execute script <script> for an already loaded element when we use render
        var myScript=document.createElement("SCRIPT");
        var scriptTop="var thisScript=document.currentScript;";
        scriptTop +="var thisElement=thisScript.previousElementSibling; var thisNode=thisScript.thisNode; var thisParams=thisScript.thisParams;"
        myScript.textContent="(function(){" + scriptTop + scriptElement.textContent + "})();"; //adding scope (encapsulation) so this variables are local and can't be modified from another scripts.
        myScript.thisNode=this;
        myScript.thisParams=params;
        var container=scriptElement.parentNode;  //!!Document Fragment is not an Element => *parentNode*
        container.insertBefore(myScript, scriptElement);
        container.removeChild(scriptElement);
      });
      return tp;
    }
    //When it is not a template we are actually executing scripts
    render(myElement) {
      return this.prerender(myElement);
    }

    //This function write a template record (refreshing) for each property
    setPropertiesView(container, tp, params) {
      return new Promise((resolve, reject) => {
        if (!container) container=this.propertiesContainerr; //Default value
        else this.propertiesContainer=container; //Update default
        if (container.nodeType==1) container.classList.add("setpropertiesloader");
        var removecontent=(myNode, container)=>container.innerHTML='';
        this.addEventListener('justBeforeAppendPropertiesView', removecontent, null, null, true);
        this.appendPropertiesView(container, tp, params)
        .then(myNode => {
          resolve(myNode);
        })
        .catch(error=>{
          console.error(error);
          container.textContent="Error Loading";
        })
        .finally(()=>{
          this.dispatchEvent("setPropertiesView");
          if (container.nodeType==1) container.classList.remove("setpropertiesloader");
        });
      });
    }
    //The actual executor. It doesnt replace
    appendPropertiesView(container, tp, params) {
      return new Promise((resolve, reject) => {
        if (!container) container=this.propertiesContainerr; //Default value
        else this.propertiesContainer=container; //Update default
        var innerAppend=tp => {
          if (this.parentNode && this.parentNode.childtablekeys) {
            var myKeys=this.parentNode.childtablekeys;
          }
          else {
            var myKeys=[];
            Object.keys(this.properties).forEach(key => {
              if (!this.properties.isProperty(this.properties, key)) return false;
              myKeys.push(key);
            });
          }
          this.dispatchEvent("justBeforeAppendPropertiesView", container);
          myKeys.forEach((key) => {
            if (key=="id") return false;
            var thiscol=tp.cloneNode(true);
            thiscol.firstElementChild.setAttribute("data-property", key);
            var myParams={...params, editpropertyname: key};
            thiscol=this.prerender(thiscol, myParams); // we must refresh the filling of the data also cloneNode does not copy extra function and data
            if (container) {
              this.propertiesContainer=container;
            }
            this.propertiesContainer.appendChild(thiscol);
          });
          resolve(this);
          this.dispatchEvent("appendPropertiesView");
          theme.dispatchEvent("setTp", this); //This way we save the last node that has a view
        }
        var getTpAndInnerAppend=tpPath=>{
          Node.getTp(tpPath)
          .then(tp => innerAppend(tp))
          .catch(err=>{
            reject(err);
            console.error(err)
          });
        }
        if (typeof tp=="string") {
          getTpAndInnerAppend(tp);
        }
        else {
          innerAppend(tp);
        }
      });
    }
    //It inserts the property value in the container
    writeProperty(container, property, attribute, onEmptyValueText) {
      //Default values
      if (!onEmptyValueText && Config.onEmptyValueTextOn) onEmptyValueText=Node.onEmptyValueText;
      if (!attribute) {
        if (container.tagName=="INPUT") attribute="value";
        else attribute="innerHTML";
      }
      if (!property) {
        var keys=Object.keys(this.properties);
        if (this.parentNode && this.parentNode.childtablekeys && this.parentNode.childtablekeys.length>0) {
          keys=this.parentNode.childtablekeys;
        }
        property = keys.find(key => key!='id');
      }
      //In case there is no property and it is not a field we assume a default value
      if (!this.properties[property] && this.properties[property]!==0 && attribute!='value') {
        if (this.parentNode && this.parentNode.childtablekeys && this.parentNode.childtablekeysinfo) {
          var pos = this.parentNode.childtablekeys.indexOf(property);
          if (pos!=-1 && this.parentNode.childtablekeysinfo[pos]['Type'].indexOf("int")!=-1) {
            //Is a integer
            if (!onEmptyValueText) container[attribute]="0";
          }
          else {
            container[attribute]=onEmptyValueText;
          }
        }
        else {
          container[attribute]=onEmptyValueText;
        }
      }
      else {
        container[attribute]=this.properties[property];
      }
    }

    //It sends a request.
    //It is posible to make several request at once by sending multy = true. In this case action, nodeData and parameters should be arrays
    static makeRequest(action, nodeData, parameters, multy, url) {
      function reduceRequestNode(node, action) {
        var reducedNode;
        switch (action) {
          case "load unlinked":
          case "load my partner":
          case "load root":
          case "load this relationship":
          case "load my childtablekeys":
          case "load all":
          case "remove all":
          case "load tables": //we dont really need to send it
          case "init database": //we dont really need to send it
          case "load children":
            reducedNode=node.cloneNode(0, 0);
            break;
          case "load my relationships":
          case "load my children not":
          case "load my children":
          case "load my tree":
          case "delete my tree":
          case "load myself":
            reducedNode=node.cloneNode(1, 0, "id", "id");
            break;
          case "edit my sort_order":
          case "delete my link":
          case "add my link":
          case "replace myself":
            reducedNode=node.cloneNode(3, 0, "id", "id"); // we need the parent->partner (and parent->partner->parent for safety check)
            break;
          case "add myself":
            var reducedNode=node.cloneNode(3, 0, null, "id"); // we need the parent->partner (and parent->partner->parent for safety check)
            break;
          case "add my children":
            reducedNode=node.cloneNode(2, 1, "id", "id"); // we need the partner (and partner->parent for safety check)
            break;
          case "delete my children":
            reducedNode=node.cloneNode(2, 1, "id", "id"); // we need the partner (and partner->parent for safety check)
            break;
          case "edit my properties":
          case "delete myself":
            reducedNode=node.cloneNode(1, 0, null, "id");
            break;
          case "load my parent":
          case "load my tree up":
            reducedNode=node.cloneNode(1, 1, "id");
            break;
          case "add my tree":
            reducedNode=node.cloneNode(3, null, null, "id"); // we need the parent->partner (and parent->partner->parent for safety check)
            break;
          default:
            reducedNode=node.cloneNode();
        }
        return reducedNode;
      }
      //We have the option of just return the reduced version. In this case parameters contains the actual action
      if (action=="reduce") {
        var reducedNodeData=reduceRequestNode(nodeData, parameters);
        reducedNodeData.avoidrecursion();
        return reducedNodeData;
      }
      if (!url) url=Config.requestFilePath;
      var reqData = {};
      if (multy==true) {
        //In case we pase single args we multiplicate it for the nodes number
        if (typeof action=='string') {
          action=Array(nodeData.length).fill(action);
        }
        if (!Array.isArray(parameters)) {
          parameters=Array(nodeData.length).fill(parameters);
        }
        reqData.action=action; //action is array!
        if (nodeData) {
          var reducedNodeData=nodeData.map(function(myNode, myIndex) { var myreturn=reduceRequestNode(myNode, action[myIndex]); myreturn.avoidrecursion(); return myreturn});
          reqData.nodeData=reducedNodeData;
        }
        if (parameters) reqData.parameters=parameters;
        reqData.multy=true;
      }
      else {
        reqData.action=action;
        if (nodeData) {
          var reducedNodeData=reduceRequestNode(nodeData, action);
          reducedNodeData.avoidrecursion();
          reqData.nodeData=reducedNodeData;
        }
        if (parameters) reqData.parameters=parameters;
      }
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: 'post',
          body: JSON.stringify(reqData),
        })
        .then(res => res.text())
        .then(resultTxt => {
          try {
            var result=JSON.parse(resultTxt);
          }
          catch(e){
            console.error('Text: ' + resultTxt); //To send errors from server
            throw e;
          }
          if (!result) reject(new Error("null"));
          if (Config.logRequests==true) {
            var childtablename= result.properties && result.properties.childtablename ? result.properties.childtablename :
            (result.parentNode && result.parentNode.properties && result.parentNode.childtablename) ?
            result.parentNode.properties.childtablename : null;
            
            if (childtablename) console.log(childtablename.substr(6));
            console.log(action);
            console.log(result);
          }
          if (result.error==true) {
            console.error('Error: ' + action, result.errorMessage);
            if (result.errorMessage=='Database safety') {
              webuser.checkSessionActive()
              .then(myresponse=>{
                if (myresponse===false){
                  alert('SESSION EXPIRED');
                  webuser.logoff();
                }
              });
            }
            reject(result);
          }
          resolve(result);
        })
        .catch(error => {
          console.error('Error: ' + action);
          reject(error);
        });
      });
    }
    //makeRequest nick for when the data node is the actual node
    request(action, parameters) {
      return new Promise((resolve, reject) => {
        Node.makeRequest(action, this, parameters)
        .then(result => resolve(result))
        .catch(error => reject(error));
      });
    }
    //makeRequest nick for when the data node is the actual node and the data is loaded in it
    loadRequest(action, parameters) {
      return new Promise((resolve, reject) => {
        Node.makeRequest(action, this, parameters)
        .then(result => {
          this.load(result);
          resolve(this);
        })
        .catch(error => reject(error));
      });
    }
    //It creates a single child not atached to the nothe but with a copy of the mother
    //It serves for creating a template of new node
    createInstanceChild() {
      return new Promise ((resolve, reject) => {
        var newNode=new NodeMale();
        newNode.parentNode=new NodeFemale;
        newNode.parentNode.load(this, 1, 0, "id");
        newNode.loadRequest("load my relationships").then(myNode => {
          //We search for a relationship about language so we have to add then language node
          var datarel = myNode.relationships.find(rel => rel.syschildtablekeysinfo.some( syskey => syskey.type=='foreignkey' && syskey.parenttablename=='TABLE_LANGUAGES' ) );
          if (datarel)  datarel.addChild(new NodeMale());
          resolve(myNode);
        });
      });
    }
  }

  //To extend the class Node to NodeFront
  function extendNode(source, target, avoid) {
    Object.getOwnPropertyNames(source).forEach(mymethod => {
      if (avoid.indexOf(mymethod)==-1) {
        target[mymethod]=source[mymethod];
      }
    });
  }
  //We add methods
  extendNode(NodeFront, Node, ["length", "prototype", "name"]);
  extendNode(NodeFront.prototype, Node.prototype, ["constructor"]);
}