function promptRemoval(size){
    var data = "mode=promptRemoval&userid=" + FridgeID + "&size=" + size
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            var list = document.getElementById("itemRemoved").getElementsByClassName("content")[0];
            list.innerHTML = "";
            for(i=0; i<response.length; i++){
                var h3 = document.createElement("h3");
                h3.dataset.id = response[i].ID;
                h3.dataset.gtin = response[i].GTIN;
                h3.innerHTML = response[i].Name;
                h3.onclick = function(){
                    console.log("Removing item")
                    removeItem(this.dataset.id, this.dataset.gtin);
                }
                list.appendChild(h3);
            }
            list.parentElement.classList.add("display")
        }
    };
    xhttp.open("POST", "https://smartfridge.crumbdesign.co.uk/php/remove_items.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}

function removeItem(id, gtin){
    var data = "mode=removeItem&id=" + id + "&gtin=" + gtin;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            document.getElementById("itemRemoved").classList.remove("display");
        }
    };
    xhttp.open("POST", "https://smartfridge.crumbdesign.co.uk/php/remove_items.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}