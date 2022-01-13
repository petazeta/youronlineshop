export default {
  themeId: "root", // Select the theme
  styleId: "main", // Select the style
  languagesOn: true, // true or false if deactivated
  chktuserdata_On: true, // if false skip user data and address insertion
  chktaddress_On: true, // if false skip address data insertion
  chktshipping_On: true, // if false skip shipping type selection
  chktpayment_On: true, // if false skip payment type selection
  initUrl: '', // Value: ?menu=32 or ?category=5&subcategory=5&item=4 (default: it will init at first menu.)
  onEmptyValueTextOn: true, // true, false then it doesn't show a value
  newordermailadmin_On: false, // if true click first category on load
  newordermailcustomer_On: false, // if true click first category on load
  showsubcategory_On: true, // if true expand to subcategories
  itemExtend_On: true, // if true expand item extend is available
  viewsCacheOn: true, // true, sometimes false for development
  loadViewsAtOnce: true, // true
  defaultImg: "noimg.png", // "noimg.png"
  catalogImagesSmallPath: "catalog-images/small/", // this can not be overwritten at config.js
  catalogImagesBigPath: "catalog-images/big/", // this can not be overwritten at config.js
  requestFilePath: "request.cmd",
  uploadFilePath: "upload.cmd",
  themesPath: "client/themes",
  loadAllComponentsFilePath: "loadallcomponents.cmd",
  catPageSize: 12, // false if we don't want product pagination
  currencyCode: 'USD', // 'USD', 'EUR' ...
  currencyLocale: null, // 'en-IN', 'en-US'  null => let for browser config
  categoryLevels: 2, // 1 or 2
}

