Cache
=====

## introduction

The content delivery services from the content manager of the application works by a request responding sequence. These elements request data from server to deliver it to the client.

Data can come from the folloing sources:
- From database
- From OS files

We can boost the application performance by caching these elements and forward the request to the cache source.

## Cache api

Cache is base in an api for retrieving data and uploading data. Uploading data is usually made at the application starts, so data will be already available for the following requests.

Interface and implementation is at server/cache.mjs and server/context__main/cache.mjs

## Cache devices

The cache implementation allows multiple devices to be used. We can use cache/db elements like reddis or mongodb. Or we can use map based cache on memory. To add devices we need a driver. Driver implementation is easy. At the moment we are just using map memory cache. You can find out other implementations in older software version.

## Api quick guide

Here there is some examples of how to use Api in some quieries. The cache works by a search parameters and a content. The content has some parameters to be able to recoginze it better, for example if we need to fetch the content of a skin from the layouts service we would serch for : skin, {skinId :"myid", subskinId: "subId"}.

A posible use of the api can be in a way of content guard. Some function check if content is in cache if it is, it returns the cache if it is not it performs the data retrieving from the suitable source.

## Cache actual use

Cache in this software provide some performance adventage in the layouts resource because layouts resource process requires several files acess and data process.

To cach client source files and database request doesn't provide any gain in response time.

