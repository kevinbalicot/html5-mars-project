var rotation = 0;

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
}
