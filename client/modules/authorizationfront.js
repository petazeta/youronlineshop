export let authorizationToken={};
export function setAuthorization(name, password) {
  if (!name || !password) authorizationToken={};
  else authorizationToken.Authorization='Basic ' + btoa(name + ':' + password);
  return authorizationToken;
}