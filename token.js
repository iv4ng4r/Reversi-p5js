function Token(i,j,team){
	this.team = team;
	//True-> Blanca, False -> Negra
	this.i = i;
	this.j = j;
	this.x = i*len;
	this.y = j*len;
	this.tam = 40;
	this.valid = false;
	
	this.show = function(valid){
			if(this.valid) 	fill(255);
			else			fill(150)
			stroke(0)
			rect(this.x, this.y, len, len)
			if(this.team != EMPTY){
				fill(this.team.color);
				ellipse(this.x+len/2, this.y+len/2, this.tam, this.tam)
			}
	}
}