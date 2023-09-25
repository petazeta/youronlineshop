export default {
  languagesOn: true, // true or false if deactivated
  chktuserdata_On: true, // if false skip user data and address insertion
  chktaddress_On: true, // if false skip address data insertion
  chktshipping_On: true, // if false skip shipping type selection
  chktpayment_On: true, // if false skip payment type selection
  initUrlSearch: '', // Value: ?menu=menu_id or ?category=cat_id&subcategory=subcat_id&item=item_id
  newordermailadmin_On: false, // mail to admin
  newordermailcustomer_On: false, // mail to customer
  itemExtend_On: true, // if true expand item extend is available
  catPageSize: 2, // false if we don't want product pagination
  currencyCode: 'USD', // 'USD', 'EUR' ...
  currencyLocale: null, // 'en-IN', 'en-US'  null => let for browser config
  defaultImg: "noimg.png", // "noimg.png"
  itemImagesMax: 3, // Num maxim the images per item
  requestUrlPath: "request.cmd", // url paths should have ".cmd" extension" to make it apart from client source files requests
  layoutsUrlPath: "layouts.cmd", // layouts.cmd?skin=skinId&subskin=subskinId&style=styleId
  uploadImagesUrlPath: "upload.cmd",
  catalogImagesUrlPath: "catalogimages.cmd"
}

