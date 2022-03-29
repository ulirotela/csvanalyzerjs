const ipc = require('electron').ipcRenderer;
const buttonCreated = document.getElementById('upload');

var maxRows = 100;

buttonCreated.addEventListener('click', (event) => {
    ipc.send('open-file-dialog-for-file')
});

ipc.on('selected-file', (event, file_details) => {
    
    document.getElementById('file_uploaded').innerHTML = 
    "Current File Path: " + `<p class="grey-text">${file_details.path}</p>`;
    
    let file_table = document.getElementById('file_data');

    for (let i = 0; i < maxRows && i < file_details.data.length; i++) {
        file_table.innerHTML += getTableRow(file_details.data[i]);
    }

});


const getTableRow = (row) => {

    let table_row = `<tr>`
    for (key in Object.keys(row)) {
        table_row += `<td>${row[Object.keys(row)[key]]}</td>`;
    }
    table_row += `</tr>`;

    return table_row;

}