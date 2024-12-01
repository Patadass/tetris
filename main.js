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
    let interval_id = window.setInterval(() => drop_shape(shape,interval_id), 200);
    //clearInterval(drop_speed);

    let key_down = false;
    document.addEventListener("keydown", function key_handle(event){
        if(key_down){
            return;
        }
        key_down = true;
        if(event.key === "q"){//TODO:make virtual event not be "q"
            document.removeEventListener("keydown", key_handle);
        }
        if(event.key === 'd'){
            if(check_collision_right(shape) !== -1){
                erase_previous_block(shape);
                check_collision(shape,interval_id);
                shape.j++;
                draw_block_on_canvas(shape);
            }
        }
        if(event.key === 'a'){
            if(check_collision_left(shape) !== -1){
                erase_previous_block(shape);
                check_collision(shape,interval_id);
                shape.j--;
                draw_block_on_canvas(shape);
            }
        }
        if(event.key === 'w'){//TODO:check collision before rotating for both w and s
            erase_previous_block(shape);
            shape = rotate_left(shape);
            draw_block_on_canvas(shape);
        }
        if(event.key === 's'){
            erase_previous_block(shape);
            shape = rotate_right(shape);
            draw_block_on_canvas(shape);
        }
    });
    document.addEventListener("keyup", function key_handle(event){
        key_down = false;
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
    //TODO:doesn't work for the first line returns -1(fix) then works good
    let children = game_canvas.children;
    if(shape.i + shape.shape.length > 19){
        clearInterval(interval_id);
        remove_event_listener();
        return -1;
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
            return -1;
        }
    }
}

function erase_previous_block(shape){
    let children = game_canvas.children;
    for(let i = 0;i < shape.shape.length;i++){
        for(let j = 0;j < shape.shape[i].length;j++){
            if((shape.i + i) * 10 + shape.j + j < 0 || shape.shape[i][j] === undefined){
                continue;
            }
            children[(shape.i + i)*10+shape.j + j].style.backgroundColor = "white";
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
    //let children = game_canvas.children;

    if(check_collision(shape,interval_id) === -1){
        return;
    }

    erase_previous_block(shape);

    shape.i++;
    draw_block_on_canvas(shape);
}

function rotate_left(shape){
    let n_shape = Object.create(shape);
    let rows = shape.shape.length;
    let col = shape.shape[0].length;
    n_shape.shape = new Array(col);
    for(let i = 0;i < n_shape.shape.length;i++){
        n_shape.shape[i] = new Array(rows);
        for(let j = 0;j < n_shape.shape[i].length;j++){
            n_shape.shape[i][j] = 0;
        }
    }
    for(let i = rows-1,ph = 0;i >= 0;i--){
        let row = shape.shape[i];
        for(let j = 0;j < row.length;j++){
            n_shape.shape[j][ph] = row[j];
        }
        ph++;
    }
    return n_shape;
}

function rotate_right(shape){
    let n_shape = Object.create(shape);
    let rows = shape.shape.length;
    let col = shape.shape[0].length;
    n_shape.shape = new Array(col);
    for(let i = 0;i < n_shape.shape.length;i++){
        n_shape.shape[i] = new Array(rows);
        for(let j = 0;j < n_shape.shape[i].length;j++){
            n_shape.shape[i][j] = 0;
        }
    }
    for(let i = 0,ph = 0;i < rows;i++){
        let row = shape.shape[i];
        for(let j = 0;j < row.length;j++){
            n_shape.shape[j][ph] = row[j];
        }
        ph++;
    }
    return n_shape;
}

function btnDrop(){
    let p = [i_block,t_block,j_block,l_block,o_block,s_block,l_block];
    let b = document.getElementById("select").value;
    remove_event_listener();
    drop(Object.create(p[b]));
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
        [undefined,1,undefined],
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
        [1,undefined],
        [1,undefined],
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