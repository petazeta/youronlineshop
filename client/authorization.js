export let authorizationToken={};
export function setAuthorization(name, password) {
  if (!name || !password) return authorizationToken={};
  authorizationToken.Authorization='Basic ' + btoa(name + ':' + password);
  return authorizationToken;
}