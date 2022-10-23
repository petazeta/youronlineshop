//
import {userLogin, userAutoLogin} from './user.mjs';
import config from './cfg/mainserver.mjs';

// Both are async

export default (headers) => config.autoLogin ? userAutoLogin(config.autoLogin) : userAuthentication(headers);

export function userAuthentication(headers) {
  let username, password;
  let auth;
  Object.keys(headers).some(key=>{
    if (typeof key == "string" && key.toLowerCase()=='authorization') {
      auth=headers[key];
      return true;
    }
    else return false;
  });
  if (auth!==undefined){
    const token=auth.match(/Basic (.*)/)[1];
    [username, password]=Buffer.from(token, 'base64').toString().split(':');
    //[username, password]=atob(token).split(':');
  }
  return userLogin(username, password);
}