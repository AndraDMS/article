
var opPriori = [["^","l"],["*","/"],["+","-"],["==","!=","<",">","<=",">="],["&&","||","X|"],["§"]]

function findTreeElem(v,arr) {
	var rs = [];
	for (var i = 0; i < arr.length; i++) {
		if (typeof arr[i] == "object") {
			var ret = findTreeElem(v,arr[i])
			if (ret[0] != -1) {
				return [i].concat(findTreeElem(v,arr[i]));
			}
		} else {
			if (arr[i] == v) {
				return [i];
			}
		}
	}
	return [-1]
}

function evalStruct(txt_) {

	var txt = txt_.remove(" ")
	var openbras = txt.findAll("(");
	var closebras = txt.findAll(")")
	var pairs = [];
	for (var i = 0; i < openbras.length; i++) {
		pairs.push({open:openbras[i], close:findPair(openbras[i],openbras,closebras)})
	}

	for (var i = 0; i < pairs.length-1; i++) {
		//console.log(i,pairs)
		if (pairs[i].close > pairs[i+1].open) {
			if (pairs[i].close < pairs[i+1].close) {
				pairs = pairs.slice(0,i).concat(pairs.slice(i+1));
			} else if (pairs[i].close >= pairs[i+1].close) {
				pairs = pairs.slice(0,i+1).concat(pairs.slice(i+2));
			}
			if (i>=0) {i--}
		}
	}

	var preevals = []

	for (var i = 0; i < pairs.length; i++) {
		preevals.push(new preeval(txt.substring(pairs[i].open+1,pairs[i].close),pairs[i].open,pairs[i].close))
	}
	for (var i = 0; i < preevals.length; i++) {
		//console.log(i,txt, preevals[i].pos, preevals[i].end)
		txt = txt.overwrite(" ", preevals[i].pos, preevals[i].end+1 )
	}

	var possOps = ["^","l","*","/","+","-","==","!=","<",">","<=",">=","&&","||","X|"]
	var operators = [];

	for (var i = 0; i < txt.length; i++) {
		if (txt.charAt(i) != " ") {
			var longestOp = "";
			for (var j = 0; j < possOps.length; j++) {	
				if (txt.substring(i).starts(possOps[j])) {
					if (longestOp.length < possOps[j].length) {
						longestOp = possOps[j]
					}
				}
			}
			if (longestOp != "") {
				operators.push({
					value:longestOp,
					pos:i,
					end:i+longestOp.length,
					type:"operator"
				})
			}
		}
	}
	for (var i = 0; i < operators.length; i++) {
		//console.log(i,txt, preevals[i].pos, preevals[i].end)
		txt = txt.overwrite(" ", operators[i].pos, operators[i].end )
	}

	var operands = [];

	for (var i = 0; i < txt.length; i++) {
		var fish = txt.substring(i).fish(" ")
		if (fish != "") {
			var val = parseFloat(fish)
			if (val || val == 0) {
				operands.push({
					value:val,
					pos:i,
					end:i+fish.length,
					type:"operand"
				})
				i+=fish.length-1
			} else if (fish == "e") {
				operands.push({
					value:Math.E,
					pos:i,
					end:i+fish.length,
					type:"operand"
				})
			} else if (fish == "p") {
				operands.push({
					value:Math.PI,
					pos:i,
					end:i+fish.length,
					type:"operand"
				})
			}
		}
	}

	var items = arrmerge(operators,operands,function(a,b){return a.pos<=b.pos}); 
	var items = arrmerge(items,preevals,function(a,b){return a.pos<=b.pos});
	//var operations = 
	//console.log(items)
	return items;
}

function preeval(txt,pos,end) {
	this.txt = txt;
	this.pos = pos;
	this.end = end;
	this.items = evalStruct(this.txt);
	this.type = "preeval";
	this.eval = function() {
		var loop = this.items.length
		for (var i = 0; i < loop; i++) {
			//.maxIndex(function(a,b){return findTreeElem(a,opPriori)[0]>findTreeElem(b,opPriori)[0]})
			//console.log(this.items)
			var itemsTemp = this.items.f(function (a) {
				if (a.type != "operator") {
					return {
						value:"§",
						pos:a.pos,
						end:a.end,
						type:"operator"
					}
				} else return a
			})
			var nextOp = itemsTemp.maxIndex(function(a,b){return findTreeElem(a.value,opPriori)[0]>findTreeElem(b.value,opPriori)[0]});
			if (itemsTemp[nextOp].value == "§") {
				return this.items[nextOp]
			}
			//console.log(this.items)
			this.items = this.items.slice(0,nextOp-1).concat([genericF(this.items[nextOp],this.items[nextOp-1],this.items[nextOp+1])].concat(this.items.slice(nextOp+2)));
		}
	}
}

function eval(txt) {
	return new preeval(txt,0,txt.length-1).eval().value
}

function genericF(f,arg1,arg2) {
	//console.log(f,arg1,arg2)
	var r = {
		pos:arg1.pos,
		end:arg2.end,
		type:"operand"
	}
	
	if (arg1.type == "preeval") {
		arg1 = arg1.eval();
	}
	if (arg2.type == "preeval") {
		arg2 = arg2.eval();
	}

	if (f.value == "^") {
		r.value = Math.pow(arg1.value,arg2.value);
		return r;
	} else if (f.value == "l") {
		r.value = Math.log(arg2.value)/Math.log(arg1.value);
		return r;
	} else if (f.value == "*") {
		r.value = arg1.value*arg2.value;
		return r;
	} else if (f.value == "/") {
		r.value = arg1.value/arg2.value;
		return r;
	} else if (f.value == "+") {
		r.value = arg1.value+arg2.value;
		return r;
	} else if (f.value == "-") {
		r.value = arg1.value-arg2.value;
		return r;
	} else if (f.value == "==") {
		r.value = arg1.value==arg2.value;
		return r;
	} else if (f.value == "!=") {
		r.value = arg1.value!=arg2.value;
		return r;
	} else if (f.value == ">=") {
		r.value = arg1.value>=arg2.value;
		return r;
	} else if (f.value == "<=") {
		r.value = arg1.value<=arg2.value;
		return r;
	} else if (f.value == ">") {
		r.value = arg1.value>arg2.value;
		return r;
	} else if (f.value == "<") {
		r.value = arg1.value<arg2.value;
		return r;
	} else if (f.value == "&&") {
		r.value = arg1.value&&arg2.value;
		return r;
	} else if (f.value == "||") {
		r.value = arg1.value||arg2.value;
		return r;
	} else if (f.value == "X|") {
		r.value = ((!arg1.value)&&arg2.value)||(arg1.value&&(!arg2.value));
		return r;
	}
}

/*preevals.push({
		txt:txt.substring(pairs[i].open+1,pairs[i].close),
		//value:preeval(this.txt),
		pos:pairs[i].open,
		end:pairs[i].close,
		type:"preeval"
	});
}
preevals.f(function (a) {
	a.items = evalStruct(a.txt);
	return a;
})*/