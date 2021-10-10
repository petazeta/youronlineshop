import qs from 'querystring';
export function parse(request, body){
  if (!request.headers['content-type'].includes('multipart/form-data')) return false;
  const boundary=request.headers['content-type'].match(/boundary=(.*)/, '$1')[1];
  const parts=body.split('--' + boundary).slice(1, -1);
  const result=[];
  for (const part of parts) {
    let element=new Map();
    let [top, content]=part.split('\r\n\r\n');
    content=content.slice(0, -2); //remove \r\n
    element.set("name", top.match(/name="(\w*)"/, '$1')[1]);
    element.set("type", "text");
    if (top.includes("filename=")) {
      element.set("type", "file");
      const myMatch=top.match(/Content-Type: (.*)/, '$1');
      if (myMatch.length>=2) element.set("type",myMatch[1]);
      element.set("filename", top.match(/filename="([\w, \.]*)"/, '$1')[1]);
    }
    element.set("content", content);
    result.push(element);
  }
  return result;
}