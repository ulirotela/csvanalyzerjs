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
});

let constFilter = document.getElementById('const_name');
let fNameFilter = document.getElementById('first_name');
let lNameFilter = document.getElementById('last_name');

var globalFilters = {
    constName: '-1',
    fName: '-1',
    lName: '-1'
}

constFilter.addEventListener('change', (event)=> {
    globalFilters.constName = event.target.value;
    renderTable();
});

fNameFilter.addEventListener('change', (event)=> {
    globalFilters.fName = event.target.value;
    renderTable();
});

lNameFilter.addEventListener('change', (event) => {
    globalFilters.lName = event.target.value;
    renderTable();
});

ipc.on('selected-file', (event, file_details) => {
    
    document.getElementById('file_uploaded').innerHTML = 
    "Current File Path: " + `<p class="grey-text">${file_details.path}</p>`;

    global_file_details = file_details;
    globalFilters = {
        constName: '-1',
        fName: '-1',
        lName: '-1'
    }

    let showButtons = document.querySelector('.btn-container');
    let tableControls = document.querySelector('.table-controls');

    if (file_details.data.length > 0) {
        showButtons.classList.remove('hide');
        tableControls.classList.remove('hide');
    }
    else {
        showButtons.classList.add('hide');
        tableControls.classList.add('hide');
    }

    renderFilterOptions();
    renderTable();


});

const renderFilterOptions = (file_details = null)=> {

    if (!file_details) file_details = global_file_details;

    firstNames = new Set(file_details.data.map(row => row['Candidate First Name'].toUpperCase()));
    lastNames = new Set(file_details.data.map(row => row['Candidate surname'].toUpperCase()));
    constNames = new Set(file_details.data.map(row => row['Constituency Name'].toUpperCase()));

    fNameFilter.innerHTML = `<option value="-1">Select first name</option>`;
    lNameFilter.innerHTML = `<option value="-1">Select last name</option>`;
    constFilter.innerHTML = `<option value="-1">Select constituency</option>`;


    // adding all unique values to the dropdown
    firstNames.forEach(fname => {
        fNameFilter.innerHTML += `<option value="${fname}">${fname}</option>`;
    });

    lastNames.forEach(lname => {
        lNameFilter.innerHTML += `<option value="${lname}">${lname}</option>`;
    });

    constNames.forEach(constName => {
        constFilter.innerHTML += `<option value="${constName}">${constName}</option>`;
    });


}

const filterData = ({data}) => {

    // filter by constituency
    if (globalFilters.constName != '-1') {
        data = data.filter(row => row['Constituency Name'].toUpperCase() == globalFilters.constName.toUpperCase());
    }

    // filter by first name
    if (globalFilters.fName != '-1') {
        data = data.filter(row => row['Candidate First Name'].toUpperCase() == globalFilters.fName.toUpperCase());
    }

    // filter by last name
    if (globalFilters.lName != '-1') {
        data = data.filter(row => row['Candidate surname'].toUpperCase() == globalFilters.lName.toUpperCase());
    }

    return data;

}

const renderTable = (file_details = null) => {

    if (!file_details) file_details = global_file_details;
    if (startingPoint >= file_details.data.length) startingPoint = file_details.data.length - tableIncrement;

    let file_table_element = document.getElementById('file_data');
    file_table_element.innerHTML = "";

    file_details = filterData(global_file_details);

    let file_table = '';

    file_table += `<thead><tr>`;
    for (let i = 0; i < Object.keys(file_details[0]).length; i++) {
        let keys = Object.keys(file_details[0]);
        let th = `<th>${keys[i]}</th>`;
        file_table += th;
    }
    file_table += `</tr></thead>`;

    for (let i = startingPoint; i < startingPoint + tableIncrement && i < file_details.length; i++) {
        file_table += getTableRow(file_details[i]);
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