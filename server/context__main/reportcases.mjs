import makeReport from './reports.mjs';

// falta un initial report con headers.host y header.referer que quizá se haga en cliente

const requestsRep=new Map();

requestsRep.set('init database', (result)=>console.log(result));

requestsRep.set('login', (result)=>{
  if (result?.logError) makeReport("log in: " + result.code);
  else
    import('../../shared/utils.mjs').then(({unpacking})=>makeReport("log in: " + unpacking(result).props.username));
});

requestsRep.set('update user pwd', (result)=>console.log(result));

requestsRep.set('update my user pwd', (result)=>console.log(result));

requestsRep.set('create user', ()=>makeReport("user created"));

requestsRep.set('send mail', (result)=>console.log(result));

requestsRep.set('edit my props', (result)=>console.log(result));

requestsRep.set('edit my sort_order', (result)=>console.log(result));

requestsRep.set('error', (result)=>console.log(result));

export default function reporting(result, action){
  if (typeof requestsRep.get(action)=="function") { 
    requestsRep.get(action)(result);
  } 
};