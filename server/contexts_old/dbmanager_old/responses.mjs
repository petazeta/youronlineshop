import {getTemplate, getTemplatesContent, getCssContent} from './themesserver.mjs';
import {Node, Linker} from './nodesserver.mjs';
import {getTableList, resetDb} from './dbgatewayserver.mjs';
import {User, userLogin} from './userserver.mjs';
import {isAllowedToRead, isAllowedToInsert, isAllowedToModify} from './safety.mjs';
import {unpacking, arrayUnpacking, packing} from '../../shared/utils.mjs';
import config from './cfg/mainserver.mjs';
import * as path from 'path';
import makeReport from './reportsserver.mjs';

const responseAuth=new Map();
const responseContentType=new Map();

export {responseAuth, responseContentType};

export default function makeRequest(user, action, parameters) {
  if (!responseAuth.has(action)) {
    const myError = new Error(`Error: action '${action}' not recognised`);
    myError.name="400";
    throw myError;
  }
  return responseAuth.get(action)(parameters, user);
}

export function getResponseContentType(action) {
  if (!responseContentType.has(action)) {
    return 'application/json'; // Default Value
  }
  return responseContentType.get(action);
}

responseAuth.set('get table list', ()=>Array.from(getTableList().values())); // It is not used by yos but can be used by dbmanager

responseAuth.set('get template content', async (parameters)=>getTemplate(parameters.tpId, parameters.themeId, parameters.subThemeId));
responseContentType.set('get template content', 'text/html');

responseAuth.set('get templates content', async (parameters)=>getTemplatesContent(parameters.themeId, parameters.subThemeId));
responseContentType.set('get templates content', 'text/html');

responseAuth.set('get css content', async (parameters)=>getCssContent(parameters.styleId, parameters.themeId, parameters.subThemeId));
responseContentType.set('get css content', 'text/html');

responseAuth.set('reset database', resetDb); // mejor llamarlo pupulateDb

responseAuth.set('report', (parameters)=>makeReport(parameters.repData));

//<-- User responseAuth

responseAuth.set('login', (parameters)=>
  userLogin(parameters.user_name, parameters.user_password)
  .then(result =>{
    if (result instanceof Error) return {logError: true, code: result.message};
    const user=result;
    user.dbUpdateAccess();
    return packing(user);
  })
);

responseAuth.set('update user pwd', async (parameters, user)=>{
  if (! await isAllowedToModify(user)) throw new Error("Database safety");
  return User.dbUpdatePwd(parameters.user_name, parameters.user_password);
});

responseAuth.set('update my user pwd', (parameters, user)=>user.dbUpdateMyPwd(parameters.user_password));

responseAuth.set('create user', (parameters)=>User.create(parameters.user_name, parameters.user_password).then(result=>{
  if (result instanceof Error) return {logError: true, code: result.message};
  return packing(result);
}));

responseAuth.set('send mail', (parameters, user)=>user.sendMail(parameters.to, parameters.subject, parameters.message, parameters.from));

//<-- Read responseAuth

responseAuth.set('get my childtablekeys', (parameters)=>Linker.dbGetChildTableKeys( unpacking(parameters.nodeData).props.childTableName ));

