var statsLink=document.createElement("img");
statsLink.style.display="none";
statsLink.generateUrl=function(data){
  var urlStats="https://youronlineshop.sourceforge.io/stats/register.php";
  var sentences=[];
  data.forEach(function(data) {
    sentences.push(Object.keys(data)[0] + "=" + data[Object.keys(data)[0]])
  });
  return urlStats + "?" + sentences.join("&");
}
statsLink.makeRecord=function(data){
  if (webuser.properties.username){
    data.unshift({username: webuser.properties.username});
  }
  data.unshift({uniqueId: this.uniqueId});
  data.push({timeDelay: new Date().getTime() - this.startTime});
  this.src=this.generateUrl(data);
}
statsLink.keepStats=function() {
  statsLink.makeRecord([]);
  window.setTimeout(function(){statsLink.keepStats()}, 300000);
}
statsLink.startRecordingProcess=function(){
  this.startTime= new Date().getTime();
  this.uniqueId=this.startTime.toString(32);
  window.document.body.appendChild(this);
  var initData=[
    {httpaddress: window.location.href},
    {languages: window.navigator.languages.join(" ")},
    {webbrowser: window.navigator.userAgent}
  ];
  this.makeRecord(initData);
  window.setTimeout(function(){statsLink.keepStats()}, 180000);
  var myEvents=[
    {name: "exitPage", eventListener: window, eventName: "beforeunload"},
    {name: "clickWindow", eventListener: window, eventName: "click"},
    {name: "log", eventListener: webuser, eventName: "log"},
    {name: "cartItem", eventListener: mycart, eventName: "cartItem"}
  ];
  myEvents.forEach(function(ev){
    ev.eventListener.addEventListener(ev.eventName, function(myArg){ //the argument sent at dispatchEvent
      var data=[{[ev.name]: ev.name}];
      statsLink.makeRecord(data);
    });
  });
}
window.onload=function(){
  statsLink.startRecordingProcess();
}

