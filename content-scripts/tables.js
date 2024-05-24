let selectedTable = null;
let rowIndex = null;
let cellIndex = null;

let table_actions = {
      "columns_remove": () => columns_remove(),
      "columns_insert": () => columns_insert(),
      "columns_clone": () => columns_clone(),
      "columns_clear": () => columns_clear(),
      "rows_remove": () => rows_remove(),
      "rows_clone": () => rows_clone(),
      "cells_copy": () => cells_copy(),
      "cells_paste": () => cells_paste(),
      "cells_clear": () => cells_clear(),
}

function update_table_params() {
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
      console.log("Элемент: ", clickedElement);
      console.log("Таблица: ", selectedTable);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      console.log(request, sender, sendResponse);
      console.log(clickedElement);
      update_table_params();
      let action = table_actions[request.action];
      if (action) {
            action();
            return;
      }
});

function columns_remove() { 
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

function columns_insert() { 
      let rows = selectedTable.rows;

      for (var j = 0; j < rows.length; j++) { 
            const newCell = rows[j].insertCell();
            newCell.textContent = "Inserted";
            if (j == 0) {
                  newCell.outerHTML = newCell.outerHTML.replace("<td", "<th").replace("</td>", "</th>");
            }
      } 
}

function columns_clone() {
      let rows = selectedTable.rows;
      let insertedCellIndex = cellIndex + 1;
      for (var j = 0; j < rows.length; j++) { 
            const newCell = rows[j].insertCell(insertedCellIndex);
            newCell.innerHTML = rows[j].cells[cellIndex].innerHTML;
            newCell.classList = rows[j].cells[cellIndex].classList;

            if (j == 0) {
                  newCell.outerHTML = newCell.outerHTML.replace("<td", "<th").replace("</td>", "</th>");
            }
      }
}

function rows_remove() {
      selectedTable.deleteRow(rowIndex)
}

function rows_clone() {
      let rows = selectedTable.rows;
      let newRow = selectedTable.insertRow();
      newRow.innerHTML = rows[rowIndex].innerHTML;
      newRow.classList = rows[rowIndex].classList;
}

async function cells_copy() {
      copy(rows[rowIndex].cells[cellIndex]);
      await navigator.clipboard.writeText(text);
}

async function cells_paste() {
      paste(rows[rowIndex].cells[cellIndex]);
}

function columns_clear() {
      let rows = selectedTable.rows;
      for (var j = 0; j < rows.length; j++) { 
            rows[j].cells[cellIndex].innerHTML = "";
      }
}

function cells_clear() {
      let rows = selectedTable.rows;
      clear(rows[rowIndex].cells[cellIndex]);
}
