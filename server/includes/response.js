import {startThemes} from './themesback.js';
import {Node, NodeMale, NodeFemale} from './nodesback.js';
import {dbRequest} from './dbgateway.js';
import {User, userLogin} from './user.js';
import {isAllowedToRead, isAllowedToInsert, isAllowedToModify} from './safety.js';
import {unpacking, arrayUnpacking, packing, detectGender} from './../../shared/modules/utils.js';

export const responseAuth=new Map();

responseAuth.set('check system', async ()=>{
  const {default: dbConfig} = await import('./../cfg/dbmain.js');
  return {dbsys: dbConfig.dbsys};
});

responseAuth.set('get themes tree', ({id})=>packing(startThemes(id)));

responseAuth.set('get tables', ()=>dbRequest("get tables"));

responseAuth.set('init database', ()=>dbRequest("init db"));

responseAuth.set('report', (parameters)=>import('./reports.js').then(({makeReport})=>makeReport(parameters.repData)));

//<-- User responseAuth

responseAuth.set('logout', User.logout);

responseAuth.set('login', (parameters)=>
  userLogin(parameters.user_name, parameters.user_password)
  .then(result =>{
    if (result instanceof Error) return {logError: true, code: result.message};
    return packing(result);
  })
);

responseAuth.set('update user pwd', (parameters)=>User.dbUpdatePwd(parameters.user_name, parameters.user_password));

responseAuth.set('update my user pwd', (parameters, user)=>user.dbUpdateMyPwd(parameters.user_password));

responseAuth.set('create user', (parameters)=>
  User.create(parameters.user_name, parameters.user_password, parameters.user_email)
  .then(result=>{
    if (result instanceof Error) return {logError: true, code: result.message};
    return result.props.id;
  })
);

responseAuth.set('send mail', (parameters, user)=>user.sendMail(parameters.to, parameters.subject, parameters.message, parameters.from));

//<-- Read responseAuth

responseAuth.set('get my childtablekeys', (parameters)=>NodeFemale.dbGetChildTableKeys( unpacking(parameters.nodeData).props.childtablename ));

