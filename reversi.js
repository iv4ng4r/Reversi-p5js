WHITE = {color: 255, think: undefined}
BLACK = {color: 0, think: undefined}
EMPTY = undefined

//tweaks
enable_ia = false


turn = WHITE //starting color

//score
white_score = 2
black_score = 2
board = []

//styles
white_border = '5px solid white'
black_border = '5px solid black'

white_score_border = '1px solid white'
black_score_border = '1px solid black'


//todo
//
//rule: you can move only if you score, movements that dont trap opps pieces are invalid. if you cant score, you pass until you can or game ends=board filled.


function setup(){
	prnt = document.getElementById('cnv')
	var width = prnt.offsetWidth-2
	var height = prnt.offsetHeight-2
	c = createCanvas(width, height);
	c.parent('cnv');
	background(50);
	len = 50;
	cols = width/len
	rows = height/len
	//rows , cols must be even!!!
	
	setupBoard()
	showBoard()
	updateUI()

}
function setupBoard(){
	white_score = 2
	black_score = 2
	turn = WHITE
	board = []
	for(i = 0;i < cols;i++){
		board.push([])
		for(j = 0; j < rows; j++) board[i].push(new Token(i, j, EMPTY))
	}
	
	//setup init state
	hbr = floor((rows-1)/2)
	hbc = floor((cols-1)/2)
	board[hbr][hbc].team = WHITE
	board[hbr][hbc + 1].team = BLACK
	board[hbr + 1][hbc].team = BLACK
	board[hbr + 1][hbc + 1].team = WHITE
}

function updateUI(){
	document.getElementById('cnv').style.border = turn == WHITE ? white_border : black_border
	document.getElementById('whitescore').innerHTML = white_score
	document.getElementById('blackscore').innerHTML = black_score
	
	document.getElementById('whitediv').style.border = turn == WHITE ? white_score_border : 'none'; //indican el PROXIMO turno
	document.getElementById('blackdiv').style.border = turn == BLACK ? black_score_border : 'none';
}

//render
function showBoard(){

	ended = true
	for(row of board){
		for(piece of row){
			piece.valid = false
			valid = checkMovement(piece.i, piece.j)
			if(valid) piece.valid = true
			piece.show()
			if(piece.team == EMPTY) ended = false
		}
	}
	if(ended) endgame();
}
function mousePressed(){
	if (enable_ia){
		if (turn.think == undefined){
			i = Math.floor(mouseX / len)
			j = Math.floor(mouseY / len)
			movement(i, j)
		}else{alert("not your turn!!")}
	} else {
		i = Math.floor(mouseX / len)
		j = Math.floor(mouseY / len)
		if(board[i][j].valid) movement(i, j);
		else console.log('invalid: '+i+'-'+j);
	}
}
function movement(i, j){
		
		board[i][j].team = turn;
		flips = chainFlips(i, j, turn)
		
		white_score += (turn == WHITE) ? flips + 1 : -flips;
		black_score += (turn == BLACK) ? flips + 1 : -flips;
		
		showBoard()
		changeTurn()
		updateUI()
		

	}


function endgame(){
	if(white_score > black_score) alert("Whites won!");
	else if(black_score > white_score) alert("Blacks won!")
	else alert("Tie!")
	setupBoard()
	showBoard()
	updateUI()
}

