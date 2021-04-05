var Config={
  themeId: "root", //Select the theme
  styleId: "main", //Select the style
  languagesOn: true, //true or false if deactivated
  importExportOn: true, //true or false if deactivated
  chkt2_On: true, //if false skip user data insertion
  chktaddressOn: true, //if false skip address data insertion
  chkt3_On: true, //if false skip shipping type selection
  chkt4_On: true, //if false skip payment type selection
  initUrl: '', //Value: ?menu=32 or ?category=5&subcategory=5&item=4 (default: it will init at first menu.)
  onEmptyValueTextOn: true, //true, false then it doesn't show a value
  newordermailadmin_On: false, //if true click first category on load
  newordermailcustomer_On: false, //if true click first category on load
  showsubcategory_On: true, //if true expand to subcategories
  itemExtend_On: true, //if true expand item extend is available
  logRequests: false, //false, true sometimes for development
  templatesCacheOn: true, //true, sometimes false for development
  loadTemplatesAtOnce: true, //true
  defaultImg: "noimg.png", //"noimg.png"
  statsOn: true, //true, false for development
  statsOnConsole: false, //false, true sometimes for development
  catalogPath: "catalog/",
  requestFilePath: "backend/request.php",
  themesPath: "themes",
  uploadFilePath: "backend/uploadfile.php",
  loginFilePath: "backend/dblogin.php",
  mailerFilePath: "backend/mailer.php",
  loadAllTemplatesFilePath: "backend/loadalltemplates.php",
}