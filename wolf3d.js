function toRadians (angle) {
  return angle * (Math.PI / 180);
}

//Canvas setup

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var CANVAS_WIDTH = canvas.width;
var CANVAS_HEIGHT = canvas.height;

//Map setup

var MAP_SIZE = 24;

var map = [

		1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,2,2,2,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1,
		1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,3,0,0,0,3,0,0,0,1,
		1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,4,0,0,0,0,5,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,4,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
		1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1


];

function getAt(column,row){

	return map[column + (row * MAP_SIZE - 1)];

}

//Player setup
var player_x = 22; 
var player_y = 12;
var dir_x = -1;
var dir_y = 0;
var plane_x = 0;
var plane_y = 0.95;
var move_speed = 0.1;
var rot_speed = 2;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

function loop(){

	console.log("looping");

	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

	for(var i = 0; i < CANVAS_WIDTH; i++){

		var cam_x = 2 * i / CANVAS_WIDTH - 1;
		var ray_pos_x = player_x;
		var ray_pos_y = player_y;
		var ray_dir_x = dir_x + plane_x * cam_x;
		var ray_dir_y = dir_y + plane_y * cam_x;

		var map_x = Math.floor(ray_pos_x);
		var map_y = Math.floor(ray_pos_y);

		var side_dist_x, side_dist_y;

		var delta_dist_x = Math.sqrt(1 + (ray_dir_y * ray_dir_y) / (ray_dir_x * ray_dir_x));
		var delta_dist_y = Math.sqrt(1 + (ray_dir_x * ray_dir_x) / (ray_dir_y * ray_dir_y));

		var perp_wall_dist;

		var step_x, step_y;

		var hitted = false;
		var side;

		if(ray_dir_x < 0){

			step_x = -1;
			side_dist_x = (ray_pos_x - map_x) * delta_dist_x;

		} else {

			step_x = 1;
			side_dist_x = (map_x + 1 - ray_pos_x) * delta_dist_x;

		}

		if(ray_dir_y < 0){

			step_y = -1;
			side_dist_y = (ray_pos_y - map_y) * delta_dist_y;

		} else {

			step_y = 1;
			side_dist_y = (map_y + 1 - ray_pos_y) * delta_dist_y;

		}

		while(!hitted){

			if(side_dist_x < side_dist_y){

				side_dist_x += delta_dist_x;
				map_x += step_x;
				side = false;

			} else {

				side_dist_y += delta_dist_y;
				map_y += step_y;
				side = true;

			}

			if(getAt(map_x,map_y) > 0) hitted = true;

		}

		if(!side){

			perp_wall_dist = Math.abs((map_x - ray_pos_x + (1 - step_x) / 2) / ray_dir_x);

		} else {

			perp_wall_dist = Math.abs((map_y - ray_pos_y + (1 - step_y) / 2) / ray_dir_y);

		}

		var line_h = Math.abs(CANVAS_HEIGHT / perp_wall_dist);
		var line_start = -line_h / 2 + CANVAS_HEIGHT / 2;
		if(line_start < 0) line_start = 0;
		var line_end = line_h / 2 + CANVAS_HEIGHT / 2;
		if(line_end >- CANVAS_HEIGHT) line_end = CANVAS_HEIGHT - 1;

		var color = [3];
		switch(getAt(map_x,map_y)){

			case 1 : {

				//red
				color[0] = 255;
				color[1] = 0;
				color[2] = 0;
				break;

			}

			case 2 : {

				//green
				color[0] = 0;
				color[1] = 255;
				color[2] = 0;
				break;

			}

			case 3 : {

				//blue
				color[0] = 0;
				color[1] = 0;
				color[2] = 255;
				break;

			}
			case 4 : {

				//white
				color[0] = 255;
				color[1] = 255;
				color[2] = 255;
				break;

			}

			default : {

				//yellow
				color[0] = 0;
				color[1] = 255;
				color[2] = 255;
				break;

			}

		}

		if(side){

			//shade
			if(color[0] != 0 ) color[0] = color[0] - 60;
			if(color[1] != 0 ) color[1] = color[1] - 60;
			if(color[2] != 0 ) color[2] = color[2] - 60;

		}

		ctx.beginPath();

		ctx.rect(i,line_start,1,line_h);

		ctx.fillStyle = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
		ctx.fill();

		ctx.closePath();

	}

	move();

}

function move(){

	if(rightPressed){

      var old_dir_x= dir_x;
      dir_x = dir_x * Math.cos(toRadians(-rot_speed)) - dir_y * Math.sin(toRadians(-rot_speed));
      dir_y = old_dir_x * Math.sin(toRadians(-rot_speed)) + dir_y * Math.cos(toRadians(-rot_speed));
      var old_plane_x = plane_x;
      plane_x = plane_x * Math.cos(toRadians(-rot_speed)) - plane_y * Math.sin(toRadians(-rot_speed))
      plane_y = old_plane_x * Math.sin(toRadians(-rot_speed)) + plane_y * Math.cos(toRadians(-rot_speed));

	}
	if(leftPressed){

		var old_dir_x= dir_x;
      	dir_x = dir_x * Math.cos(toRadians(rot_speed)) - dir_y * Math.sin(toRadians(rot_speed));
      	dir_y = old_dir_x * Math.sin(toRadians(rot_speed)) + dir_y * Math.cos(toRadians(rot_speed));
      	var old_plane_x = plane_x;
      	plane_x = plane_x * Math.cos(toRadians(rot_speed)) - plane_y * Math.sin(toRadians(rot_speed))
      	plane_y = old_plane_x * Math.sin(toRadians(rot_speed)) + plane_y * Math.cos(toRadians(rot_speed));

	}
	if(upPressed){

        if(getAt(Math.floor(player_x + dir_x * move_speed),Math.floor(player_y)) == 0){

        	player_x += dir_x * move_speed;

        }
        if(getAt(Math.floor(player_x),Math.floor(player_y + dir_y * move_speed)) == 0){

        	player_y += dir_y * move_speed;

        }		

	}
	if(downPressed){

    	if(getAt(Math.floor(player_x - dir_x * move_speed),Math.floor(player_y)) == 0){

        	player_x -= dir_x * move_speed;

        }
        if(getAt(Math.floor(player_x),Math.floor(player_y - dir_y * move_speed)) == 0){

        	player_y -= dir_y * move_speed;

        }

	}

}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
    else if(e.keyCode == 40) {
        downPressed = true;
    }
    else if(e.keyCode == 38) {
        upPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
    else if(e.keyCode == 40) {
        downPressed = false;
    }
    else if(e.keyCode == 38) {
        upPressed = false;
    }
}

setInterval(loop,10);