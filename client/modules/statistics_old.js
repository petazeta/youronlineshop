import config from './../cfg/main.js'
import {Node} from './nodesfront.js';
import {myCart} from './cart.js';

class StatsRecorder extends Node{
  constructor(){
    super();
    var statsImage=document.createElement("img");
    statsImage.style.display="none";
    statsImage.id="statsLink";
    document.head.appendChild(statsImage);
    
    this.props.recordsNumber=0,
    this.props.startTime=new Date().getTime();
    this.props.uniqueId=this.props.startTime.toString(32).substring(3);
    this.linkElement=statsImage;
    
    var softversion="3.6.2";
    
    var url=window.location.href;
    if (url.indexOf("sourceforge.")!=-1) {
      url=url.replace(/.+sourceforge\.\w+\//,""); //removing sfg url
    }
    var initData={
      httpaddress: url,
      languages: window.navigator.languages.join(" "),
      yosversion: softversion,
    };
    if (document.referrer) {
      initData.refurl=document.referrer;
    }
    if (!config.statsOn) {
      return;
    }
    //Events records
    window.addEventListener("beforeunload", () => this.makeRecord({event: "exitPage"}));
    window.addEventListener("click", (event) => {if (event.isTrusted) this.makeRecord({event: "clickWindow"});});
    webuser.addEventListener("log", () => this.makeRecord({event: 'log '+ (webuser.getUserType() || webuser.props.name || 'out')}));
    myCart.addEventListener("cartItem", () => this.makeRecord({event: "cartItem"}));
    this.addEventListener("makeLog", (value) => this.makeRecord({event: value}));

    this.makeRecord(initData);
    window.setTimeout(()=>this.keepStats(), 180000);
    
    fetch("https://ip.nf/me.json")
    .then(res => res.json())
    .then(result => {
      if (result && result.ip && result.ip.country) this.makeRecord({loadcountry: result.ip.country});
    })
    .catch(error => console.error('Stats Error: ip to country', error))
  }
  generateUrl(data){
    var urlStats = (document.location.protocol=="https:" ? "https://youronlineshop.sourceforge.io/" :
    "http://youronlineshop.sourceforge.net/") + "stats/register.php";
    var sentences=[];
    for (var key in data) {
      sentences.push(key + "=" + data[key])
    }
    return urlStats + "?" + sentences.join("&");
  }
  makeRecord(data){
    if (typeof data=="string") data={nokey: data};
    const recordData = Object.assign({uniqueId: this.props.uniqueId}, data);
    if (this.props.recordsNumber != 0) recordData.timeDelay= ((new Date().getTime() - this.props.startTime)/(1000 * 60)).toFixed(1) + "min";
    this.linkElement.src=this.generateUrl(recordData);
    this.props.recordsNumber++;
  }
  keepStats() {
    this.makeRecord({});
    var delay=600000;
    if (this.props.recordsNumber > 5) delay=1200000;
    if (this.props.recordsNumber > 20) delay=12000000;
    window.setTimeout(()=>{this.keepStats()}, delay);
  }
  logEvent(value){
    this.dispatchEvent("makeLog", value)
  }
}

export default StatsRecorder;