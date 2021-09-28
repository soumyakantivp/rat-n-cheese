# This is an attempt to implement Q-learning using simple Bellman equation 
in a deterministic environment. 

# open index.html
step 1--> click learn
step 2--> click solve

//manual mode was used for debugging

in the HTML:
<button id="learn" onclick="startLearning(1000)">learn</button> 

***the rat solves the maze 1000 times to calculate the Q values.***
_______________________________________________________________________
<button id="solve" onclick="solveAI(12)">solve</button>

***solves the maze using calculated Q values starting at box 12.***
_______________________________________________________________________

cheese: reward = 1
snake: reward = -1

class State{
    //reward 1 for cheese and -1 for snake
    //Qvalue is an array [0,1,2,3] of size 4
    //1-left 2-right 3-up 4-down
    
    constructor(reward, Qvalues, dirIndex, isBlock){
        this.reward = reward;
        this.Qvalues = Qvalues;//[left, right, up, down]
        this.dirIndex = dirIndex; // max Qvalue index
        this.isBlock = isBlock;
    }
}
***********************************************************************
