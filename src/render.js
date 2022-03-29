const ipc = require('electron').ipcRenderer;
const buttonCreated = document.getElementById('upload');

var maxRows = 100;

buttonCreated.addEventListener('click', (event) => {
    ipc.send('open-file-dialog-for-file')
});

ipc.on('selected-file', (event, file_details) => {
    
    document.getElementById('file_uploaded').innerHTML = 
    "Current File Path: " + `<p class="grey-text">${file_details.path}</p>`;
    
    let file_table_element = document.getElementById('file_data');
    let file_table = '';

    file_table += `<thead><tr>`;
    for (let i = 0; i < Object.keys(file_details.data[0]).length; i++) {
        let keys = Object.keys(file_details.data[0]);
        let th = `<th>${keys[i]}</th>`;
        file_table += th;
    }
    file_table += `</tr></thead>`;

    for (let i = 0; i < maxRows && i < file_details.data.length; i++) {
        file_table += getTableRow(file_details.data[i]);
    }

    file_table_element.innerHTML = file_table;

});


const getTableRow = (row) => {

    let table_row = `<tr>`
    for (key in Object.keys(row)) {
        table_row += `<td>${row[Object.keys(row)[key]]}</td>`;
    }
    table_row += `</tr>`;

    return table_row;

}