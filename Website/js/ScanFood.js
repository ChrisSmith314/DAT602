//Code for camera 

navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

var video;
var webcamStream;

function startWebcam() {
    if (navigator.getUserMedia) {
        var reader = new dynamsoft.BarcodeReader();
        navigator.getUserMedia (
            //Contraints
            {
                video: true,
                audio: false
            },
            // successCallback
            function(localMediaStream) {
                video = document.querySelector('video');
                video.srcObject = localMediaStream;
                webcamStream = localMediaStream;
                
            },
            // errorCallback
            function(err) {
                console.log(err);
                console.log("The following error occured: " + err);
            }
        );
        
        /*reader.decodeVideo(document.getElementById("webcam1")).then(results=>{
            for(var i = 0; i < results.length; ++i){
                console.log(results[i].BarcodeText);
                // If Confidence >= 30, the barcode results are reliable
                console.log(results[i].LocalizationResult.ExtendedResultArray[0].Confidence);
            }
        })*/

    } else {
        console.log("getUserMedia not supported");
    }  
}

function stopWebcam() {
    webcamStream.stop();
}
//---------------------
// TAKE A SNAPSHOT CODE
//---------------------
var canvas, ctx;

function init() {
    // Get the canvas and obtain a context for
    // drawing in it
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext('2d');
}

function snapshot() {
    document.body.classList.add("flash")
    // Draws current image from the video element into the canvas
    setTimeout(function(){
        ctx.drawImage(video, 0,0, canvas.width, canvas.height);
        var imageData = canvas.toDataURL("image/jpeg");
        var image = {url: imageData};
        var barcodeFound;
        console.log("IMAGE")
        var reader = new dynamsoft.BarcodeReader(licenceKey);
        reader.decodeBase64String(imageData).then(results=>{
            for(var i = 0; i < results.length; ++i){
                console.log(results)
                barcodeFound = results[i].BarcodeText;
                console.log(barcodeFound)
            }
            if(barcodeFound != undefined){
                scanBarcode(barcodeFound)
            } else {
                scanImage(image)
            }
        });
        setTimeout(function(){
            document.body.classList.remove("flash")
        },500)
    }, 100);
}

var licenceKey = "f0068NQAAAMW5fTmBoPVtc4AJGdGSxvPic4SSBXSOkTTqo6ZfvimZXXKy/u9PkATiwUVlEqgzhk5s2Wp6nZZ5yY1itV8oPv8=";

dynamsoft = self.dynamsoft || {};
dynamsoft.dbrEnv = dynamsoft.dbrEnv || {};
dynamsoft.dbrEnv.onAutoLoadWasmSuccess = function(){
    document.getElementById('divLoadInfo').innerHTML="load dbr wasm success.";
};
dynamsoft.dbrEnv.onAutoLoadWasmError = function(status){
    document.getElementById('divLoadInfo').innerHTML="load wasm failed: "+status;
};

/*Connecting to node-red*/
function scanImage(image){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var items = this.responseText;
            var display = document.getElementsByClassName("returnedFood")[0];
            display.innerHTML = "";
            if(items.indexOf("No Products Found") > -1){
                var h3 = document.createElement("h3");
                h3.innerHTML = items;
                display.appendChild(h3);
            } else {
                items = JSON.parse(items);
                var content = document.createElement("div");
                for(i=0; i<items.length; i++){
                    var div = document.createElement("div");
                    var img = document.createElement("img");
                    var h4 = document.createElement("h4");
                    div.className = "foodItem";
                    
                    img.src = items[i].image;
                    
                    h4.innerHTML = items[i].name;
                    
                    div.appendChild(img);
                    div.appendChild(h4);
                    div.dataset.name = items[i].name;
                    div.dataset.tpnb = items[i].tpnb;
                    
                    div.onclick = function(){
                        prepareToAdd(this.dataset.name, this.dataset.tpnb)
                    }
                    
                    display.appendChild(div);
                }
            }
        }
    };
    xhttp.open("POST", "https://dat602-chris-smith.eu-gb.mybluemix.net/newImage", true);
    xhttp.send(JSON.stringify(image));
}

