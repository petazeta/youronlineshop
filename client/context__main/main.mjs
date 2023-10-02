import {webuser, init as initWebUser} from './webuser/webuser.mjs'
import {getTemplate, getTemplates, getStyles} from './layouts.mjs'
import makeReport from './reports.mjs'
import {Alert} from './alert.mjs'
import {init as initLanguages, selectMyLanguage} from './languages/languages.mjs'
import {initData as initSiteText} from './sitecontent.mjs'
import {setConfig} from './cfg/main.mjs'
import prepareTpScripts from './viewcomponent.mjs'
import {bodyView} from './body.mjs'

export async function main() {
  try {
    //const {default: devConfig} = await import('./cfg/devconfig.mjs') // development configuration
    //const config=setConfig(devConfig); // dev configuration (some parameters could have been taken in advance from the standard config)
    const config = setConfig()

    // Alert element definition
    customElements.define("alert-element", Alert)

    // Layouts init
    await getTemplates() // Load the templates from server
    await getStyles() // Load the css from server

    await initLanguages() // Load languages for server
    if (! selectMyLanguage()) throw new Error('No Language Content');

    await initWebUser() // Loading initial user type (customer) data and automatic login (remember me)

    // Load web site text content
    const siteText = await initSiteText()

    document.body.innerHTML="";
    document.body.appendChild(await bodyView())
  }
  // catching errors from the previous block, not for the entire app
  catch(myError) {
    // Managing installing situations
    if (myError instanceof Error && myError.message=='No Language Content') {
      document.body.appendChild(prepareTpScripts(await getTemplate("dbimport")))
    }
    else {
      // Error Output Messange
      console.error(myError)
      if (myError.stack) myError = myError.stack; //js errors it shows error line
      const errorAlert = document.getElementById('syserror').content.firstElementChild
      errorAlert.textContent = myError
      document.body.appendChild(errorAlert)
      errorAlert.showModal()
      makeReport(myError)
    }
  }
}