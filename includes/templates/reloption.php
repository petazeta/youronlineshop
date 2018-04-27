<option data-js='
	var fields=[];
	for(var i=0; i<thisNode.parentNode.childtablekeys.length; i++) {
		key=thisNode.parentNode.childtablekeys[i];
		if(thisNode.hasOwnProperty(key)) {
			if (typeof thisNode[key] == "object") continue;
			if (typeof thisNode[key] == "function") continue;
			fields.push(key + ": " + thisNode[key]);
		}
	}
	thisElement.value=thisNode.id;
	thisElement.innerHTML=fields.join();
'>
</option>