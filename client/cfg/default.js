export default {
  themeId: "root", // Select the theme
  subThemeId: null, // Select the sub-theme
  styleId: "main", // Select the style
  languagesOn: true, // true or false if deactivated
  chktuserdata_On: true, // if false skip user data and address insertion
  chktaddress_On: true, // if false skip address data insertion
  chktshipping_On: true, // if false skip shipping type selection
  chktpayment_On: true, // if false skip payment type selection
  initUrlSearch: '', // Value: ?menu=menu_id or ?category=cat_id&subcategory=subcat_id&item=item_id
  onEmptyValueTextOn: true, // true, false then it doesn't show a value
  newordermailadmin_On: false, // mail to admin
  newordermailcustomer_On: false, // mail to customer
  showsubcategory_On: true, // if true expand to subcategories
  itemExtend_On: true, // if true expand item extend is available
  viewsCacheOn: true, // true, sometimes false for development
  loadViewsAtOnce: true, // true
  catPageSize: 10, // false if we don't want product pagination
  currencyCode: 'USD', // 'USD', 'EUR' ...
  currencyLocale: null, // 'en-IN', 'en-US'  null => let for browser config
  categoryLevels: 2, // 1 or 2
  defaultImg: "noimg.png", // "noimg.png"
  itemImagesMax: 3, // Num maxim the images per item
}

