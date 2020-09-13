//Set location by config
//If no url:
if (!window.location.search) {
  if (Config.initUrl) {
    if (Config.initUrl.indexOf('?')!=-1) {
          history.pushState({url:Config.initUrl}, null, Config.initUrl);
    }
    else {
      try {
        let url;
        let urlobj=JSON.parse(Config.initUrl);
        if (urlobj.menu) {
          Config.startMenuNum=urlobj.menu;
        }
        else if (urlobj.cat) {
          url='?category=' + urlobj.cat;
          Config.startCatNum=urlobj.cat;
          if (urlobj.subcat) {
            Config.startSubcatNum=urlobj.subcat;
            if (urlobj.item) {
              Config.startItemNum=urlobj.item;
            }
          }
        }
      } catch(e) {
        console.log(e, Config.initUrl);
      }
    }
  }
}