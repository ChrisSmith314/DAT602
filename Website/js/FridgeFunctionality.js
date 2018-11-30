var FridgeID = 1001;

var client = new Paho.MQTT.Client(location.hostname, Number(location.port), "clientId");

function eventListen(){
    //Space that will be used to listen for MQTT activations from the fridge but for now will be listening for keyboard commands
}

window.addEventListener("keydown", function(){
    if(event.keyCode == 79){
        wakeUp();
    }
    if(event.keyCode == 80){
        sleep();
    }
    if(currentPage == "scan"){
        if(event.keyCode == 32){
            snapshot();
        }
    }
})

window.onload = getFood();//Just temporary so I don't have to keep waiting 10 seconds

function wakeUp(){
    document.body.classList.remove("sleep");
    startWebcam();
    getFood();
    getRecipes();
}

function sleep(){
    document.body.classList.add("sleep");
    stopWebcam();
}

var currentPage = "scan";

function loadPage(page){//Script for loading the different sections of the app
   // wakeUp();
    document.body.classList.remove(currentPage);
    setTimeout(function(){
        document.body.classList.add(page);
        currentPage = page;
    },0);
}

function popup(msg, type, func){
    var popup = document.createElement("div");
    popup.id = "popup";
    var p = document.createElement("p");
    p.innerHTML = msg;
    
    var input = document.createElement("input");
    input.type = type;
    input.id = "popupValue"
    
    var button = document.createElement("input");
    button.type = "button";
    button.value = "Confirm";
    
    popup.appendChild(p);
    popup.appendChild(input);
    popup.appendChild(button);
    document.body.appendChild(popup);
    return button
}

function closePopup(){
    document.getElementById("popup").parentNode.removeChild(document.getElementById("popup"))
}