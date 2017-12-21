
String.prototype.findAll = function (str) {
	var rs = [];
	for (var i = 0; i <= this.length - str.length; i++) {
		if (this.substring(i,i+str.length) == str) {
			rs.push(i);
		}
	}
	return rs
}

String.prototype.firstAfter = function (i_,str) {
	for (var i = i_; i <= this.length - str.length; i++) {
		if (this.substring(i,i+str.length) == str) {
			return i;
		}
	}
} 
String.prototype.nthAfter = function (i_,str,n) {
	if (!n) n = 1;
	var count = 0; 
	for (var i = i_; i <= this.length - str.length; i++) {
		if (this.substring(i,i+str.length) == str) {
			count++
		}
		if (count == n) {
			return i;
		}
	}
} 

String.prototype.findPair = function (i_,start,end) {
	var count = 0;
	for (var i = i_; i <= this.length - end.length; i++) {
		if (this.substring(i,i+start.length) == start) {
			count++
		} else if (this.substring(i,i+end.length) == end) {
			count--
			if (count == 0) {
				return i;
			}
		}
	}
	return -1;
}

String.prototype.only = function (charset) {
	for (var i = 0; i < this.length; i++) {
		if (charset.indexOf(this.charAt(i)) == -1) return false;
	}
	return true;
}

String.prototype.remove = function (charset) {
	var r = "";
	for (var i = 0; i < this.length; i++) {
		if (charset.indexOf(this.charAt(i)) == -1) r+=this[i];
	}
	return r;
}

String.prototype.overwrite = function (str, start, end) {
	var r = this;
	for (var i = start; i < end; i++) {
		r = r.substring(0,i) + str.charAt((i-start)%str.length) + r.substring(i+1)
	}
	return r;
}

String.prototype.starts = function (str) {
	if (this.substring(0,str.length) == str) {
		return true;
	}
	return false;
}

String.prototype.ends = function (str) {
	if (this.substring(this.length-str.length) == str) {
		return true;
	}
	return false;
}

String.prototype.fish = function (str) {
	var r = this + str;
	for (var i = 0; i < r.length; i++) {
		if (r.substring(i).starts(str)) {
			return r.substring(0,i)
		}
	}
	return "";
}