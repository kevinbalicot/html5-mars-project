var rotation = 90;

function rudderRightBtnClick(){
    rotation += 30;
    document.getElementById("rudderImg").style.transform = "rotate("+rotation+"deg)";
}

function rudderLeftBtnClick(){
    rotation -= 30;
    document.getElementById("rudderImg").style.transform = "rotate("+rotation+"deg)";
}

function moveUp(){
    let movementPowerValue = Number(document.getElementById("movementPower").value);
    movementPowerValue += 0.25;
    document.getElementById("movementPower").value = movementPowerValue;

    if(movementPowerValue>1){
        document.getElementById("movementPower").value = "1";
    }
}

function moveDown(){

let movementPowerValue = Number(document.getElementById("movementPower").value);
movementPowerValue -= 0.25;
document.getElementById("movementPower").value = movementPowerValue;

if(movementPowerValue<0){
    document.getElementById("movementPower").value = "0";
    }
}

document.addEventListener('keydown', function (event) {
    switch (event.key){
        case 'ArrowLeft':
        case 'q':
            rudderLeftBtnClick();
            break;
        case 'ArrowRight':
        case 'd':
            rudderRightBtnClick();
            break;
        case 'ArrowUp':
        case 'z':
            moveUp();
            break;
        case 'ArrowDown':
        case 's':
            moveDown();
            break;
        default:
            console.log(event.key);
    }
});

function loadFile(event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
  };

function Connection(){
    window.location = document.getElementById("jobSelect").value+'.html?team='+document.getElementById("teamSelect").value+'&username='+document.getElementById("usr").value;
}