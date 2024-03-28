import {init as initWebUser} from './webuser/webuser.mjs'
import {getTemplates, getStyles} from './layouts.mjs'
import {Alert} from './alert.mjs'
import {init as initLanguages, selectMyLanguage} from './languages/languages.mjs'
import {initData as initSiteText} from './sitecontent.mjs'

/*
  Initiation of the client. - bodyView will be any function that returns the view for the body.
  It is supposed to be called just once for starting the client. But for the special case after isntallation we would call it for showing the admin passwordss change view. However it is not recomended to use more than once so we haven't stydied this situation in detail.
*/
export async function startView(bodyView) {
  try {
    // Alert element definition
    if (!customElements.get("alert-element"))
      customElements.define("alert-element", Alert)

    // Layouts init
    await getTemplates() // Load the templates from server. --- custom development maybe comment this line
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
      const {dbPopView} = await import("./install/dbpop.mjs")
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
      const {makeReport} = await import("./reports.mjs")
      makeReport(myError)
    }
  }
}
