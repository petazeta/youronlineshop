import {Node, NodeFemale, NodeMale} from './nodesfront.js';

//Turn input values to element props
export function formToData(relationship, myform) {
  var data=new NodeMale();
  relationship.childtablekeys.forEach((key)=>{
    if (key!="id" && myform.elements[key]) {
      data.props[key]=myform.elements[key].value;
    }
  });
  return data;
}

export function checkDataChange(relationship, data) {
  return relationship.childtablekeys.some(key=>key!='id' && data.props[key]!=relationship.getChild().props[key]);
}

export function checkValidData(data) {
  if (!data) return false;
  let minchar=3;
  let maxchar=120;
  function checklength(value, min, max){
    if (typeof value=="number") value=value.toString();
    if (typeof value == "string") {
      if (value.length >= min && value.length <= max) return true;
    }
    return false;
  };
  for (const key in data.props) {
    const value=data.props[key];
    if (key=="id") continue;
    if (!value ||
    !checklength(value, minchar, maxchar)) {
      return {errorKey: key, minchar: minchar, maxchar: maxchar};
    }
  }
  return true;
}

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//This function is to detect numbers as arguments that are in string format
export function parseNumber(x){
  const detectNumber=(x)=>{
    if (!isNaN(x) && !(x.trim())=='') {
      return true;
    }
    return false;
  }
  if (typeof x == "string" && detectNumber(x)) return Number(x);
  if (typeof x == "number") return x;
  return NaN;
}

//This function is to detect numbers as arguments that are in string format
export function parseNumberAndString(x){
  const detectNumber=(x)=>{
    if (!isNaN(x) && !(x.trim())=='') {
      return true;
    }
    return false;
  }
  if (typeof x == "string" && detectNumber(x)) return Number(x);
  if (typeof x == "string") return x;
  if (typeof x == "number") return x;
  return '';
}