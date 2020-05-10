var Config={
  requestFilePath: "request.php", //"request.php"
  logRequests: false, //false, true sometimes for production
  defaultEditButtonPosition: "btmiddleright", //"btmiddleright"
  defaultAdmnsButtonsPosition: "bttopcenter", //"bttopcenter"
  defaultImg: "noimg.png", //"noimg.png"
  statsOn: true, //true, false for production
  statsOnConsole: false, //false, true sometimes for production
  onEmptyValueText: null, //null, It will be setled later
  templatesCacheOn: true, //true, better sometimes false for production
  loadTemplatesAtOnce: true, //true, better sometimes false for production
  dbSessionsOn: false, //true or false if deactivated
  languagesOn: false, //true or false if deactivated
  importExportOn: false, //true or false if deactivated
  chkt2_On: true, //if false skip user data insertion
  chktaddressOn: true, //if false skip address data insertion
  chkt3_On: true, //if false skip shipping type selection
  chkt4_On: true, //if false skip payment type selection
  defaultmenu_On: true, //if true click first menu on load
  defaultcat_On: false //if true click first category on load
}

