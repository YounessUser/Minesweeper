import React from "react";
import './App.css'

const ROWS_COUNT = 16;
const COLUMN_COUNT = 16;
const TRAPS_COUNT = 32;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      squares: [],
      currentLevel: 0,
      rows: 10,
      column: 7,
      trapsCount: 11
    }
    this.handleClick = this.handleClick.bind(this);
    this.nonTrapsSqauresCount = 0;
  }

  componentDidMount() {
    this.startGame();
  }

  startGame() {
    let squares = this.getSquares();
    squares = this.setTraps(squares);
    squares = this.setInstructions(squares);
    this.nonTrapsSqauresCount = squares.filter(item => !item.isTrap).length;
    this.setState({
      squares: squares
    }, () => {
        console.log(this.state.squares, this.nonTrapsSqauresCount)
      }
    );
  }

  getSquares() {
    let squares = [];
    for (let i = 0; i < ROWS_COUNT; i++) {
      for (let j = 0; j < COLUMN_COUNT; j++) {
        squares.push({
          id: i+"-"+j,
          sroundedTraps: 0,
          isTrap: false,
          showSquare: false,
          showTrap: false
        });
      }
    }

    return squares;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  setTraps(squares){
    let id;
    for (let i = 0; i < TRAPS_COUNT; i++) {
      id = this.getRandomInt(ROWS_COUNT) + "-" + this.getRandomInt(COLUMN_COUNT);
      squares.forEach((item) => {
        if(item.id === id) {
          item.isTrap = true;
        }
      })
    }

    return squares;
  }

  sroundedSquares(sqaureID) {
    const [row, column] = sqaureID.split("-").map( Number );
    let result = [];
    let surrounding = [
      [row-1, column],
      [row, column-1],
      [row-1, column-1],
      [row+1, column+1],
      [row-1, column+1],
      [row+1, column-1],
      [row, column+1],
      [row+1, column]
    ]

    surrounding.map(cord => {
        if((cord[0] >= 0 && cord[0] < ROWS_COUNT) && (cord[1] >= 0 && cord[1] < COLUMN_COUNT)) {
          result.push(cord.join("-"));
        }
    });

    return result;
  }

  setInstructions(squares) {
    let srounded = [];
    let squaresWithTrap = squares.filter(item => item.isTrap);
    for (let i = 0; i < squaresWithTrap.length; i++) {
        srounded = this.sroundedSquares(squaresWithTrap[i].id);
        for (let j = 0; j < srounded.length; j++) {
          squares.forEach((square) => {
            if(srounded[j] === square.id) {
              square.sroundedTraps = square.sroundedTraps + 1;
            }
          })
        }
    }
    return squares;
  }

  handleClick(e){
    let squares = this.state.squares;
    let squareSelected = squares.find(item => item.id === e.target.id);

    if(squareSelected.isTrap) {
      let gameover = false;
      squares.forEach((square) => {
        if(squareSelected.id === square.id) {
          square.showTrap = true;
          gameover = true;
        }
      })

      if(gameover) {
        setTimeout(() => {
          this.startGame();
        }, 1000);
      }
    } else {
      squares.forEach((square) => {
        if(squareSelected.id === square.id) {
          square.showSquare = true;
        }
      });

      if(squareSelected.sroundedTraps === 0){
        squares = this.clearNonTrapSquares(squares, squareSelected.id)
      }
    }

    this.setState({
      squares: squares
    });

    let unselectedSquare = squares.filter(item => item.showSquare === true).length;
    console.log("unselectedSquare", unselectedSquare);
    if(unselectedSquare === this.nonTrapsSqauresCount && window.confirm("You won")){
        squares = this.startGame();
    }
  }

  clearNonTrapSquares(squares, squareID){
    let sroundedSquares = this.sroundedSquares(squareID);
    squares.forEach((square) =>{
      if(sroundedSquares.includes(square.id) && square.isTrap === false){
        square.showSquare = true;
      }
    });
    return squares
  }

  getClassName(square) {
    let classes = "square";
    classes += square.isTrap ? " trap" : "";
    classes += square.showSquare ? " show-square" : "";
    classes += square.showTrap ? " show-trap" : "";
    return classes;
  }

  render() {
    let style = {display: "grid", gridTemplateColumns: "repeat("+COLUMN_COUNT+", 1fr)"};
    return (
      <div className="App" style={style}>
        {this.state.squares.map((square, index)=>{
          return (<div className={this.getClassName(square)}
            key={index}
            id={square.id}
            data-srounded-traps={square.sroundedTraps}
            onClick={this.handleClick}></div>);
        })}
      </div>
    )
  }
}

export default App
