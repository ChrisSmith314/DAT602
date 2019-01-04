function searchRecipe(element){
    var query = element.parentElement.getElementsByClassName("query")[0].value;
    
    var data = "mode=findRecipe&query=" + query;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xhttp.open("POST", "http://smartfridge.crumbdesign.co.uk/php/database.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}

var weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function getRecipes(){
    var data = "mode=getPlan&userid=" + FridgeID;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            var days = document.getElementById("mealPlan").getElementsByClassName("day");
            var currentDay = new Date().getDay()-1;
            if(currentDay == -1)currentDay = 6;
            for(i=0; i<response.length; i++){
                var thisDay = weekDays.indexOf(response[i].day);
                var text = response[i].day + " - " + response[i].recipe.Name;
                var h4 = document.createElement("h4");
                h4.innerHTML = text;
                days[i].innerHTML = ""
                days[i].appendChild(h4);
                console.log(thisDay + " " + currentDay)
                if(thisDay < currentDay){
                    days[i].classList.add("complete");
                } else {
                    days[i].classList.remove("complete")
                }
            }
        }
    };
    xhttp.open("POST", "http://smartfridge.crumbdesign.co.uk/php/database.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}