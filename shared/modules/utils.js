/*
  Functions to serialize a node (in node list format) from a root node. And to undo this action.
  It could be useful in case we will switch to no sql solution or to fastern the sql by quering all elements at once
  
  En lugar de poner un id numérico, sería mejor que el id (en adelante hash) fuera tipo (table_name:id): TABLE_ITEMCATEGORIES:5. Y para las female quizá: (partner_id:childtablename;parenttablename)
  de esta forma sería más significativo. La función que sacaría el hash a partir del nodo se llama función de hash.
  
  Quizás sería más legible el resultado de packing si utilizaramos un objecto en lugar de un array, mediante Object.fromEntries(mapelement), en lugar de Array.from(mapElement), la operación inversa sería Object.entries(objelement);
*/

export function detectGender(myNode){
  return myNode.hasOwnProperty('parentNode') ? "male" : "female";
}

// type: primary, foreignkey, positionkey. return unique value
export function getSysKey(parentNode, type='foreignkey'){
  if (type=="primary") {
    const result = parentNode.syschildtablekeysinfo.find(value=>value.type=="primary");
    if (result) return result.name;
    return result;
  }
  const result = parentNode.syschildtablekeysinfo.find(value=>value.type==type && value.parenttablename && value.parenttablename==parentNode.props.parenttablename);
  if (result) return result.name;
  return result;
}

export function getRoot(myNode, tableName) {
  let index=myNode;
  // we go for the male
  if (detectGender(index)!="male") {
    if (!index.partnerNode) return;
    index=index.partnerNode;
  }
  while (index.parentNode && index.parentNode.partnerNode && (!tableName || index.parentNode.props.childtablename!=tableName)) {
    index = index.parentNode.partnerNode;
  }
  if (tableName && index.parentNode.props.childtablename!=tableName) return;
  return index;
}

// detects if nodes are equivalent. It works olso for not Node instance objects
export function equality(nodeOne, nodeTwo) {
  if (detectGender(nodeOne)!=detectGender(nodeTwo)) return false;
  // male
  if (detectGender(nodeOne)=='male') {
    if (nodeOne.props.id!==nodeTwo.props.id) return false;
    // parentNodes can be differents because we are checking just data equivalence
    if (nodeOne.parentNode!=nodeTwo.parentNode && (nodeOne.parentNode===null || nodeTwo.parentNode===null)) return false;
    if (nodeOne.parentNode && nodeTwo.parentNode &&
      nodeOne.parentNode.props.childtablename === nodeTwo.parentNode.props.childtablename &&
      nodeOne.parentNode.props.parenttablename === nodeTwo.parentNode.props.parenttablename) return true;
  }
  // female
  else {
    if (nodeOne.props.childtablename != nodeTwo.props.childtablename) return false;
    if (nodeOne.props.parenttablename != nodeTwo.props.parenttablename) return false;
    // partnerNodes can be differents because we are checking just data equivalence
    if (nodeOne.partnerNode!=nodeTwo.partnerNode && (nodeOne.partnerNode===null || nodeTwo.partnerNode===null)) return false;
    if (nodeOne.partnerNode && nodeTwo.partnerNode &&
      nodeOne.partnerNode.props.id === nodeTwo.partnerNode.props.id) return true;
  }
}

export function deconstruct(myNode){
  // save the myNode in a diferent var
  // go to start node (either male of female) and set myNode as it
  const indexNode=myNode;
  myNode=getRoot(myNode);
  if (!myNode) myNode=indexNode;
  if (myNode.parentNode) myNode=myNode.parentNode;
  const gender = detectGender(myNode);

  const serials=new Map();
  
  const serializeNode = (myNode, gender) => {
    // dudo si habría que incluir en la lista las variables propias de género: children, relationships, parentNode, partnerNode
    const serialFemale={partnerNode: null, children:[]},
    serialMale={parentNode: null, relationships:[]},
    maleKeys=['props'],
    femaleKeys=['props', 'childtablekeys', 'childtablekeysinfo', 'syschildtablekeys', 'syschildtablekeysinfo'];

    const myKeys = gender=='female' ? femaleKeys : maleKeys;
    const serialNode = gender=='female' ? serialFemale : serialMale;
    for (const key of myKeys) {
      serialNode[key]=myNode[key];
    }
    return serialNode;
  }
  let indexKey;
  const innerSerialize = (myNode, gender) => {
    const myId=serials.size + 1; // this ensures unique ids
    if (myNode===indexNode) indexKey=myId;
    const newOne=serializeNode(myNode, gender);
    newOne.props.__id=myId;
    let recursion, nextGender;
    if (gender=='female') {
      if (myNode.partnerNode && myNode.partnerNode.props.__id) {
        newOne.partnerNode=myNode.partnerNode.props.__id;
      }
      recursion=myNode.children;
      nextGender='male';
    }
    else {
      if (myNode.parentNode && myNode.parentNode.props.__id) {
        newOne.parentNode=myNode.parentNode.props.__id;
      }
      recursion=myNode.relationships;
      nextGender='female';
    }
    serials.set(myId, newOne);
    for (const re of recursion) {
      innerSerialize(re, nextGender);
    }
  }
  
  innerSerialize(myNode, gender);
  
  
  serials.forEach((value)=>{
    // si el valor es el del nodo guardado guardamos su id
    //if (value && value.props && value.props.id && indexNode.props && indexNode.props.id && value.props.id===indexNode.props.id) indexKey=value.props.__id;
    if (value && value.props && value.props.__id) delete value.props.__id;
  })
  if (!indexKey) return;
  // ponemos un último valor en el map para establecer el valor inicial del bloque: index: id, 
  serials.set('index', indexKey);
  return serials;
}

