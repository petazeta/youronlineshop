import config from './../cfg/main.js';
import {authorizationToken} from "./authorizationfront.js";
import {getNewId} from './idgenerator.js';
import {onAppend} from './onappendlistener.js';
import NodeBase from './../../shared/modules/nodebasic.js';
import EventListnerMixing from './eventlistenersmixing.js';
import {NodeMixing, NodeMaleMixing, NodeFemaleMixing} from './../../shared/modules/nodesmixing.js';
import {getDomElementFromChild, getDomElementFromProp} from './frontutils.js';

/*
  It adds NodeFront methods to Node class
*/

//FrontEnd facility
const NodeFrontMixing=Sup => class extends Sup {
  //Similar to setView but refering to node children
  async setChildrenView(container, tp, params) {
    return this.appendChildrenView(container, tp, params, true);
  }
  //It doesn't replace, it adds the content
  async appendChildrenView(container, tp, params, reset, child) {
    if (!container) container=this.childContainer; //Default value for container
    else this.childContainer=container; //Update default
    if (!tp) tp=this.myChildTp; //Default value
    else this.myChildTp=tp; //Update default
    if (!container || !tp) throw new Error('No data');
    let loaderClassName="appendchildrenloader";
    if (reset) loaderClassName="setchildrenloader";
    if (container.nodeType==1) container.classList.add(loaderClassName);
    
    if (typeof tp=="string") {
      tp = await this.constructor.getTp(tp);
    }
    let renderedChildren;
    let children=[];
    const skey=this.getMySysKey('sort_order');
    if (child) {
      if (skey && this.children.length>0 && child.props[skey]<this.children.length) {
        let nextSiblingElement=getDomElementFromChild(this.children[child.props[skey]-1]);
        if (!nextSiblingElement) nextSiblingElement=container.lastElementChild;
        container.insertBefore(child.prerender(tp, params), nextSiblingElement);
      }
      else children=[child];
    }
    else children=this.children;

    if (children.length>0) {
      if (skey) children=children.sort((a,b)=>a.props[skey]-b.props[skey]);
      renderedChildren=document.createDocumentFragment();
      for (const child of children) {
        renderedChildren.appendChild(child.prerender(tp, params));
      }
    }
    
    if (reset) container.innerHTML='';
    if (renderedChildren) {
      container.appendChild(renderedChildren);
    }
    let dispachEventName="appendChildrenView";
    if (reset) dispachEventName="setChildrenView";
    if (child) dispachEventName="appendChildView";
    this.dispatchEvent(dispachEventName);
    if (container.nodeType==1) container.classList.remove(loaderClassName);
    return this;
  }
  //It doesn't replace, it adds the content
  async appendChildView(child, params, container, tp) {
    return this.appendChildrenView(container, tp, params, false, child);
  }

  // This is the function that actually gets a template from file.
  // Templates cache can be filled completely at the first load by onfig loadalltemplatesatonce
  // tpName is the file name without extension but it also acepts the file name and path
  static async getTp(tpName) {
    const {themeActive, tpList, getTpPath}=await import ('./themesfront.js')
    const tpPath=getTpPath(themeActive, tpName);
    //Loading from cache
    if (config.viewsCacheOn!==false) {
      let tpid;
      if (tpPath) tpid="tp" + tpPath.match(/(\w+)\.\w+/)[1];
      else tpid="tp" + tpName;
      if (tpList.has(tpid)) {
        const tpElement=tpList.get(tpid);
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
    if (config.viewsCacheOn!==false) {
      const tpid="tp" + tpPath.match(/(\w+)\.\w+/)[1];
      tpList.set(tpid, myTp);
      tpList.get(tpid).id=tpid;
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
    return this.appendPropertiesView(container, tp, params, true);
  }
  //The actual executor. It doesnt replace
  async appendPropertiesView(container, tp, params, reset, prop) {
    if (!container) container=this.propsContainerr; //Default value
    else this.propsContainer=container; // Update default
    if (!tp) tp=this.myPropTp; // Default value
    else this.myPropTp=tp; // Update default
    let loaderClassName="append-prop-loader";
    if (reset) loaderClassName="set-prop-loader";
    if (container.nodeType==1) container.classList.add(loaderClassName);
    if (typeof tp=="string") {
      tp=await this.constructor.getTp(tp);
    }
    let myKeys=[];
    if (prop) {
      if (this.parentNode && this.parentNode.childtablekeys) {
        let nextSiblingElement=getDomElementFromProp(this, prop);
        if (nextSiblingElement) {
          let thiscol=tp.cloneNode(true);
          thiscol.firstElementChild.setAttribute("data-property", prop);
          let params={...params, editpropertyname: prop};
          container.insertBefore(this.prerender(tp, params), nextSiblingElement);
        }
        else myKeys=[prop]
      }
      else myKeys=[prop];
    }
    else if (this.parentNode && this.parentNode.childtablekeys) {
      myKeys=this.parentNode.childtablekeys;
    }
    else {
      myKeys=Object.keys(this.props);
    }
    if (reset) container.innerHTML='';
    for (const key of myKeys) {
      if (key=="id") continue;
      let thiscol=tp.cloneNode(true);
      thiscol.firstElementChild.setAttribute("data-property", key);
      let myParams={...params, editpropertyname: key};
      thiscol=this.prerender(thiscol, myParams); // we must refresh the filling of the data also cloneNode does not copy extra function and data
      container.appendChild(thiscol);
    }
    let dispachEventName="appendPropsView";
    if (reset) dispachEventName="setPropsView";
    if (prop) dispachEventName="appendPropView";
    this.dispatchEvent(dispachEventName);
    return this;
  }
  async appendPropView(prop, params, container, tp) {
    return this.appendChildrenView(container, tp, params, false, prop);
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
      const keys= this.parentNode && this.parentNode.childtablekeys && this.parentNode.childtablekeys.length > 0 ? this.parentNode.childtablekeys : Object.keys(this.props);
      property = keys.find(key => key!="id"); //Order minds!!
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
          if (!this.parentNode ||  !this.parentNode.childtablekeys) return;
          const keyIndex=this.parentNode.childtablekeys.indexOf(property);
          if (keyIndex==-1 || !this.parentNode.childtablekeysinfo || !this.parentNode.childtablekeysinfo[keyIndex]['Type']) return;
          return this.parentNode.childtablekeysinfo[keyIndex]['Type'].includes("int") || this.parentNode.childtablekeysinfo[keyIndex]['Type'].includes("decimal");
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
          //******** que pasa con e?? no tiene datos?
          throw new Error("Action: " + action + ". Error: Response error: "+ resultTxt);
        }
      }
      if (result && typeof result=="object" && result.error==true) {
        throw (new Error(action + '. SERVER Message: ' + result.message));
      }
      return result;
    })
    .catch(error=>{console.error(error); throw error;});
  }
  //~ makeRequest nick for when the data node is the actual node
  //~ Reduce option is for just removing the not necesary nodes and return the package version but not make the request
  async request(action, parameters, reduce=false, url) {
    const {reqReduc} = await import('./request.js');
    //const {deconstruct} = await import('./../../shared/modules/utils.js'); //hemos pasado esta funcionalidad a request.js

    let reqRedFuncs=reqReduc.get(action);
    
    if (!Array.isArray(reqRedFuncs)) reqRedFuncs=[reqRedFuncs];
    let [nodeRedFunc, paramRedFunc] = reqRedFuncs;
    if (!nodeRedFunc) nodeRedFunc=reqReduc.get("default");
    if (!paramRedFunc) paramRedFunc=params=>params;

    let nodeData=nodeRedFunc(this);
    if (parameters) paramRedFunc(parameters); // no need to re-asign
    /* hemos pasado esta funcionalidad a request.js
    //~ packing data
    nodeData = Array.from(deconstruct(nodeData)); // new for destructure
    if (parameters && parameters.extraParents) {
      parameters.extraParents=parameters.extraParents.map(eParent=>{
        return Array.from(deconstruct(eParent));
        //eParent.avoidrecursion();
        //return eParent;
      });
    }
    */
    
    //We have the option of just return the reduced version.
    if (reduce) {
      if (parameters) return [nodeData, parameters];
      else return nodeData;
    }
    if (!parameters) parameters={};
    parameters.nodeData=nodeData;
    return this.constructor.makeRequest(action, parameters);
  }
  static async requestMulti(action, dataNodes, parameters, reduce, url) {
    //In case we pass single args we multiplicate it for the nodes number
    if (typeof action=='string') {
      action=Array(dataNodes.length).fill(action);
    }
    if (parameters && !Array.isArray(parameters)) {
      parameters=Array(dataNodes.length).fill(parameters);
    }
    let reducedDataNodes=[], reducedParams=[], params=[];
    // we make reduction and save the result also for reduce only option
    for (let index=0; index<dataNodes.length; index++) {
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
    // esto anula la posibilidad de recibir null or undefined, no me gusta
    //if (result===null || result===undefined) throw new Error("Action: " + action + ". Error: No server response");
    
    const {reqLoaders} = await import('./request.js');

    let loadFunc=reqLoaders.get(action);
    if (!loadFunc) loadFunc=(myNode, result)=>myNode.load(result);
    loadFunc(this, result, parameters);
    return this;
  }
  
  static dataToNode(source){
    const myClon= Node.detectGender(source)=="female" ? new NodeFemale() : new NodeMale();
    return myClon.load(source);
  }
}