```
async function streamCacheFile(filePathName, response) {
  const cacheStream = await cacheReadStream(filePathName)
  if (cacheStream === false) {
    // actualizando cache
    const cacheWriter = await cacheWriteStream(filePathName)
    await writeFile(filePathName, cacheWriter)
    await streamFile(filePathName, response)
    return
  }
  //console.log(filePathName + " content comes from cache")
  streamFile(filePathName, response, cacheStream)
}

// Se puede hacer cache del contenido de la base de datos, pero no mejora la velocidad, todo el overhead parece que produce más retardos

responseAuth.set('get my tree', async (parameters, user)=>{
  if (! await isAllowedToRead(user, unpacking(parameters.nodeData)))
    throw new Error("Database safety")
  return siteContentCacheGuard(parameters,
    ()=>menusContentCacheGuard(parameters,
      ()=>pageContentCacheGuard(parameters,
        ()=>langsCacheGuard(parameters,
          ()=>catsContentCacheGuard(parameters,
            async ()=>{
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
            }
          )
        )
      )
    )
  )
})

// siteContent cache retrieve driver: exec getResult when no cache
async function siteContentCacheGuard(parameters, getResult) {
  const reqNode = Node.clone(unpacking(parameters.nodeData))
  if (config.cache != "none" && reqNode?.parent && reqNode.parent.props.childTableName == "SiteElements") {
    const extraParents = arrayUnpacking(parameters.extraParents)
    const myLangId = extraParents && extraParents[0]?.partner && extraParents[0].partner.props.id
    const cacheParams = {site_lang_id: myLangId, site_id: reqNode.props.id}
    const cacheStream = await cacheReadStream("site content", cacheParams)
    if (cacheStream === false) {
      // actualizando cache
      const cacheWriter = await cacheWriteStream("site content", cacheParams)
      const result = await getResult()
      Readable.from(chunkSubstr(toJSON(result))).pipe(cacheWriter)
      return result
    }
    console.log("site content comes from cache")
    return cacheStream
  }
  return await getResult()
}

// menus content cache retrieve driver: exec getResult when no cache
async function menusContentCacheGuard(parameters, getResult) {
  const reqNode = Node.clone(unpacking(parameters.nodeData))
  if (config.cache != "none" && reqNode?.parent && reqNode.parent.props.childTableName == "PageElements") {
    const extraParents = arrayUnpacking(parameters.extraParents)
    const myLangId = extraParents && extraParents[0]?.partner && extraParents[0].partner.props.id
    const cacheParams = {menus_lang_id: myLangId, menus_id: reqNode.props.id}
    const cacheStream = await cacheReadStream("menus content", cacheParams)
    if (cacheStream === false) {
      // actualizando cache
      const cacheWriter = await cacheWriteStream("menus content", cacheParams)
      const result = await getResult()
      Readable.from(chunkSubstr(toJSON(result))).pipe(cacheWriter)
      return result
    }
    console.log("menus content comes from cache")
    return cacheStream
  }
  return await getResult()
}

// page content cache retrieve driver: exec getResult when no cache
async function pageContentCacheGuard(parameters, getResult) {
  const reqNode = Node.clone(unpacking(parameters.nodeData))
  if (config.cache != "none" && reqNode.props.childTableName == "PageElements" && reqNode.partner?.props.id) {
    const extraParents = arrayUnpacking(parameters.extraParents)
    const myLangId = extraParents && extraParents[0]?.partner && extraParents[0].partner.props.id
    const cacheParams = {page_lang_id: myLangId, page_id: reqNode.partner?.props.id}
    const cacheStream = await cacheReadStream("page content", cacheParams)
    if (cacheStream === false) {
      // actualizando cache
      const cacheWriter = await cacheWriteStream("page content", cacheParams)
      const result = await getResult()
      Readable.from(chunkSubstr(toJSON(result))).pipe(cacheWriter)
      return result
    }
    console.log("page content comes from cache")
    return cacheStream
  }
  return await getResult()
}

// cats content cache retrieve driver: exec getResult when no cache
async function catsContentCacheGuard(parameters, getResult) {
  const reqNode = Node.clone(unpacking(parameters.nodeData))
  if (config.cache != "none" && reqNode?.parent && reqNode.parent.props.childTableName == "ItemCategories") {
    const extraParents = arrayUnpacking(parameters.extraParents)
    const myLangId = extraParents && extraParents[0]?.partner && extraParents[0].partner.props.id
    const cacheParams = {cats_lang_id: myLangId, cats_id: reqNode.props.id}
    const cacheStream = await cacheReadStream("cats content", cacheParams)
    if (cacheStream === false) {
      // actualizando cache
      const cacheWriter = await cacheWriteStream("cats content", cacheParams)
      const result = await getResult()
      Readable.from(chunkSubstr(toJSON(result))).pipe(cacheWriter)
      return result
    }
    console.log("cats content comes from cache")
    return cacheStream
  }
  return await getResult()
}

// lang list content cache retrieve driver: exec getResult when no cache
async function langsCacheGuard(parameters, getResult) {
  const reqNode = Node.clone(unpacking(parameters.nodeData))
  if (config.cache != "none" && reqNode.props.childTableName == "Languages") {
    const cacheStream = await cacheReadStream("langs")
    if (cacheStream === false) {
      // actualizando cache
      const cacheWriter = await cacheWriteStream("langs")
      const result = await getResult()
      Readable.from(chunkSubstr(toJSON(result))).pipe(cacheWriter)
      return result
    }
    console.log("langs comes from cache")
    return cacheStream
  }
  return await getResult()
}

// siteContent remove cache driver
async function siteContentCacheReset(parameters) {
  const reqNode = Node.clone(unpacking(parameters.nodeData))
  if (config.cache != "none" && reqNode?.parent && reqNode.parent.props.childTableName == "SiteElements") {
    const extraParents = arrayUnpacking(parameters.extraParents)
    const myLangId = extraParents && extraParents[0]?.partner && extraParents[0].partner.props.id
    const cacheParams = {site_lang_id: myLangId}
    console.log("site content reset cache")
    return await cacheDelete("site content", cacheParams)
  }
}

// pageContent remove cache driver
async function menusContentCacheReset(parameters) {
  const reqNode = Node.clone(unpacking(parameters.nodeData))
  if (config.cache != "none" && reqNode?.parent && reqNode.parent.props.childTableName == "PageElements") {
    const extraParents = arrayUnpacking(parameters.extraParents)
    const myLangId = extraParents && extraParents[0]?.partner && extraParents[0].partner.props.id
    const cacheParams = {page_lang_id: myLangId}
    console.log("menus content reset cache")
    return await cacheDelete("menus content", cacheParams)
  }
}
```