/*
Esta consulta devuelve los datos de la tabla siteelements ordenados en jerarquía lo que sería útil si quisiéramos convertir estos datos al tree sin usar recursión

WITH RECURSIVE MyTree AS (
    SELECT * FROM public.siteelements WHERE "_siteelements" IS NULL
    UNION ALL
    SELECT m.* FROM public.siteelements AS m JOIN MyTree AS t ON m._siteelements = t.id
)
SELECT * FROM MyTree;

So tenemos este resultado de una tabla podemos utilizar los propios ids para que el mapa resultante de serialize tenga como claves los ids y de esta forma si queremos añadir al arbol elementos de otras tablas lo tendríamos más fácil:
const myId = gender == "male" ? myNode.props.id : 'f' + (serials.size + 1);

Quizá podría ponerse en cada nodo de la lista además de parent__id children[..._id] y así quizás se podría hacer de forma que no importara el orden
*/

export function construct(serials){
  //const tree = new Map([[serials.entries().next().value[0], serials.entries().next().value[1]]]);
  const tree = new Map();
  serials.forEach((dataValue, id)=>{
    if (id=='index') return;
    let value=JSON.parse(JSON.stringify(dataValue));
    tree.set(id, value);
    // set the antecesor
    if (value.parentNode) {
      const parent=tree.get(value.parentNode);
      if (parent) {
        // add child to parent
        value.parentNode=parent;
        parent.children.push(value);
      }
    }
    else if (value.partnerNode) {
      const partner=tree.get(value.partnerNode);
      if (partner) {
        // add relationship to partner
        value.partnerNode=partner;
        partner.relationships.push(value);
      }
    }
  });
  // devuelve el nodo adecuado, no el primero: return tree.get(tree.get('index'));
  return tree.get(serials.get('index'));
  //return tree.entries().next().value[1];
}

export const unpacking=data=>{
  if (typeof data == 'object') return construct(new Map(data));
  return data;
};
export const arrayUnpacking=datas=>{
  if (typeof datas == 'object') return datas.map(data => unpacking(data));
  return datas;
};
export const packing=data=>{
  if (typeof data == 'object') return Array.from(deconstruct(data));
  return data;
};
export const arrayPacking=datas=>{
  if (typeof datas == 'object') return datas.map(data => packing(data));
  return datas;
};

// Only when structure is identical
export function replaceLangData(targetTree, sourceTree){
  const targetTreeArray=targetTree.arrayFromTree();
  const sourceArray=sourceTree.arrayFromTree();
  for (let i=0; i<targetTreeArray.length; i++) {
    if (detectGender(targetTreeArray[i])=="female") {
      const isLangContent = targetTreeArray[i].syschildtablekeysinfo &&
      targetTreeArray[i].syschildtablekeysinfo.some(syskey=>syskey.type=='foreignkey' && syskey.parenttablename=="TABLE_LANGUAGES");
      if (!isLangContent) continue;
      //Swap the other langs content
      targetTreeArray[i].children[0].props=sourceArray[i].children[0].props;
    }
  }
  return targetTree;
}

// split the languages data in one array of langdata for each language
export function splitLangTree(origTree, totalLang){
  if (totalLang<2) return [origTree];
  const origSerial=origTree.arrayFromTree();
  const singleTrees=[];
  for (let lang_i=0; lang_i<totalLang; lang_i++) {
    singleTrees[lang_i] = origTree.constructor.dataToNode(origTree);
    const langSerial=singleTrees[lang_i].arrayFromTree();
    for (let i=0; i<origSerial.length; i++) {
      if (detectGender(origSerial[i])=="female") {
        const isLangContent = origSerial[i].syschildtablekeysinfo &&
        origSerial[i].syschildtablekeysinfo.some(syskey=>syskey.type=='foreignkey' && syskey.parenttablename=="TABLE_LANGUAGES");
        if (!isLangContent) continue;
        //The children are the lang conent
        langSerial[i].children=[origSerial[i].children[lang_i]];
      }
    }
  }
  return singleTrees;
}