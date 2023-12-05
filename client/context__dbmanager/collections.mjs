import {Node, Linker} from "./nodes.mjs"
import {getTemplate} from './layouts.mjs'
import {selectorFromAttr, visibleOnMouseOver} from '../frontutils.mjs'
import {setEdition} from "./admin/edition.mjs"
import {setAdditionButton} from "./admin/addition.mjs"
import {setChangePosButton} from "./admin/changepos.mjs"
import {setDeletionButton} from "./admin/deletion.mjs"
import {getLangParent, isLangBranch} from "./languages/languages.mjs"

export async function setCollectionButtons(container){
  const collectionList = await Node.makeRequest("get collections")
  const collectionParents = collectionList.map(tableName => new Linker(tableName))
  for (const colParent of collectionParents) {
    container.appendChild(await collectionButtonView(colParent))
  }
}

async function collectionButtonView(collectionParent){
  const butTp = await getTemplate("collection")
  const but = selectorFromAttr(butTp, "data-value")
  but.textContent = collectionParent.props.childTableName
  but.addEventListener("click", async function(ev) {
    ev.preventDefault()
    await collectionParent.loadRequest("get my childtablekeys")
    if (isAutoRelatedCollection(collectionParent)) {
      collectionParent.props.parentTableName = collectionParent.props.childTableName
      await collectionParent.loadRequest("get my root")
    }
    else {
      await collectionParent.loadRequest("get all my children")
    }
    selectorFromAttr(document.querySelector("main"), "data-main").innerHTML = ""
    for (const myNode of collectionParent.children) {
      selectorFromAttr(document.querySelector("main"), "data-main").appendChild(await nodeView(myNode))
    }
  })
  return butTp
}

async function nodeView(myNode) {
  const myTp = await getTemplate("node")
  const container = selectorFromAttr(myTp, "data-container")
  myNode.firstElement = container
  if (myNode.constructor.nodeConstructor.detectLinker(myNode)) {
    selectorFromAttr(container, "data-value").textContent = myNode.props.name
    selectorFromAttr(container, "data-expander").addEventListener("click", async function(ev) {
      ev.preventDefault()
      const params = {}
      if (isLangBranch(myNode))
        params.extraParents = getLangParent(myNode)
      await myNode.loadRequest("get my children", params)
      myNode.childContainer = selectorFromAttr(container, "data-children")
      myNode.childContainer.innerHTML = ""
      for (const myChild of myNode.children) {
        myNode.childContainer.appendChild(await nodeView(myChild))
      }
    })
  }
  else {
    selectorFromAttr(container, "data-value").innerHTML = ""
    selectorFromAttr(container, "data-value").appendChild(await fieldsView(myNode))
    visibleOnMouseOver(selectorFromAttr(container, "data-admnbuts"), container) // on mouse over edition button visibility
    await setChangePosButton(myNode, container, "butchposvert")
    await setAdditionButton(myNode.parent, myNode, 1, container, async (newNode)=>{
      return await nodeView(newNode)
    })
    await setDeletionButton(myNode, container)
    selectorFromAttr(container, "data-expander").addEventListener("click", async function(ev) {
      ev.preventDefault()
      await myNode.loadRequest("get my relationships")
      myNode.childContainer = selectorFromAttr(container, "data-children")
      myNode.childContainer.innerHTML = ""
      for (const myRel of myNode.relationships) {
        myNode.childContainer.appendChild(await nodeView(myRel))
      }
    })
  }
  selectorFromAttr(container, "data-reducer").addEventListener("click", async function(ev) {
    ev.preventDefault()
    selectorFromAttr(container, "data-children").innerHTML = ""
  })
  return myTp
}

async function fieldsView(myNode) {
  const fieldsTableTp = await getTemplate("datatable")
  const fieldsTable = selectorFromAttr(fieldsTableTp, "data-container")
  const fieldsTableRow = fieldsTable.rows[0].cloneNode(true)
  const fieldsTableCell = fieldsTableRow.cells[0].cloneNode(true)
  const modTableCell = fieldsTableRow.cells[1].cloneNode(true)
  fieldsTableRow.deleteCell(0)
  fieldsTableRow.deleteCell(0) // row must be empty
  fieldsTable.deleteRow(0)
  for (const propKey of myNode.parent.childTableKeys) {
    let propCell = fieldsTableCell.cloneNode(true)
    myNode.writeProp(selectorFromAttr(propCell, "data-value"), propKey)
    visibleOnMouseOver(selectorFromAttr(propCell, "data-butedit"), propCell) // on mouse over edition button visibility
    await setEdition(myNode, propCell, undefined, propKey)
    fieldsTableRow.appendChild(propCell)
  }
  fieldsTableRow.appendChild(modTableCell)
  fieldsTable.appendChild(fieldsTableRow)
  return fieldsTableTp
}

function isAutoRelatedCollection(parentNode){
  if (!parentNode.props.childTableName || !parentNode.sysChildTableKeysInfo)
    throw new Error("no valid parent")
  return parentNode.sysChildTableKeysInfo.some(syskey=>syskey.type=="foreignkey" && syskey.parentTableName==parentNode.props.childTableName)
}

/*
//------
for (const tableName of tables) {
  myParent.addChild(new thisNode.constructor({tableName: tableName}));
}
myParent.setChildrenView(document.getElementById("tablescontainer"), "table");

//Then we make login with user: check views login. Backend it is a patch for allowing login without password
//await webuser.login("systemadmin", "systemadmin");
const myParent=new thisNode.parent.constructor();
thisNode.request("get table list")
.then(async (tables)=>{
  for (const tableName of tables) {
    myParent.addChild(new thisNode.constructor({tableName: tableName}));
  }
  myParent.setChildrenView(document.getElementById("tablescontainer"), "table");
});

  thisNode.writeProp(thisElement);
  //thisElement.textContent=thisNode.props.tableName;
  thisElement.addEventListener("click", async function(ev) {
    ev.preventDefault();
    const myrootmother=new thisNode.parent.constructor('TABLE_' + thisNode.props.tableName.toUpperCase());
    //we have to load root element if autorelated or all the elements if not
    await myrootmother.loadRequest("get my childtablekeys");
    let autorelated=false;
    for (const syskey of myrootmother.sysChildTableKeysInfo) {
      if (syskey.type=="foreignkey" && syskey.parentTableName==myrootmother.props.childTableName) {
        autorelated=true;
      }
    }
    if (autorelated) {
      myrootmother.props.parentTableName=myrootmother.props.childTableName;
      await myrootmother.loadRequest("get my root");
    }
    else {
      await myrootmother.loadRequest("get all my children");
    }

    myrootmother.setChildrenView(document.getElementById("treecontainer"), "maletp")
    .then(async ()=>{
      if (myrootmother.children.length==0) {
        const newNode=await myrootmother.createInstanceChildText();
        newNode.setView(myrootmother.childContainer, "butaddnewnode");
      }
    });

    const {setActive} = await import('./' + CLIENT_MODULES_PATH + 'activenode.js');
    setActive(thisNode);
  });

*/
