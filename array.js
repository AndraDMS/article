
function index_Of(arr,vr,func) {
  for (var i = 0; i < arr.length; i++) {
    if (vr == func(arr[i])) {
      return i;
    }
  }
  return -1
}

Array.prototype.indexOfFunc = function (vr, func) { // Finds first index of result after a function is applied
	if (func) {
	  	for (var i = 0; i < this.length; i++) {
	    	if (vr == func(this[i])) {
	      		return i;
	    	}
	  	}
  		return -1
	} else {
	  	for (var i = 0; i < this.length; i++) {
	    	if (vr == this[i]) {
	      		return i;
	    	}
	  	}
  		return -1
	}
}

Array.prototype.f = function (func) { // Applies a function to every element of an array
	var newarr = [];
	for (var i = 0; i < this.length; i++) {
		newarr[i] = func(this[i]);
	}
	return newarr
}

Array.prototype.toString = function () {
	var r = "";
	for (var i = 0; i < this.length; i++) {
		r += this[i];
	}
	return r;
}

Array.prototype.binSrch = function (v, fc, f) { // v = value to search for, f = function to apply to each item, fc = comparison function
	if (f == null) f = function (x) {return x};
	if (fc == null) fc = function (a,b) {return a>b};

	var lowb = 0;
	var upb = this.length;
	var middle = Math.floor((lowb+upb)/2);

	for (var i = 0; i < this.length; i++) {
		//console.log(middle,i);
		if (v == f(this[middle])) {
			return middle;
		} else if (fc(v,f(this[middle]))) {
			lowb = middle;
		} else {
			upb = middle;
		}
		middle = Math.floor((lowb+upb)/2);
	}

	return -1;

}

Array.prototype.randomise = function () {
  	var currarr = this;
  	var newarr = [];
  	for (var i = 0; i < this.length; i++) {
	    var r = Math.floor(Math.random()*currarr.length);
	    newarr.push(currarr[r]);
	    currarr = currarr.slice(0,r).concat(currarr.slice(r+1));
  	}
  	return newarr;
}

Array.prototype.concatStrs = function (str) {
	var r = "";
	for (var i = 0; i < this.length; i++) {
		r += this[i] + (i+1 == this.length?"":str);
	}
	return r;
}

Array.prototype.last = function () {
	return this[this.length-1];
}

Array.prototype.max = function (f) {
	if (!f) f = function(a,b) {return a<b}
	var m = this[0];
	for (var i = 1; i < this.length; i++) {
		if (f(m,this[i])) {
			m = this[i];
		}
	}
	return m;
}

Array.prototype.maxIndex = function (f) {
	if (!f) f = function(a,b) {return a<b}
	var m = 0;
	for (var i = 1; i < this.length; i++) {
		if (f(this[m],this[i])) {
			m = i;
		}
	}
	return m;
}

Array.prototype.min = function (f) {
	if (!f) f = function(a,b) {return a>b}
	var m = this[0];
	for (var i = 1; i < this.length; i++) {
		if (f(m,this[i])) {
			m = this[i];
		}
	}
	return m;
}

Array.prototype.satisfy = function(f, after) {
	var r = [];
	if (!after) after = 0;
	for (var i = after; i < this.length; i++) {
		if (f(this[i])) r.push(i);
	}
	return r;
}

Array.prototype.firstAfter = function(after, f) {
	if (!after) after = 0;
	for (var i = after; i < this.length; i++) {
		if (f(this[i])) return i;
	}
	return -1;
}

Array.prototype.firstBefore = function(before, f) {
	if (!before) before = this.length-1;
	for (var i = before; i >= 0; i--) {
		if (f(this[i])) return i;
	}
	return -1;
}

function arrmerge(arr1,arr2,f) {
	var rs = [];
	var len = arr1.length+arr2.length
	for (var i = 0; i < len; i++) {
		if (arr1.length == 0 && arr2.length == 0) {
			break;
		} else if (arr1.length == 0) {
			rs = rs.concat(arr2);
			break;
		} else if (arr2.length == 0) {
			rs = rs.concat(arr1);
			break;
		}
		else if (f(arr1[0],arr2[0]) || arr2.length == 0) {
			rs.push(arr1[0])
			arr1 = arr1.slice(1)
		} else {
			rs.push(arr2[0])
			arr2 = arr2.slice(1)
		}
	}
	return rs;
}