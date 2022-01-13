import User from './userfront.js';
import {ObservableMixing} from './observermixing.js'

const initialUserData=`{"props":{},"relationships": [],"parentNode": {"props":{"parenttablename":"TABLE_USERSTYPES","childtablename":"TABLE_USERS"},"partnerNode":{"props":{"type":"customer"}, "parentNode":null,"relationships":[]},"children":[]}}`;

const WebUserMixing=Sup => class extends Sup {
  constructor() {
    super();
    this.load(JSON.parse(initialUserData));
  }
  resetData() {
    super.resetData();
    this.load(JSON.parse(initialUserData));
  }
}
const WebUser=WebUserMixing(ObservableMixing(User));
const webuser=new WebUser();
export default webuser;