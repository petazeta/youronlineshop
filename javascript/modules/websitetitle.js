
export function setTitle(siteText, headTopText) {
  //web site title
  const titFixed=siteText.getNextChild("not located").getNextChild("pagTit").getRelationship("domelementsdata").getChild();
  if (!titFixed.props.value) {
    document.title=headTopText.props.value;
  }
  else {
    document.title=titFixed.props.value;
  }
  headTopText.addEventListener("changeProperty", (property)=>{
    if (!titFixed.props.value) {
      document.title=headTopText.props.value;
    }
  },
  "changePageTitle");
}