javascript:(function(){	
	function checkNodes(node, regex, numberOfMatches = 0)
	{
		var numberOfNewMatches = 0;
		if(node.data !== undefined)
		{
			var nodeData = regexReplace(regex, node.data);
			node.data = nodeData.newData;
			numberOfNewMatches += nodeData.numberOfMatches;
		}
		if(node.tagName !== "SCRIPT" && node.tagName !== "STYLE" && node.childNodes !== undefined)
		{
			for(var a = 0; a < node.childNodes.length; a++)
				numberOfMatches += checkNodes(node.childNodes[a], regex);
		}
		return numberOfNewMatches + numberOfMatches;
	}
	
	function checkForNestedTags(str) 
	{
		var count = 0;
		for(var a = 0; a < str.length; a++)
		{
			if(str[a] === "<")
				count++;
			if(str[a] === ">")
				count--;
			if(count >= 2)
				return true;
		}
		return false;
	}
	
	function removeOne(str)
	{
		var count = 0;
		var indexes = [];
		for(var a = 0; a < str.length; a++)
		{
			if(str[a] === "<")
				count++;
			if(count === 2)
				indexes.push(a);
			if(str[a] === ">" && count === 1)
				count--;
			if(str[a] === ">" && count === 2)
			{
				indexes.push(a + 1);
				return str.slice(0, indexes[0]) + str.slice(indexes[indexes.length - 1], str.length);
			}
		}
	}
	
	function regexReplace(regex, string)
	{
		var newString = string;
		var matches = string.match(regex);
		if(matches === null)
			return {newData: string, numberOfMatches: 0};
		var unfilteredMatchesLength = matches.length;
		matches = matches.filter(function(item, pos, self) {
			return self.indexOf(item) == pos;
		});
		for(var a = 0; a < matches.length; a++)
			newString = newString.replace(new RegExp(matches[a], "g"), "<span class='highlight'>" + matches[a] + "<span id='filler'></span></span>");
		while(checkForNestedTags(newString))
		{
			var newNewString = removeOne(newString);
			if(newNewString !== undefined)
				newString = newNewString;
		}
		return {newData: newString, numberOfMatches: unfilteredMatchesLength};
	}
	
	function searchWithRegex()
	{
		var regex = new RegExp(prompt("Enter the regular expression. Cancel to remove current highlighting. Leave the field blank to exit."), "g");
		var replace = true;
		var numberOfMatches = 0;
		if(regex.toString() === "/null/g")
			replace = false;
		if(replace)
			document.body.innerHTML = document.body.innerHTML.replace(/<span class="highlight">|<span class="filler"><\/span><\/span>|<style>.highlight{background-color:yellow;}<\/style>/g, "");
		if(regex.toString() === "/(?:)/g")
			replace = false;
		if(replace)
		{
			numberOfMatches = checkNodes(document, regex);
		
			if(numberOfMatches !== 0)
			{
				var HTML = document.body.innerHTML;
				HTML = HTML.replace(/&lt;/g, "<");
				HTML = HTML.replace(/&gt;/g, ">");
				HTML += "<style>.highlight{background-color:yellow;color:black;}</style>";
				document.body.innerHTML = HTML;
			}
		
			if(numberOfMatches === 1)
				alert("1 match found");
			else
				alert(numberOfMatches.toString() + " matches found");
		}
	}
	
	confirm("Pressing the Ctrl + Shift + F keys together will pull up a search prompt");
	var keys = {ctrl: false, shift: false}; 
	
	window.addEventListener("keyup", function(e){
		if(e.keyCode === 16)
			keys.shift = false;
		if(e.keyCode === 17)
			keys.ctrl = false;
	});
	
	window.addEventListener("keydown", function(e) {
		if(e.keyCode === 16)
			keys.shift = true;
		if(e.keyCode === 17)
			keys.ctrl = true;
		if(e.keyCode === 70 && keys.shift && keys.ctrl)
		{
			searchWithRegex();
			keys.shift = false;
			keys.ctrl = false;
		}
	});
})();