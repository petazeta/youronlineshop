import {NodeMale} from './nodesfront.js';

class Alert extends NodeMale {
  constructor(msg) {
    super();
    if (msg) this.props.alertmsg=msg;
  }
  async showAlert(tp, params) {
    if (tp == null) tp= "alert";
    var alertcontainer=document.createElement("div");
    document.body.appendChild(alertcontainer);
    await this.setView(alertcontainer, tp, params);
    if (this.props.timeout>0) {
      alertcontainer.firstElementChild.style.opacity=0;
      alertcontainer.firstElementChild.style.transition="opacity 0.5s";
      alertcontainer.firstElementChild.style.opacity=1;
      this.hideAlert();
    }
    if (this.props.closeOnClick) {
      alertcontainer.addEventListener("click", (e)=>{
        alertcontainer.firstElementChild.style.transition="opacity 0.5s";
        this.hideAlert();
      });
    }
    return this;
  }
  hideAlert() {
    var remove=(element)=>{
      if (element && element.parentElement) {
        element.parentElement.removeChild(element);
      }
    };
    if (this.props.timeout>0) {
      window.setTimeout(()=>this.myContainer.firstElementChild.style.opacity=0, this.props.timeout);
      window.setTimeout(()=>remove(this.myContainer), this.props.timeout+500);
    }
    else remove(this.myContainer);
  }
}

class AlertMessage extends Alert{
  constructor(msg, timeOut) {
    super(msg);
    if (timeOut) this.props.timeout=timeOut;
    this.props.alertclass="alertmsg";
    this.props.closeOnClick=true;
  }
}


export {Alert, AlertMessage}