import {setConfig} from './cfg/main.js';
import {DataNode} from './nodes.js';
import initWebUser from './webuser.js';
import {getTemplates, getStyles} from './themesserver.js';
import {Alert, AlertMessage} from './alert.js';
import makeReport from './reports.js';
import {selectMyLanguage} from './languages.js';
import {loadText} from './sitecontent.js';
import {setInitialNavSearch} from './navhistory.js';
//import devConfig from './cfg/devconfig.js'; // dev configuration

try {
  //const config=setConfig(devConfig); // dev configuration
  const config=setConfig();

  // We check if they try to exec the app directly through the file
  if (window.location.protocol=="file:") throw new Error('Incorrect protocol: Are you are trying to launch the app straight through your web browser???');

  setInitialNavSearch(config.initUrlSearch); // It sets initial navigation search to config one and stores the search value

  await getTemplates(); // Load the templates
  await getStyles(); // Load the css

  if (! await selectMyLanguage()) throw new Error('No Language Content');

  await initWebUser(); // Loading initial user type (customer) data and automatic login (remember me)

  // Load web site text content
  const siteText= await loadText();

  // Load Page
  // We start the templates and its scripts
  await siteText.setView(document.body, "body");
  // siteText.appendView(document.body, "extra"); // For dev mode
}
catch(myError) {
  // Managing installing situations
  if (myError instanceof Error && myError.message=='No Language Content') {
    new DataNode().setView(document.body, "dbimport");
  }
  else {
    // Error Output Messange
    console.error(myError);
    if (myError.stack) myError=myError.stack; //js errors it shows error line
    new Alert(myError).showAlert(document.getElementById('syserror'));
    makeReport(myError);
  }
}
