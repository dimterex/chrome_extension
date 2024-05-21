let clickedElement = null;

let selectedTable = null;
let rowIndex = null;
let cellIndex = null;

document.addEventListener('mousedown', function(event) {
      if (event.button === 2) {
            clickedElement = event.target;

            selectedTable = clickedElement.closest('table');
            
            if (selectedTable) {
                  rowIndex = clickedElement.closest('tr').rowIndex
                  console.log("Строка: " + rowIndex);
      
                  if (rowIndex == 0) {
                        cellIndex = clickedElement.closest('th').cellIndex
                        console.log("Столбец: " + cellIndex);
                  } else {
                        cellIndex = clickedElement.closest('td').cellIndex
                        console.log("Столбец: " + cellIndex);
                  }
            }
      }
}, true);


let actions = {
      "remove_cell": () => remove_column(),
      "insert_cell": () => add_column(),
      "copy_cell": () => copy_cell(),
      "remove_row": () => remove_row(),
      "add_row": () => add_row(),
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      switch (request.id) {
            case "ant_designer_table":
                  let action = actions[request.action];

                  if (action) {
                        action();
                        return;
                  }
                  console.log(request, sender, sendResponse);
      }
});

function remove_column() { 
      var rows = selectedTable.rows;
      let cellCount = rows[0].cells.length;
      if (cellCount == 1) {
            console.log("Cant remove last cell.");
            return;
      }

      for (var j = 0; j < rows.length; j++) { 
            rows[j].deleteCell(cellIndex); 
      } 
}

function add_column() { 
      let rows = selectedTable.rows;

      for (var j = 0; j < rows.length; j++) { 
            const newCell = rows[j].insertCell();
            newCell.textContent = "Inserted";
      } 
}

function copy_cell() {
      let rows = selectedTable.rows;
      let insertedCellIndex = cellIndex + 1;
      for (var j = 0; j < rows.length; j++) { 
            const newCell = rows[j].insertCell(insertedCellIndex);
            newCell.innerHTML = rows[j].cells[cellIndex].innerHTML;
            newCell.classList = rows[j].cells[cellIndex].classList;
      } 
}

function remove_row() {
      selectedTable.deleteRow(rowIndex)
}

function add_row() {
      let rows = selectedTable.rows;
      let lastRow = rows[rows.length - 1]

      var clone = lastRow.cloneNode(true);
      console.log(selectedTable);

      let tbody = selectedTable.querySelector('tbody');
      tbody.appendChild(clone);
}