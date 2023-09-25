// FrontEnd facility (it needs a nodeserver.mjs version to provide contexts)
// The class static props: nodeContructor, linkerConstructor need to be set at nodeserver.mjs
import {makeRequest, request, loadRequest, requestMulti} from "./request.mjs";
//import {BasicLinker, BasicNode} from './../shared/linker.mjs';
//import eventListenerMixin from './eventlistenermixin.mjs';
//import {getDomElementFromChild} from './frontutils.mjs';

// It also makes live import of:
// './themesfront.mjs', './request.mjs'
// url belongs to context and should be set in a nodeserver version

// API layer to server
// It is essentially a storage interface. It can be overwritten in extension classes/contexts
export const modelRequestMixin=Sup => class extends Sup {
  // It sends a request.
  static async makeRequest(action, params, url) {
    return await makeRequest(action, params, url)
  }
  //~ makeRequest nick for when the data node is the actual node
  async request(action, params, url) {
    return await request(this, action, params, url)
    //this.notifyObservers("request") // The interface is defined down here in blank for when no imported
    //this.dispatchEvent("request")
  }
  async loadRequest(action, params, url) {
    return await loadRequest(this, action, params, url)
  }
  static async requestMulti(action, dataNodes, parameters, url) {
    return await requestMulti(action, dataNodes, parameters, url)
  }
  // observer and event interface in case there is not
  notifyObservers(){}
  dispatchEvent(){}
}

// Api layer to browser view
export const viewMixin=Sup => class extends Sup {
  // This is the function that actually gets a template from file.
  // Templates cache can be filled completely at the first load by config loadalltemplatesatonce
  // tpName is the file name without extension but it also acepts the file name and path
  // getTp must be defined in context version
  static async getTp(tpName, getTemplate) {
    return await getTemplate(tpName)
  }
}

export const linkerViewMixin=Sup => class extends Sup {
  constructor(...args) {
    super(...args)
    this.childTp=null
    this.childContainer=null
  }
  //It creates a single child not atached to the node but with a copy of the mother
  //It serves for creating a template of new node
  //By default it creates a empty lang data children if it is related to a lang element parent

  //Similar to setView but refering to node children
  async setChildrenView(container, tp, params, append=false) {
    if (typeof tp=="string") {
      tp = await this.constructor.getTp(tp)
    }
    if (!container) container=this.childContainer; //Default value for container
    else this.childContainer=container; //Update default
    if (!tp) tp=this.childTp; //Default value
    else this.childTp=tp; //Update default
    if (!container || !tp) throw new Error('No data')

    if (!append) container.innerHTML=''

    const renderedChildren=document.createDocumentFragment()
    for (const child of this.children) {
      let childView=child.render(tp, params)
      renderedChildren.appendChild(childView)
      // Experimental *****
      if (params && typeof params.init=="function") params.init(child, childView)
    }
    container.appendChild(renderedChildren)
    this.notifyObservers("setChildrenView")
    this.dispatchEvent("setChildrenView")
    return this;
  }
  //It doesn't replace, it adds the content
  async appendChildrenView(container, tp, params) {
    return this.setChildrenView(container, tp, params, true);
  }
  // similar to setChildrenView but for a single child
  async appendChildView(myChild, container, tp, params) {
    if (typeof tp=="string") {
      tp = await this.constructor.getTp(tp)
    }
    if (!container) container=this.childContainer //Default value for container
    else this.childContainer=container //Update default
    if (!tp) tp=this.childTp //Default value
    else this.childTp=tp //Update default
    if (!container || !tp) throw new Error('No data')
    const skey=this.getSysKey('sort_order')
    const nextSiblingElement = skey && this.children.length>0 && myChild.props[skey]<this.children.length && this.children.find(child=>child.props[skey]==myChild.props[skey])?.firstElement
    let childView=myChild.render(tp, params)
    nextSiblingElement ? container.insertBefore(childView, nextSiblingElement) : container.appendChild(childView)
    // Experimental *****
    if (params && typeof params.init=="function") params.init(myChild, childView)
    this.notifyObservers("appendChildView")
    this.dispatchEvent("appendChildView")
    return this
  }
  // this method despite it is not apparently related to any view element it is used for the addition procedure at the view interface to create a virtual child
  // to be added to the database.
  createInstanceChild(position=1) {
    const newNode=new this.constructor.nodeConstructor
    newNode.parent=this
    const skey=newNode.parent.getSysKey('sort_order')
    if (skey) {
      newNode.props[skey]=position
    }
    return newNode
  }
  // observer and event interface
  notifyObservers(){}
  dispatchEvent(){}
}

