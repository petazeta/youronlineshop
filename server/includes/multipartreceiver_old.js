import qs from 'querystring';

export function extractBoundary(contentType) {
  const CONTENT_TYPE_RE = /^multipart\/(?:form-data|related)(?:;|$)/i;
  const CONTENT_TYPE_PARAM_RE = /;\s*([^=]+)=(?:"([^"]+)"|([^;]+))/gi;
  
  let myMatch = CONTENT_TYPE_RE.exec(contentType);
  if (!myMatch) {
    return false;
  }
  
  let boundary;
  CONTENT_TYPE_PARAM_RE.lastIndex = myMatch.index + myMatch[0].length - 1;
  while ((myMatch = CONTENT_TYPE_PARAM_RE.exec(contentType))) {
    if (myMatch[1].toLowerCase() !== 'boundary') continue;
    boundary = myMatch[2] || myMatch[3];
    break;
  }
  return boundary;
}
export function parse(request, body){
  const boundary = extractBoundary(request.headers['content-type'])
  
  const parts=body.split('--' + boundary).slice(1, -1);
  const result=[];
  for (const part of parts) {
    let element=new Map();
    let [top, content]=part.split('\r\n\r\n');
    content=content.slice(0, -2); //remove \r\n
    element.set("name", top.match(/name="(\w*)"/)[1]);
    element.set("type", "text");
    if (top.includes("filename=")) {
      element.set("type", "file");
      const myMatch=top.match(/Content-Type: (\S*)/);
      if (myMatch) element.set("type",myMatch[1]);
      element.set("filename", top.match(/filename="([\w, \.]*)"/)[1]);
    }
    element.set("content", content);
    result.push(element);
  }
  return result;
}