responseAuth.set('get my root',  async (parameters, user)=>{
  if (! await isAllowedToRead(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return Linker.dbGetRoot(unpacking(parameters.nodeData));
});

responseAuth.set('get all my children', async (parameters, user)=>{
  if (! await isAllowedToRead(user,unpacking(parameters.nodeData))) throw new Error("Database safety");
  return Linker.dbGetAllChildren(unpacking(parameters.nodeData), parameters.filterProps, parameters.limit);
});
  
responseAuth.set('get my children', async (parameters, user)=>{
  if (! await isAllowedToRead(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return Linker.dbGetChildren(unpacking(parameters.nodeData), arrayUnpacking(parameters.extraParents), parameters.filterProps, parameters.limit, parameters.count);
});

// get descendents: equivalent to get my tree down
responseAuth.set('get my tree', async (parameters, user)=>{
  if (! await isAllowedToRead(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  const req = Node.clone(unpacking(parameters.nodeData));
  return req.dbGetMyTree(arrayUnpacking(parameters.extraParents), parameters.deepLevel, parameters.filterProps, parameters.limit, parameters.myself)
  .then(result=>{
    if (!result) return result;
    // careful the result list has still parentNode or partnerNode,
    if (Node.detectLinker(unpacking(parameters.nodeData))) {
      if (result.total==0) return {total: 0};
      const myResult = new Linker();
      result.data.forEach(child=>myResult.addChild(child));
      return {data: packing(myResult), total: result.total};
    }
    if (parameters.myself) return packing(result);
    const myResult = new Node();
    result.forEach(rel=>myResult.addRelationship(rel));
    return packing(myResult);
  });
});

responseAuth.set('get my tree up', async (parameters, user)=>{
  if (! await isAllowedToRead(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  const req = Node.clone(unpacking(parameters.nodeData));
  return req.dbGetMyTreeUp(parameters.deepLevel)
  .then(result=>{
    if (!result) return result;
    if (Array.isArray(result)) {
      return result.map(result=>packing(result));
    }
    return packing(result);
  });
});

responseAuth.set('get my relationships', (parameters, user)=>Node.dbGetRelationships(unpacking(parameters.nodeData)));
  
//<-- Insert responseAuth

responseAuth.set('add myself', async (parameters, user)=>{
  if (! await isAllowedToInsert(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new Node().load(unpacking(parameters.nodeData)).dbInsertMySelf(arrayUnpacking(parameters.extraParents), parameters.updateSiblingsOrder);
});

responseAuth.set('add my children', async (parameters, user)=>{
  if (! await isAllowedToInsert(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new Linker().load(unpacking(parameters.nodeData)).dbInsertMyChildren(arrayUnpacking(parameters.extraParents));
});
  
responseAuth.set('add my tree', async (parameters, user)=>{
  if (! await isAllowedToInsert(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  const req = Node.clone(unpacking(parameters.nodeData));
  return req.dbInsertMyTree(parameters.deepLevel, arrayUnpacking(parameters.extraParents), parameters.myself, parameters.updateSiblingsOrder)
  .then(result=>{
    if (!result) return result;
    return packing(result);
  });
});

responseAuth.set('add my tree table content', async (parameters, user)=>{
  if (! await isAllowedToInsert(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  const req = Node.clone(unpacking(parameters.nodeData));
  return req.dbInsertMyTreeTableContent(parameters.tableName, parameters.deepLevel, arrayUnpacking(parameters.extraParents))
  .then(result=>{
    if (!result) return result;
    return packing(result);
  });
});

responseAuth.set('add my link', async (parameters, user)=>{
  if (! await isAllowedToInsert(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new Node().load(unpacking(parameters.nodeData)).dbInsertMyLink(arrayUnpacking(parameters.extraParents));
});

//<-- Delete queries

responseAuth.set('delete myself', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new Node().load(unpacking(parameters.nodeData)).dbDeleteMySelf();
});

responseAuth.set('delete my tree', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  const req = Node.clone(unpacking(parameters.nodeData));
  const load = parameters.load===undefined ? true : parameters.load;
  return req.dbDeleteMyTree(load);
});

responseAuth.set('delete my tree table content', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  const req = Node.clone(unpacking(parameters.nodeData));
  return req.dbDeleteMyTreeTableContent(parameters.tableName);
});

responseAuth.set('delete my children', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new Linker().load(unpacking(parameters.nodeData)).dbDeleteMyChildren();
});

responseAuth.set('delete my link', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new Node().load(unpacking(parameters.nodeData)).dbDeleteMyLink();
});

//<-- Update queries

responseAuth.set('edit my props', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new Node().load(unpacking(parameters.nodeData)).dbUpdateMyProps(parameters.values);
});
  
responseAuth.set('edit my sort_order', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new Node().load(unpacking(parameters.nodeData)).dbUpdateMySortOrder(parameters.newSortOrder)
  .then(afected=>{
    if (afected==1) return parameters.newSortOrder;
    else return false;
  });
});

responseAuth.set('upload image', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return true;
});

// utils
responseAuth.set('get time', async ()=>Date.now());
