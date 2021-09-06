var queueIndex = 0;
var latest, root;
var ongoingPick, nextPick;
var animationStarted = false;
var brightColorAlpha = '789ABCDEF';
var arr = [];
var portal = 650;
var maxLevel = 0;
var max = 100;
var min = -100;
var lock = false;
//var max = 100;
//var min = -100;
window.onkeydown = function (e) {
    
    var code = e.keyCode ? e.keyCode : e.which;
    if (code === 32) {
	    if(arr.length > (max-min)){
		   return;
	    }
        createNewNode();
    }
};
function getRandomColorForNode() {
	  var color = '#';
	  for (var i = 0; i < 6; i++) {
		color += brightColorAlpha[Math.floor(Math.random() * brightColorAlpha.length)];
	  }
	  return color;
	}

function createNewNode(){
	var div = document.createElement("div");
	div.classList.add("node");
	queueIndex++;
	div.style.left = "0px";
	div.style.top = "0px";
	div.style.backgroundColor = getRandomColorForNode();
	var div2 = document.createElement("div");
	div2.classList.add("text");
	var t;
	while(true){
		t = Math.floor((Math.random() * (max-min+1)) + 1)-(max-min)/2;
		elem = document.getElementById(t);
		if(elem === null){
			break;
		}
	}
	arr.push(t);
	div.id = t;
	div2.innerHTML = t;
	
	var iterate = nextPick;
	while(iterate !== undefined){
		var elem = document.getElementById(iterate);
		elem.style.left = (parseInt(elem.style.left,10)+50) + "px";
		iterate = elem.prev;
	}
	
	//div.style.left = queueIndex*50 + "px";
	if(nextPick === null || nextPick === undefined){
		nextPick = t;
		latest = t;
	} else {
		var elem = document.getElementById(latest);
		elem.prev = t;
		latest = t;
	}
	div.appendChild(div2);
	document.getElementById("main").appendChild(div);
	if(animationStarted	== false){
	    animationStarted = true;
		pickNextNode();
	}
}
function pickNextNode(){
    if(queueIndex == 0){
		return;
	}
	if(queueIndex > 1){
		console.log("testing");
	}
	ongoingPick = nextPick;
    var elem = document.getElementById(ongoingPick);
	nextPick = elem.prev;
	if(root === undefined){
		root = ongoingPick;
		var rootElem = document.getElementById(root);
		rootElem.level = 0;
		swap(elem, null);
	} else {
		var rootElem = document.getElementById(root);
		insertNode(rootElem);
	}
	queueIndex--;
}
function insertNode(elem){
	if(parseInt(elem.id) > ongoingPick){
		if(elem.leftChild === undefined){
			addLeftChild(elem);
		} else {
		   var leftChildElem = document.getElementById(elem.leftChild);
		   insertNode(leftChildElem);
		}
	} else {
	    if(elem.rightChild === undefined){
			addRightChild(elem);
		} else {
		   var rightChildElem = document.getElementById(elem.rightChild);
		   insertNode(rightChildElem);
		}
	}
}	
function addLeftChild(elem){
	var nextPickElem = document.getElementById(ongoingPick);
	elem.leftChild = ongoingPick;
	nextPickElem.parent = elem.id;
	nextPickElem.level = elem.level+1;
	if(maxLevel < elem.level+1){
		maxLevel = elem.level+1;
	}
	nextPickElem.classList.add("level-"+(elem.level+1));
	let parentLeft = parseInt(elem.style.left,10);
	let left = parentLeft-portal/(2*Math.pow(2,elem.level));
	if(parentLeft-left < 20){
		left = parentLeft - 20;
	}
	move(elem.level+1,left);
}
function addRightChild(elem){
    var nextPickElem = document.getElementById(ongoingPick);
	elem.rightChild = ongoingPick;
	nextPickElem.parent = elem.id;
	nextPickElem.level = elem.level+1;
	if(maxLevel < elem.level+1){
		maxLevel = elem.level+1;
	}
	nextPickElem.classList.add("level-"+(elem.level+1));
	let parentLeft = parseInt(elem.style.left,10);
	let left = parentLeft+portal/(2*Math.pow(2,elem.level));
	if(left - parentLeft < 20){
		left = parentLeft + 20;
	}
	move(elem.level+1,left);
}
function move(level,left2){
    /*let lines = document.getElementsByClassName("lines");
	for(let line of lines){
		line.style.border = '1px solid white !important';
		line.remove();
	}*/
	let top2 = 60+level*35;
	let g = null;	  
	var elem = document.getElementById(ongoingPick);
	left1 = parseInt(elem.style.left,10);
	top1 = parseInt(elem.style.top,10);
	clearInterval(g);
	g = setInterval(frame, 20);

	function frame() {
	    let left = parseInt(elem.style.left,10);
		let top = parseInt(elem.style.top,10);
	    if (Math.abs(top2 - top) < (top2-top1)/10  
		 || Math.abs(left2 - left) < (left2-left1)/10) {
	      clearInterval(g);
		  var elem3 = document.getElementById(ongoingPick);
		  drawLine(document.getElementById(elem3.parent), elem3);
		  adjustPositionsAllLevels();
		  ongoingPick = elem3.prev;
		  if(queueIndex > 0){
				pickNextNode();
			} else {
				animationStarted = false;
			}
	    } else {
	      left +=((left2-left1)/10);  
          elem.style.left = left + "px"; 
		  top +=((top2-top1)/10); 
          elem.style.top = top + "px";
	    }
	}

}
function swap(elem1, elem2){
	let id1 = null;	  
	clearInterval(id1);
	let left1, left2, top1, top2;
	left2 = parseInt(elem1.style.left,10);
	top2 = parseInt(elem1.style.top,10);
	if(elem2 === null){
		left1 = portal;
		top1 = 60;
	} else {
		left1 = parseInt(elem2.style.left,10);
		top1 = parseInt(elem2.style.top,10);
		id2 = setInterval(frame2, 5);
	}
	id1 = setInterval(frame1, 5);
	
	function frame1() {
	let left = parseInt(elem1.style.left,10);
	let top = parseInt(elem1.style.top,10);
    if (left == left1) {
	  if(top == top1) {
		clearInterval(id1);
		var elem3 = document.getElementById(ongoingPick);
		ongoingPick = elem3.prev;
			if(queueIndex > 0){
				pickNextNode();
			} else {
				animationStarted = false;
			}
	  } else {
       top +=((top1-top2)/10); 
       elem1.style.top = top + "px";
      }
    } else {
      left +=((left1-left2)/10);  
      elem1.style.left = left + "px"; 
    }
  }
}
function adjustPositionsAllLevels(){
	for(let l=maxLevel;l>0;l--){
		adjustPositions(l);
	}
	for(let l=maxLevel;l>0;l--){
		adjustPositions(l);
	}
	for(let l=maxLevel;l>0;l--){
		adjustPositions(l);
	}
}
function adjustPositions(level){
	let rowElems = document.getElementsByClassName("level-"+level);
	rowElems = [].slice.call(rowElems);
	for(let i=0;i<rowElems.length-1;i++){
		for(let j=i+1;j<rowElems.length;j++){
			if(parseInt(rowElems[i].id) > parseInt(rowElems[j].id)){
			    let temp = rowElems[i];
				rowElems[i] = rowElems[j];
				rowElems[j] = temp;
				/*let l1= parseInt(rowElems[i].style.left,10);
				let l2= parseInt(rowElems[j].style.left,10);
				if(Math.abs(l1-l2)<30){
					issueFound = true;
				}*/
			}
		}
	}
	for(let i=0; i<rowElems.length-1; i++){
		let l1= parseInt(rowElems[i].style.left,10);
		let l2= parseInt(rowElems[i+1].style.left,10);
		if(l1<0){
			l1=5;
			rowElems[i].style.left = "5px";
			var parent = document.getElementById(rowElems[i].parent);
			document.getElementById(parent.id+"-"+rowElems[i].id).remove();
			drawLine(parent,rowElems[i]);
		}
		if(l2<0){
			l2=5;
		}
		let diff = l2-l1;
		if(diff<32){
			rowElems[i+1].style.left = (32+l1)+"px";
			moveKids(rowElems[i+1], parseInt(rowElems[i+1].style.left,10)-l2);
			
			var parent = document.getElementById(rowElems[i+1].parent);
			document.getElementById(parent.id+"-"+rowElems[i+1].id).remove();
			moveParent(parent,rowElems[i+1].id);
			drawLine(parent,rowElems[i+1]);
			
		}
	}
	//drawVertices(document.getElementById(root));
}
function moveKids(node, additional){
	if(node.leftChild){
		let lc = document.getElementById(node.leftChild);
		let prev = parseInt(lc.style.left,10);
		lc.style.left = (prev+additional)+"px";
		document.getElementById(node.id+"-"+lc.id).remove();
		drawLine(node,lc);
		moveKids(lc, additional);
	}
	
	if(node.rightChild){
		let rc = document.getElementById(node.rightChild);
		let prev = parseInt(rc.style.left,10);
		rc.style.left = (prev+additional)+"px";
		document.getElementById(node.id+"-"+rc.id).remove();
		drawLine(node,rc);
		moveKids(rc, additional);
	}
}
function moveParent(parent, child){  
    
	let leftChild = document.getElementById(parent.leftChild);
	let rightChild = document.getElementById(parent.rightChild);
	
	let left, right;
	if(leftChild){
	 left = parseInt(leftChild.style.left,10);
	}
	if(rightChild){
	 right = parseInt(rightChild.style.left,10);
	}
	if(!left){
	 left = right-70;
	}
	if(!right){
	 right = left+70;
	}
	parent.style.left = ((left+right)/2)+"px";
	
	if(parent.leftChild == child && parent.rightChild){
		document.getElementById(parent.id+"-"+parent.rightChild).remove();
		drawLine(parent,document.getElementById(parent.rightChild));
	} else if(parent.rightChild == child && parent.leftChild){
		document.getElementById(parent.id+"-"+parent.leftChild).remove();
		drawLine(parent,document.getElementById(parent.leftChild));
	}
	let superParent = document.getElementById(parent.parent);
	if(superParent){
	 document.getElementById(superParent.id+"-"+parent.id).remove();
	 moveParent(superParent, parent.id);
	 drawLine(superParent,parent);
	}
}
function drawVertices(node){
	if(node.leftChild !== undefined){
	    let leftChildElem = document.getElementById(node.leftChild);
		drawLine(node, leftChildElem);
		drawVertices(leftChildElem);
	}
	if(node.rightChild != undefined){
		let rightChildElem = document.getElementById(node.rightChild);
		drawLine(node, rightChildElem);
		drawVertices(rightChildElem);
	}
}
function drawLine(node1, node2){
	
	document.body.appendChild(createLine(15+parseInt(node1.style.left,10),
	           15+parseInt(node1.style.top,10),
			   15+parseInt(node2.style.left,10),
	           15+parseInt(node2.style.top,10),
			   node1.id+"-"+node2.id
	           ));	   
}
function createLineElement(x, y, length, angle, id) {
    var line = document.createElement("div");
	line.classList.add("lines");
	line.id = id;
    var styles = 'border: 1px solid black; '
               + 'width: ' + length + 'px; '
               + 'height: 0px; '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'position: absolute; '
			   + 'z-index: -50; '
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; ';
    line.setAttribute('style', styles);  
    return line;
}

function createLine(x1, y1, x2, y2, id) {
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha, id);
}