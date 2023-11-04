//
//import {userLogin, userAutoLogin} from './user.mjs';
import {config} from './cfg.mjs';

// Both are async

export const authenticate = (User, headers) => config.get("autoLogin") ? User.autoLogin(config.autoLogin) : userAuthentication(User, headers)

function userAuthentication(User, headers) {
  const authKeyValue = Object.entries(headers).find(([key, value])=>typeof key == "string" && key.toLowerCase()=='authorization')
  if (!authKeyValue) return
  const token = authKeyValue[1].match(/Basic (.*)/)[1]
  const [username, password] = Buffer.from(token, 'base64').toString().split(':')
  return User.login(username, password)
}