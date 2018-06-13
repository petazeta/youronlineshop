var statsRecorder={};
statsRecorder.generateUrl=function(data){
  var urlStats="https://youronlineshop.sourceforge.io/stats/register.php";
  var sentences=[];
  data.forEach(function(data) {
    sentences.push(Object.keys(data)[0] + "=" + data[Object.keys(data)[0]])
  });
  return urlStats + "?" + sentences.join("&");
}
statsRecorder.makeRecord=function(data){
  data.unshift({uniqueId: this.uniqueId});
  if (this.recordsNumber != 0) data.push({timeDelay: ((new Date().getTime() - this.startTime)/(1000 * 60)).toFixed(1) + "min"});
  this.linkElement.src=this.generateUrl(data);
  this.recordsNumber++;
}
statsRecorder.keepStats=function() {
  statsRecorder.makeRecord([]);
  var delay=60000;
  if (this.recordsNumber > 20) delay=300000;
  if (this.recordsNumber > 100) delay=3000000;
  window.setTimeout(function(){statsRecorder.keepStats()}, delay);
}
statsRecorder.startRecordingProcess=function(){
  this.recordsNumber=0;
  this.startTime= new Date().getTime();
  this.uniqueId=this.startTime.toString(32);
  this.linkElement=window.document.getElementById("statsLink");
  var thisNavigator="-";
  if (window.navigator.userAgent.indexOf("Chrome")) thisNavigator="Chrome";
  else if (window.navigator.userAgent.indexOf("Firefox")) thisNavigator="Firefox";
  else if (window.navigator.userAgent.indexOf("Mozila")) thisNavigator="Mozilla";
  if (window.navigator.userAgent.indexOf("Mobil")) thisNavigator+=" Mobil";
  var initData=[
    {httpaddress: window.location.href},
    {languages: window.navigator.languages.join(" ")},
    {yosversion: "1.0.7"},
    {webbrowser: thisNavigator}
  ];
  this.makeRecord(initData);
  window.setTimeout(function(){statsRecorder.keepStats()}, 180000);
  var myEvents=[
    {write: "exitPage", eventListener: window, eventName: "beforeunload"},
    {write: "clickW", eventListener: window, eventName: "click"},
    {write: "javascript:ev.write='log '+ (webuser.getUserType() || webuser.properties.name || 'out')", eventListener: webuser, eventName: "log"},
    {write: "cartItem", eventListener: mycart, eventName: "cartItem"}
  ];
  myEvents.forEach(function(ev){
    ev.eventListener.addEventListener(ev.eventName, function(myArg){ //the argument sent at dispatchEvent
      if (ev.write.indexOf("javascript:"==0)) eval(ev.write.substr(11));
      var data=[{[ev.eventName]: ev.write}];
      statsRecorder.makeRecord(data);
    });
  });
}
window.onload=function(){
  statsRecorder.startRecordingProcess();
}

