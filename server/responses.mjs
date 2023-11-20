import {unpacking, arrayUnpacking, packing} from "../shared/utils.mjs"
import {Readable} from "stream"
import {populateDb} from "./import.mjs"

export class Responses{
  constructor(Node, Linker, User, isAllowedToRead, isAllowedToInsert, isAllowedToModify, makeReport, importPath){
    this.responseAuth = new Map()
    this.responseContentType = new Map()

    // this.responseAuth: get a request response.

    this.responseAuth.set("populate database", async (response)=>{
      const {total} = await Node.dbGateway.elementsFromTable({props: {childTableName: "TABLE_LANGUAGES"}})
      if (total > 0)
        throw new Error('The database is not empty')
      return await populateDb(Node, importPath)
    })

    this.responseAuth.set("report", async (parameters)=>{
      makeReport(parameters.repData)
    })

    // -- User this.responseAuth

    this.responseAuth.set("login", async (parameters)=> {
      const result = await User.login(parameters.user_name, parameters.user_password)
      if (result instanceof Error)
        return {logError: true, code: result.message}
      const user = result
      user.dbUpdateAccess()
      return packing(user)
    })

    this.responseAuth.set("update user pwd", async (parameters, user)=>{
      if (! await isAllowedToModify(user)) throw new Error("Database safety")
        return await User.dbUpdatePwd(parameters.user_name, parameters.user_password)
    });

    this.responseAuth.set("update my user pwd", async (parameters, user)=>{
      return await user.dbUpdateMyPwd(parameters.user_password)
    })

    this.responseAuth.set("create user", async (parameters)=>{
      const result = await User.create(parameters.user_name, parameters.user_password)
      if (result instanceof Error)
        return {logError: true, code: result.message}
      return packing(result)
    })

    this.responseAuth.set("send mail", async (parameters, user)=>{
      return await user.sendMail(parameters.to, parameters.subject, parameters.message, parameters.from)
    })

    //<-- Read this.responseAuth

    this.responseAuth.set("get my childtablekeys", async (parameters)=>{
      return Linker.dbGetChildTableKeys( unpacking(parameters.nodeData).props.childTableName )
    })

    this.responseAuth.set("get my root",  async (parameters, user)=>{
      if (! await isAllowedToRead(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      return Linker.dbGetRoot(unpacking(parameters.nodeData).props.childTableName)
    })

    this.responseAuth.set("get all my children", async (parameters, user)=>{
      if (! await isAllowedToRead(user,unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      return Linker.dbGetAllChildren(unpacking(parameters.nodeData), parameters.filterProps, parameters.limit)
    })
      
    this.responseAuth.set("get my children", async (parameters, user)=>{
      if (! await isAllowedToRead(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      return Linker.dbGetChildren(unpacking(parameters.nodeData), arrayUnpacking(parameters.extraParents), parameters.filterProps, parameters.limit, parameters.count)
    })

    // get descendents: equivalent to get my tree down
    this.responseAuth.set("get my tree", async (parameters, user)=>{
      if (! await isAllowedToRead(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      const reqNode = Node.clone(unpacking(parameters.nodeData))
      const result = await reqNode.dbGetMyTree(arrayUnpacking(parameters.extraParents), parameters.deepLevel, parameters.filterProps, parameters.limit, parameters.myself)
      if (!result) return result
      // careful the result list has still parentNode or partnerNode,
      if (Node.detectLinker(unpacking(parameters.nodeData))) {
        if (result.total==0) return {total: 0}
        const myResult = new Linker()
        result.data.forEach(child=>myResult.addChild(child))
        return {data: packing(myResult), total: result.total}
      }
      if (parameters.myself) return packing(result)
      const myResult = new Node()
      result.forEach(rel=>myResult.addRelationship(rel))
      return packing(myResult)
    })

    this.responseAuth.set("get my tree up", async (parameters, user)=>{
      if (! await isAllowedToRead(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      const reqNode = Node.clone(unpacking(parameters.nodeData))
      const result = await reqNode.dbGetMyTreeUp(parameters.deepLevel)
      if (!result) return result
      if (Array.isArray(result)) {
        return result.map(result=>packing(result))
      }
      return packing(result)
    })

    this.responseAuth.set("get my relationships", async (parameters)=>{
      return await Node.dbGetRelationships(unpacking(parameters.nodeData))
    })

    //<-- Insert this.responseAuth

    this.responseAuth.set("add myself", async (parameters, user)=>{
      if (! await isAllowedToInsert(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety");
      return new Node().load(unpacking(parameters.nodeData)).dbInsertMySelf(arrayUnpacking(parameters.extraParents), parameters.updateSiblingsOrder);
    });

    this.responseAuth.set("add my children", async (parameters, user)=>{
      if (! await isAllowedToInsert(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      return new Linker().load(unpacking(parameters.nodeData)).dbInsertMyChildren(arrayUnpacking(parameters.extraParents));
    });
      
    this.responseAuth.set("add my tree", async (parameters, user)=>{
      if (! await isAllowedToInsert(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      const req = Node.clone(unpacking(parameters.nodeData));
      return req.dbInsertMyTree(parameters.deepLevel, arrayUnpacking(parameters.extraParents), parameters.myself, parameters.updateSiblingsOrder)
      .then(result=>{
        if (!result) return result;
        return packing(result);
      });
    });

    this.responseAuth.set("add my tree table content", async (parameters, user)=>{
      if (! await isAllowedToInsert(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      const req = Node.clone(unpacking(parameters.nodeData));
      return req.dbInsertMyTreeTableContent(parameters.tableName, parameters.deepLevel, arrayUnpacking(parameters.extraParents))
      .then(result=>{
        if (!result) return result;
        return packing(result);
      });
    });

    this.responseAuth.set("add my link", async (parameters, user)=>{
      if (! await isAllowedToInsert(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      return new Node().load(unpacking(parameters.nodeData)).dbInsertMyLink(arrayUnpacking(parameters.extraParents));
    });

    //<-- Delete queries

    this.responseAuth.set("delete myself", async (parameters, user)=>{
      if (! await isAllowedToModify(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      return new Node().load(unpacking(parameters.nodeData)).dbDeleteMySelf();
    });

    this.responseAuth.set("delete my tree", async (parameters, user)=>{
      if (! await isAllowedToModify(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      const req = Node.clone(unpacking(parameters.nodeData));
      const load = parameters.load===undefined ? true : parameters.load;
      return req.dbDeleteMyTree(load);
    });

    this.responseAuth.set("delete my tree table content", async (parameters, user)=>{
      if (! await isAllowedToModify(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      const req = Node.clone(unpacking(parameters.nodeData));
      return req.dbDeleteMyTreeTableContent(parameters.tableName);
    });

    this.responseAuth.set("delete my children", async (parameters, user)=>{
      if (! await isAllowedToModify(user, unpacking(parameters.nodeData)))
       throw new Error("Database safety")
      return new Linker().load(unpacking(parameters.nodeData)).dbDeleteMyChildren();
    });

    this.responseAuth.set("delete my link", async (parameters, user)=>{
      if (! await isAllowedToModify(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      return new Node().load(unpacking(parameters.nodeData)).dbDeleteMyLink();
    });

    //<-- Update queries

    this.responseAuth.set("edit my props", async (parameters, user)=>{
      if (! await isAllowedToModify(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      //await siteContentCacheReset(parameters) *** parece que no se ha implementado ningún sistema par resetear cache para estos casos
      return new Node().load(unpacking(parameters.nodeData)).dbUpdateMyProps(parameters.values)
    })
      
    this.responseAuth.set("edit my sort_order", async (parameters, user)=>{
      if (! await isAllowedToModify(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      return new Node().load(unpacking(parameters.nodeData)).dbUpdateMySortOrder(parameters.newSortOrder)
      .then(afected=>{
        if (afected==1) return parameters.newSortOrder;
        else return false;
      });
    });

    this.responseAuth.set("upload image", async (parameters, user)=>{
      if (! await isAllowedToModify(user, unpacking(parameters.nodeData)))
        throw new Error("Database safety")
      return true;
    });

    // utils
    this.responseAuth.set("get time", async ()=>Date.now());
  }
  // ** Main Entrance ** it writes to client the request response and returns it
  // if request response comes from a read stream it also collects it for returning it
  async makeRequest(response, user, action, parameters) {
    if (!this.responseAuth.has(action)) {
      // mirar error response en errors.mjs
      const myError = new Error(`Error: action "${action}" not recognised`)
      myError.name="400";
      throw myError;
    }
    const result = await this.responseAuth.get(action)(parameters, user)
    if (result instanceof Readable) {
      return JSON.parse(await collectStream(result, response))
    }
    response.write(toJSON(result))
    return result // return for posible report
  }

  getResponseContentType(action) {
    if (!this.responseContentType.has(action)) {
      return "application/json" // Default Value
    }
    return this.responseContentType.get(action);
  }
}

// - - -  helpers

function toJSON(myObj){
  return (myObj && JSON.stringify(myObj)) || ""
}

async function collectStream(myReadStream, response) {
  let resultAcc =""
  for await (const chunk of myReadStream) {
    if (response)
      response.write(chunk)
    resultAcc += chunk.toString()
  }
  return resultAcc
}

function chunkSubstr(str, size = 64 * 1024) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)
  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size)
  }
  return chunks
}