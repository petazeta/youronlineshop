// FrontEnd facility

import config from './cfg/main.js';
import {authorizationToken} from "./authorization.js";
import basicMixin from './../shared/basicmixin.mjs';
import linksMixin from './../shared/linksmixin.mjs';
import {commonMixin, linkerMixin, dataMixin, linkerExpressMixin, dataExpressMixin} from './../shared/linkermixin.mjs';
import eventListenerMixin from './eventlistenermixin.js';
import {getDomElementFromChild} from './frontutils.js';

// It also makes live import of:
// './themesfront.js', './request.js'

const modelMixin=Sup => class extends Sup {
  //It sends a request.
  static async makeRequest(action, params, url) {
    const {reqMethods} = await import('./request.js');
    let reqMethodFunc=reqMethods.get(action);
    if (!reqMethodFunc) reqMethodFunc=reqMethods.get("default");
    const method=reqMethodFunc(params);
    const contentType='application/json';
    if (!url) url=config.requestUrlPath;
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
          throw new Error(e.message + "Action: " + action + ". Error: Response error: "+ resultTxt);
        }
      }
      if (result && typeof result=="object" && result.error==true) {
        throw new Error(action + '. SERVER Message: ' + result.message);
      }
      return result;
    });
  }
  //~ makeRequest nick for when the data node is the actual node
  //~ Reduce option is for just removing the not necesary nodes and return the package version but not make the request
  async request(action, parameters, reduce=false, url) {
    const {reqReduc} = await import('./request.js');

    let reqRedFuncs=reqReduc.get(action);
    if (!reqRedFuncs) reqRedFuncs=reqReduc.get("default");
    if (!Array.isArray(reqRedFuncs)) reqRedFuncs=[reqRedFuncs];
    let [nodeRedFunc, paramRedFunc=params=>params] = reqRedFuncs;

    let nodeData=nodeRedFunc(this);
    if (parameters) paramRedFunc(parameters); // no need to re-asign because we act to the object properties

    //We have the option of just return the reduced version.
    if (reduce) {
      if (parameters) return [nodeData, parameters];
      return nodeData;
    }
    if (!parameters) parameters={};
    parameters.nodeData=nodeData;
    const result = this.constructor.makeRequest(action, parameters);
    this.notifyObservers("request"); // The interface is defined down here in blank for when no imported
    this.dispatchEvent("request");
    return result;
  }
  async loadRequest(action, parameters, url) {
    const result= await this.request(action, parameters, false, url);
    const {reqLoaders} = await import('./request.js');

    let loadFunc=reqLoaders.get(action);
    if (!loadFunc) loadFunc=reqLoaders.get("default");
    loadFunc(this, result, parameters);
    return this;
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
    for (const index of Object.keys(dataNodes)) {
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
      return reducedDataNodes;
    }
    return this.makeRequest(action, params, url); // static
  }
  // observer and event interface in case there is not
  notifyObservers(){}
  dispatchEvent(){}
}

const viewMixin=Sup => class extends Sup {
  // This is the function that actually gets a template from file.
  // Templates cache can be filled completely at the first load by config loadalltemplatesatonce
  // tpName is the file name without extension but it also acepts the file name and path
  static async getTp(tpName) {
    const {getTemplate}=await import ('./themesserver.js');
    return await getTemplate(tpName);
  }
}

const linkerViewMixin=Sup => class extends Sup {
  constructor(...args) {
    super(...args);
    this.childTp=null;
    this.childContainer=null;
  }

  //It creates a single child not atached to the node but with a copy of the mother
  //It serves for creating a template of new node
  //By default it creates a empty lang data children if it is related to a lang element parent

  //Similar to setView but refering to node children
  async setChildrenView(container, tp, params, append=false) {
    if (typeof tp=="string") {
      tp = await this.constructor.getTp(tp);
    }
    if (!container) container=this.childContainer; //Default value for container
    else this.childContainer=container; //Update default
    if (!tp) tp=this.childTp; //Default value
    else this.childTp=tp; //Update default
    if (!container || !tp) throw new Error('No data');

    if (!append) container.innerHTML='';

    const renderedChildren=document.createDocumentFragment();
    const skey=this.getSysKey('sort_order');

    if (this.children.length>0) {
      if (skey) this.children=this.children.sort((a,b)=>a.props[skey]-b.props[skey]);
      for (const child of this.children) {
        renderedChildren.appendChild(child.render(tp, params));
      }
    }
    container.appendChild(renderedChildren);
    this.notifyObservers("setChildrenView");
    this.dispatchEvent("setChildrenView");
    return this;
  }
  //It doesn't replace, it adds the content
  async appendChildrenView(container, tp, params) {
    return this.setChildrenView(container, tp, params, true);
  }

  async appendChildView(child, params, container, tp) {
    if (typeof tp=="string") {
      tp = await this.constructor.getTp(tp);
    }
    if (!container) container=this.childContainer; //Default value for container
    else this.childContainer=container; //Update default
    if (!tp) tp=this.childTp; //Default value
    else this.childTp=tp; //Update default
    if (!container || !tp) throw new Error('No data');

    const skey=this.getSysKey('sort_order');
    if (skey && this.children.length>0 && child.props[skey]<this.children.length) {
      let nextSiblingElement=getDomElementFromChild(this.children[child.props[skey]-1]);
      if (!nextSiblingElement) nextSiblingElement=container.lastElementChild;
      container.insertBefore(child.render(tp, params), nextSiblingElement);
    }
    else container.appendChild(child.render(tp, params));
    return this;
  }

  createInstanceChild(position=1) {
    const newNode=new this.constructor.dataConstructor;
    newNode.parent=this;
    const skey=newNode.parent.getSysKey('sort_order');
    if (skey) {
      newNode.props[skey]=position;
    }
    return newNode;
  }
  // observer and event interface
  notifyObservers(){}
  dispatchEvent(){}
}

