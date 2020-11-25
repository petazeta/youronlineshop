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
  languagesOn: true, //true or false if deactivated
  importExportOn: false, //true or false if deactivated
  chkt2_On: true, //if false skip user data insertion
  chktaddressOn: true, //if false skip address data insertion
  chkt3_On: true, //if false skip shipping type selection
  chkt4_On: true, //if false skip payment type selection
  initUrl: '{"menu":1}', //Init with first menu at start. Value is a String: ?menu=32 or ?category=5&subcategory=5&item=4, also (cat ordinal, subcat or menu) {cat : 2, subcat : 3}, {menu : 2}
  expimplang_On: false, //if true click first category on load
  newordermailadmin_On: false, //if true click first category on load
  newordermailcustomer_On: false, //if true click first category on load
  showsubcategory_On: false, //if true expand to subcategories
  itemExtend_On: true, //if true expand item extend is available
  firstSubcategoryAuto_On: false, //if true expand to first subcategory content
  pageTitle_On: true, //if true show page title
  pageSubTitle_On: true, //if true show page subtitle
  pagTitAsText: false, //if true show web page title as page title
  nodeOnAppend: function(){
    if (window.screen.width<700 && this.myContainer && this.myContainer.id=='centralcontent') {
      this.myContainer.scrollIntoView();
    }
  }, //scroll to content in phone screens
}

