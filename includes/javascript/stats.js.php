var statsRecorder={};
statsRecorder.generateUrl=function(data){
  var urlStats = (document.location.protocol=="https:" ? "https://youronlineshop.sourceforge.io/" :
  "http://youronlineshop.sourceforge.net/") + "stats/register.php";
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
  this.makeRecord([]);
  var delay=600000;
  if (this.recordsNumber > 5) delay=1200000;
  if (this.recordsNumber > 20) delay=12000000;
  window.setTimeout(function(){statsRecorder.keepStats()}, delay);
}
statsRecorder.startRecordingProcess=function(){
  this.recordsNumber=0;
  this.startTime= new Date().getTime();
  this.uniqueId=this.startTime.toString(32);
  this.linkElement=window.document.getElementById("statsLink");
  var thisNavigator="-";
  if (window.navigator.userAgent.indexOf("Chrome")!=-1) thisNavigator="Chrome";
  else if (window.navigator.userAgent.indexOf("Firefox")!=-1) thisNavigator="Firefox";
  else if (window.navigator.userAgent.indexOf("Mozila")!=-1) thisNavigator="Mozilla";
  var softversion="<?php
$myfile = fopen('../../README.txt', 'r') or die('Unable to open file!');
// Output one line until end-of-file
$i=4;
while($i-- && !feof($myfile)) {
  $version=fgets($myfile);
}
fclose($myfile);
echo preg_replace('/\n/', '', $version);
?>";
  var installId="<?php
$myfile = fopen('../config.php', 'r') or die('Unable to open file!');
// Output one line until end-of-file
$filecontent='';
while(!feof($myfile)) {
  $filecontent+=fgets($myfile);
}
fclose($myfile);
$filecontent= preg_replace('/\n/', '', $filecontent);
echo md5($filecontent);
?>";
  var initData=[
    {httpaddress: window.location.href},
    {languages: window.navigator.languages.join(" ")},
    {yosversion: softversion},
    {isntallId: installId},
    {webbrowser: thisNavigator}
  ];
  if (domelementsrootmother && domelementsrootmother.children[0]) {
    initData.push({databasellink: "Db Link ok"});
  }
  else initData.push({databasellink: "Db Link Not ok"});
  var myEvents=[
    {write: "exitPage", eventListener: window, eventName: "beforeunload"},
    {write: "clickW", eventListener: window, eventName: "click"},
    {write: "javascript:ev.write='log '+ (webuser.getUserType() || webuser.properties.name || 'out')", eventListener: webuser, eventName: "log"},
    {write: "cartItem", eventListener: mycart, eventName: "cartItem"}
  ];
  this.makeRecord(initData);  
  window.setTimeout(function(){statsRecorder.keepStats()}, 180000);

  myEvents.forEach(function(ev){
    ev.eventListener.addEventListener(ev.eventName, function(myArg){ //the argument sent at dispatchEvent
      if (ev.write.indexOf("javascript:")==0) eval(ev.write.substr(11));
      var data=[];
      var myObject={};
      myObject[ev.eventName]=ev.write;
      data.push(myObject);
      statsRecorder.makeRecord(data);
    });
  });
}
if (Config.statsOn) {
  window.onload=function(){
    window.setTimeout(function(){
      statsRecorder.startRecordingProcess();
    }, 5000);
  }
}
