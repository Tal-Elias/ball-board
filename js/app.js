'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'

// Model:
var gBoard
var gGamerPos

function onInitGame() {
	gGamerPos = { i: 2, j: 9 }
	gBoard = buildBoard()
	renderBoard(gBoard)
}

function buildBoard() {
	const board = createMat(10, 12)

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			board[i][j] = { type: FLOOR, gameElement: null }
			if (i === 0 || i === board.length - 1 ||
				j === 0 || j === board[0].length - 1) {
				board[i][j].type = WALL
			}
		}
	}

	// Place the gamer and two balls
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER

	board[2][2].gameElement = BALL
	board[7][4].gameElement = BALL

	console.log(board)
	return board
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = ''
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>'
		for (var j = 0; j < board[0].length; j++) {
			const currCell = board[i][j] // {type,gameElement}
			// console.log('currCell:', currCell)

			var cellClass = getClassName({ i: i, j: j }) // 'cell-0-0'

			if (currCell.type === FLOOR) cellClass += ' floor'
			else if (currCell.type === WALL) cellClass += ' wall'

			strHTML += '<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >'

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG
			}

			strHTML += '</td>'
		}
		strHTML += '</tr>'
	}

	const elBoard = document.querySelector('.board')
	elBoard.innerHTML = strHTML
}

// Move the player to a specific location
function moveTo(i, j) {
	console.log('i, j:', i, j)

	const targetCell = gBoard[i][j]
	if (targetCell.type === WALL) return

	// Calculate distance to make sure we are moving to a neighbor cell
	const iAbsDiff = Math.abs(i - gGamerPos.i)
	// console.log('iAbsDiff:', iAbsDiff)
	const jAbsDiff = Math.abs(j - gGamerPos.j)
	// console.log('jAbsDiff:', jAbsDiff)

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) ||
		(jAbsDiff === 1 && iAbsDiff === 0)) {
		console.log('MOVE')

		if (targetCell.gameElement === BALL) {
			console.log('Collecting!')
		}

		// Move the gamer
		// Moving from current position:
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null

		// Dom:
		renderCell(gGamerPos, '')


		// Moving to selected position:
		// Model:
		gGamerPos.i = i
		gGamerPos.j = j
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER

		// Dom:
		renderCell(gGamerPos, GAMER_IMG)

	} else console.log('TOO FAR', iAbsDiff, jAbsDiff)

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	const cellSelector = '.' + getClassName(location)
	const elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}

// Move the player by keyboard arrows
function onHandleKey(event) {
	// console.log('event:', event)
	const i = gGamerPos.i
	const j = gGamerPos.j

	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1)
			break
		case 'ArrowRight':
			moveTo(i, j + 1)
			break
		case 'ArrowUp':
			moveTo(i - 1, j)
			break
		case 'ArrowDown':
			moveTo(i + 1, j)
			break
	}
}

// Returns the class name for a specific cell
function getClassName(location) { // {i:2,j:5}
	const cellClass = `cell-${location.i}-${location.j}` // 'cell-2-5'
	return cellClass
}