
function elem (txt, start, end, floodStart) {

	this.start = start;
	this.end = end;
	this.txt = txt;
	this.type = "txt";
	this.typeId = -1;
	this.argNo = 0;
	this.args = [];
	this.attr = {};
	this.children = [];

	this.floodStart = 0;
	this.floodLength = 0;

	this.setType = function() {
		var t = this.txt;
		var end = t.firstAfter(0,"{");
		this.type = t.substring(1,end);
	}

	this.setTypeId = function() {
		this.typeId = elemTypes.binSrch(this.type,function(a,b){return a>b},function(a){return a.type})
		if (this.typeId == -1) {
			this.typeId = elemTypes.binSrch("txt",function(a,b){return a>b},function(a){return a.type})
		}
	}

	this.setArgNo = function() {
		this.argNo = elemTypes[this.typeId].args;
	}

	this.setArgs = function() {
		var t = this.txt.substring(this.type.length+1);
		var args = [];

		var currPos = 0;
		var openCurls = t.findAll("{");
		var closeCurls = t.findAll("}");

		for (var i = 0; i < this.argNo; i++) {
			var nextStart = t.firstAfter(currPos,"{")
			var nextEnd = findPair(nextStart, openCurls, closeCurls);
			args.push(new elemArg(t.substring(nextStart+1,nextEnd),nextStart,nextEnd))
			currPos = nextEnd+1;
		}

		this.args = args;
	}

	this.applyArgs = function () {
		this.attrApplier = elemTypes[this.typeId].attrApplier;
		this.attrApplier();
	}

	this.attrApplier = function () {}

	this.setAttrs = function (n) {
		var attrJSON = "{"+this.args[n].txt+"}";
		var attrs = JSON.parse(attrJSON);
		Object.mergePres(attrs,elemTypes[this.typeId].attr)
		this.attr = attrs;
	}

	this.setChildren = function(n) {
		var t = this.args[n].txt;
		var slashes = t.findAll("/").f(function(a){return {slash:a, argStart:t.firstAfter(a,"{")}});
		slashes = slashes.f(function(a){
			a.type = t.substring(a.slash+1,a.argStart);
			return a;
		})
		slashes = slashes.filter(function (a) {
			return a.type.only("abcdefghijklmnopqrstuvwxyz")
		})

		var openCurls = t.findAll("{");
		var closeCurls = t.findAll("}");

		slashes = slashes.f(function(a) {
			var r = new elem("/" + a.type + "{", a.slash, a.slash+a.type.length+1);
			r.setType();
			r.setTypeId();
			r.setArgNo();
			//console.log(r.start,findPairN(r.start,openCurls,closeCurls,r.argNo))
			r.txt = t.substring(r.start,findPairN(r.start,openCurls,closeCurls,r.argNo)+1);
			r.end = r.start+r.txt.length-1;
			return r;
		})

		for (var i = 0; i < slashes.length-1; i++) {
			//console.log(i,slashes)
			if (slashes[i].end > slashes[i+1].start) {
				if (slashes[i].end < slashes[i+1].end) {
					slashes = slashes.slice(0,i).concat(slashes.slice(i+1));
				} else if (slashes[i].end >= slashes[i+1].end) {
					slashes = slashes.slice(0,i+1).concat(slashes.slice(i+2));
				}
				if (i>=0) {i--}
			}
		}

		slashes = slashes.f(function(a) {
			a.setArgs();
			a.applyArgs();
			return a;
		})

		var textChildren = [];
		var currPos = 0; 

		for (var i = 0; i <= slashes.length; i++) {
			if (slashes[i]) {
				var nextEnd = slashes[i].start
			} else {
				var nextEnd = t.length; 
			}
			var tempElem_ = new elem("/def{" + t.substring(currPos,nextEnd) + "}",currPos,nextEnd)
			tempElem_.setType();
			tempElem_.setTypeId();
			tempElem_.setArgNo();
			tempElem_.setArgs();
			tempElem_.applyArgs();
			textChildren.push(tempElem_)
			if (slashes[i]) currPos = slashes[i].end + 1
		}
		textChildren = textChildren.filter(function (a) {
			return !a.args[0].txt.only(" ")
		})

		this.children = arrmerge(slashes,textChildren,function(a,b){return a.start<=b.start});
	}

	this.raise = function (inherit) { // Supply inherited attributes to children
		Object.mergePres(this.attr,inherit)
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].raise(Object.clone(this.attr));
		}
	}

	this.flood = function (start) { // Find numbers of possible splits in all children
		this.floodStart = start;
		var currFloodLength = 0;
		if (this.attr.deplete == "element") {
			for (var i = 0; i < this.children.length; i++) {
				var add = this.children[i].flood(start);
			}
			this.floodLength = 1;
		} else {
			for (var i = 0; i < this.children.length; i++) {
				var add = this.children[i].flood(start+currFloodLength);
				currFloodLength += add;
			}
			this.floodLength = currFloodLength;
		}
		//console.log(currFloodLength)
		return this.floodLength;
	}

	this.split = function (n) {

		if (n == this.floodStart || n >= this.floodStart + this.floodLength) {
			return [this];
		}

		var splitChildNo = 0;
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].floodStart <= n && n < this.children[i].floodStart + this.children[i].floodLength) {
				//console.log(i)
				splitChildNo = i;
				break;
			}
		}
		var splitChild = this.children[splitChildNo].split(n);
		var returns = [Object.clone(this),Object.clone(this)];
		if (splitChild.length == 1) {
			//console.log(returns[0].children)
			returns[0].children = returns[0].children.slice(0,splitChildNo);
			returns[1].children = [splitChild[0]].concat(returns[1].children.slice(splitChildNo+1));
		} else if (splitChild.length == 2) {
			returns[0].children = returns[0].children.slice(0,splitChildNo).concat(splitChild[0]);
			returns[1].children = [splitChild[1]].concat(returns[1].children.slice(splitChildNo+1));
		}

		return returns;
	}

	this.form = function () {
		var r = this.formElement(this.attr);

		var attrs = Object.keys(this.attr)
		for (var i = 0; i < attrs.length; i++) {
			switch (attrs[i]) {
				case "fontStyle": 
					switch (this.attr[attrs[i]]) {
						case "normal": r.style.fontStyle = "normal"; break;
						case "italic": r.style.fontStyle = "italic"; break;
						case "oblique": r.style.fontStyle = "oblique"; break;
						default: r.style.fontStyle = "normal"; break;
					}
					break;
				case "padding": 
					var paddingVal = parseFloat(this.attr[attrs[i]]);
					if (paddingVal) {
						if (this.attr[attrs[i]].ends("vh")) r.style.padding = paddingVal+"vh";
						else if (this.attr[attrs[i]].ends("%")) r.style.padding = paddingVal+"%";
						else if (this.attr[attrs[i]].ends("px")) r.style.padding = paddingVal+"px";
						else r.style.padding = paddingVal+"vh";
					}
					else r.style.padding = "0vh";
					break;
			}
		}

		for (var i = 0; i < this.children.length; i++) {
			r.appendChild(this.children[i].form());
		}
		return this.finalAlterElement(r, this.attr);
	}

	this.formElement = function () {
		return document.createElement("DIV");
	}
	this.finalAlterElement = function(r) {
		return r;
	}

}

