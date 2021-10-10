import User from './userfront.js';
class WebUser extends User {
  constructor() {
    super();
    this.language;
  }
}
const webuser=new WebUser();
export default webuser;