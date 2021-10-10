export default {
  themeId: "root", //Select the theme
  styleId: "main", //Select the style
  languagesOn: true, //true or false if deactivated
  chktuserdata_On: true, //if false skip user data and address insertion
  chktaddress_On: true, //if false skip address data insertion
  chktshipping_On: true, //if false skip shipping type selection
  chktpayment_On: true, //if false skip payment type selection
  initUrl: '', //Value: ?menu=32 or ?category=5&subcategory=5&item=4 (default: it will init at first menu.)
  onEmptyValueTextOn: true, //true, false then it doesn't show a value
  newordermailadmin_On: false, //if true click first category on load
  newordermailcustomer_On: false, //if true click first category on load
  showsubcategory_On: true, //if true expand to subcategories
  itemExtend_On: true, //if true expand item extend is available
  viewsCacheOn: true, //true, sometimes false for development
  loadViewsAtOnce: true, //true
  defaultImg: "noimg.png", //"noimg.png"
  statsOn: true, //(true, false) false for development
  statsOnConsole: false, //(false, true) true sometimes for development
  catalogPath: "catalog/",
  requestFilePath: "server/php/request.php",
  uploadFilePath: "server/php/upload.php",
  themesPath: "themes",
  loadAllComponentsFilePath: "server/php/loadallcomponents.php",
  catPageSize: 12, //false if we don't want product pagination
}