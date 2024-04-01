import Languages from '../../languages/languages.mjs'
import {Linker} from '../nodes.mjs'

const myLanguages = new Languages()

export async function init() {
  return await myLanguages.init(Linker)
}
export async function loadLanguages() {
  return myLanguages.loadInitContent()
}
export async function selectMyLanguage(langParent) {
  return myLanguages.selectMyLanguage(langParent)
}
export async function setCurrentLanguage(lang) {
  return myLanguages.setCurrentLanguage(lang)
}
export function getCurrentLanguage() {
  return myLanguages.currentLanguage
}
export function getLanguagesRoot() {
  return myLanguages.treeRoot
}
export function getLanguages() {
  return myLanguages.treeRoot.getMainBranch().children
}
// widely used function
// It returns the branch that will contain language data in a node
export function getLangBranch(myNode) {
  return myLanguages.getLangBranch(myNode)
}
export function isLangBranch(myNode) {
  return myLanguages.isLangBranch(myNode)
}
// widely used function
// It returns the rootlanguage branch that is ascendant of the descendant lang data node of myNode
// It serves to get the extra parent (lang parent) of the data node to set this parental relationship when inserting it in database
export function getLangParent(myNode) {
  return myLanguages.getLangParent(myNode)
}
// widely used function
// It returns a new node that is descendent of parentNode and that contains in turn a child that is descendant of its lang relationship
// It serves to create void lang data when adding a new node
export function createInstanceChildText(parentNode, position=1) {
  return myLanguages.createInstanceChildText(parentNode, position)
}


// Hay que cambiar languages y currentLanguage por sus respectivos getters en código:
// antes -> export {languages, currentLanguage, getCurrentLanguage};
