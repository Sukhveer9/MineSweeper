
var time = 0;
var tiles = [];
var m_bFirstClick = false;
var columns = 9;
    var rows = 9;
var m_iNumOfMines = 10;
var m_bGameOver = false;
function buildGrid() {

    // Fetch grid and clear out old elements.
    var grid = document.getElementById("minefield");
    grid.innerHTML = "";

    
	tiles = [];
	m_bFirstClick = false;
	m_bGameOver = false;
	time = 0;
	
	document.getElementById("flagCount").innerHTML = m_iNumOfMines;

    // Build DOM Grid
    var tile;
	var iCounter = 0;
    for (var y = 0; y < rows; y++) {
		//tiles[y] = new Array(5);
		tiles[y] = [];
        for (var x = 0; x < columns; x++) {
			
			tile = {
				number : iCounter,
				isCleared : false,
				isFlagged : false,
				isMine : false,
				tileObject : createTile(x,y)
			};
			
            //tile = createTile(x,y);
			//console.log("This tile is "+ tile != null);
			tiles[y][x] = tile;
            grid.appendChild(tile.tileObject);
        }
    }
    
    var style = window.getComputedStyle(tile.tileObject);

    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));
    
    grid.style.width = (columns * width) + "px";
    grid.style.height = (rows * height) + "px";
}

function createTile(x,y) {
    var tile = document.createElement("div");

    tile.classList.add("tile");
    tile.classList.add("hidden");
    
    tile.addEventListener("auxclick", function(e) { e.preventDefault(); }); // Middle Click
    tile.addEventListener("contextmenu", function(e) { e.preventDefault(); }); // Right Click
    tile.addEventListener("mouseup", handleTileClick ); // All Clicks

    return tile;
}

function startGame() {
	setDifficulty();
    buildGrid();
    startTimer();
}

function smileyDown() {
    var smiley = document.getElementById("smiley");
	smiley.classList.remove("face_lose");
	smiley.classList.remove("face_win");
    smiley.classList.add("face_down");
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
}