var currentItems;

function scanBarcode(barcode){
    var data = JSON.stringify({barcode: barcode});
    currentItems = new Array();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
            var item = this.responseText;
            var display = document.getElementsByClassName("returnedFood")[0];
            display.innerHTML = "";
            item = JSON.parse(item).products;
            if(item.length > 0){
                item = item[0]
                var img = document.createElement("img");
                var h4 = document.createElement("h4");
                var button = document.createElement("input");
                var button2 = document.createElement("input");
                
                button.type = "button";
                button.dataset.num = 0;
                currentItems.push(item);
                button.id = "newItem"
                button.onclick = function(){
                    addItem(currentItems[this.dataset.num]);
                    return false;
                }
                
                button2.type = "button";
                button2.value = "cancel";
                button2.onclick = function(){
                    display.innerHTML = "";
                }

                //img.src = item.image;

                h4.innerHTML = item.description;

                //display.appendChild(img);
                display.appendChild(h4);
                display.appendChild(button);
                display.appendChild(button2);
            } else {
                var h3 = document.createElement("h3");
                h3.innerHTML = "No Products Found";
                display.appendChild(h3);
            }
        }
    };
    xhttp.open("POST", "https://dat602-chris-smith.eu-gb.mybluemix.net/barcode", true);
    xhttp.send(data);
}

function prepareToAdd(name, tpnb){
    var data = JSON.stringify({barcode: tpnb, name: name});
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            scanBarcode(this.responseText);
        }
    };
    xhttp.open("POST", "https://dat602-chris-smith.eu-gb.mybluemix.net/addTesco", true);
    xhttp.send(data);
}

var itemWeight = "unknown";

function addItem(item){//Code to add items to the fridge database
    console.log(item)
    var data = "mode=add&userid=" + FridgeID + "&gtin=" + item.gtin + "&name=" + item.description + "&description=" + item.marketingText + "&weight=" + itemWeight;
    
    try{
        data = data + "&max_serving=" + item.gda.gdaRefs[0].headers[0];

        var servings = item.gda.gdaRefs[0].values;
        for(i=0; i<servings.length; i++){
            data = data + "&" + servings[i].name.toLowerCase() + "=" + servings[i].percent;
        }
    }catch(err){
        console.log("GDA data not available")
    }
    
    try{
        data = data + "&allergens=" + item.allergenAdvice.allergenText;
    }catch(err){
        console.log("allergens not available")
    }
    
    if(item.productCharacteristics.isFood == true){
        data = data + "&type=FOOD";
    } else if(item.productCharacteristics.isDrink == true){
        data = data + "&type=DRINK";
    } else {
        var notFood = confirm("This item does not appear to be food. Are you sure you want to continue?", "yes", "no");
        if(notFood == "no"){
            return false;
        }
    }
    
    data = data + "&quantity=" + 1;//Assuming only 1 item is added
    console.log(data)
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText.split(",");
            if(response[0] == "NoExpiryDate"){
                addExpiryDate(response[1],response[2]);
            } else {
                alert("Item Added");
            }
        }
    };
    xhttp.open("POST", "https://smartfridge.crumbdesign.co.uk/php/database.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}

function addExpiryDate(gtin, name){
    var date = popup("The expiry date for this product is unavailable. Please help us to improve this service by typing the Best Before date in below.", "date");
    console.log(gtin)
    date.onclick = function(){
        console.log(gtin)
        var date = document.getElementById("popupValue").value
        var data = "mode=expirydate&gtin=" + gtin + "&name=" + name + "&date=" + date;
        console.log(data)
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText)
                closePopup();
            }
        };
        xhttp.open("POST", "https://smartfridge.crumbdesign.co.uk/php/database.php", true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(data);
        return false;
    }
}





