export function streamErrorGuard(readStream, response) {
  readStream.on("error", function (err) {
    response.end()
    readStream.destroy()
    throw new Error("read stream error" + err.message)
  })
}
export function errorResponse(err, response) {
  console.log(err)
  let message = "undefined error"
  if (typeof err=="string")
    message = err
  else if (err?.message)
    message = err.message
  response.statusCode = 500
  if (err.name && !isNaN(err.name))
    response.statusCode = parseInt(err.name);
  response.setHeader('Content-Type', 'application/json')
  response.write(JSON.stringify({error: true, message: message}))
  // reporting(message, "error");
}

/*
// quiza se podia modificar el método pipe del prototipo stream para que hiciera esto, por ejemplo
function pipeErrorGuard(response) {
  this.on("error", function (err) {
    response.end()
    readStream.destroy()
    throw new Error("read stream error" + err.message)
  })
  this.pipe(response)
}

// for terminating response if errors
export async function httpErrorGuard(req, res, app) {
  req.on("error", (err)=>{
    errorResponse(err, res)
    req.destroy()
    throw err
  })
  try {
    return await app(req, res)
  }
  catch(err){
    errorResponse(err, res)
    req.destroy()
    throw err
  }
}
*/