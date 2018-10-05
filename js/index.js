var ws, modal;

function selectRole(){
    document.getElementById("formConnection").action = document.getElementById("jobSelect").value+'.html';
}

function loadFile(event) {
    var output = document.getElementById('output');
    var avatar = URL.createObjectURL(event.target.files[0]);
    output.src = avatar;
};

window.onload = function () {
// Get the modal
    modal = document.getElementById('modalConnection');

// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
    }
};

function Connection() {
    ws = new WebSocket('ws://92.222.88.16:9090' +
        '?team='+document.getElementById('teamSelect').value+
        '&username='+document.getElementById('usr').value+
        '&job='+document.getElementById('jobSelect').value
    );

    ws.onopen = function () {
        modal.style.display = "none";
        console.log("socket open with server !");
    };

    ws.onmessage = function(message) {
        console.log(message.data);
    };
}