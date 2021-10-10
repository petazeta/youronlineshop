import {startThemes} from './themesback.js';
import {Node, NodeMale, NodeFemale, dataToNode} from './nodesback.js';
import {dbGetTables, dbInitDb} from './dbgateway.js';
import {User, userLogin} from './user.js';
import {isAllowedToRead, isAllowedToInsert, isAllowedToModify} from './safety.js';
/*
var safetyMod=require('./safety');
var Safety=safetyMod.Safety;
var config=require('./generalcfg.json');
var themesMod=require('./themes');
var Theme=themesMod.Theme;
require('./themesback');
*/

async function makeRequest(reqHeaders, action, parameters) {

  let user;
  switch (action) {
    case "check requirements":
    case "check db link":
    case "init database":
    case "get tables":
    case "get themes tree":
    case "login":
    case "report":
    break;
    case "edit my image":
      await import('./filemanager.js'); //******
    default:
    let {default: login}= await import('./authorization.js');
    user = await login(reqHeaders);
  }
  
  if (parameters && parameters.language) {
    if (!parameters.filter) parameters.filter={};
    parameters.filter['_langauges']=parameters.language;
  }
  var safetyErrorMessage="Database safety";
  switch (action) {
    case "check requirements":
      return true;
    case "check db link":
      return Node.dbCheckDbLink();
    case "get themes tree":
      const themeActive=startThemes();
      return themeActive.avoidrecursion();
    case "get tables":
      return dbGetTables();
    case "init database":
      return dbInitDb();
    case "report":
      var {makeReport} = await import('./reports.js');
      return makeReport(parameters.repData);
    //<-- User requests
    case "logout":
      return User.logout();
    case "login":
      var log=await userLogin(parameters.user_name, parameters.user_password);
      if (typeof log=="object") log.avoidrecursion();
      return log;
    case "update user pwd":
      return User.dbUpdatePwd(parameters.user_name, parameters.user_password);
    case "update my user pwd":
      return user.dbUpdateMyPwd(parameters.user_password);
    case "create user":
      var email=parameters.user_email ? parameters.user_email : null;
      var result=await User.create(parameters.user_name, parameters.user_password, email);
      if (typeof result=="object") return result.props.id;
      else return result;
    case "send mail":
      return user.sendMail(parameters.to, parameters.subject, parameters.message, parameters.from);
    //<-- Read requests
    case "get my childtablekeys":
      return NodeFemale.dbGetChildTableKeys(parameters.nodeData);
    case "get my root":
      if (!await isAllowedToRead(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      return NodeFemale.dbGetRoot(parameters.nodeData);
    case "get all my children":
      var filterProps=parameters.filterProps ? parameters.filterProps : [];
      var limit=parameters.limit ? parameters.limit: [];
      if (!await isAllowedToRead(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      var result=await NodeFemale.dbGetAllChildren(parameters.nodeData, filterProps, limit);
      for (const child of result.data) {
        child.avoidrecursion();
      }
      return result;
    case "get my children":
      var extraParents=parameters.extraParents ? parameters.extraParents : null;
      var filterProps=parameters.filterProps ? parameters.filterProps : [];
      var limit=parameters.limit ? parameters.limit: [];
      if (!await isAllowedToRead(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      var result=await NodeFemale.dbGetChildren(parameters.nodeData, extraParents, filterProps, limit);
      for (const child of result.data) {
        child.avoidrecursion();
      }
      return result;
    case "get my tree":
      var deepLevel=parameters.deepLevel ? parameters.deepLevel : null;
      var extraParents=parameters.extraParents ? parameters.extraParents : null;
      var filterProps=parameters.filterProps ? parameters.filterProps : [];
      var limit=parameters.limit ? parameters.limit: [];
      var myself=parameters.myself ? parameters.myself: false;
      var req = dataToNode(parameters.nodeData);
      if (!await isAllowedToRead(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      var result= await req.dbLoadMyTree(extraParents, deepLevel, filterProps, limit, myself);
      var elements=Node.detectGender(parameters.nodeData)=="female" ? result.data : !myself ? result : [];
      
      for (const element of elements) {
        element.avoidrecursion();
      }
      if (myself) result.avoidrecursion();
      return result;
    case "get my relationships":
      var relationships=await NodeMale.dbGetRelationships(parameters.nodeData);
      for (const rel of relationships) {
        rel.avoidrecursion();
      }
      return relationships;
    case "get my tree up":
      var deepLevel=parameters.deepLevel ? parameters.deepLevel : null;
      var req = Node.detectGender(parameters.nodeData)=="female" ? new NodeFemale() : new NodeMale();
      req.load(parameters.nodeData)
      if (!await isAllowedToRead(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      var upElements=await req.dbGetMyTreeUp(deepLevel);
      if (Array.isArray(upElements)) {
        for (const upNode of upElements) {
          upNode.avoidrecursion();
        }
      }
      else upElements.avoidrecursion();
      return upElements;
    //<-- Insert requests
    case "add myself":
      var extraParents=parameters.extraParents ? parameters.extraParents : null;
      var req=new NodeMale();
      req.load(parameters.nodeData);
      if (!await isAllowedToInsert(user, req)) {
        throw new Error(safetyErrorMessage);
      }
      return req.dbInsertMySelf(extraParents);
    case "add my children":
      var extraParents=parameters.extraParents ? parameters.extraParents : null;
      var req=new NodeFemale();
      req.load(parameters.nodeData);
      if (!await isAllowedToInsert(user, req)) {
        throw new Error(safetyErrorMessage);
      }
      return req.dbInsertMyChildren(extraParents);
    case "add my tree":
      var deepLevel=parameters.deepLevel ? parameters.deepLevel : null;
      var extraParents=parameters.extraParents ? parameters.extraParents : null;
      var myself=parameters.myself ? parameters.myself: null;
      var req = Node.detectGender(parameters.nodeData)=="female" ? new NodeFemale() : new NodeMale();
      req.load(parameters.nodeData)
      if (!await isAllowedToInsert(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      let mresult= (await req.dbInsertMyTree(deepLevel, extraParents, myself)).avoidrecursion();
      return mresult;
    case "add my tree table content":
      var deepLevel=parameters.deepLevel ? parameters.deepLevel : null;
      var extraParents=parameters.extraParents ? parameters.extraParents : null;
      var req = Node.detectGender(parameters.nodeData)=="female" ? new NodeFemale() : new NodeMale();
      req.load(parameters.nodeData)
      if (!await isAllowedToInsert(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      var elements = await req.dbInsertMyTreeTableContent(parameteres.tableName, deepLevel, extraParents);
      var elementsIds=[];
      for (const elm of elements) {
        if (elm.props.id) elementsIds.push(elm.props.id);
      }
      return elementsIds;
    case "add my link":
      var extraParents=parameters.extraParents ? parameters.extraParents : null;
      var req=new NodeMale();
      req.load(parameters.nodeData);
      if (!await isAllowedToInsert(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      return req.dbInsertMyLink(extraParents);
    //<-- Delete queries
    case "delete myself":
      var req=new NodeMale();
      req.load(parameters.nodeData);
      if (!await isAllowedToModify(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      return req.dbDeleteMySelf();
    case "delete my tree":
      var req = Node.detectGender(parameters.nodeData)=="female" ? new NodeFemale() : new NodeMale();
      req.load(parameters.nodeData);
      if (!await isAllowedToModify(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      return req.dbDeleteMyTree();
    case "delete my children":
      var req=new NodeFemale();
      req.load(parameters.nodeData);
      if (!await isAllowedToModify(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      return req.dbDeleteMyChildren();
    //<-- Update queries
    case "edit my sort_order":
      var req=new NodeMale();
      req.load(parameters.nodeData);
      await req.dbLoadMyself();  //For loading the actual position
      if (!await isAllowedToModify(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      var afected = await req.dbUpdateMySortOrder(parameters.newSortOrder);
      if (afected==1) return parameters.newSortOrder;
      else return false;
    case "edit my props":
      var req=new NodeMale();
      req.load(parameters.nodeData);
      if (!await isAllowedToModify(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      return req.dbUpdateMyProps(parameters.props);
    case "edit my image":
      var req=new NodeMale();
      req.load(parameters.nodeData);
      if (!await isAllowedToModify(user, parameters.nodeData)) {
        throw new Error(safetyErrorMessage);
      }
      await import('./filemanager.js');
      return true;
    default:
      throw new Error("no action recognised");

  }
}
export default makeRequest;