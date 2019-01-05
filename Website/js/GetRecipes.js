function searchRecipe(element){
    var query = element.parentElement.getElementsByClassName("query")[0].value;
    
    var data = "mode=findRecipe&query=" + query;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            element.parentElement.getElementsByClassName("query")[0].value = "";
            listRecipes();
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
                console.log(response[i])
                days[i].dataset.link = response[i].recipe.Link
                days[i].onclick = function(){
                    window.location = this.dataset.link
                }
                console.log(thisDay + " " + currentDay)
                if(thisDay < currentDay){
                    days[i].classList.add("complete");
                } else {
                    days[i].classList.remove("complete")
                }
            }
            document.getElementById("mealPlan").style.display = "";
            document.getElementById("recipeList").style.display = "";
            
            document.getElementById("recipeSearchBox").style.visibility = "";//BHides the search box
        }
    };
    xhttp.open("POST", "http://smartfridge.crumbdesign.co.uk/php/database.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}

function listRecipes(){//Code to get all the recipes in the database
    var data = "mode=listRecipes&userid=" + FridgeID;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            var recipeDiv = document.getElementById("recipeList");
            recipeDiv.innerHTML = "";
            recipeDiv.scrollTo(0,0);
            for(i=0; i<response.length; i++){
                var div = document.createElement("div");
                div.classList.add("item");
                if(response[i].fullIngredients == true){
                    div.classList.add("full");
                }
                div.dataset.link = response[i].Link
                div.onclick = function(){
                    window.location = this.dataset.link
                }
                var h4 = document.createElement("h4");
                h4.innerHTML = response[i].Name;
                div.appendChild(h4);
                recipeDiv.appendChild(div);
            }
            document.getElementById("mealPlan").style.display = "none";
            document.getElementById("recipeList").style.display = "block";
            
            document.getElementById("recipeSearchBox").style.visibility = "visible";//Brings up the search box
        }
    };
    xhttp.open("POST", "http://smartfridge.crumbdesign.co.uk/php/database.php", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(data);
}