const Node = NodeFrontMixing(EventListnerMixing(NodeMixing(NodeBase)));

const NodeFemaleFrontMixing=Sup => class extends Sup {
  //It creates a single child not atached to the node but with a copy of the mother
  //It serves for creating a template of new node
  //By default it creates a empty lang data children if it is related to a lang element parent
  
  loaddesc(source, level, thisProperties, myConstructor) {
    if (!myConstructor) return super.loaddesc(source, level, thisProperties, NodeMale);
    return super.loaddesc(source, level, thisProperties, myConstructor);
  }
  
  loadasc(source, level, thisProperties, myConstructor) {
    if (!myConstructor) return super.loadasc(source, level, thisProperties, NodeMale);
    return super.loadasc(source, level, thisProperties, myConstructor);
  }

  createInstanceChild(position=1) {
    const newNode=new NodeMale();
    newNode.parentNode=this;
    const skey=newNode.parentNode.getMySysKey('sort_order');
    if (skey) {
      newNode.props[skey]=position;
    }
    return newNode;
  }
  createInstanceChildText(position=1){
    const newNode=this.createInstanceChild(position);
    return newNode.loadRequest("get my relationships")
    .then(newNode=>{
      //We search for a relationship about language so we have to add then a data language node child
      const datarel = newNode.relationships.find(rel => rel.syschildtablekeysinfo.some( syskey => syskey.type=='foreignkey' && syskey.parenttablename=='TABLE_LANGUAGES' ) );
      if (datarel)  datarel.addChild(new NodeMale());
      return newNode;
    });
  }
  
}

const NodeFemale = NodeFemaleFrontMixing(NodeFrontMixing(NodeFemaleMixing(Node)));

const NodeMaleFrontMixing=Sup => class extends Sup {
  //It loads (ajax) a template replacing container content and executing the scripts. If config.CacheOn=true, it could take the template from the present document
  
  loaddesc(source, level, thisProperties, myConstructor) {
    if (!myConstructor) return super.loaddesc(source, level, thisProperties, NodeFemale);
    return  super.loaddesc(source, level, thisProperties, myConstructor);
  }
  
  loadasc(source, level, thisProperties, myConstructor) {
    if (!myConstructor) return super.loadasc(source, level, thisProperties, NodeFemale);
    return super.loadasc(source, level, thisProperties, myConstructor);
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
    if (container.nodeType==1) container.classList.remove("setviewloader");
    return this;
  }
  //Similar to setView. It doesnt not replace but add the content to the container
  async appendView(container, tp, params) {
    return this.setView(container, tp, params, true);
  }
}

const NodeMale = NodeMaleFrontMixing(NodeFrontMixing(NodeMaleMixing(Node)));

export {Node, NodeFemale, NodeMale}