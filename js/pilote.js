var rotation = 0;

function rudderRightBtnClick(){
    rotation += 30;
    document.getElementById("rudderImg").style.transform = "rotate("+rotation+"deg)";
}

function rudderLeftBtnClick(){
    rotation -= 30;
    document.getElementById("rudderImg").style.transform = "rotate("+rotation+"deg)";
}