import fs from 'fs';

const sourceTables = ["userstypes","usersdata","users","addresses","itemcategoriesdata","itemcategories","languages","itemsdata","itemsimages","items","orderitems","orderpaymenttypes","ordershippingtypes","orders","pageelementsdata","pageelements","paymenttypesdata","paymenttypes","shippingtypesdata","shippingtypes","siteelementsdata","siteelements"];
const targetTables = ["UsersTypes","UsersData", "Users","Addresses","ItemCategoriesData","ItemCategories","Languages","ItemsData","ItemsImages","Items","OrdersItems","OrderPaymentTypes","OrderShippingTypes","Orders","PageElementsdata","PageElements","PaymentTypesData","PaymentTypes","ShippingTypesData","ShippingTypes","SiteElementsData","SiteElements"];
const sForeigns=[], sPositions=[], tForeigns=[], tPositions=[];
for (let i=0; i<sourceTables.length; i++) {
  sForeigns.push('_' + sourceTables[i]);
  sPositions.push(sForeigns[i] + '_position');
  tForeigns.push('parent' + targetTables[i]);
  tPositions.push('position' + targetTables[i]);
}

let data=fs.readFileSync('pgsql_dtbs.json', 'utf8');

sPositions.forEach((val, i)=>data = data.replaceAll(`"${sPositions[i]}"`, `"${tPositions[i]}"`));
sForeigns.forEach((val, i)=>data = data.replaceAll(`"${sForeigns[i]}"`, `"${tForeigns[i]}"`));
fs.writeFileSync('mongodb_dtbs.json', data);