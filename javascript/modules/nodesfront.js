import config from './config.js';
import {Node as NodeBase, NodeFemale as NodeFemaleBase, NodeMale as NodeMaleBase} from './nodes.js';
//import {Node, NodeFemale, NodeMale} from './nodes.js';
import {authorizationToken} from "./authorizationfront.js";
import {getNewId} from './idgenerator.js';
import {onAppend} from './onappendlistener.js';
//import extendNode from './extend.js';

/* we are not importing at the begining this elements but dynamically because in future it could give problems
import {theme, default as Theme} from './themesfront.js'; //
import {Alert, AlertMessage} from './alert.js'; //
import {setLastActive} from './watchlastactive.js'; //
*/


/*
  It adds NodeFront methods to Node class
*/

//FrontEnd facility
const NodeFrontMixing=Sup => class extends Sup {
//class NodeFront {
  //Similar to setView but refering to node children
  async setChildrenView(container, tp, params) {
    if (!container) container=this.childContainer; //Default value for container
    else this.childContainer=container; //Update default
    if (!tp) tp=this.myChildTp; //Default value
    else this.myChildTp=tp; //Update default
    if (!container || !tp) throw new Error('No data');
    if (container.nodeType==1) container.classList.add("setchildrenloader");
    
    if (typeof tp=="string") {
      tp = await this.constructor.getTp(tp);
    }
    if (this.children.length>0) {
      const skey=this.getMySysKey('sort_order');
      if (skey) this.children=this.children.sort((a,b)=>a.props[skey]-b.props[skey]);
      var renderedChildren=document.createDocumentFragment();
      for (const child of this.children) {
        renderedChildren.appendChild(child.prerender(tp, params));
      }
    }
    container.innerHTML='';
    if (renderedChildren) {
      container.appendChild(renderedChildren);
    }
    if (typeof onAppend == 'function') {
      onAppend(this);
    }
    
    this.dispatchEvent("setChildrenView");
    if (container.nodeType==1) container.classList.remove("setchildrenloader");
    const {setLastActive}=await import('./watchlastactive.js');
    if (typeof setLastActive == 'function') {
      setLastActive(this);//This way we save the last node that has a view
    }

    return this;
  }
  //It is the atual loader of setChildrenView. It doesn't replace, it adds the content
  async appendChildrenView(container, tp, params) {
    if (!container) container=this.childContainer; //Default value for container
    else this.childContainer=container; //Update default
    if (!tp) tp=this.myChildTp; //Default value
    else this.myChildTp=tp; //Update default
    if (!container || !tp) throw new Error('No data');
    if (container.nodeType==1) container.classList.add("appendchildrenloader");
    
    if (typeof tp=="string") {
      tp = await this.constructor.getTp(tp);
    }
    if (this.children.length>0) {
      const skey=this.getMySysKey('sort_order');
      if (skey) this.children=this.children.sort((a,b)=>a.props[skey]-b.props[skey]);
      var renderedChildren=document.createDocumentFragment();
      for (const child of this.children) {
        renderedChildren.appendChild(child.prerender(tp, params));
      }
    }
    if (renderedChildren) {
      container.appendChild(renderedChildren);
    }
    if (typeof onAppend == 'function') {
      onAppend(this);
    }
    const {setLastActive}=await import('./watchlastactive.js');
    this.dispatchEvent("appendChildrenView");
    if (typeof setLastActive == 'function') {
      setLastActive(this);//This way we save the last node that has a view
    }
    return this;
  }

  // This is the function that actually gets a template from file.
  // Templates cache can be filled completely at the first load by onfig loadalltemplatesatonce
  // tpName is the file name without extension but it also acepts the file name and path
  static async getTp(tpName) {
    const {default: Theme, theme}=await import ('./themesfront.js')
    const tpPath=Theme.getTpPath(theme.active, tpName);
    //Loading from cache
    if (config.componentsCacheOn!==false) {
      if (tpPath) var tpid="tp" + tpPath.match(/(\w+)\.\w+/, '$1')[1];
      else var tpid="tp" + tpName;
      if (tpid in theme.tpList) {
        const tpElement=theme.tpList[tpid];
        const newElement=tpElement.cloneNode(true)
        newElement.id=null;
        return newElement.content;
      }
    }
    const myTp=await fetch(tpPath)
    .then(res=>{
      if (!res.ok) {
        return res.status; //It could return 404
      }
      return res.text();
    })
    .then(result=>{
      if (Number.isInteger(result)) { //The template doesn't exists, we try from the parent theme
        throw new Error(result);
      }
      const myTp=document.createElement("template");
      myTp.innerHTML=result;
      return myTp;
    });
    //Saving to cache
    if (config.componentsCacheOn!==false) {
      var tpid="tp" + tpPath.match(/(\w+)\.\w+/, '$1')[1];
      theme.tpList[tpid]=myTp;
      theme.tpList[tpid].id=tpid;
    }
    return myTp.content;
  }
  
  //This function serves to add "scope" and prepare an html template or a dom element.
  //In case is a dom element it will actually render scripts but if it is a template is prerender untill it is actually inserted as a dom
  //node.render(domelement), node.render(scriptelement)
  //it is named prerender because the scripts doesn't execute untill the element dom insertion
  prerender(tp, params) {
    if (!params) params={}; //Default
    if (!tp) tp=this.myTp; //Default
    if (!tp) throw new Error('tp is not valid');
    if (tp.nodeType==1 && tp.tagName=="TEMPLATE") {
      tp=tp.content; //templates are not valid just its content
    }
    //for the templates we let original unmodified
    if (tp.nodeType==11) tp=tp.cloneNode(true);
    let scriptElements=[];
    if (tp.tagName=="SCRIPT") scriptElements.push(tp); //For when there is no descendents
    else scriptElements=Array.from(tp.querySelectorAll("SCRIPT")); //inner elements
    scriptElements.forEach(scriptElement => {
      //To avoid script execution limitation for the request we make a copy of the script to a "brand new" script node
      //Also to execute script <script> for an already loaded element when we use render
      const myScript=document.createElement("SCRIPT");
      for (const at of scriptElement.attributes) {
        myScript.setAttribute(at.name, at.value);
      }
      if (myScript.getAttribute("type")=="module") {
        const dataId=getNewId();
        myScript.setAttribute("data-id", dataId);
        scriptTop=`const thisScript=document.querySelector("script[data-id='${dataId}']");`;
        scriptTop +="let thisElement=thisScript.previousElementSibling; let thisNode=thisScript.thisNode; let thisParams=thisScript.thisParams;"
        myScript.textContent=scriptTop + scriptElement.textContent;
      }
      //adding scope (encapsulation) so this variables are local and can't be modified from another scripts.
      //Also async type allows awiat in scripts
      else myScript.textContent="(async (thisElement, thisNode, thisParams)=>{" + scriptElement.textContent + "})(document.currentScript.previousElementSibling, document.currentScript.thisNode, document.currentScript.thisParams);";
      myScript.thisNode=this;
      myScript.thisParams=params;
      const container=scriptElement.parentNode;  //!!Document Fragment is not an Element => *parentNode*
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
  async setPropertiesView(container, tp, params) {
    if (!container) container=this.propsContainerr; //Default value
    else this.propsContainer=container; //Update default
    if (container.nodeType==1) container.classList.add("setpropsloader");
    const removecontent= container => container.innerHTML='';
    this.addEventListener('justBeforeAppendPropertiesView', removecontent, null, null, true);
    await this.appendPropertiesView(container, tp, params);
    this.dispatchEvent("setPropertiesView");
    if (container.nodeType==1) container.classList.remove("setpropsloader");
    return this;
  }
  //The actual executor. It doesnt replace
  async appendPropertiesView(container, tp, params) {
    if (!container) container=this.propsContainerr; //Default value
    else this.propsContainer=container; //Update default      
    if (typeof tp=="string") {
      tp=await this.constructor.getTp(tp);
    }
    let myKeys;
    if (this.parentNode && this.parentNode.childtablekeys) {
      myKeys=this.parentNode.childtablekeys;
    }
    else {
      myKeys=Object.keys(this.props);
    }
    this.dispatchEvent("justBeforeAppendPropertiesView", container);
    myKeys.forEach((key) => {
      if (key=="id") return false;
      var thiscol=tp.cloneNode(true);
      thiscol.firstElementChild.setAttribute("data-property", key);
      var myParams={...params, editpropertyname: key};
      thiscol=this.prerender(thiscol, myParams); // we must refresh the filling of the data also cloneNode does not copy extra function and data
      if (container) {
        this.propsContainer=container;
      }
      this.propsContainer.appendChild(thiscol);
    });
    this.dispatchEvent("appendPropertiesView");
    const {setLastActive}=await import('./watchlastactive.js');
    if (typeof setLastActive == 'function') {
      setLastActive(this);//This way we save the last node that has a view
    }
    return this;
  }
  //It inserts the property value in the container. Container can contain the property name to be filled.
  writeProperty(container, property, attribute, onEmptyValueText) {
    if (!property) { //we must guess the property value if it is not settled
      let currentValue; //lets check the current Value of the element so it can contain the property name like {propname}
      if (!attribute) {
        if (container.tagName=="INPUT") currentValue=container.value;
        else currentValue=container.innerHTML;
      }
      else {
        currentValue=container.hasAttribute(attribute) ? container.getAttribute(attribute) : container[attribute];
      }
      let valuePropName=null;
      const regExp=/^\{(.+)\}$/;
      if (currentValue.search(regExp)===0) {
        valuePropName=currentValue.replace(regExp, "$1");
      }
      const keys=this.parentNode && this.parentNode.childtablekeys || Object.keys(this.props);
      property = keys.includes(valuePropName) && valuePropName || keys.find(key => key!='id'); //Order minds!!
    }
    let value=this.props[property];
    if (!value && value!==0) value=''; //Parse undefined
    //We set a default value
    import('./textforempty.js')
    .then(({empty})=>{
      if (config.onEmptyValueTextOn && !attribute && container.tagName!="INPUT") {
        if (!onEmptyValueText) onEmptyValueText=empty;
        //If field type is int => value=0, other case value=onEmptyValueText when innerHTML
        const isNumberField=()=>{
          let keyIndex=-1;
          if (this.parentNode && this.parentNode.childtablekeys) keyIndex=this.parentNode.childtablekeys.indexOf(property);
          if (keyIndex!==-1) return  this.parentNode.childtablekeysinfo[keyIndex]['Type'].includes("int") || this.parentNode.childtablekeysinfo[keyIndex]['Type'].includes("decimal");
        }
        if (isNumberField()) {
          container.setAttribute("data-placeholder", "0");
        }
        else {
          container.setAttribute("data-placeholder", onEmptyValueText);
        }
      }
    });
    //Write the new value
    if (!attribute) {
      if (container.tagName=="INPUT") container.value=value;
      else container.innerHTML=value;
    }
    else container.hasAttribute(attribute) ? container.setAttribute(attribute, value) : container[attribute]=value;
  }

  //It sends a request.
  static async makeRequest(action, params, url) {
    let method='post';
    let contentType='application/json';
    if (action.includes("delete ")) method='delete';
    else if (action.includes("edit ")) method='put';
    if (!url) url=config.requestFilePath;
    const fetchParams={
      method: method,
      headers: {
        'Content-Type': contentType
      },
      body: JSON.stringify({action: action, parameters: params}),
    };
    if (authorizationToken) fetchParams.headers={...fetchParams.headers, ...authorizationToken};
    return fetch(url, fetchParams)
    .then(res => res.text())
    .then(resultTxt => {
      let result=null;
      if (resultTxt) {
        try {
          result=JSON.parse(resultTxt);
        }
        catch(e){//To send errors from server in case the error catching methods at backend fail
          throw new Error("Action: " + action + ". Error: Response error: "+ resultTxt);
        }
      }
      if (result && typeof result=="object" && result.error==true) {
        throw (new Error(action + '. Message: ' + result.message));
      }
      return result;
    })
    .catch(error=>{console.error(error); throw error;});
  }
  //makeRequest nick for when the data node is the actual node
  async request(action, parameters, reduce=false, url) {
    function reduceRequestNode(node, action) {
      var reducedNode; //we make a cpy to not modify the original object
      switch (action) {
        case "get my root":
        case "get my childtablekeys":
        case "get all my children":
          reducedNode=node.cloneNode(0, 0);
          break;
        case "get my relationships":
        case "get my children":
        case "get my tree":
        case "delete my tree":
          reducedNode=node.cloneNode(1, 0, "id", "id");
          break;
        case "edit my sort_order":
        case "delete my link":
        case "add my link":
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
        case "delete myself":
        case "edit my props":
          reducedNode=node.cloneNode(1, 0, null, "id");
          break;
        case "get my parent":
        case "get my tree up":
          reducedNode=node.cloneNode(1, 1, "id");
          break;
        case "add my tree":
        case "add my tree table content":
          reducedNode=node.cloneNode(3, null, null, "id"); // we need the parent->partner (and parent->partner->parent for safety check)
          break;
        default:
          reducedNode=node.cloneNode();
      }
      return reducedNode;
    }
    const reduceParamsNode = (params, action) => {
      //we make a cpy to not modify the original object
      switch (action) {
        case "get my tree":
        case "get my children":
        case "add myself":
        case "add my children":
        case "add my tree":
        case "add my tree table content":
        case "add my link":
          if (params.extraParents) {
            if (!Array.isArray(params.extraParents)) params.extraParents=[params.extraParents];
            params.extraParents=params.extraParents.map(eParent=>{
              if (eParent.avoidrecursion) {
                eParent=eParent.cloneNode(1, 0, "id", "id");
                eParent.avoidrecursion();
              }
              return eParent;
            });
          }
          break;
      }
      return params;
    }
    const nodeData=reduceRequestNode(this, action);
    nodeData.avoidrecursion();
    if (parameters) reduceParamsNode(parameters, action);
    //We have the option of just return the reduced version.
    if (reduce) {
      if (parameters) return [nodeData, parameters];
      else return nodeData;
    }
    if (!parameters) parameters={};
    parameters.nodeData=nodeData;
    return this.constructor.makeRequest(action, parameters);
  }
  static async requestMulty(action, dataNodes, parameters, reduce, url) {
    //In case we pass single args we multiplicate it for the nodes number
    if (typeof action=='string') {
      action=Array(dataNodes.length).fill(action);
    }
    if (parameters && !Array.isArray(parameters)) {
      parameters=Array(dataNodes.length).fill(parameters);
    }
    let reducedDataNodes=[], reducedParams=[], params=[];
    for (const index in dataNodes) {
      if (parameters && parameters[index]) {
        [reducedDataNodes[index], reducedParams[index]]=await dataNodes[index].request(action[index], parameters[index], true);
        params[index]={...reducedParams[index], nodeData: reducedDataNodes[index]};
      }
      else {
        reducedDataNodes[index]=await dataNodes[index].request(action[index], null, true);
        params[index]={nodeData: reducedDataNodes[index]};
      }
    }
    if (reduce) {
      if (parameters) return [reducedDataNodes, reducedParams];
      else return reducedDataNodes;
    }
    return this.makeRequest(action, params, url);
  }
  async loadRequest(action, parameters, url) {
    const result= await this.request(action, parameters, false, url);
    switch (action) {
      case "get my root":
      this.children=[];
      if (typeof result=="object") {
        this.addChild((new NodeMale()).load(result));
      }
      break;
      case "get my children":
      case "get all my children":
      this.children=[];
      if (typeof result=="object") {
        result.data.forEach(child=>this.addChild((new NodeMale()).load(child)));
        this.props.total=result.total;
      }
      break;
      case "get my tree":
      if (typeof result=="object") {
        if (this.detectMyGender()=="female") {
          this.children=[];
          for (const element of result.data) {
            this.addChild((new NodeMale()).load(element));
          }
          this.props.total=result.total;
        }
        else {
          if (parameters && parameters.myself) {
            this.load(result);
            break;
          }
          this.relationships=[];
          for (const element of result) {
            this.addRelationship((new NodeFemale()).load(element));
          }
        }
      }
      break;
      case "get my relationships":
      this.relationships=[];
      if (typeof result=="object") {
        result.forEach(rel=>this.addRelationship((new NodeFemale()).load(rel)));
      }
      break;
      case "get my tree up":
      if (typeof result=="object") {
        if (this.detectMyGender()=="female") {
          this.partnerNode=(new NodeMale()).load(result);
          this.partnerNode.addRelationship(this);
        }
        else {
          if (Array.isArray(result)) {
            this.parentNode=[];
            for (const i in result) {
              this.parentNode[i]=(new NodeFemale()).load(result[i]);
              this.parentNode[i].addChild(this);
            }
          }
          else {
            this.parentNode=(new NodeFemale()).load(result);
            this.parentNode.addChild(this);
          }
        }
      }
      break;
      case "add myself":
      if (typeof result=="number") {
        this.props.id=result;
      }
      break;
      case "add my tree":
      if (typeof result=="object") {
        if (result.props.id)  this.props.id=result.props.id; //female has no id
        this.loaddesc(result);
      }
      break;
      case "add my children":
      if (typeof result=="object") {
        for (const i in result) {
          this.children[i].props.id=result[i];
        }
      }
      break;
      default:
        this.load(result);
    }
    return this;
  }
}

//We add methods
//extendNode(NodeFront, Node);
const Node = NodeFrontMixing(NodeBase);

const NodeFemaleFrontMixing=Sup => class extends Sup {
//class NodeFemaleFront {
  //It creates a single child not atached to the node but with a copy of the mother
  //It serves for creating a template of new node
  //By default it creates a empty lang data children if it is related to a lang element parent
  
  load(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
    return super.load(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown, NodeMale);
  }
  
  cloneNode(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
    return super.cloneNode(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown, NodeMale);
  }
  
  loaddesc(source, level, thisProperties) {
    super.loaddesc(source, level, thisProperties, NodeMale);
  }
  
  loadasc(source, level, thisProperties) {
    super.loadasc(source, level, thisProperties, NodeMale);
  }

  async createInstanceChild(previousSibling, noLang=false) {
    const newNode=new NodeMale();
    /*
    newNode.parentNode=new NodeFemale;
    newNode.parentNode.load(this, 1, 0, "id");
    */
    newNode.parentNode=this;
    const skey=newNode.parentNode.getMySysKey('sort_order');
    if (skey) {
      if (previousSibling && previousSibling.props[skey]) newNode.props[skey]=previousSibling.props[skey] + 1;
      else newNode.props[skey]=1;
    }
    await newNode.loadRequest("get my relationships");
    //We search for a relationship about language so we have to add then a data language node child
    const datarel = newNode.relationships.find(rel => rel.syschildtablekeysinfo.some( syskey => syskey.type=='foreignkey' && syskey.parenttablename=='TABLE_LANGUAGES' ) );
    if (datarel && !noLang)  datarel.addChild(new NodeMale());
    return newNode;
  }
  //get one element that has change its order and the old order and updates the siblings order
  static updateSiblingsOrder(element, oldOrder) {
    let skey=element.parentNode.getMySysKey('sort_order');
    if (skey && element.props[skey]) {
      let swapElement, childElement;
      for (const child of element.parentNode.children) {
        if (child.props[skey] == element.props[skey] && element.props.id!=child.props.id) {
          swapElement=child;
          break;
        }
      }
      if (swapElement) swapElement.props[skey]=oldOrder; //It could not find it when exceeds pagination
    }
  }
}

//We add methods
//extendNode(NodeFemaleFront, NodeFemale);
const NodeFemale = NodeFemaleFrontMixing(NodeFrontMixing(NodeFemaleBase));

const NodeMaleFrontMixing=Sup => class extends Sup {
//class NodeMaleFront {
  //It loads (ajax) a template replacing container content and executing the scripts. If config.CacheOn=true, it could take the template from the present document
  
  cloneNode(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
    return super.cloneNode(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown, NodeFemale);
  }
  
  load(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown) {
    return super.load(source, levelup, leveldown, thisProperties, thisPropertiesUp, thisPropertiesDown, NodeFemale);
  }
  
  loaddesc(source, level, thisProperties) {
    super.loaddesc(source, level, thisProperties, NodeFemale);
  }
  
  loadasc(source, level, thisProperties) {
    super.loadasc(source, level, thisProperties, NodeFemale);
  }
  
  async setView(container, tp, params, append=false) {
    if (!container) container=this.myContainer; //Default value for container
    else this.myContainer=container; //Update default
    if (!tp) tp=this.myTp; //Default value for
    else this.myTp=tp; //Update default
    if (!container || !tp) throw new Error('No data');
    if (container.nodeType==1) container.classList.add("setviewloader");

    if (typeof tp=="string") {
      tp= await this.constructor.getTp(tp);
    }
    const clone=this.prerender(tp, params); //It gets tp content modifying scripts to adapt to needs and making it able to executing
    if (!append) container.innerHTML='';
    container.appendChild(clone);
    
    if (typeof onAppend == 'function') {
      onAppend(this);
    }
    this.dispatchEvent("setView");
    const {setLastActive}=await import('./watchlastactive.js');
    if (typeof setLastActive == 'function') {
      setLastActive(this);//This way we save the last node that has a view
    }
    if (container.nodeType==1) container.classList.remove("setviewloader");
    return this;
  }
  //Similar to setView. It doesnt not replace but add the content to the container
  async appendView(container, tp, params) {
    return this.setView(container, tp, params, true);
  }
}

//We add methods
//extendNode(NodeMaleFront, NodeMale);
const NodeMale = NodeMaleFrontMixing(NodeFrontMixing(NodeMaleBase));

export {Node, NodeFemale, NodeMale}