
function findPair(i_,starts,ends) {
	for (var i = 0; i < starts.length; i++) {
		if (starts[i] >= i_) {
			starts = starts.slice(i,starts.length);
			break;
		}
	}
	for (var i = 0; i < ends.length; i++) {
		if (ends[i] >= i_) {
			ends = ends.slice(i,ends.length);
			break;
		}
	}
	if (starts[starts.length-1] < i_) {
		starts = [];
	}
	if (ends[ends.length-1] < i_) {
		ends = [];
	}
	var count = 0
	var l = ends.length + starts.length;
	for (var i = 0; i <= l; i++) {
		//console.log(count, starts[0], ends[0])
		if (ends[0] == undefined && starts[0] == undefined) {
			return -1
		} else if (starts[0] <= ends[0] || ends[0] == undefined) {
			count++;
			starts = starts.slice(1,starts.length);
		} else if (starts[0] > ends[0] || starts[0] == undefined) {
			count--;
			if (count == 0) {
				return ends[0]
			}
			ends = ends.slice(1,ends.length);
		}
	}
	return -1;
}

function findPairN(i_,starts,ends,n) {
	for (var i = 0; i < n; i++) {
		var next = findPair(i_+1,starts,ends)
		if (next == -1) {
			return -1
		}
		i_ = next;
	}
	return i_
}