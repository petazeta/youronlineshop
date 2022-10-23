
let webuser;
const CLIENT_MODULES_PATH='client/';
const CLIENT_CONFIG_PATH='client/cfg/';
const SHARED_CONFIG_PATH='shared/cfg/';
const SHARED_MODULES_PATH='shared/';


const VIEWS_FOLDER = "views"; // deprecated

function pathJoin(...args) {
  return args.map((part, i) => {
    if (i === 0) {
      return part.trim().replace(/[\/]*$/g, '')
    } else {
      return part.trim().replace(/(^[\/]*|[\/]*$)/g, '')
    }
  }).filter(x=>x.length).join('/')
}

textEditorSaved=''; //This var saves the textEditor data to not be deteleted each time