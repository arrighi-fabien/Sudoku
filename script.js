var sudoku;
var sudoku_copy;
var width;

function beginGame() {
  // prompt to change the difficulty
  let difficulty = prompt("Please enter the difficulty (easy, medium)");
  // check if the difficulty is valid
  if (difficulty === "easy" || difficulty === "medium") {
    switch (difficulty) {
      case "easy":
        // create a 4x4 sudoku
        width = 4;
        break;
      case "medium":
        // create a 9x9 sudoku
        width = 9;
        break;
    }
    // create a table with the width
    createTable(width);
  } else {
    alert("Please enter a valid difficulty");
  }
}

function createTable(width) {
  // create a table with rows and columns
  let table = document.createElement("table");
  for (let i = 0; i < width; i++) {
    let row = document.createElement("tr");
    // add class to the tr element
    row.classList.add("sudoku-row-" + width + "x" + width);
    for (let j = 0; j < width; j++) {
      let cell = document.createElement("td");
      cell.classList.add("sudoku-cell-" + width + "x" + width);
      // create an input field for each cell with pattern 1-9
      cell.innerHTML = "<input type='text' id='input" + i + j + "' maxlength='1' size='1' pattern='[1-9]' />";
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  document.body.appendChild(table);
  createSudoku(width);
}

function createSudoku(width) {
  //generate an array for the sudoku
  sudoku = new Array(width);
  for (let i = 0; i < width; i++) {
      sudoku[i] = new Array(width);
  }

  //create an array with possible numbers depending on the width
  let numbers = [];
  for (let i = 1; i <= width; i++) {
    numbers.push(i);
  }

  //fill the array with random numbers between 1 and 9
  for (let i = 0; i < width; i++) {
    // copy the numbers array to a new array
    let row = [...numbers];
    for (let j = 0; j < width; j++) {
      let value_error = false;
      let index = Math.floor(Math.random() * row.length);
      if (i > 0) {
        // get all the numbers in the column
        let column = [];
        for (let k = 0; k < i; k++) {
          column.push(sudoku[k][j]);
        }
        //get all the numbers in the square (3x3)
        let square = [];
        let square_width = Math.sqrt(width);
        let square_i = Math.floor(i / square_width);
        let square_j = Math.floor(j / square_width);
        for (let k = square_i * square_width; k < (square_i + 1) * square_width; k++) {
          for (let l = square_j * square_width; l < (square_j + 1) * square_width; l++) {
            square.push(sudoku[k][l]);
          }
        }
        // while the number is in the square or in the column, get a new number
        let count = 0;
        while (square.includes(row[index]) || column.includes(row[index])) {
          index = Math.floor(Math.random() * row.length);
          if (count > width) {
            value_error = true;
            break;
          }
          count++;
        }
      }
      if (!value_error) {
        sudoku[i][j] = row[index];
        row.splice(index, 1);
      }
      else {
        // if there is an error, reset the row, and the square
        row = [...numbers];
        for (let k = 0; k < j; k++) {
          sudoku[i][k] = 0;
        }
        i--;
        break;
      }
    }
  }

  //create a copy of the array sudoku and remove some numbers
  sudoku_copy = [];
  for (let i = 0; i < width; i++) {
    sudoku_copy[i] = [...sudoku[i]];
  }
  let count = 0;
  if (width === 4) {
    white_space = 8;
  }
  else if (width === 9) {
    white_space = 60;
  }
  while (count < white_space) {
    let i = Math.floor(Math.random() * width);
    let j = Math.floor(Math.random() * width);
    if (sudoku_copy[i][j] !== 0) {
      sudoku_copy[i][j] = 0;
      count++;
    }
  }

  //fill the table with the numbers from the array
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      if (sudoku_copy[i][j] !== 0) {
        document.getElementById("input" + i + j).value = sudoku_copy[i][j];
        // disable the input field
        document.getElementById("input" + i + j).disabled = true;
      }
    }
  }

}

beginGame()


// create event listener for all the input fields using foreach
document.querySelectorAll("input").forEach(item => {
  item.addEventListener("input", event => {
    // get the id of the input field
    let id = event.target.id;
    // check if the value is a number with regex with value between 1 and width value
    let regex = new RegExp("^[1-" + width + "]$");
    if (!event.target.value.match(regex)) {
      event.target.value = "";
    }
    // check if the value is valid
    checkSudoku(sudoku_copy, id);
  });
});



function checkSudoku(sudoku, id) {
  // get the row and column of the input field
  let row = parseInt(id.slice(5, 6));
  let column = parseInt(id.slice(6));
  // get the value of the input field
  let value = parseInt(document.getElementById(id).value);
  // add the value to the sudoku array
  // if value is NaN
  if (value !== value) {
    value = 0;
    sudoku[row][column] = value;
    document.getElementById(id).style.backgroundColor = "white";
    return;
  }
  sudoku[row][column] = value;
  // check if the value is in the row
  let row_error = false;
  for (let i = 0; i < sudoku.length; i++) {
    if (i !== column && sudoku[row][i] === value) {
      row_error = true;
      break;
    }
  }
  // check if the value is in the column
  let column_error = false;
  for (let i = 0; i < sudoku.length; i++) {
    if (i !== row && sudoku[i][column] === value) {
      column_error = true;
      break;
    }
  }
  // check if the value is in the square
  let square_error = false;
  let square_width = Math.sqrt(sudoku.length);
  let square_row = Math.floor(row / square_width);
  let square_column = Math.floor(column / square_width);
  for (let i = square_row * square_width; i < (square_row + 1) * square_width; i++) {
    for (let j = square_column * square_width; j < (square_column + 1) * square_width; j++) {
      if (i !== row && j !== column && sudoku[i][j] === value) {
        square_error = true;
        break;
      }
    }
  }
  // if there is an error, change the color of the input field
  if (row_error || column_error || square_error) {
    document.getElementById(id).style.backgroundColor = "#FF5858";
  }
  else {
    document.getElementById(id).style.backgroundColor = "white";
  }
}