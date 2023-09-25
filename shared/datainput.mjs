export function checkDataChange(relationship, data) {
  return relationship.childTableKeys.some(key=>key!='id' && data.props[key]!=relationship.getChild().props[key]);
}

export function checkLength(value, min, max){
  if (typeof value=="number") value=value.toString();
  if (typeof value == "string" && value.length >= min && value.length <= max) return true;
  return false;
};

export function checkValidData(data) {
  if (!data) return false;
  let minchar=3;
  let maxchar=120;
  for (const key in data.props) {
    const value=data.props[key];
    if (key=="id") continue;
    if (!value ||
    !checkLength(value, minchar, maxchar)) {
      return {errorKey: key, minchar: minchar, maxchar: maxchar};
    }
  }
  return true;
}

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const detectNumber=(x)=>{
  if (!isNaN(x) && !(x.trim())=='') {
    return true;
  }
  return false;
}

//This function is to detect numbers as arguments that are in string format
export function parseNumber(x){
  if (typeof x == "string" && detectNumber(x)) return Number(x);
  if (typeof x == "number") return x;
  return NaN;
}

//This function is to detect numbers as arguments that are in string format
export function parseNumberAndString(x){
  if (typeof x == "string" && detectNumber(x)) return Number(x);
  if (typeof x == "string") return x;
  if (typeof x == "number") return x;
  return '';
}