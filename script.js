// This loads the HTML before the JS
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid")
    let width = 10
    let squares = []
    let bombAmount = 20
    let flags = 0
    let isGameOver = false

// create the board
    function createBoard() {
        // add bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptySquares = Array(width*width - bombAmount).fill('valid')
        const gameArray = emptySquares.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() -0.5)

        for(let i = 0; i < width*width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            // add event listener for normal click
            square.addEventListener('click', function(e) {
                click(square)
            })

            // add event listener for control and left click
            square.oncontextmenu = function(e) {
                e.preventDefault()
                flagSquare(square)
            }
        }

        // add numbers to the boxes neighboring any bombs on the gameboard
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const leftEdge = (i % width === 0) // checks if the square is on the left edge of the board
            const rightEdge = (i % width === width - 1) // checks if the square is on the right edge of the board

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !leftEdge && squares[i-1].classList.contains('bomb')) total ++
                if (i > 9 && !rightEdge && squares[i+1-width].classList.contains('bomb')) total ++
                if (i > 10 && squares[i-width].classList.contains('bomb')) total ++
                if (i > 11 && !leftEdge && squares[i-1-width].classList.contains('bomb')) total ++
                if (i < 98 && !rightEdge && squares[i+1].classList.contains('bomb')) total ++
                if (i < 90 && !leftEdge && squares[i-1+width].classList.contains('bomb')) total ++
                if (i < 88 && !rightEdge && squares[i+1+width].classList.contains('bomb')) total ++
                if (i < 89 && squares[i+width].classList.contains('bomb')) total ++
                squares[i].setAttribute('data', total)
            }
        }

    }
    createBoard()

    //add flag with a right click
    function flagSquare(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🚩'
                flags ++
                gameWon()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ""
                flags --
            }
        }

    }

    //define the click function 
    function click(square) {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            gameOver(square)            
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                square.innerHTML = total
                return
            } 
            checkSquare(square, currentId)
        } 
        square.classList.add('checked')
    }

    // check neighboring squares ONCE a square is clicked to clear them out
    function checkSquare(square, currentId) {
        const leftEdge = (currentId % width === 0)
        const rightEdge = (currentId % width === width -1)
        setTimeout(() => {
            if (currentId > 0 && !leftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            } if (currentId > 9 && !rightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            } if (currentId > 10) {
                const newId = squares[parseInt(currentId - width)].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            } if (currentId > 11 && !leftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            } if (currentId < 98 && !rightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            } if (currentId < 90 && !leftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            } if (currentId < 88 && !rightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            } if (currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        }, 10)
    }

    // game over function
    function gameOver(square) {
        console.log('Boom! Game Over')
        isGameOver = true
        // show ALL bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
            }
        })
    }

    // game won function
    function gameWon() {
    let matches = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches ++
            } if (matches === bombAmount) {
                console.log('WIN!')
                isGameOver = true 
            }
        }
    } 

})