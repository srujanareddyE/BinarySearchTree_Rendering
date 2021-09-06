var queueIndex = 0;
var nextPick, latest, root;
var animationStarted = false;
var brightColorAlpha = '789ABCDEF';
var arr = [];
var portal = 650;

window.onkeydown = function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code === 32) {
	    if(arr.length > 200){
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
	
	while(true){
		var id = Math.floor((Math.random() * 201) + 1)-100;
		elem = document.getElementById(id);
		if(elem === null){
			break;
		}
	}
	arr.push(id);
	div.id = id;
	div2.innerHTML = id;
	
	var iterate = nextPick;
	while(iterate !== undefined){
		var elem = document.getElementById(iterate);
		elem.style.left = (parseInt(elem.style.left,10)+50) + "px";
		iterate = elem.prev;
	}
	
	//div.style.left = queueIndex*50 + "px";
	if(nextPick === null || nextPick === undefined){
		nextPick = id;
		latest = id;
	} else {
		var elem = document.getElementById(latest);
		elem.prev = id;
		latest = id;
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
    var elem = document.getElementById(nextPick);
	if(root === undefined){
		root = nextPick;
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
	if(parseInt(elem.id) > nextPick){
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
	var nextPickElem = document.getElementById(nextPick);
	elem.leftChild = nextPick;
	nextPickElem.level = elem.level+1;
	move(elem.level+1,parseInt(elem.style.left,10)-portal/(2*Math.pow(2,elem.level)));
}
function addRightChild(elem){
    var nextPickElem = document.getElementById(nextPick);
	elem.rightChild = nextPick;
	nextPickElem.level = elem.level+1;
	move(elem.level+1,parseInt(elem.style.left,10)+portal/(2*Math.pow(2,elem.level)));
}
function move(level,left2){
	let top2 = 60+level*33;
	let id = null;	  
	var elem = document.getElementById(nextPick);
	left1 = parseInt(elem.style.left,10);
	top1 = parseInt(elem.style.top,10);
	clearInterval(id);
	id = setInterval(frame, 20);

	function frame() {
	    let left = parseInt(elem.style.left,10);
		let top = parseInt(elem.style.top,10);
	    if (Math.abs(top2 - top) < (top2-top1)/10  
		 || Math.abs(left2 - left) < (left2-left1)/10) {
	      clearInterval(id);
		  var elem3 = document.getElementById(nextPick);
		  nextPick = elem3.prev;
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
		var elem3 = document.getElementById(nextPick);
		nextPick = elem3.prev;
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
function myMove() {
  let id = null;
  const elem = document.getElementById("animate");   
  let pos = 0;
  clearInterval(id);
  id = setInterval(frame, 5);
  function frame() {
    if (pos == 350) {
      clearInterval(id);
    } else {
      pos++; 
      elem.style.top = pos + "px"; 
      elem.style.left = pos + "px"; 
    }
  }
}