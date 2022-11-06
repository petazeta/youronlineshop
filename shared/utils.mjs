/*
  Some utils functions for nodes.
  The most important is the one to serialize a node tree (in node list format) from a root node. And to undo this action.
  Data strongnest is gained with this format over the json because data has no hearchy, this is, each data cell is in equal level, so if some data is lost we could easily restore the rest of the data and it becomes more clear for reading. It is a similar principle than new line delimited json so if the data is corrupt we can recover data easily with this format.

  It could be also used in no sql solution or to fastern the sql by quering all elements at once
  
  En lugar de poner un id numérico, sería mejor que el id (en adelante hash) fuera tipo (table_name:id): TABLE_ITEMCATEGORIES:5. Y para las female quizá: (partner_id:childTableName;parentTableName)
  de esta forma sería más significativo. La función que sacaría el hash a partir del nodo se llama función de hash.
  
  Quizás sería más legible el resultado de packing si utilizaramos un objecto en lugar de un array, mediante Object.fromEntries(mapelement), en lugar de Array.from(mapElement), la operación inversa sería Object.entries(objelement);
*/


import {BasicNode} from './linker.mjs';

// serializing the node data
export function deconstruct(myNode){
  // We get to the root node and serialize from it, and for be able to get again to the present node we store it in an index field.
  const indexNode=myNode; // set a pointer to the present node
  myNode=BasicNode.getRoot(myNode);
  if (!myNode) myNode=indexNode;
  const serials=new Map();
  // It returns the node with the basic data. It clears the links to parent and children.
  const clearNode = (myNode) => {
    const serialCommon={_parent: null, _children:[]},
    serialFemale={partner: null, children:[]},
    serialMale={parent: null, relationships:[]},
    commonKeys=['props'],
    maleKeys=[],
    femaleKeys=['childTableKeys', 'childTableKeysInfo', 'sysChildTableKeys', 'sysChildTableKeysInfo'];

    const isLinker = BasicNode.detectLinker(myNode);
    const myKeys = isLinker ? [...commonKeys, ...femaleKeys] : [...commonKeys, ...maleKeys];
    const serialNode = isLinker ? {...serialCommon, ...serialFemale} : {...serialCommon, ...serialMale};
    for (const key of myKeys) {
      serialNode[key]=myNode[key];
    }
    return serialNode;
  }
  let indexKey; // For storing the indexKey
  const innerSerialize = (myNode) => {
    const myId=serials.size + 1; // this ensures unique ids
    if (myNode===indexNode) indexKey=myId;
    const newOne=clearNode(myNode);
    newOne.props.__id=myId; // We set the id into the properties

    if (myNode._parent && myNode._parent.props.__id) {
      newOne._parent=myNode._parent.props.__id; // we assing the parent id to "_parent" property
    }

    serials.set(myId, newOne);
    for (const re of myNode._children) {
      innerSerialize(re);
    }
  }
  
  innerSerialize(myNode);
  
  serials.forEach((value)=>{
    if (value?.props?.__id) delete value.props.__id;
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
    let value=JSON.parse(JSON.stringify(dataValue)); // make a copy
    tree.set(id, value);
    // set the antecesor
    if (value._parent) {
      const parent=tree.get(value._parent);
      if (parent) {
        // add child to parent
        value._parent=parent;
        if ("parent" in value) value.parent = parent;
        else value.partner = parent;
        if ("children" in parent) parent.children.push(value);
        else parent.relationships.push(value);
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

export const splitLinesFormat=jsonData=>{
  return jsonData.replaceAll('],[', '],\n[');
};

export const exportFormat=jsonData=>{
  return splitLinesFormat(jsonData).replaceAll('[[[', '\n[[[').replaceAll(']]],', ']]],\n')
};

// Only when structure is identical
export function replaceLangData(targetTree, sourceTree){
  const sourceArray=sourceTree.arrayFromTree();
  targetTree.arrayFromTree().forEach((targetTree, i)=>{
    if (BasicNode.detectLinker(targetTree)) {
      const isLangContent = targetTree.sysChildTableKeysInfo && targetTree.sysChildTableKeysInfo.some(syskey=>syskey.type=='foreignkey' && syskey.parentTableName=="TABLE_LANGUAGES");
      //Swap the other langs content
      if (isLangContent) targetTree.children[0].props=sourceArray[i].children[0].props;
    }
  });
  return targetTree;
}

// split the languages data in one array of langdata for each language
export function splitLangTree(origTree, totalLang){
  if (totalLang<2) return [origTree];
  const origSerial=origTree.arrayFromTree();
  const singleTrees=new Array(totalLang).fill(undefined).map(()=>origTree.clone());
  singleTrees.forEach((singleTree, lang_i)=>{
    const langSerial=singleTree.arrayFromTree();
    origSerial.forEach((orig, i)=>{
      if (BasicNode.detectLinker(orig)) {
        const isLangContent = orig.sysChildTableKeysInfo && orig.sysChildTableKeysInfo.some(syskey=>syskey.type=='foreignkey' && syskey.parentTableName=="TABLE_LANGUAGES");
        //The children are the lang conent
        if (isLangContent)langSerial[i].children=[orig.children[lang_i]];
      }
    })
  });
  return singleTrees;
}

export function getChildrenArray(myNode) {
  const relChildrenArray = (rel) => rel.children.reduce((childArray, child)=>childArray = [...childArray, child], []);
  if (BasicNode.detectLinker(myNode)) return relChildrenArray(myNode);
  return myNode.relationships.reduce((totalArray, rel)=>totalArray = [...totalArray, ...relChildrenArray(rel)], []);
}