const LinkerNode = eventListenerMixin(linkerViewMixin(viewMixin(modelMixin(linkerExpressMixin(linkerMixin(commonMixin(linksMixin(basicMixin(class {})))))))));

const dataViewMixin=Sup => class extends Sup {
  constructor(...args) {
    super(...args);
    this.tp=null;
    this.container=null;
  }

  // It loads (ajax) a template replacing container content and executing the scripts. If config.CacheOn=true, it could take the template from the present document

  // This function serves to add "scope" and prepare an html template or a dom element.
  // In case is a dom element it will actually render scripts but if it is a template untill it is actually inserted int the dom the scrips are not executed
  // node.render(domelement), node.render(scriptelement)
  render(tp, params={}) {
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
      //adding scope (encapsulation) so this variables are local and can't be modified from another scripts.
      //Also async type allows awiat in scripts
      myScript.textContent="(async (thisElement, thisNode, thisParams)=>{" + scriptElement.textContent + "})(document.currentScript.previousElementSibling, document.currentScript.thisNode, document.currentScript.thisParams);";
      myScript.thisNode=this;
      myScript.thisParams=params;
      const container=scriptElement.parentNode;  // !!Document Fragment is not an Element => *parentNode*
      container.insertBefore(myScript, scriptElement);
      container.removeChild(scriptElement);
    });
    return tp;
  }

  async setView(container, tp, params, append=false) {
    if (typeof tp=="string") {
      tp = await this.constructor.getTp(tp);
    }
    if (!container) container=this.container; //Default value for container
    else this.container=container; //Update default
    if (!tp) tp=this.tp; //Default value for
    else this.tp=tp; //Update default
    if (!container || !tp) throw new Error('No data');

    const clone=this.render(tp, params); //It gets tp content with the scrips ready
    if (!append) container.innerHTML='';
    container.appendChild(clone);
    
    this.notifyObservers("setView");
    this.dispatchEvent("setView");
    return this;
  }
  //Similar to setView. It doesnt not replace but add the content to the container
  async appendView(container, tp, params) {
    return this.setView(container, tp, params, true);
  }

  //This function write a template record (refreshing) for each property
  async setPropsView(container, tp, params, append=false) {
    if (typeof tp=="string") {
      tp=await this.constructor.getTp(tp);
    }
    if (!container || !tp) throw new Error('No data');

    if (!append) container.innerHTML='';

    const renderedProps=document.createDocumentFragment();
    const myKeys = this.parent && this.parent.childTableKeys.length > 0 ? [...this.parent.childTableKeys] : Object.keys(this.props);

    for (const key of myKeys) {
      if (key=="id") continue;
      const columnTp=tp.cloneNode(true);
      columnTp.firstElementChild.setAttribute("data-property", key); // set this attribute for give some info about present prop
      renderedProps.appendChild(this.render(columnTp, {...params, editPropName: key})); // we must refresh the filling of the data also cloneNode does not copy extra function and data
    }
    container.appendChild(renderedProps);
    this.notifyObservers("setPropsView");
    this.dispatchEvent("setPropsView");
    return this;
  }

  //It doesn't replace, it adds the content
  async appendPropsView(container, tp, params) {
    return this.setPropsView(container, tp, params, true);
  }
  
  // It inserts the property value in the container. Container can contain the property name to be filled.
  // It uses config
  writeProp(container, propName, attribute, onEmptyValueText) {
    if (!propName) { //we must guess the propName value if it is not settled
      const keys= this.parent & this.parent.childTableKeys.length > 0 ? this.parent.childTableKeys : Object.keys(this.props);
      propName = keys.find(key => key!="id"); //Order minds!!
    }
    let value=this.props[propName];
    if (!value && value!==0) value=''; //Parse undefined

    //Write the new value
    if (!attribute) {
      if (container.tagName=="INPUT") container.value=value;
      else container.innerHTML=value;
    }
    else container.hasAttribute(attribute) ? container.setAttribute(attribute, value) : container[attribute]=value;

    //We set a default value
    if (!config.onEmptyValueTextOn || attribute || container.tagName=="INPUT") return;
    //If field type is int => value=0, other case value=onEmptyValueText when innerHTML
    if (this.parent && this.constructor.isNumberField(this.parent, propName)) {
      container.setAttribute("data-placeholder", "0");
    }
    else {
      container.setAttribute("data-placeholder", onEmptyValueText);
    }
  }
  // observer and event interface
  notifyObservers(){}
  dispatchEvent(){}
}

const DataNode = eventListenerMixin(dataViewMixin(viewMixin(modelMixin(dataExpressMixin(dataMixin(commonMixin(linksMixin(basicMixin(class {})))))))));

DataNode.linkerConstructor=LinkerNode;
LinkerNode.dataConstructor=DataNode;

export {LinkerNode, DataNode}

/*

Deja de existir setviewloader
myContainer => container
myTp => tp, myChildTp => childTp
prerender => render
editpropertyname => editPropName
data-property => data-prop
setPropertiesView => setPropsView
writeProperty => writeProp
*/