
//global variables
var stateArray = [];
var currentpos;
var left = [];
var right = [];
var up = [];
var down = [];
var df = 0.9; //discount factor
var snakeIndex = 8;
var cheeseIndex = 1;
var tileIndex = 5;
//global variables end

class State{
    //reward 1 for cheese and -1 for snake
    //Qvalue is an array [0,1,2,3] of size 4
    //1-left 2-right 3-up 4-down
    //
    constructor(reward, Qvalues, dirIndex, isBlock){
        this.reward = reward;
        this.Qvalues = Qvalues;//[left, right, up, down]
        this.dirIndex = dirIndex; // max Qvalue index
        this.isBlock = isBlock;
    }
}

//defines the maze in an array of size n x m
function initializeEnvironment(){
    left = [1,4,7,10];
    right = [3,6,9,12];
    up = [1,2,3];
    down = [10,11,12];

    for(i=0; i<12; i++){
        var array = [0, 0, 0, 0];
        stateArray[i] = new State(-0.1,array,0,false);
    }
    stateArray[snakeIndex-1].reward = -1; // snake
    stateArray[cheeseIndex-1].reward = 1; // cheese
    stateArray[tileIndex-1].isBlock = true; // block
}

// getX() and getY() returns the co-ordinates
// of the board with the square value as input
// (as set in HTML)
function getX(n){
    var val = n%3;
    if(val == 1)
    return 63.33;
    else if(val == 2)
    return 63.33+126.66;
    else if(val == 0)
    return 63.33+126.66+126.66;
}
function getY(n){
    var val = (n-1)/3;
    if(val < 1)
    return 0;
    else if(val < 2)
    return 85;
    else if(val < 3)
    return 85*2;
    else if(val < 4)
    return 85*3;
}

//positions rat at square n
function positionRat(n){
    var rat = document.getElementById("rat");
    rat.style.left = getX(n)+"px";
    rat.style.top = getY(n)+"px";
    rat.style.transform = "translate(-50%,0)";
}

// moves rat from initial position pos in direction dir
function move(dir){
    //console.log("in");
    var rat = document.getElementById("rat");
    if(dir === "left" && !left.includes(currentpos) && !stateArray[currentpos-2].isBlock){
        rat.style.left = getX(currentpos-1)+"px";
        rat.style.top = getY(currentpos-1)+"px";
        updateStates(currentpos, currentpos-1, dir);
        currentpos = currentpos-1;
    }
    else if(dir === "right" && !right.includes(currentpos) && !stateArray[currentpos].isBlock){
        rat.style.left = getX(currentpos+1)+"px";
        rat.style.top = getY(currentpos+1)+"px";
        updateStates(currentpos, currentpos+1, dir);
        currentpos = currentpos+1;
    }
    else if(dir === "up" && !up.includes(currentpos) && !stateArray[currentpos-4].isBlock){
        rat.style.left = getX(currentpos-3)+"px";
        rat.style.top = getY(currentpos-3)+"px";
        updateStates(currentpos, currentpos-3, dir);
        currentpos = currentpos-3;
    }
    else if(dir === "down" && !down.includes(currentpos) && !stateArray[currentpos+2].isBlock){
        rat.style.left = getX(currentpos+3)+"px";
        rat.style.top = getY(currentpos+3)+"px";
        updateStates(currentpos, currentpos+3, dir);
        currentpos = currentpos+3;
    }
    else{
        updateStates(currentpos, currentpos, dir);
    }
}

//is game over?
function isGameOver(){
    if(currentpos === cheeseIndex || currentpos === snakeIndex)
        return true;
    return false;
}

//get index left-0, right-1, up-2, down-3
function getIndex(dir){
    if(dir === "left")
        return 0;
    else if(dir === "right")
        return 1;
    else if(dir === "up")
        return 2;
    else if(dir === "down")
        return 3;
    else
        console.log("invalid direction");
}

//get move -->inverse of getIndex(dir)
function getMove(index){
    if(index === 0)
        return "left";
    else if(index === 1)
        return "right";
    else if(index === 2)
        return "up";
    else if(index === 3)
        return "down";
    else
        console.log("invalid move");
}
// autoPlay
function autoPlay(callback){
    moves = ["left", "right", "up", "down"];
    var gameLoop = setInterval(function(){ 
        var r = Math.floor(Math.random() * 4);
        console.log(moves[r]);
        move(moves[r]);
        if(isGameOver()){
            clearInterval(gameLoop);
            callback();
        }       
    }, 10);
    
}

// let the agent learn : n-> number of iterations
function startLearning(n){
    currentpos = 10;   // starts at square 10 
    initializeEnvironment();
    positionRat(currentpos);
    
    for(i=0; i<n; i++){
        autoPlay(function() {
            console.log("over______________________________________________");
            currentpos = 10;
            positionRat(currentpos);
            console.log("test"+stateArray[0].Qvalues);
        });       
    }
    
}

//after learning use solve to see the policy developed by learning
function solveAI(start){
    currentpos = start;   // starts at square 10 
    positionRat(currentpos);

    var solveLoop = setInterval(function(){ 
        var dir = getMove(stateArray[currentpos-1].dirIndex);
        move(dir);
        console.log(stateArray[currentpos-1].dirIndex);
        if(isGameOver()){
            clearInterval(solveLoop);
        }
    }, 500);
}

//function max
function max(currentPos, arr){
    var i =0;
    var max = arr[i];
    stateArray[currentPos-1].dirIndex = i;
    for(i=1 ;i<arr.length; i++){
        if(parseFloat(max) < parseFloat(arr[i])){
            max = arr[i];
            stateArray[currentPos-1].dirIndex = i;  
        }       
    }
    
    return max;
}


//update stateArray
function updateStates(currentPos, newPos, dir){
    var V = max(currentPos, stateArray[newPos-1].Qvalues);
    var Q = stateArray[newPos-1].reward + df*V;
    Q = Q.toFixed(2);
    stateArray[currentPos-1].Qvalues[getIndex(dir)] = Q;
    //console.log(max(stateArray[newPos-1].Qvalues));
    //console.log(currentPos+" "+newPos+" "+dir+" "+stateArray[currentPos-1].Qvalues+" "+stateArray[newPos-1].Qvalues);
    var sq = document.getElementById(currentPos);
    //sq.innerHTML = max(currentPos, stateArray[currentPos-1].Qvalues)+" | ";
    //sq.innerHTML += stateArray[currentPos-1].Qvalues;
}

//manual 
function manual(){
    currentpos = 10;   // starts at square 10 
    initializeEnvironment();
    positionRat(currentpos);
    
    var left = document.getElementById("left");
    var right = document.getElementById("right");
    var up = document.getElementById("up");
    var down = document.getElementById("down");

    left.addEventListener("click", function(){
        move("left");
        console.log(JSON.stringify(stateArray));
    });
    right.addEventListener("click", function(){
        move("right");
        console.log(JSON.stringify(stateArray));
    });
    up.addEventListener("click", function(){
        move("up");
        console.log(JSON.stringify(stateArray));
    });
    down.addEventListener("click", function(){
        move("down");
        console.log(JSON.stringify(stateArray));
    });
}