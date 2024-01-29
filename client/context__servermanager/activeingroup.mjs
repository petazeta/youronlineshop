import {ActiveGroups} from '../activelauncher.mjs'

// Active groups ==> groups of links (menus) to some container
// groups key == container id

const myActiveGroups=new ActiveGroups()

function getActiveInGroup(groupName){
  return myActiveGroups.getActiveInGroup(groupName)
}
function setActiveInGroup(newActive, groupName){
  return myActiveGroups.setActiveInGroup(newActive, groupName)
}
export function getActiveInSite(){
  return myActiveGroups.getActiveInGroup("centralcontent")
}
export function setActiveInSite(newActive){
  return myActiveGroups.setActiveInGroup(newActive, "centralcontent")
}
