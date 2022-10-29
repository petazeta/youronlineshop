import {Node} from './nodes.js';

export class Alert extends Node {
  constructor(msg) {
    super({alertmsg: msg});
  }
  async showAlert(tp, params) {
    if (tp == null) tp= "alert";
    const alertcontainer=document.createElement("div");
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
    const remove = element=>element?.parentElement?.removeChild(element);
    if (this.props.timeout>0) {
      setTimeout(()=>this.container.firstElementChild.style.opacity=0, this.props.timeout);
      setTimeout(()=>remove(this.container), this.props.timeout+500);
    }
    else remove(this.container);
  }
}

export class AlertMessage extends Alert{
  constructor(msg, timeout) {
    super(msg);
    if (timeout) this.props.timeout=timeout;
    this.props.alertclass="alertmsg";
    this.props.closeOnClick=true;
  }
}