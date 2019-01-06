var FridgeID = 1001;
var itemRemoved;
var itemAdded
var doorOpen
var raspberryIP = window.location.hostname;
if(raspberryIP == "localhost"){
    raspberryIP = prompt("Please enter the Raspberry Pi's IP address", localStorage.getItem("IPAddress"));
    localStorage.setItem("IPAddress", raspberryIP)//Code for testing purposes
}

//Code that deals with all the communications between the raspberry pi and the interface
function socketConnection(){
    console.log("Starting connection", raspberryIP);
    itemRemoved = new WebSocket("ws://" + raspberryIP + ":1881/itemRemoved");//Opens a websocket link with the Raspberry pi
    itemRemoved.onopen = onConnect;
    itemRemoved.onmessage = removedItem;
    itemAdded = new WebSocket("ws://" + raspberryIP + ":1881/itemAdded");
    itemAdded.onopen = onConnect;
    itemAdded.onmessage = addedItem;
    doorOpen = new WebSocket("ws://" + raspberryIP + ":1881/doorOpen");
    doorOpen.onopen = onConnect;
    doorOpen.onmessage = openDoor;
    
}

function removedItem(data){
    console.log("Oi, put that back");
    console.log(data);
    promptRemoval(data.data)
}

function addedItem(data){
    console.log("What was that");
    console.log(data);
    itemWeight = data.data;
    $(document.getElementById("newItem")).click();
}

function openDoor(data){//Code for when the door is open or closed
    if(data.data == "open"){
        wakeUp();
    } else if(data.data == "closed"){
        sleep();
    }
}

function onConnect(){
    console.log("Connected");
   // client.subscribe("World");
   /* message = new Paho.MQTT.Message("Hello");
    message.destinationName = "World";
    client.send(message);*/
}

function failed(message){
    console.log("I have failed")
    console.log(message)
}

window.addEventListener("keydown", function(){
   /* if(event.keyCode == 79){
        wakeUp();
    }
    if(event.keyCode == 80){
        sleep();
    }*/
    if(currentPage == "scan"){
        if(event.keyCode == 32){
            snapshot();
        }
    }
})

window.onload = function(){
    getFood();//Just temporary so I don't have to keep waiting 10 seconds
    init();
    setTimeout(wakeUp,5000);
    setTimeout(socketConnection, 500);
    setDate();
    dateInterval = setInterval(setDate, 60000);
    console.log("hello")
}

function wakeUp(){
    document.body.classList.remove("sleep");
    startWebcam();
    getFood();
    getRecipes();
    socketConnection();
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

function setFullscreen(){
    if(!window.document.fullscreenElement){
        document.body.requestFullscreen();
       }
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

var dateInterval;

function setDate(){
    var date = new Date();
    var currentTime = ("0" + date.getDate()).slice(-2) + "/" + ("0" + date.getMonth()+1).slice(-2) + "/" + date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + "<span class='timeColon'>:</span>" + ("0" + date.getMinutes()).slice(-2);
    document.getElementById("Date").innerHTML = currentTime;
}