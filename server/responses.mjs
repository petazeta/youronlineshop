import {unpacking, arrayUnpacking, packing, zip} from "../shared/utils.mjs"
import {Readable} from "stream"

export class Responses{
  constructor(Node, Linker, User, isAllowedToRead, isAllowedToInsert, isAllowedToModify, makeReport, importPath){
    this.responseAuth = new Map()
    this.responseContentType = new Map()

    // this.responseAuth: get a request response.

    this.responseAuth.set("populate database", async ()=>{
      const {total} = await Node.dbGateway.elementsFromTable({props: {childTableName: "TABLE_LANGUAGES"}})
      if (total > 0)
        throw new Error('The database is not empty')
      const {populateDb} = await import( "./import.mjs")
      return await populateDb(Node, importPath)
    })

    this.responseAuth.set("report", async (parameters)=>{
      makeReport(parameters.repData)
    })

    // -- User this.responseAuth

    this.responseAuth.set("login", async (parameters)=> {
      // *** quiza mejor no enviar el password directamente sino que codificarlo antes
      const result = await User.login(parameters.user_name, parameters.user_password)
      if (result instanceof Error)
        return {logError: true, code: result.message}
      const user = result
      user.dbUpdateAccess()
      return packing(user)
    })

    this.responseAuth.set("update user pwd", async (parameters, user)=>{
      // *** quiza mejor no enviar el password directamente sino que codificarlo antes
      if (user.props.username==parameters.user_name)
        return await user.dbUpdateMyPwd(parameters.user_password)
      if (! await isAllowedToModify(user))
        throw new Error("Database safety")
      return await User.dbUpdatePwd(parameters.user_name, parameters.user_password)
    })

    this.responseAuth.set("create user", async (parameters)=>{
      // *** quiza mejor no enviar el password directamente sino que codificarlo antes
      const result = await User.create(parameters.user_name, parameters.user_password)
      if (result instanceof Error)
        return {logError: true, code: result.message}
      return packing(result)
    })

    this.responseAuth.set("send mail", async (parameters, user)=>{
      return await user.sendMail(parameters.to, parameters.subject, parameters.message, parameters.from)
    })

    this.responseAuth.set("payment", async (parameters, user)=>{
      const order = new Node().load(unpacking(parameters.nodeData)) //new Node().load == Node.clone
      const payment = new Node().load(unpacking(parameters.payment))
      const payments = await import(`./payments/${payment.props.moduleName}.mjs`)
      if (typeof payments[parameters.paymentAction]=="function")
        return await payments[parameters.paymentAction](order, payment)
    })

    //<-- Read this.responseAuth

    this.responseAuth.set("get my childtablekeys", async (parameters)=>{
      return Linker.dbGetChildTableKeys( unpacking(parameters.nodeData).props.childTableName )
    })

    this.responseAuth.set("get my root",  async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToRead(user, myNode))
        throw new Error("Database safety")
      return Linker.dbGetRoot(myNode.props.childTableName)
    })

    this.responseAuth.set("get all my children", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToRead(user, myNode))
        throw new Error("Database safety")
      return Linker.dbGetAllChildren(myNode, parameters.filterProps, parameters.limit)
    })
      
    this.responseAuth.set("get my children", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToRead(user, myNode))
        throw new Error("Database safety")
      return Linker.dbGetChildren(myNode, arrayUnpacking(parameters.extraParents), parameters.filterProps, parameters.limit, parameters.count)
    })

    // get descendents: equivalent to get my tree down
    this.responseAuth.set("get my tree", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToRead(user, myNode))
        throw new Error("Database safety")
      const reqNode = Node.clone(myNode)
      const result = await reqNode.dbGetMyTree(arrayUnpacking(parameters.extraParents), parameters.deepLevel, parameters.filterProps, parameters.limit, parameters.myself)
      if (!result)
        return result
      // careful the result list has still parentNode or partnerNode,
      if (Node.detectLinker(myNode)) {
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
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToRead(user, myNode))
        throw new Error("Database safety")
      const reqNode = Node.clone(myNode)
      const result = await reqNode.dbGetMyTreeUp(parameters.deepLevel)
      if (Array.isArray(result)) {
        return result.map(result=>packing(result))
      }
      return result && packing(result)
    })

    this.responseAuth.set("get my relationships", async (parameters)=>{
      return await Node.dbGetRelationships(unpacking(parameters.nodeData))
    })

    this.responseAuth.set("get my props", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToRead(user, myNode))
        throw new Error("Database safety")
      const reqNode = Node.clone(myNode)
      const result = await reqNode.dbGetMyProps()
      if (result && parameters.filterProps) {
        return Object.fromEntries(Object.entries(result).filter(([key, value])=>parameters.filterProps.includes(key)))
      }
      return result
    })

    //<-- Insert this.responseAuth

    this.responseAuth.set("add myself", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
        throw new Error("Database safety");
      const myExtraParents = Array.isArray(parameters.extraParents) ? arrayUnpacking(parameters.extraParents) : parameters.extraParents
      return new Node().load(myNode).dbInsertMySelf(myExtraParents, parameters.updateSiblingsOrder);
    });

    this.responseAuth.set("add my children", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
        throw new Error("Database safety")
      return new Linker().load(myNode).dbInsertMyChildren(arrayUnpacking(parameters.extraParents));
    });
      
    this.responseAuth.set("add my tree", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
        throw new Error("Database safety")
      const myExtraParents = Array.isArray(parameters.extraParents) ? arrayUnpacking(parameters.extraParents) : parameters.extraParents
      const req = Node.clone(myNode)
      const result = await req.dbInsertMyTree(parameters.deepLevel, myExtraParents, parameters.myself, parameters.updateSiblingsOrder)
      return result && packing(result)
    });

    this.responseAuth.set("add my tree table content", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
        throw new Error("Database safety")
      const req = Node.clone(myNode);
      const result = await req.dbInsertMyTreeTableContent(parameters.tableName, parameters.deepLevel, arrayUnpacking(parameters.extraParents))
      return result && packing(result)
    })

    this.responseAuth.set("add my link", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
        throw new Error("Database safety")
      return new Node().load(myNode).dbInsertMyLink(arrayUnpacking(parameters.extraParents));
    });

    //<-- Delete queries

    this.responseAuth.set("delete myself", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
        throw new Error("Database safety")
      return new Node().load(myNode).dbDeleteMySelf();
    });

    this.responseAuth.set("delete my tree", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
        throw new Error("Database safety")
      const req = Node.clone(myNode)
      const load = parameters.load===undefined ? true : parameters.load
      return req.dbDeleteMyTree(load)
    });

    this.responseAuth.set("delete my tree table content", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
        throw new Error("Database safety")
      const req = Node.clone(myNode);
      return req.dbDeleteMyTreeTableContent(parameters.tableName)
    });

    this.responseAuth.set("delete my children", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
       throw new Error("Database safety")
      return new Linker().load(myNode).dbDeleteMyChildren()
    });

    this.responseAuth.set("delete my link", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
        throw new Error("Database safety")
      return new Node().load(myNode).dbDeleteMyLink()
    });

    //<-- Update queries

    this.responseAuth.set("edit my props", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
        throw new Error("Database safety")
      //await siteContentCacheReset(parameters) *** parece que no se ha implementado ningún sistema par resetear cache para estos casos
      return new Node().load(myNode).dbUpdateMyProps(parameters.values)
    })
      
    this.responseAuth.set("edit my sort_order", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
        throw new Error("Database safety")
      const afected = await new Node().load(myNode).dbUpdateMySortOrder(parameters.newSortOrder)
      if (afected==1)
        return parameters.newSortOrder
      else
        return false
    })

    this.responseAuth.set("upload image", async (parameters, user)=>{
      const myNode = unpacking(parameters.nodeData)
      if (! await isAllowedToInsert(user, myNode))
        throw new Error("Database safety")
      return true
    })

    // utils *** deprecated
    this.responseAuth.set("get time", async ()=>Date.now());
  }
  // ** Main Entrance ** it writes to client the request response and returns it
  // if request response comes from a read stream it also collects it for returning it
  async handleRequest(response, user, action, parameters) {
    if (!this.responseAuth.has(action)) {
      // mirar error response en errors.mjs
      const myError = new Error(`Error: action "${action}" not recognised`)
      myError.name = "400"
      throw myError
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
    return this.responseContentType.get(action)
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