responseAuth.set('get my root',  async (parameters, user)=>{
  if (! await isAllowedToRead(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return NodeFemale.dbGetRoot(unpacking(parameters.nodeData));
});

responseAuth.set('get all my children', async (parameters, user)=>{
  if (! await isAllowedToRead(user,unpacking(parameters.nodeData))) throw new Error("Database safety");
  return NodeFemale.dbGetAllChildren(unpacking(parameters.nodeData), parameters.filterProps, parameters.limit);
});
  
responseAuth.set('get my children', async (parameters, user)=>{
  if (! await isAllowedToRead(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return NodeFemale.dbGetChildren(unpacking(parameters.nodeData), arrayUnpacking(parameters.extraParents), parameters.filterProps, parameters.limit);
});

// get descendents: equivalent to get my tree down
responseAuth.set('get my tree', async (parameters, user)=>{
  if (! await isAllowedToRead(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  const req = Node.dataToNode(unpacking(parameters.nodeData));
  return req.dbGetMyTree(arrayUnpacking(parameters.extraParents), parameters.deepLevel, parameters.filterProps, parameters.limit, parameters.myself)
  .then(result=>{
    if (!result) return result;
    // careful the result list has still parentNode or partnerNode,
    const gender=detectGender(unpacking(parameters.nodeData));
    if (gender=="female") {
      if (result.total==0) return {total: 0};
      const myResult = new NodeFemale();
      result.data.forEach(child=>myResult.addChild(child));
      return {data: packing(myResult), total: result.total};
    }
    if (parameters.myself) return packing(result);
    const myResult = new NodeMale();
    result.forEach(rel=>myResult.addRelationship(rel));
    return packing(myResult);
  });
});

responseAuth.set('get my tree up', async (parameters, user)=>{
  if (! await isAllowedToRead(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  const req = detectGender(unpacking(parameters.nodeData))=="female" ? new NodeFemale() : new NodeMale();
  req.load(unpacking(parameters.nodeData));
  return req.dbGetMyTreeUp(parameters.deepLevel)
  .then(result=>{
    if (!result) return result;
    if (Array.isArray(result)) {
      for (let i=0; i<result.length;  i++) {
        result[i]=packing(result[i]);
      }
      return result;
    }
    return packing(result);
  });
});

responseAuth.set('get my relationships', (parameters, user)=>NodeMale.dbGetRelationships(unpacking(parameters.nodeData)));
  
//<-- Insert responseAuth

responseAuth.set('add myself', async (parameters, user)=>{
  if (! await isAllowedToInsert(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new NodeMale().load(unpacking(parameters.nodeData)).dbInsertMySelf(arrayUnpacking(parameters.extraParents), parameters.updateSiblingsOrder);
});

responseAuth.set('add my children', async (parameters, user)=>{
  if (! await isAllowedToInsert(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new NodeFemale().load(unpacking(parameters.nodeData)).dbInsertMyChildren(arrayUnpacking(parameters.extraParents));
});
  
responseAuth.set('add my tree', async (parameters, user)=>{
  if (! await isAllowedToInsert(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  const req = detectGender(unpacking(parameters.nodeData))=="female" ? new NodeFemale() : new NodeMale();
  return req.load(unpacking(parameters.nodeData)).dbInsertMyTree(parameters.deepLevel, arrayUnpacking(parameters.extraParents), parameters.myself, parameters.updateSiblingsOrder)
  .then(result=>{
    if (!result) return result;
    return packing(result);
  });
});

responseAuth.set('add my tree table content', async (parameters, user)=>{
  if (! await isAllowedToInsert(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  const req = detectGender(unpacking(parameters.nodeData))=="female" ? new NodeFemale() : new NodeMale();
  return req.load(unpacking(parameters.nodeData)).dbInsertMyTreeTableContent(parameters.tableName, parameters.deepLevel, arrayUnpacking(parameters.extraParents))
  .then(result=>{
    if (!result) return result;
    return packing(result);
  });
});

responseAuth.set('add my link', async (parameters, user)=>{
  if (! await isAllowedToInsert(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new NodeMale().load(unpacking(parameters.nodeData)).dbInsertMyLink(arrayUnpacking(parameters.extraParents));
});

//<-- Delete queries

responseAuth.set('delete myself', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new NodeMale().load(unpacking(parameters.nodeData)).dbDeleteMySelf();
});

responseAuth.set('delete my tree', async (parameters, user)=>{
  debugger;
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  const req = detectGender(unpacking(parameters.nodeData))=="female" ? new NodeFemale() : new NodeMale();
  const load = parameters.load===undefined ? true : parameters.load;
  return req.load(unpacking(parameters.nodeData)).dbDeleteMyTree(load);
});

responseAuth.set('delete my tree table content', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  const req = detectGender(unpacking(parameters.nodeData))=="female" ? new NodeFemale() : new NodeMale();
  return req.load(unpacking(parameters.nodeData)).dbDeleteMyTreeTableContent(parameters.tableName);
});

responseAuth.set('delete my children', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new NodeFemale().load(unpacking(parameters.nodeData)).dbDeleteMyChildren();
});

responseAuth.set('delete my link', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new NodeMale().load(unpacking(parameters.nodeData)).dbDeleteMyLink();
});

//<-- Update queries

responseAuth.set('edit my props', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new NodeMale().load(unpacking(parameters.nodeData)).dbUpdateMyProps(parameters.props);
});
  
responseAuth.set('edit my sort_order', async (parameters, user)=>{
  if (! await isAllowedToModify(user, unpacking(parameters.nodeData))) throw new Error("Database safety");
  return new NodeMale().load(unpacking(parameters.nodeData)).dbUpdateMySortOrder(parameters.newSortOrder)
  .then(afected=>{
    if (afected==1) return parameters.newSortOrder;
    else return false;
  });
});

// utils
responseAuth.set('get time', async ()=>Date.now());
