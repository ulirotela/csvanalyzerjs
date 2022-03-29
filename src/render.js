const ipc = require('electron').ipcRenderer;
const buttonCreated = document.getElementById('upload');

var startingPoint = 0;
var tableIncrement = 5;

var global_file_details = null;

buttonCreated.addEventListener('click', (event) => {
    ipc.send('open-file-dialog-for-file')
});

const previousButton = document.getElementById('table_prev');
const nextButton = document.getElementById('table_next');

previousButton.addEventListener('click', (event)=> {
    startingPoint -= tableIncrement;
    if (startingPoint < 0) startingPoint = 0;
    renderTable();
})

nextButton.addEventListener('click', (event)=> {
    startingPoint += tableIncrement;
    renderTable();
})

ipc.on('selected-file', (event, file_details) => {
    
    document.getElementById('file_uploaded').innerHTML = 
    "Current File Path: " + `<p class="grey-text">${file_details.path}</p>`;

    global_file_details = file_details;

    let showButtons = document.querySelector('.btn-container');
    if (file_details.data.length > 0) {
        showButtons.classList.remove('hide');
    }
    else {
        showButtons.classList.add('hide');
    }

    renderTable();


});

const renderTable = (file_details = null) => {

    if (!file_details) file_details = global_file_details;

    if (startingPoint >= file_details.data.length) startingPoint = file_details.data.length - tableIncrement;

    let file_table_element = document.getElementById('file_data');
    file_table_element.innerHTML = "";

    let file_table = '';

    file_table += `<thead><tr>`;
    for (let i = 0; i < Object.keys(file_details.data[0]).length; i++) {
        let keys = Object.keys(file_details.data[0]);
        let th = `<th>${keys[i]}</th>`;
        file_table += th;
    }
    file_table += `</tr></thead>`;

    for (let i = startingPoint; i < startingPoint + tableIncrement && i < file_details.data.length; i++) {
        file_table += getTableRow(file_details.data[i]);
    }

    file_table_element.innerHTML = file_table;
}


const getTableRow = (row) => {

    let table_row = `<tr>`
    for (key in Object.keys(row)) {
        table_row += `<td>${row[Object.keys(row)[key]]}</td>`;
    }
    table_row += `</tr>`;

    return table_row;

}