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
var levelSpacing = 35;
var lock = false;
//let tempArray = [56,-90,43,-57,53,49,55,-89,23];
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
		//t = tempArray.shift();
		t = Math.floor((Math.random() * (max-min+1)) + 1)-(max-min)/2;
		elem = document.getElementById(t);
		if(elem === null){
			break;
		}
	}
	arr.push(t);
	div.id = t;
	div2.innerHTML = t;
	div.addEventListener('click', function (event) {
            deleteNode(t);
        });
	
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
	if(root === undefined || root === null){
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
function deleteNode(id){
	var nodeToDelete = document.getElementById(id);
	if(nodeToDelete.leftChild && nodeToDelete.rightChild){
		var leastInRightTree = document.getElementById(nodeToDelete.rightChild);
		while(leastInRightTree.leftChild){
			leastInRightTree = document.getElementById(leastInRightTree.leftChild);
		}
		swap(leastInRightTree, nodeToDelete);
		return;
	}
	var parent = null;
	if(nodeToDelete.parent){
		 parent = document.getElementById(nodeToDelete.parent);
	}
	if(!nodeToDelete.leftChild && !nodeToDelete.rightChild){
		if(parent){
			if(parent.leftChild == id){
				parent.leftChild = null;
			} else if(parent.rightChild == id){
			    parent.rightChild = null;
			}
		} else {
			root = null;
		}
	} else if(!nodeToDelete.leftChild || !nodeToDelete.rightChild) {
	    var child;
		if(!nodeToDelete.leftChild){
		 child = document.getElementById(nodeToDelete.rightChild);
		} else {
		 child = document.getElementById(nodeToDelete.leftChild);
		}
		if(parent){
		    if(parent.leftChild == id){
				parent.leftChild = child.id;
			} else {
				parent.rightChild = child.id;
			}
			child.parent = nodeToDelete.parent;
			document.getElementById(id+"_"+child.id).remove();
		} else {
			root = child.id;
			child.parent = null;
		}
		moveChildUp(child);
	} 
	
	nodeToDelete.remove();
	if(parent){
	  let y = document.getElementById(parent.id+"_"+id);
	  if(y){
	   y.remove();
	  }
	}
    const index = arr.indexOf(parseInt(id));
	if (index > -1) {
	  arr.splice(index, 1);
	}
    console.log(id+" deleted");    
}
function moveChildUp(node){
	let top = parseInt(node.style.top,10);
    node.level = node.level - 1;
	node.style.top = (top-levelSpacing)+"px";
	let oldChildLine = document.getElementById(node.parent+"_"+node.id);
	if(oldChildLine){
	  oldChildLine.remove();
	}
	drawLine(document.getElementById(node.parent), node);
	if(node.leftChild){
		moveChildUp(document.getElementById(node.leftChild));
	}
	if(node.rightChild){
		moveChildUp(document.getElementById(node.rightChild));
	}
}
function insertNode(elem){
	if(parseInt(elem.id) > ongoingPick){
		if(elem.leftChild === undefined || elem.leftChild === null){
			addLeftChild(elem);
		} else {
		   var leftChildElem = document.getElementById(elem.leftChild);
		   insertNode(leftChildElem);
		}
	} else {
	    if(elem.rightChild === undefined || elem.rightChild === null){
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
	let top2 = 60+level*levelSpacing;
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
	let todo = new Set();
	if(elem2 === null){
		left1 = portal;
		top1 = 60;
	} else {
		left1 = parseInt(elem2.style.left,10);
		top1 = parseInt(elem2.style.top,10);
		
		tparent = elem1.parent;
		tleftChild = elem1.leftChild;
		trightChild = elem1.rightChild;
		tlevel = elem1.level;
		
		if(elem1.parent){
			todo.add(document.getElementById(elem1.parent+"_"+elem1.id));
		}
		if(elem1.rightChild){
			todo.add(document.getElementById(elem1.id+"_"+elem1.rightChild));
		}
		if(elem1.leftChild){
			todo.add(document.getElementById(elem1.id+"_"+elem1.leftChild));
		}
		if(elem2.parent){
			todo.add(document.getElementById(elem2.parent+"_"+elem2.id));
		}
		if(elem2.rightChild){
			todo.add(document.getElementById(elem2.id+"_"+elem2.rightChild));
		}
		if(elem2.leftChild){
			todo.add(document.getElementById(elem2.id+"_"+elem2.leftChild));
		}
		
		if(elem1.parent){
		  if(elem1.parent != elem2.id){
			let parentNode = document.getElementById(elem1.parent);
			if(parentNode){
				if(parentNode.leftChild == elem1.id){
					parentNode.leftChild = elem2.id;
				} else if(parentNode.rightChild == elem1.id){
					parentNode.rightChild = elem2.id;
				}
			}
		  }
		}
		if(elem2.parent){
		   if(elem2.parent != elem1.id){
			let parentNode = document.getElementById(elem2.parent);
			if(parentNode){
				if(parentNode.leftChild == elem2.id){
					parentNode.leftChild = elem1.id;
				} else if(parentNode.rightChild == elem2.id){
					parentNode.rightChild = elem1.id;
				}
			}
		  }	
		}
		elem1.parent = elem2.parent;
		elem1.leftChild = elem2.leftChild;
		elem1.rightChild = elem2.rightChild;
		elem1.level = elem2.level;
		
		elem2.parent = tparent;
		elem2.leftChild = tleftChild;
		elem2.rightChild = trightChild;
		elem2.level = tlevel;
		
		if(elem1.leftChild == elem1.id){
			elem1.leftChild = elem2.id;
		}
		if(elem1.rightChild == elem1.id){
			elem1.rightChild = elem2.id;
		}
		if(elem1.parent == elem1.id){
			elem1.parent = elem2.id;
		}
		if(elem2.leftChild == elem2.id){
			elem2.leftChild = elem1.id;
		}
		if(elem2.rightChild == elem2.id){
			elem2.rightChild = elem1.id;
		}
		if(elem2.parent == elem2.id){
			elem2.parent = elem1.id;
		}
		id2 = setInterval(frame2, 20);
	}
	id1 = setInterval(frame1, 20);
	
	function frame1() {
	let left = parseInt(elem1.style.left,10);
	let top = parseInt(elem1.style.top,10);
    if (Math.abs(left1 - left) < Math.abs((left1-left2)/10) ) {
	  if(Math.abs(top1 - top) < Math.abs((top1-top2)/10)  ) {
		clearInterval(id1);
		var elem3 = document.getElementById(ongoingPick);
		if(elem3){
		  ongoingPick = elem3.prev;
		}
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
  function frame2() {
	let left = parseInt(elem2.style.left,10);
	let top = parseInt(elem2.style.top,10);
    if (Math.abs(left2 - left) < Math.abs((left2-left1)/10) ) {
	  if(Math.abs(top2 - top) < Math.abs((top2-top1)/10)  ) {
		clearInterval(id2);
		for (const item of todo) {
		    if(item){
				item.remove();
			}
		}
		let todo2 = new Set();
		if(elem1.parent){
		    if(!todo2.has(elem1.parent+"_"+elem1.id)){
			   drawLine(document.getElementById(elem1.parent),elem1);
			   todo2.add(elem1.parent+"_"+elem1.id);	
			}
		}
		if(elem1.rightChild){
		    if(!todo2.has(elem1.id+"_"+elem1.rightChild)){
				drawLine(elem1,document.getElementById(elem1.rightChild));
				todo2.add(elem1.id+"_"+elem1.rightChild);
			}
		}
		if(elem1.leftChild){
		    if(!todo2.has(elem1.id+"_"+elem1.leftChild)){
				drawLine(elem1,document.getElementById(elem1.leftChild));
				todo2.add(elem1.id+"_"+elem1.leftChild);
			}	
		}
		if(elem2.parent){
		   if(!todo2.has(elem2.parent+"_"+elem2.id)){
			drawLine(document.getElementById(elem2.parent),elem2);
			todo2.add(elem2.parent+"_"+elem2.parent);
		  }
		}
		if(elem2.rightChild){
		   if(!todo2.has(elem2.id+"_"+elem2.rightChild)){
			drawLine(elem2,document.getElementById(elem2.rightChild));
			todo2.add(elem2.id+"_"+elem2.rightChild);
		   }	
		}
		if(elem2.leftChild){
		   if(!todo2.has(elem2.id+"_"+elem2.leftChild)){
			drawLine(elem2,document.getElementById(elem2.leftChild));
			todo2.add(elem2.id+"_"+elem2.leftChild);
		   }	
		}
		
		deleteNode(elem2.id);
		//var elem3 = document.getElementById(ongoingPick);
		//ongoingPick = elem3.prev;
			/*if(queueIndex > 0){
				pickNextNode();
			} else {
				animationStarted = false;
			}*/
	  } else {
       top +=((top2-top1)/10); 
       elem2.style.top = top + "px";
      }
    } else {
      left +=((left2-left1)/10);  
      elem2.style.left = left + "px"; 
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
			document.getElementById(parent.id+"_"+rowElems[i].id).remove();
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
			document.getElementById(parent.id+"_"+rowElems[i+1].id).remove();
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
		document.getElementById(node.id+"_"+lc.id).remove();
		drawLine(node,lc);
		moveKids(lc, additional);
	}
	
	if(node.rightChild){
		let rc = document.getElementById(node.rightChild);
		let prev = parseInt(rc.style.left,10);
		rc.style.left = (prev+additional)+"px";
		document.getElementById(node.id+"_"+rc.id).remove();
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
		document.getElementById(parent.id+"_"+parent.rightChild).remove();
		drawLine(parent,document.getElementById(parent.rightChild));
	} else if(parent.rightChild == child && parent.leftChild){
		document.getElementById(parent.id+"_"+parent.leftChild).remove();
		drawLine(parent,document.getElementById(parent.leftChild));
	}
	let superParent = document.getElementById(parent.parent);
	if(superParent){
	 document.getElementById(superParent.id+"_"+parent.id).remove();
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
	if(node1 && node2){
	document.body.appendChild(createLine(15+parseInt(node1.style.left,10),
	           15+parseInt(node1.style.top,10),
			   15+parseInt(node2.style.left,10),
	           15+parseInt(node2.style.top,10),
			   node1.id+"_"+node2.id
	           ));	  
    }			   
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