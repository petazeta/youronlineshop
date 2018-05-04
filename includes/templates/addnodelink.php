<a href="" style="margin:2px" data-js='
	thisElement.onclick=function() {
		var myalert=thisElement.lastElementChild.cloneNode(true);
		var myform=myalert.getElementsByTagName("form")[0];
		var loadcandidatesnode=new NodeFemale();
		var loadcandidatesform=thisElement.getElementsByTagName("form")[0];
		myform.onsubmit=function() {
			var myresult=new NodeMale();
			var thisParent=thisNode.parentNode;
			var myadded=function(){
				if (myresult.extra && myresult.extra.error===true) {
					myerroralert.properties.alertmsg="Error adding node"
					myerroralert.properties.timeout=2000;
					myerroralert.showalert();
					return false;
				}
				var addelement=loadcandidatesnode.children[myform.getElementsByTagName("select")[0].selectedIndex];
				if (!thisNode.properties.id) thisParent.children=[];
				else addelement.sort_order=thisNode.sort_order+1;
				thisParent.addChild(addelement);
				thisParent.refreshChildrenView();
			}
			myresult.loadfromhttp(this, myadded);
			myalert.parentElement.removeChild(myalert);
			return false;
		};
		var loadedreloptp=function(){
			loadcandidatesnode.childTp=loadcandidatesnode.xmlTp;
			if (thisNode.parentNode.properties.parentunique!=0) var parameters={action: "load unlinked"};
			else var parameters={action: "load all"};
			loadcandidatesform.elements.parameters.value=JSON.stringify(parameters);
			var loadedrows=function() {
				loadcandidatesnode.childContainer=myalert.getElementsByTagName("select")[0];
				loadcandidatesnode.refreshChildrenView();
				document.body.appendChild(myalert);
				myalert.style.display="block";
			}
			loadcandidatesnode.loadfromhttp(loadcandidatesform,loadedrows);
		}
		loadcandidatesnode.getTp("includes/templates/reloption.php", loadedreloptp);
		myform.elements.exit.onclick=function(){
			myalert.parentElement.removeChild(myalert);
		}
		return false;
	}
'>
	<form action="dbrequesttbrecords.php" style="display:none">
		<input type="hidden" name="json" data-js='
			var myparentdata=new NodeFemale();
			myparentdata.loadasc(thisNode.parentNode, 1);
			thisElement.value=JSON.stringify(myparentdata);
		'/>
		<input type="hidden" name="parameters"/>
	</form>
	<img src="includes/css/images/plusrel.png"/>
	<div class="alert" style="display:none">
		<p>The list of candidates is printed below</p>
		<form action="dbrequest.php">
			<select name="id"></select>
			<input type="hidden" name="json" data-js='
				var mydata=new NodeMale();
				mydata.parentNode=new NodeFemale();
				mydata.parentNode.loadasc(thisNode.parentNode, 1);
				if (thisNode.sort_order) mydata.sort_order=thisNode.sort_order+1;
				thisElement.value=JSON.stringify(mydata);
			'/>
			<input type="hidden" name="parameters" value='{"action":"add mylink"}'/>
			<table class="mytable" style="margin-top:11px;">
				<tr>
					<td>
						<input type="button" value="Cancel" name="exit">
					</td>
					<td><input type="submit" value="Add element link"></td>
				</tr>
			</table>
		</form>
	</div>
</a>