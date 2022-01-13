//
import {userLogin} from './user.js';
export default function login(headers) {
  let username, password;
  const headerKeys=Object.keys(headers);
  const lowerHeaderKeys=headerKeys.map(key=>{
    if (typeof key == "string") return key.toLowerCase();
    else return false;
  });
  const authIndex=lowerHeaderKeys.indexOf('authorization');
  if (authIndex!=-1){
    const auth=headers[headerKeys[authIndex]];
    const token=auth.match(/Basic (.*)/)[1];
    [username, password]=Buffer.from(token, 'base64').toString().split(':');
    //[username, password]=atob(token).split(':');
  }
  return userLogin(username, password);
}