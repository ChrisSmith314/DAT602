var FridgeID = 1001;
var itemRemoved;
var itemAdded
var doorOpen
var takePhoto;
var raspberryIP = window.location.hostname;
if(raspberryIP == "localhost"){
    raspberryIP = prompt("Please enter the Raspberry Pi's IP address", localStorage.getItem("IPAddress"));
    localStorage.setItem("IPAddress", raspberryIP)//Code for testing purposes
}

//Code that deals with all the communications between the raspberry pi and the interface
function socketConnection(){
    console.log("Starting connection", raspberryIP);
    if(!WSConnected){
        itemRemoved = new WebSocket("wss://" + raspberryIP + ":1881/itemRemoved");//Opens a websocket link with the Raspberry pi
        itemRemoved.onopen = onConnect;
        itemRemoved.onmessage = removedItem;
        itemAdded = new WebSocket("wss://" + raspberryIP + ":1881/itemAdded");
        itemAdded.onopen = onConnect;
        itemAdded.onmessage = addedItem;
        doorOpen = new WebSocket("wss://" + raspberryIP + ":1881/doorOpen");
        doorOpen.onopen = onConnect;
        doorOpen.onmessage = openDoor;
        takePhoto = new WebSocket("wss://" + raspberryIP + ":1881/takeImage");
        takePhoto.onopen = onConnect;
        takePhoto.onmessage = takeImage;
    }
    
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
    console.log("the door is doing something")
    if(data.data == "OPEN"){
        wakeUp();
    } else if(data.data == "CLOSE"){
        sleep();
    }
}

var flashTime = 5;
var timeoutFlash;
var canPhoto = true;
var fadeTimeout;

function takeImage(data){//Code for calling script to take an image
    var msg = document.getElementById("imageAlert")
    if(data.data == "FLASH" && canPhoto){
        console.log("PHOTO IN: " + flashTime)
        msg.innerHTML = "IMAGE IN " + flashTime;//Code for creating the popup message
        msg.style.opacity = "1";
        fadeTimeout = setTimeout(function(){
            msg.style.opacity = "0";
        },500);
        clearTimeout(timeoutFlash);
        flashTime--;
        if(flashTime <= -1){
            msg.style.opacity = "0";//Hides the message if it is less than zero
            snapshot();//Calls function to take the photo
            flashTime = 5;
            canPhoto = false;
            setTimeout(function(){
                canPhoto = true;//Code to prevent thhe system from taking another photo for another 5 seconds
            }, 5000);
        }
        timeoutFlash = setTimeout(function(){
            flashTime = 5;
        }, 3000);
    }
}

var WSConnected = false;

function onConnect(data){
    console.log("Connected");
    console.log(data)
    var ws = data.currentTarget.url.toString().split("/")[3];
    alertPrompt("Socket Connected: " + ws)
    WSConnected = true;
   // client.subscribe("World");
   /* message = new Paho.MQTT.Message("Hello");
    message.destinationName = "World";
    client.send(message);*/
}

function failed(message){
    console.log("I have failed")
    console.log(message)
    WSConnected = false;
    alertPrompt("No Socket Connection")
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
    alertPrompt("Waking up");
    setTimeout(wakeUp,5000);
    setTimeout(socketConnection, 500);
    setDate();
    dateInterval = setInterval(setDate, 60000);
    console.log("hello")
}

var sleeping = true;

function wakeUp(){
    var sleeping = false;
    document.body.classList.remove("sleep");
    try{
        startWebcam();
    }catch(err){
        alertPrompt("No camera")
        setTimeout(wakeUp,1000)//Keeps calling wakeUp function until it works
    }
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

var sleepTimeout;

function setFullscreen(){
    if(sleeping){
        wakeUp();
    }
    clearTimeout(sleepTimeout)
    sleepTimeout = setTimeout(sleep, 300000);
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

var alertTimeout;

function alertPrompt(msg){//Code for calling the alert prompt
    clearTimeout(alertTimeout)
    var alert = document.getElementById("alert");
    alert.innerHTML = msg;
    alert.style.opacity = "1";
    alertTimeout = setTimeout(function(){
        alert.style.opacity = "0";
    },3000);
}