function SetupMines(x, y)
{
	var iMineAdded = 0;
	
	while(iMineAdded != m_iNumOfMines)
	{
		var isValid = true;
		var randomY = getRandomInt(0,rows-1);
		if(randomY == (y) || randomY == (y+1) || randomY == (y -1))
		{
			isValid = false;
			console.log(isValid);
		}
		
		var randomX = getRandomInt(0,columns-1);
		if(randomX == (x) || randomX == (x+1) || randomX == (x -1))
		{
			isValid = false;
			//console.log(isValid);
		}
		
		try{
		if(isValid == true && tiles[randomY][randomX].isMine == true)
		{
			isValid = false;
		}
		}catch(err)
		{
			console.log("Error random: " + randomY + " " + randomX);
			return;
		}
		
		if(isValid == true)
		{
			isValid = false;
			//console.log("random: " + randomY + " " + randomX);
			tiles[randomY][randomX].isMine = true;
			//tiles[randomY][randomX].tileObject.classList.remove("hidden");
			//tiles[randomY][randomX].tileObject.classList.add("mine");
			iMineAdded++;
		}
	}
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function HasMine(x,y)
{
	if(x< 0) return false;
	if(x >= columns) return false;
	if(y < 0) return false;
	if (y >= rows) return false;
	if(tiles[y][x].isCleared) return false;
	if(tiles[y][x].isMine) return true;
}

function CheckArea(x, y)
{
	iStackCounter++;
	var hasAdjacentMine = false;
	var iNumOfMines = 0;
	if (y < 0)console.log(y);
	if(x< 0) return ;
	if(x >= columns) return ;
	if(y < 0) return ;
	if (y >= rows) return ;
	
	
	
	if(tiles[y][x].isMine) return 1;
	if(tiles[y][x].isCleared) return 0;
	
	if(HasMine(x+1,y)) iNumOfMines++;
	if(HasMine(x-1,y)) iNumOfMines++;
	if(HasMine(x,y-1)) iNumOfMines++;
	if(HasMine(x,y+1)) iNumOfMines++;
	
	if(HasMine(x+1,y+1)) iNumOfMines++;
	if(HasMine(x-1,y-1)) iNumOfMines++;
	if(HasMine(x+1,y-1)) iNumOfMines++;
	if(HasMine(x-1,y+1)) iNumOfMines++;
	
	if(iNumOfMines == 0)
	{
		tiles[y][x].tileObject.classList.remove("hidden");
		tiles[y][x].isCleared = true;
		CheckArea(x+1,y);
		CheckArea(x-1,y);
		CheckArea(x,y-1);
		CheckArea(x,y+1);
		
		//CheckArea(x+1,y+1);
		
		
	}
	else if(iNumOfMines == 1)
	{
		tiles[y][x].tileObject.classList.add("tile_1");
		tiles[y][x].isCleared = true;
		return 0;
	}
	else if(iNumOfMines == 2)
	{
		tiles[y][x].tileObject.classList.add("tile_2");
		tiles[y][x].isCleared = true;
		return 0;
	}
	else if(iNumOfMines == 3)
	{
		tiles[y][x].tileObject.classList.add("tile_3");
		tiles[y][x].isCleared = true;
		return 0;
	}
	else if(iNumOfMines == 4)
	{
		tiles[y][x].tileObject.classList.add("tile_4");
		tiles[y][x].isCleared = true;
		return 0;
	}
}

var iStackCounter = 0;

function GameOver(_x, _y)
{
	m_bGameOver = true;
	var smiley = document.getElementById("smiley");
    smiley.classList.add("face_lose");
	
	
	tiles[_y][_x].tileObject.classList.remove("hidden");
	tiles[_y][_x].tileObject.classList.add("mine_hit");
	
	for(var y = 0; y < tiles.length; y++)
	{
		for( var x = 0; x < tiles[y].length; x++)
		{
			if(tiles[y][x].isMine && tiles[y][x] != tiles[_y][_x])
			{
				tiles[y][x].tileObject.classList.remove("hidden");
				if(tiles[y][x].isFlagged)
				{
					tiles[y][x].tileObject.classList.add("mine_marked");
				}
				else
				{
					tiles[y][x].tileObject.classList.add("mine");
				}
				
			}
		}
	}
}

function IsEverythingCleared()
{
	var iCleared = false;
	
	for(var y = 0; y < tiles.length; y++)
	{
		for( var x = 0; x < tiles[y].length; x++)
		{
			if(!tiles[y][x].isCleared && !tiles[y][x].isMine)
			{
				//console.log("NOT CLEARED");
				return false;
			}
		}
	}
	return true;
}

function YouWin()
{
	var smiley = document.getElementById("smiley");
    smiley.classList.add("face_win");
	for(var y = 0; y < tiles.length; y++)
	{
		for( var x = 0; x < tiles[y].length; x++)
		{
			if(tiles[y][x].isMine)
			{
				tiles[y][x].tileObject.classList.add("hidden");
				tiles[y][x].tileObject.classList.remove("mine");
				tiles[y][x].tileObject.classList.add("flag");
				
			}
		}
	}
}

function handleTileClick(event) {
	
	if(m_bGameOver)return;
	
    // Left Click
    if (event.which === 1) {
        //TODO reveal the tile
		for(var y = 0; y < tiles.length; y++)
		{
			for(var x = 0; x < tiles[y].length; x++)
			{
				if(tiles[y][x].tileObject == event.target)
				{
					console.log("coord is "+y + " " + x);
					var tile = event.target;
					tile.classList.remove("hidden");
					
					if(m_bFirstClick == false)
					{
						m_bFirstClick = true;
						SetupMines(x, y);
					}
					try
					{
						if(tiles[y][x].isMine)
						{
							GameOver(x, y);
						}
						else
						{
							CheckArea(x,y);
							if(IsEverythingCleared())
							{
								console.log("YOU WIN");
								YouWin();
							}
						}
						
					}catch(err)
					{
						console.log("stack count: "+iStackCounter);
					}
					
				}
			}
			
		}
    }
    // Middle Click
    else if (event.which === 2) {
        //TODO try to reveal adjacent tiles
    }
    // Right Click
    else if (event.which === 3) {
        //TODO toggle a tile flag
		for(var y = 0; y < tiles.length; y++)
		{
			for(var x = 0; x < tiles[y].length; x++)
			{
				if(tiles[y][x].tileObject == event.target)
				{
					FlagTile(x,y);
					return;
				}
			}
		}
    }
}

function FlagTile(x, y)
{
	if(!tiles[y][x].isCleared && !tiles[y][x].isFlagged && m_iNumOfMines != 0)
	{
		tiles[y][x].tileObject.classList.remove("hidden");
		tiles[y][x].tileObject.classList.remove("mine");
		tiles[y][x].tileObject.classList.add("flag");
		tiles[y][x].isFlagged = true;
		m_iNumOfMines--;
		
	}
	else if(tiles[y][x].isFlagged)
	{
		tiles[y][x].tileObject.classList.remove("flag");
		tiles[y][x].tileObject.classList.add("hidden");
		tiles[y][x].isFlagged = false;
		m_iNumOfMines++;
	}
	document.getElementById("flagCount").innerHTML = m_iNumOfMines;
}

function setDifficulty() {
    var difficultySelector = document.getElementById("difficulty");
    var difficulty = difficultySelector.selectedIndex;

    //TODO implement me
	if(difficulty == 0)
	{
		rows = 9;
		columns = 9;
		m_iNumOfMines = 10;
	}
	else if(difficulty == 1)
	{
		rows = 16;
		columns = 16;
		m_iNumOfMines = 40;
	}
	else if(difficulty == 2)
	{
		rows = 30;
		columns = 16;
		m_iNumOfMines = 99;
	}
}

function startTimer() {
    timeValue = 0;
    window.setInterval(onTimerTick, 1000);
}

function onTimerTick() {
	if(!m_bGameOver)
	{
		timeValue++;
		updateTimer();
	}
    
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}