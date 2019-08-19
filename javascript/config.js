var Config={
  requestFilePath: "request.php", //"request.php"
  logRequests: false, //false, true sometimes for production
  defaultEditButtonPosition: "btmiddleright", //"btmiddleright"
  defaultAdmnsButtonsPosition: "bttopcenter", //"bttopcenter"
  defaultImg: "noimg.png", //"noimg.png"
  statsOn: true, //true, false for production
  onEmptyValueText: null, //null, It will be setled later
  templatesCacheOn: true, //true, better sometimes false for production
  loadTemplatesAtOnce: true, //true, better sometimes false for production
  dbSessionsOn: true, //true or false if deactivated
  chkt2_On: true, //if false skip address insertion
  chkt3_On: true, //if false skip shipping type selection
  chkt4_On: true //if false skip payment type selection
}
