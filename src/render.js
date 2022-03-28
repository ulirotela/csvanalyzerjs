const ipc = require('electron').ipcRenderer;
const buttonCreated = document.getElementById('upload');

buttonCreated.addEventListener('click', (event) => {
    ipc.send('open-file-dialog-for-file')
});

ipc.on('selected-file', (event, path) => {
    document.getElementById('file_uploaded').innerHTML = 
    "Current File Path: " + `<p class="grey-text">${path}</p>`;
});