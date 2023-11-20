Database export
===============

## Export data

The exporting data has two elements:

- Languages: It is made up of lang parent which has just the info about lang table name, then the root element, their relationships that and the children of the main branch, that are the actual languages.

- tree (---It should be called trees instead---): Data trees that contains a whole tree from the root untill the leaf. It usually contains the lang information of all the languges.

They are:
  - Users: It contains the usertypes starting by the parent, then usertypes, then users belonging userstypes.
  - Page elements: It contains "pageElements" starting by the parent, then the page elements tree that also contains the "pageelementsdata" (lang content for each site element)
  - Site elements: similar to page elements
  - Categories and items: From cagetories all the way to items. It contains also the lang data at the suitable relationship.
  - Shippings
  - Payments


