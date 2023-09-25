import ProtoUser from '../../user.mjs'
import {Linker, Node} from './nodes.mjs';

class User extends ProtoUser{}

User.userConstructor=User;
User.linkerConstructor=Linker;
User.nodeConstructor=Node;
User.dbGateway=Node.dbGateway;

const userLogin = async (uname, upwd) => await User.login(uname, upwd);

const userAutoLogin = async (uname) => await User.autoLogin(uname);

export {User, userLogin, userAutoLogin};