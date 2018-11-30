function getFood(){
    var data = "mode=get&userid=" + FridgeID;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText)
            console.log(response)
            var table = document.getElementById("currentFoodTable");
            table.innerHTML = ""//table.getElementsByClassName("header")[0].outerHTML;
            for(i=0; i<response.gtin.length; i++){
                var item = response.name[i];
               // var description = "No Description";
                var useby,quantity,remaining;
                useby = quantity = remaining = "";
                for(e=0; e<response.quantity[i].length; e++){
                    var date = new Date(response.useby[i][e]);
                    //useby = useby + "<br>" + ("0" + date.getDate()).slice(-2) + " " + ("0" + (date.getMonth()+1)).slice(-2) + " " + date.getFullYear();
                    quantity = quantity + "<p>" + response.quantity[i][e] + "</p>";
                    var dateDifference = Math.round(parseInt((date.getTime()) - (new Date().getTime())) / 86400000);
                    remaining = remaining + "<p>" + dateDifference + "</p>";
                }
                
                var tr = document.createElement("div");
                tr.classList.add("item");
                var nameTD, descriptionTD, usebyTD, quantityTD, remainingTD;
                nameTD = document.createElement("div");
                nameTD.classList.add("name");
               // descriptionTD = document.createElement("div");
              //  usebyTD = document.createElement("div");
                quantityTD = document.createElement("div");
                quantityTD.classList.add("quantity");
                remainingTD = document.createElement("div");
                remainingTD.classList.add("daysRemaining")
                nameTD.innerHTML = item;
               // descriptionTD.innerHTML = description;
              //  usebyTD.innerHTML = useby;
                quantityTD.innerHTML = quantity;
                remainingTD.innerHTML = remaining;
                
                tr.appendChild(nameTD);
               // tr.appendChild(descriptionTD);
              // tr.appendChild(usebyTD);
                tr.appendChild(quantityTD);
                tr.appendChild(remainingTD);
                table.appendChild(tr);
            }
        }
    };
    xhttp.open("POST", "http://smartfridge.crumbdesign.co.uk/php/database.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}