// export const Linker = eventListenerMixin(linkerViewMixin(viewMixin(modelRequestMixin(BasicLinker))))

export const dataViewMixin=Sup => class extends Sup {
  constructor(...args) {
    super(...args)
    this.tp=null
    this.firstElement=null
    this.container=null
  }
  // prepareTpScripts must be defined in context version
  render(tp, params={}, prepareTpScripts) {
    const tpContent = prepareTpScripts(tp, this, params) // stable
    this.firstElement = tpContent.firstElementChild
    return tpContent
    // return this.container = prepareTpScriptsComponent(tp, this, params) // experimental: que pasa si el fragmento contiene un <tr>? quedaría <table><view-component><tr>?
  }
  async setView(container, tp, params, append=false) {
    if (typeof tp=="string") {
      tp = await this.constructor.getTp(tp)
    }
    if (!container) container=this.container //Default value for container
    else this.container=container //Update default
    if (!tp) tp=this.tp //Default value for
    else this.tp=tp //Update default
    if (!container || !tp) throw new Error('No data')

    const clone=this.render(tp, params); //It gets tp content with the scrips ready
    
    if (!append) container.innerHTML=''
    container.appendChild(clone)
    // Experimental *****
    // seria más conveniente quizás aplicar la funcion al tp antes de ser insertado??? probarlo?? tener en cuenta que firstElement no estaría disponible
    if (params && typeof params.init=="function") params.init(this, clone)
    
    this.notifyObservers("setView")
    this.dispatchEvent("setView")
    return this
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
    const myKeys = this.parent?.childTableKeys.length > 0 ? [...this.parent.childTableKeys] : Object.keys(this.props);

    for (const key of myKeys) {
      if (key=="id") continue;
      const columnTp=tp.cloneNode(true); // ESto es obsoleto???
      columnTp.firstElementChild.setAttribute("data-property", key); // set this attribute for give some info about present prop
      renderedProps.appendChild(this.render(columnTp, {...params, editPropName: key})); // we must refresh the filling of the data also cloneNode does not copy extra function and data
    }
    container.appendChild(renderedProps);
    // Experimental *****
    if (params && typeof params.init=="function") params.init(this, renderedProps)
    this.notifyObservers("setPropsView");
    this.dispatchEvent("setPropsView");
    return this;
  }

  //It doesn't replace, it adds the content
  async appendPropsView(container, tp, params) {
    return this.setPropsView(container, tp, params, true);
  }
  
  // It inserts the property value in the container. Container can contain the property name to be filled.
  // If no value, it inserts a default value: 0 for integers and onEmptyValueText for texts
  writeProp(container, propName, attribute, onEmptyValueText) {
    if (!propName) { //we must guess the propName value if it is not settled
      if (this.parent?.childTableKeys.length) propName = this.parent.childTableKeys.filter(key=>!this.parent.sysChildTableKeys.includes(key))[0];
      else propName = Object.keys(this.props).find(key => key!="id"); //Order minds!!
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
    if (attribute || container.tagName=="INPUT") return;
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

// export const Node = eventListenerMixin(dataViewMixin(viewMixin(modelRequestMixin(BasicNode))));