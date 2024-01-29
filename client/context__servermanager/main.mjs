import {init as initWebUser} from './webuser/webuser.mjs'
import {getTemplates, getStyles} from './layouts.mjs'
import {Alert} from './alert.mjs'
import {init as initLanguages, selectMyLanguage} from './languages/languages.mjs'
import {initData as initSiteText} from './sitecontent.mjs'
import {bodyView} from './body.mjs'

try {
  // Alert element definition
  customElements.define("alert-element", Alert)

  // Layouts init
  await getTemplates() // Load the templates from server
  await getStyles() // Load the css from server
  try {
    await initLanguages() // Load languages for server
  }
  catch(err) {
    if(err.message=="Database Content Error")
      throw new Error('No Language Content')
  }
  if (! selectMyLanguage())
    throw new Error('No Language Content')

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
    const {dbPopView} = await import("./dbpop.mjs")
    document.body.appendChild(await dbPopView())

    //document.body.appendChild(prepareTpScripts(await getTemplate("dbimport")))
  }
  else {
    // Error Output Messange
    console.error(myError)
    if (myError.stack) myError = myError.stack; //js errors it shows error line
    const errorAlert = document.getElementById('syserror').content.firstElementChild
    errorAlert.textContent = myError
    document.body.appendChild(errorAlert)
    errorAlert.showModal()
    const makeReport = await import("./reports.mjs")
    makeReport(myError)
  }
}