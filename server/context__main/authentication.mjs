//
//import {userLogin, userAutoLogin} from './user.mjs';
import {config} from './cfg.mjs';

// Both are async

export const authenticate = (User, headers) => config.get("autoLogin") ? User.autoLogin(config.autoLogin) : userAuthentication(User, headers)

function userAuthentication(User, headers) {
  /*
  let username, password;
  let auth;
  Object.keys(headers).some(key=>{
    if (typeof key == "string" && key.toLowerCase()=='authorization') {
      auth=headers[key];
      return true;
    }
    else return false;
  });
  */
  const auth=Object.entries(headers).find(([key, value])=>typeof key == "string" && key.toLowerCase()=='authorization');
  if (auth){
    const token=auth[1].match(/Basic (.*)/)[1];
    const [username, password]=Buffer.from(token, 'base64').toString().split(':');
    return User.login(username, password);
  }
}