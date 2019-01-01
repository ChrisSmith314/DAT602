<?php 

function getRecipes($query){
    //Code for connecting to the Edaman API
    $app_id = "a1c094dc";
    $app_key = "140a54562d93c0848fe7f49b6e3ce315";
    $url =  "https://api.edamam.com/search?q=" . str_replace(" ", "%20", $query) . "&app_id=" . $app_id . "&app_key=" . $app_key;
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
    $result = curl_exec($curl);
    curl_close($curl);
    $result = json_decode($result, true);
    $hits = $result['hits'];
    
    for($x=0; $x<count($hits); $x++){
        $current = $hits[$x]['recipe'];
        $name = $current['label'];
        $sqlQuery = "SELECT * FROM Recipes WHERE Name = '" . $name . "';";
        $result = $GLOBALS['conn']->query($sqlQuery);
        if($result->num_rows <= 0){
            $health = json_encode($current['healthLabels']);
            $ingredients = json_encode($current['ingredientLines']);

            $nutrients = $current['totalNutrients'];

            $fat = $nutrients['FAT']['quantity'] . " " . $nutrients['FAT']['unit'];
            $sugar = $nutrients['SUGAR']['quantity'] . " " . $nutrients['FAT']['unit'];
            $protein = $nutrients['PROCNT']['quantity'] . " " . $nutrients['FAT']['unit'];
            $carbs = $nutrients['CHOCDF']['quantity'] . " " . $nutrients['FAT']['unit'];
            $saturates = $nutrients['FASAT']['quantity'] . " " . $nutrients['FAT']['unit'];

            $image = $current['image'];
            
            $yield = $current['yield'];
            $link = $current['url'];
            
            $sqlQuery = "INSERT INTO Recipes (Name, Search_Query, Ingredients, Fat, Sugar, Protein, Carbs, Saturated, Image, Health_Labels, Serves, Link) VALUES ('" . $name . "', '" . $query . "', '" . $ingredients . "', '" . $fat . "', '" . $sugar . "', '" . $protein . "', '" . $carbs . "', '" . $saturates. "', '" . $image . "', '" . $health . "', '" . $yield . "', '" . $link . "');";
            $result = $GLOBALS['conn']->query($sqlQuery);
        }
        
        
        
    }
}

function availableRecipes(){
    $used = [];
    $partialIngredients = [];
    $fullIngredients = [];
    $query = "SELECT * FROM Fridge_storage WHERE User_ID = '" . $_POST['userid'] . "';";
    $result = $GLOBALS['conn']->query($query);
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $items = explode(" ",$row['Name']);
            foreach($items as $item){
                if(!in_array($item, $used)){
                    $query2 = "SELECT * FROM Recipes WHERE Ingredients LIKE '%" . $item . "%';";
                    $recipes = $GLOBALS['conn']->query($query2);
                    $used[] = $item;
                    
                    if($recipes->num_rows > 0){
                        while($row1 = $recipes->fetch_assoc()){
                            if(!in_array($row1, $partialIngredients)){
                                $partialIngredients[] = $row1;
                                $fullIngredients[] = $row1;
                            }
                        }
                    }
                    
                    for($x=0; $x<count($fullIngredients); $x++){
                        if(!(strpos($fullIngredients[$x]['Ingredients'], $item) === false)){
                            unset($fullIngredients[$x]);
                        }
                    }
                }
            }
        }
    }
    return $fullIngredients;
}

$searchParameters = [];
$triedRecipes = [];
$totalRecipes = 0;
$range = 0;
$recipes = "hello";
$i = -1;

function weeklyPlan(){
    $mondayDate = date("Y-m-d", strtotime("Monday this week"));
    $query = "SELECT * FROM Weekly_plan WHERE User_id = '" . $_POST['userid'] . "' AND Date = '" . $mondayDate . "';";
    $result = $GLOBALS['conn']->query($query);
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            echo $row['Recipes'];
        }
    } else {
    
        $GLOBALS['searchParameters'] = [];
        $GLOBALS['triedRecipes'] = [];
        $GLOBALS['recipes'] = array_values(availableRecipes());
        //echo var_dump($GLOBALS['recipes']);
        $GLOBALS['totalRecipes'] = count($GLOBALS['recipes']);
        $GLOBALS['range'] = range(0,$GLOBALS['totalRecipes']);
        shuffle($GLOBALS['range']);

       // echo "Total Recipes: " . $totalRecipes;

        function getNum(){
            $GLOBALS['i'] = intval($GLOBALS['i']) + 1;
            $rand = intval($GLOBALS['range'][intval($GLOBALS['i'])]);
            /*if(($GLOBALS['i']+1) >= $GLOBALS['totalRecipes']){
                shuffle($GLOBALS['range']);
                $GLOBALS['i'] = -1;
            }*/
            if(in_array($GLOBALS['recipes'][$rand]['Search_Query'], $GLOBALS['searchParameters'])){
                //echo var_dump($GLOBALS['triedRecipes']);
                if(!in_array($GLOBALS['recipes'][$rand]['ID'], $GLOBALS['triedRecipes'])){
                    $GLOBALS['triedRecipes'][] = $GLOBALS['recipes'][$num]['ID'];
                    if($GLOBALS['i'] >= $GLOBALS['totalRecipes']){
                        $GLOBALS['searchParameters'] = [];
                        $GLOBALS['triedRecipes'] = [];
                        shuffle($GLOBALS['range']);
                        $GLOBALS['i'] = -1;
                    }
                }
                return getNum($GLOBALS['recipes']);
            } else {
                return $rand;
            }
            //return $rand;
        }
        function getRecipe(){
            $num = getNum($GLOBALS['recipes']);
            $GLOBALS['searchParameters'][] = $recipes[$num]['Search_Query'];
            return $GLOBALS['recipes'][$num];
        }

        $weeklyPlan = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        for($x=0; $x<count($weeklyPlan); $x++){
            $today = getRecipe();
            $today['Ingredients'] = json_decode($today['Ingredients']);
            $today['Health_Labels'] = json_decode($today['Health_Labels']);
            $weeklyPlan[$x] = array("day"=> $weeklyPlan[$x], "recipe"=> $today);
        }

        $query = "DELETE FROM Weekly_plan WHERE User_id = '" . $_POST['userid'] . "';";
        $result = $GLOBALS['conn']->query($query);

        $query = "INSERT INTO Weekly_plan (User_id, Date, Recipes) VALUES ('" . $_POST['userid'] . "', '" . $mondayDate . "', '" . json_encode($weeklyPlan) . "');";
        $result = $GLOBALS['conn']->query($query);


        echo json_encode($weeklyPlan);
    }
}
?>