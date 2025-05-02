const GameState = {
    boardSize: { width: 20, height: 20},
    snake: [{x:10, y:10}],
    food: {x:15, y:10},
    direction: {x:1, y:0}
};

const opositeDirection = {
    w: "s",
    s: "w",
    a: "d",
    d: "a"
}

const directions = {
    w: {x: 0, y: -1},
    s: {x: 0, y: 1},
    a: {x: -1, y: 0},
    d: {x: 1, y: 0}
};

function initState(boardWidth, boardHeight) {
    return {
        boardSize: { width: 20, height: 20 },
        snake: [{x: Math.floor(boardWidth / 2), y: Math.floor(boardHeight / 2)}],
        food: {
            x: Math.floor(Math.random() * boardWidth), 
            y: Math.floor(Math.random() * boardHeight)},
        direction: {x:1, y:0}
    };
}

function render(state){
    let tabuleiro = "";
    for(let i = 0; i < state.boardSize.height; i++) {
        for(let j = 0; j < state.boardSize.width; j++){
            if(j === state.food.x && i === state.food.y) {
                tabuleiro += "◉"
            } else if (state.snake.some(segment => segment.x === j && segment.y === i)) {
                tabuleiro += "0"
            } else {
                tabuleiro += "·"
            }
        }
        tabuleiro += "\n";
    }

    console.clear();
    console.log(tabuleiro);
}

function updateState(state){
    const cabeca = state.snake[0];
    const newSnake = state.snake.slice();
    
    const novaCabeca = {
        x: cabeca.x + state.direction.x,
        y: cabeca.y + state.direction.y 
    };
    
    const colidiuEmSi = (
        novaCabeca.x < 0 || 
        novaCabeca.x >= state.boardSize.width || 
        novaCabeca.y < 0 || 
        novaCabeca.y >= state.boardSize.height);
    
    const colidiuParede = (
        state.snake.some(segment => 
            segment.x === novaCabeca.x && 
            segment.y === novaCabeca.y)); 

    const eatFood = (
        novaCabeca.x === state.food.x && 
        novaCabeca.y === state.food.y);
        
    if(colidiuEmSi || colidiuParede) process.exit(0);

    newSnake.unshift(novaCabeca);
    let newFood = state.food;

    if(!eatFood) {
        newSnake.pop()
    } else {
        newFood = generateFood(state);
    }

    return {
        boardSize: state.boardSize,
        snake: newSnake,
        food: newFood,
        direction: state.direction
    };
}

function generateFood(state) {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * state.boardSize.width), 
            y: Math.floor(Math.random() * state.boardSize.height)
        }
    } while (state.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

    return newFood;
}

let state = initState(20, 20);

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

let lastKey = "d";
process.stdin.on('data', (currentKey) => {
    if (currentKey === '\u0003') process.exit();
    if (currentKey in directions && currentKey !== opositeDirection[lastKey]) state.direction = directions[currentKey];
    lastKey = currentKey;
});

setInterval(() => {
    state = updateState(state);
    render(state);
}, 200);