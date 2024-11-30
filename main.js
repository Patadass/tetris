const game_canvas = document.getElementById("gameCanvas");
const HEIGHT = parseInt(game_canvas.style.height);
const WIDTH = parseInt(game_canvas.style.width);

function load(){
    for(let i = 0;i < 10*20;i++){
        let div = document.createElement("div");
        div.classList.add("game-canvas-block");
        div.style.backgroundColor = "white";
        div.style.height = WIDTH/10-parseInt(div.style.borderWidth) + "px";
        div.style.width = WIDTH/10-parseInt(div.style.borderWidth) + "px";
        game_canvas.appendChild(div);
    }
}

function remove_event_listener(){
    let event = new KeyboardEvent("keydown", {key: "q"});
    document.dispatchEvent(event);
}

function drop(shape){
    let children = game_canvas.children;

    let interval_id = window.setInterval(() => drop_shape(shape,interval_id), 100);
    //clearInterval(drop_speed);

    document.addEventListener("keydown", function key_handle(event){
        console.log(event.key + " " + event.code);
        if(event.key === "q"){
            clearInterval(interval_id);
            document.removeEventListener("keydown", key_handle);
        }
        if(event.key === 'd'){
            if(check_collision_right(shape) !== -1){
                check_collision(shape,interval_id);
                erase_previous_block(shape);
                shape.j++;
                draw_block_on_canvas(shape);
            }
        }
        if(event.key === 'a'){
            if(check_collision_left(shape) !== -1){
                check_collision(shape,interval_id);
                erase_previous_block(shape);
                shape.j--;
                draw_block_on_canvas(shape);
            }
        }
    });
}

function check_collision_left(shape){
    let children = game_canvas.children;
    for(let i = 0;i < shape.shape.length;i++){
        for(let j = 0;j < shape.shape[i].length;j++){
            let ph = (shape.i + i) * 10 + shape.j-1 + j;
            if(shape.shape[i][j] === undefined){
                continue;
            }

            if(ph > children.length || shape.j-1 < 0){
                return -1;
            }
            if(children[ph].style.backgroundColor !== "white" && j-1 < 0){
                console.log(ph);
                return -1;
            }
        }
    }
}

function check_collision_right(shape){
    let children = game_canvas.children;
    for(let i = 0;i < shape.shape.length;i++){
        for(let j = 0;j < shape.shape[i].length;j++){
            let ph = (shape.i + i) * 10 + shape.j+1 + j;
            if(shape.shape[i][j] === undefined){
                continue;
            }
            if(ph > children.length || shape.j+j >= 9){
                return -1;
            }
            if(children[ph].style.backgroundColor !== "white" && j+1 >= shape.shape[i].length){
                console.log(ph);
                return -1;
            }
        }
    }
}

function check_collision(shape,interval_id){
    let children = game_canvas.children;
    if(shape.i + shape.shape.length > 19){
        clearInterval(interval_id);
        remove_event_listener();
    }
    let i = shape.shape.length-1;
    for(let j = 0;j < shape.shape[i].length;j++){
        let ph = (shape.i+1 + i) * 10 + shape.j + j;
        if(shape.shape[i][j] === undefined){
            continue;
        }
        if(ph >= children.length){
            continue;
        }
        if(children[ph].style.backgroundColor !== "white"){
            clearInterval(interval_id);
            remove_event_listener();
        }
    }
}

function erase_previous_block(shape){
    let children = game_canvas.children;
    for(let i = 0;i < shape.shape.length;i++){
        for(let j = 0;j < shape.shape[i].length;j++){
            if((shape.i-1 + i) * 10 + shape.j + j < 0 || shape.shape[i][j] === undefined){
                continue;
            }
            children[(shape.i-1 + i)*10+shape.j + j].style.backgroundColor = "white";
        }
    }
}

function draw_block_on_canvas(shape){
    let children = game_canvas.children;
    for(let i = 0;i  < shape.shape.length;i++){
        for(let j = 0;j < shape.shape[i].length;j++){
            if((shape.i + i) * 10 + shape.j + j < 0 || shape.shape[i][j] === undefined){
                continue;
            }
            children[(shape.i + i)*10+shape.j + j].style.backgroundColor = shape.color;
        }
    }
}

function drop_shape(shape,interval_id){
    let children = game_canvas.children;

    check_collision(shape,interval_id);

    erase_previous_block(shape);

    draw_block_on_canvas(shape);
    shape.i++;
}

let i_block = {
    shape:[
        [1],
        [1],
        [1],
        [1]
    ],
    i:-3,
    j:5,
    color:"lightblue"
};

let t_block = {
    shape:[
        [undefined,1],
        [1,1,1]
    ],
    i:-1,
    j:5,
    color:'orange'
};

let o_block = {
    shape:[
        [1,1],
        [1,1]
    ],
    i:-1,
    j:5,
    color:'yellow'
};

let s_block = {
    shape:[
        [undefined,1,1],
        [1,1,undefined]
    ],
    i:-1,
    j:5,
    color:'red'
};

let z_block = {
    shape:[
        [1,1,undefined],
        [undefined,1,1]
    ],
    i:-1,
    j:5,
    color:'green'
};

let l_block = {
    shape:[
        [1],
        [1],
        [1,1]
    ],
    i:-2,
    j:5,
    color:'orange'
};

let j_block = {
    shape:[
        [undefined,1],
        [undefined,1],
        [1,1],
    ],
    i:-2,
    j:5,
    color:'pink'
};