
var book = {};

function loadPages(t) {
	book = new elem(t,0,t.length);
	book.setType();
	book.setTypeId();
	book.setArgNo();
	book.setArgs();
	book.applyArgs();

	clearPages(book)
	printChapter(book,0)
	printNeeded(book,0,0)

}

function clearPages(book) {
	document.getElementById("wrap").innerHTML = "";
	for (var i = 0; i < book.children.length; i++) {
		var nextElem = document.createElement("DIV");
		nextElem.setAttribute("blockid",i)
		document.getElementById("wrap").appendChild(nextElem)

		book.children[i].generated = false;
		book.children[i].pageStart = 0;
		book.children[i].clientWidth = 0;
	}
}

function reprintPages(book) {
	for (var j = 0; j < book.children.length; j++) {
		printChapter(book, j)
	}
}

function printChapter(book, n) {
	//console.log(n)
	book.children[n].flood(0);
	var pages = book.children[n].allSplits();
	//console.log(pages.length,"pages")
	for (var i = 0; i < pages.length; i++) {
		document.getElementById("wrap").children[n].appendChild(pages[i].form());
	}
	book.children[n].generated = true;
	var addedWidth = window.innerHeight*parseFloat(document.getElementById("wrap").children[n].children[document.getElementById("wrap").children[n].children.length-1].style.marginBottom)/100
	book.children[n].clientWidth = document.getElementById("wrap").children[n].clientHeight + addedWidth;
	floodPageStarts(book)

}

function chaptersVisible(book,deltaY) {
	var generated = book.children.satisfy(function(a){return a.generated})
	if (generated.length == 0) printChapter(book,0);
	var onPage = {left:[],full:[],right:[]};
	var wrap = document.getElementById("wrap");
	for (var i = 0; i < generated.length; i++) {
		if (book.children[generated[i]].pageStart >= wrap.scrollTop + (deltaY<0?deltaY:0) && book.children[generated[i]].pageStart < wrap.scrollTop + wrap.clientHeight + (deltaY<0?0:(deltaY?deltaY:0))) onPage.full.push(generated[i]);
	}
	if (generated[0] < onPage.full[0] && book.children[onPage.full[0]].pageStart > wrap.scrollTop + (deltaY<0?deltaY:0)) {
		onPage.left = [generated[generated.indexOf(onPage.full[0])-1]];
	}
	if (onPage.full.length > 0) {
		if (book.children[onPage.full.last()].pageStart + book.children[onPage.full.last()].clientWidth > wrap.scrollTop + wrap.clientHeight + (deltaY<0?0:deltaY)) {
			onPage.right = [onPage.full.last()];
			onPage.full = onPage.full.slice(0,-1);
		}
	}
	//console.log(generated);
	return onPage;
}

function lookupNextChapterGen(book,deltaY,context) {
	var vis = chaptersVisible(book,deltaY);
	var toGenerate = {};
	//console.log(deltaY, vis.left[0], vis.full[0])
	if (context) toGenerate.context = context;
	else {	
		if (deltaY > 0) {
			toGenerate.context = (vis.left[0]?vis.left[0]:vis.full[0]);
			//console.log("before:",toGenerate)
		} else {
			toGenerate.context = vis.full.concat(vis.right)[0];
		}
	}
	//console.log(toGenerate)
	var visAll = vis.left.concat(vis.full).concat(vis.right); 

	if (!context) {
		if (vis.left[0] <= toGenerate.context - 2) { // If scrolling left, generate one before first block visible
			toGenerate.gen = toGenerate.context - 1;
			return toGenerate;
		}
	} else {
		var startFrom = visAll.indexOf(context);
		if (startFrom == -1) {
			startFrom = visAll.firstAfter(false,function (a) {return a>context});
		}
		for (var i = startFrom; i >= 1; i--) { // If scrolling left, generate one before context
			if (visAll[i-1] + 1 < visAll[i]) {
				toGenerate.gen = visAll[i] - 1;
				return toGenerate;
			}
		}
	}

	for (var i = 1; i < visAll.length; i++) { // If any gaps in existing blocks, generate first in gap
		if (visAll[i-1] + 1 < visAll[i]) {
			toGenerate.gen = visAll[i-1] + 1;
			return toGenerate;
		}
	}

	if (vis.left.length == 0 && deltaY < 0 && vis.full[0] > 0) { // If scrolling left at start, generate one before start if existing
		if (!book.children[vis.full[0]-1].generated) {
			toGenerate.gen = vis.full[0] - 1;
			return toGenerate;
		}
	};

	if (vis.right.length == 0 && deltaY > 0 && vis.full.last() < book.children.length - 1) { // If scrolling right at end, generate one after end if existing
		if (!book.children[vis.full.last() + 1].generated) {
			toGenerate.gen = vis.full.last() + 1;
			return toGenerate;
		}
	}; 

 	if (visAll.length > 0) {
		if (book.children[visAll.last()].clientWidth + book.children[visAll.last()].pageStart - document.getElementById("wrap").scrollTop < document.getElementById("wrap").clientHeight && visAll.last() < book.children.length - 1) {
			toGenerate.gen = visAll.last() + 1;
			return toGenerate;
		}
	}

	return -1

}

function floodPageStarts(book) {
	var generated = book.children.satisfy(function(a){return a.generated});

	book.children[generated[0]].pageStart = 0;
	var widthUpTo = book.children[generated[0]].clientWidth;
	for (var i = 1; i < generated.length; i++) {
		book.children[generated[i]].pageStart = widthUpTo;
		widthUpTo += book.children[generated[i]].clientWidth;
	}
}