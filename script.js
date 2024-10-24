document.getElementById('generateButton').addEventListener('click', generateMaze);
document.getElementById('downloadButton').addEventListener('click', downloadSVG);

function generateMaze() {
    const gridX = parseInt(document.getElementById('gridX').value);
    const gridY = parseInt(document.getElementById('gridY').value);
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');

    const cellSize = 20;
    canvas.width = gridX * cellSize;
    canvas.height = gridY * cellSize;

    let maze = createMaze(gridX, gridY);

    for (let y = 0; y < gridY; y++) {
        for (let x = 0; x < gridX; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? 'black' : 'white';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function createMaze(width, height) {
    let maze = Array.from({ length: height }, () => Array(width).fill(1));
    let stack = [];
    let currentCell = [0, 0];
    maze[0][0] = 0;
    stack.push(currentCell);

    const directions = [
        [0, 1],   // down
        [1, 0],   // right
        [0, -1],  // up
        [-1, 0]   // left
        //Why notes... cause me stupid
    ];

    while (stack.length > 0) {
        let [x, y] = currentCell;
        let possibleDirections = directions.filter(([dx, dy]) => {
            let nx = x + dx * 2;
            let ny = y + dy * 2;
            return nx >= 0 && ny >= 0 && nx < width && ny < height && maze[ny][nx] === 1;
        });

        if (possibleDirections.length > 0) {
            let [dx, dy] = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
            let nextX = x + dx;
            let nextY = y + dy;
            maze[nextY][nextX] = 0;
            maze[nextY + dy][nextX + dx] = 0;
            currentCell = [nextX + dx, nextY + dy];
            stack.push(currentCell);
        } else {
            currentCell = stack.pop();
        }
    }

    return maze;
}

function downloadSVG() {
    const gridX = parseInt(document.getElementById('gridX').value);
    const gridY = parseInt(document.getElementById('gridY').value);
    const maze = createMaze(gridX, gridY);

    const cellSize = 20;
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${gridX * cellSize}" height="${gridY * cellSize}" viewBox="0 0 ${gridX * cellSize} ${gridY * cellSize}">`;

    for (let y = 0; y < gridY; y++) {
        for (let x = 0; x < gridX; x++) {
            if (maze[y][x] === 0) {
                const rectX = x * cellSize;
                const rectY = y * cellSize;
                svgContent += `<rect x="${rectX}" y="${rectY}" width="${cellSize}" height="${cellSize}" fill="white"/>`;
            }
        }
    }

    svgContent += '</svg>';

    //Do blob thingyy here
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(svgBlob);
    link.download = 'maze.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