function chainFlips(i, j, team){
	flips = 0
	//look left
	leftcell = undefined
	if(i > 0)
		for(a = i-1; a >= 0; a--){
			if(board[a][j].team == team) {leftcell = a; break}
			if(board[a][j].team == EMPTY) break;
		}
	//look right
	rightcell = undefined
	if(i < cols-1)
		for(a = i+1; a < cols; a++){
			if(board[a][j].team == team){rightcell = a; console.log('hit!'); break}
			if(board[a][j].team == EMPTY) break;
		}

	//look up
	upcell = undefined
	if(j > 0)
		for(a = j-1; a >= 0; a--){
			
			if(board[i][a].team == team){upcell = a; break}
			if(board[i][a].team == EMPTY) break;
		}
	//look down
	downcell = undefined
	if(j < rows-1)
		for(a = j+1; a < rows; a++){
			if(board[i][a].team == team){downcell = a; break}
			if(board[i][a].team == EMPTY) break;		
		}
	
	//DIAG SEARCH
	//look up-left
	upleftcell = undefined
	if (i > 0 && j > 0){
		a = i-1;
		b = j-1;
		while(a >= 0 && b >= 0){
			if(board[a][b].team == team){upleftcell = [a, b]; break}
			if(board[a][b].team == EMPTY) break;
			a--;
			b--;
		}
	}
	//look down-left
	downleftcell = undefined
	if (i > 0 && j < rows-1){
		a = i-1;
		b = j+1;
		while(a >= 0 && b < rows){
			if(board[a][b].team == team){downleftcell = [a, b]; break}
			if(board[a][b].team == EMPTY) break;
			a--;
			b++;
		}
	}
	//look up-right
	uprightcell = undefined
	if (i < cols-1 && j > 0){
		a = i+1;
		b = j-1;
		while(a < cols && b >= 0){
			if(board[a][b].team == team){uprightcell = [a, b]; break}
			if(board[a][b].team == EMPTY) break;
			a++;
			b--;
		}
	}
	//look down-right
	downrightcell = undefined
	if (i < cols-1 && j < rows-1){
		a = i+1;
		b = j+1;
		while(a < cols && b < rows){
			if(board[a][b].team == team){downrightcell = [a, b]; break}
			if(board[a][b].team == EMPTY) break;
			a++;
			b++;
		}
	}
	
	
	if(leftcell != undefined){
		for(b = i-1; b > leftcell; b--) {board[b][j].team = team; flips++}
	}
	if(rightcell != undefined){
		for(b = i+1; b < rightcell; b++) {board[b][j].team = team; flips++}
	}
	if(upcell != undefined){
		for(b = j-1; b > upcell; b--) {board[i][b].team = team; flips++}
	}
	if(downcell != undefined){
		for(b = j+1; b < downcell; b++) {board[i][b].team = team; flips++}
	}
	
	//DIAG FLIPS
	if(upleftcell != undefined){
		[a, b] = upleftcell
		x = i-1
		y = j-1
		console.log(x +' - '+y)
		while(x > a || y > b) {board[x][y].team = team; flips++; x--; y--;}
	}
	if(downleftcell != undefined){
		[a, b] = downleftcell
		x = i-1
		y = j+1
		console.log(x +' - '+y)
		while(x > a || y < b) {board[x][y].team = team; flips++; x--; y++;}
	}
	if(uprightcell != undefined){
		[a, b] = uprightcell
		x = i+1
		y = j-1
		console.log(x +' - '+y)
		while(x < a || y > b) {board[x][y].team = team; flips++; x++; y--;}
	}
	if(downrightcell != undefined){
		[a, b] = downrightcell
		x = i+1
		y = j+1
		console.log(x +' - '+y)
		while(x < a || y < b) {board[x][y].team = team; flips++; x++; y++;}
	}
	return flips
	

}
function checkMovement(x, y){ //returns 1 if valid, 0 if non-empty cell, -1 if no neighbors
	//EMPTY -> 0
	empty = true
	if(board[x][y].team != EMPTY) empty = false;
	
	//NO NEIGHBORS -> -1, if NEIGHBOR => VALID -> 1
	neighbors = false
	try{if(board[x-1][y+0].team != EMPTY) neighbors = true}catch(e){} //left
	try{if(board[x+1][y+0].team != EMPTY) neighbors = true}catch(e){} //right
	try{if(board[x+0][y+1].team != EMPTY) neighbors = true}catch(e){} //up
	try{if(board[x+0][y-1].team != EMPTY) neighbors = true}catch(e){} //down
	try{if(board[x-1][y+1].team != EMPTY) neighbors = true}catch(e){} //down left
	try{if(board[x+1][y+1].team != EMPTY) neighbors = true}catch(e){} //down right
	try{if(board[x-1][y-1].team != EMPTY) neighbors = true}catch(e){} //up left
	try{if(board[x+1][y-1].team != EMPTY) neighbors = true}catch(e){} //up right

	//MUST SCORE - todo
	
	return empty && neighbors
	
}
function changeTurn(){
	turn = (turn == WHITE) ? BLACK : WHITE
	document.getElementById('cnv').style.border = turn == WHITE ? white_border : black_border
	
	if (enable_ia & turn.think != undefined){
		[i, j] = turn.think()
		movement(i, j)
	}
}

function ia_think(){
	// ia algorithm
}