document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerID 
    let score = 0
    const colors = [
      'indigo',
      'green',
      'pink',
      'blue',
      'yellow'
    ]

    //Drawing the tetriminoes
    const lTerimino =[
      [1, width+1, width*2+1, 2],
      [width, width+1, width+2, width*2+2],
      [1, width+1, width*2+1, width*2],
      [width, width*2, width*2+1, width*2+2]
    ]
    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
      ]
    
      const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
      ]
    
      const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
      ]
    
      const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
      ]
      const theTetriminoes = [lTerimino, zTetromino, tTetromino, oTetromino, iTetromino]
      let currentPosition = 4
      let currentRotation = 0

      //Randomly select a tetrimino at its first rotation
      let random = Math.floor(Math.random()*theTetriminoes.length)
      let current = theTetriminoes[random][currentRotation]

      //Draw the first rotation
      function draw(){
        current.forEach(index => {
        squares[currentPosition + index].classList.add('tetrimino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
      })
    }

    //undraw the Tetrimino
    function undraw(){
      current.forEach(index =>{
        squares[currentPosition + index].classList.remove('tetrimino')
        squares[currentPosition + index].style.backgroundColor = ''
      })
    }
    // make every tetrimio move down
    // timerID = setInterval(moveDown, 1000)

    //assign functions to keyCodes 
    function control(e){
      if(e.keyCode === 37){
        moveLeft()
      }else if(e.keyCode === 38){
        rotate()
      }else if (e.keyCode === 39){
        moveRight()
      }else if (e.keyCode === 40){
        moveDown()
      }
    }
    document.addEventListener('keyup', control)

    //move down function
    function moveDown(){
      undraw()
      currentPosition += width
      draw()
      freeze()
    }

    //freeze function
    function freeze(){
      if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
      current.forEach(index => squares[currentPosition +index].classList.add('taken'))
      //start a new tetrimino
      random = nextRandom
      nextRandom = Math.floor(Math.random()* theTetriminoes.length)
      current = theTetriminoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
      }
    }
  // Move the tetrimino left, unless is at the edge or there's a blockage
    function moveLeft(){
      undraw()
      const isAtLeftEdge = current.some(index =>(currentPosition + index) % width ===0)
      if(!isAtLeftEdge) currentPosition -=1
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition +=1
      }
      draw()
    }
     // Move the tetrimino right, unless is at the edge or there's a blockage
     function moveRight(){
      undraw()
      const isAtRightEdge = current.some(index =>(currentPosition + index) % width === width-1)
      if(!isAtRightEdge) currentPosition +=1
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -=1
      }
      draw()
    }

    //Rotate the Tetrimimo
    function rotate(){
      undraw()
      currentRotation++
      if(currentRotation === current.length){
        currentRotation = 0
      }
      current = theTetriminoes[random][currentRotation]
      draw()
    }
    //show up-next tetrimino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const dispalyWidth = 4
    const displayIndex = 0
    
    
    // The tetriminoes without rotation
    const upNextTetriminoes =[
      [1, dispalyWidth+1, dispalyWidth*2+1, 2], //lTetrimino
      [0, dispalyWidth, dispalyWidth+1, dispalyWidth*2+1], //zTetrimino
      [1, dispalyWidth, dispalyWidth+1, dispalyWidth+2], //tTetrimino
      [0, 1, dispalyWidth, dispalyWidth+1], //oTetromino
      [1, dispalyWidth+1, dispalyWidth*2+1, dispalyWidth*3+1] //iTetrimino
    ]

    function displayShape(){
      //remove any trace of a tetrimino from the grid
      displaySquares.forEach(square =>{
        square.classList.remove('tetrimino')
        square.style.backgroundColor = ''
      })
       upNextTetriminoes[nextRandom].forEach(index =>{
         displaySquares[displayIndex + index].classList.add('tetrimino')
         displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
       })
    }

    //Add functionality to button
    startBtn.addEventListener('click',() =>{
      if(timerID){
        clearInterval(timerID)
        timerID = null
      }else {
        draw()
        timerID =setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetriminoes.length)
        displayShape()
    }
  })
  // Add score
  function addScore(){
     for (let i=0; i < 199; i +=width){
       const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
       if(row.every(index => squares[index].classList.contains('taken'))){
         score +=10
         scoreDisplay.innerHTML = score
         row.forEach(index =>{
           squares[index].classList.remove('taken')
           squares[index].classList.remove('tetrimino')
           squares[index].style.backgroundColor = ''
         })
         const squaresRemoved = squares.splice(i, width)
         squares = squaresRemoved.concat(squares)
         squares.forEach(cell => grid.appendChild(cell))
       }
     }
  }
  //game over
  function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerID)
    }
  }
})