function elemArg(txt,start,end) {
	this.start = start;
	this.end = end;
	this.txt = txt;
} 

var elemTypes = [{
		type: "block", 
		args: 2,
		attrApplier: function() {
			this.setAttrs(0)
			this.setChildren(this.args.length-1);
			this.formElement = function (attrs) {
				var r = document.createElement("DIV");
				r.setAttribute("class","txtB")

				var attrsKeys = Object.keys(attrs)
				for (var i = 0; i < attrsKeys.length; i++) {
					switch (attrsKeys[i]) {
						case "width": 
							var widthVal = parseFloat(attrs[attrsKeys[i]]);
							r.style.width = (widthVal-5)+"vh";
							break;
					}
				}

				return r;
			}
			this.finalAlterElement = function(e, attrs) {
				var r = document.createElement("DIV");
				r.setAttribute("class","txtW")

				var attrsKeys = Object.keys(attrs)
				for (var i = 0; i < attrsKeys.length; i++) {
					switch (attrsKeys[i]) {
						case "width": 
							var widthVal = parseFloat(attrs[attrsKeys[i]]);
							r.style.width = widthVal+"vh";
							r.style.marginBottom = (widthVal-100)+"vh";
							r.style.transform = "translateX(" + -1*(widthVal-100)+ "vh) translateY(" + widthVal + "vh) rotate(90deg)";
							break;
					}
				}

				r.appendChild(e);
				return r;

			}
			this.splitTest = function(n) {
				document.getElementById("wrap_Test").innerHTML = "";
				document.getElementById("wrap_Test").appendChild(this.split(n)[0].form());
				return document.getElementById("wrap_Test").children[0].children[0].scrollHeight <= document.getElementById("wrap_Test").children[0].children[0].clientHeight;
			}

			this.bestSplit = function (start) { 
				if (this.splitTest(this.floodLength)) return this.floodLength;

				var lowb = (start?start:1);
				var upb = this.floodLength;
				var middle = Math.floor((lowb+upb)/2);

				for (var i = 0; i < this.floodLength; i++) {
					//console.log(middle,i);
					if (this.splitTest(middle)) {
						lowb = middle;
					} else {
						upb = middle;
					}
					middle = Math.floor((lowb+upb)/2);
					if (middle == lowb) break;
				}

				this.splitTest(middle)
				return middle;
			}

			this.allSplits = function () {

				var bestSplit = this.bestSplit();
				var splits = this.split(bestSplit)
				if (splits.length == 1) return splits;
				splits[1].flood(0);
				return [splits[0]].concat(splits[1].allSplits());

			}
		},
		attr: {
			width:"90"
		},
	},{
		type: "body",
		args: 2,
		attrApplier: function() {
			this.setAttrs(0)
			this.setChildren(this.args.length-1);
			this.raise(Object.mergePres(this.attr,defaultAttr));
			this.flood(0);
			this.formElement = function () {
				return document.createElement("DIV");
			}
		},
		attr: {
		},
	},{
		type: "def",
		args: 1,
		attrApplier: function() {
			this.flood = function (start) {
				this.floodStart = start;
				if (this.attr.deplete == "letter") this.floodLength = this.args[0].txt.length;
				else if (this.attr.deplete == "word") this.floodLength = this.args[0].txt.split(" ").filter(function (a) {return a!=""}).length;
				else if (this.attr.deplete == "element") this.floodLength = 0;
				//console.log(this.floodLength)
				return this.floodLength;
			}
			this.split = function (n) {

				if (n == this.floodStart) {
					return [this];
				}

				var returns = [Object.clone(this),Object.clone(this)];
				if (this.attr.deplete == "letter") {
					returns[0].args[0].txt = this.args[0].txt.substring(0,n-this.floodStart);
					returns[1].args[0].txt = this.args[0].txt.substring(n-this.floodStart);
				} else if (this.attr.deplete == "word") {
					var words = this.args[0].txt.split(" ").filter(function (a) {return a!=""})
					returns[0].args[0].txt = words.slice(0,n-this.floodStart).concatStrs(" ");
					returns[1].args[0].txt = words.slice(n-this.floodStart).concatStrs(" ");
				}

				return returns;
			}
			this.form = function () {
				return document.createTextNode(this.args[0].txt);
			}
		},
		attr: {
		},
	},{
		type: "span",
		args: 2,
		attrApplier: function() {
			this.setAttrs(0)
			this.setChildren(this.args.length-1);
			this.formElement = function () {
				return document.createElement("SPAN");
			}
		},
		attr: {
			padding:"0",
		},
	},{
		type: "txt",
		args: 2,
		attrApplier: function() {
			this.setAttrs(0)
			this.setChildren(this.args.length-1);
			this.formElement = function () {
				var r = document.createElement("DIV");
				r.setAttribute("class","txtE");
				return r;
			}
		},
		attr: {
			padding:"15px",
		},
	}]

var defaultAttr = {
	deplete:"word",
	fontStyle:"normal"
}
