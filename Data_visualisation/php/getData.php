<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
include 'serverinfo.php';

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$query = "SELECT id, Location FROM Users;";

$result = $conn->query($query);

$areas = ["South_west", "south_east", "London", "East_of_England", "East_Midlands", "Wales", "West_Midlands", "North_West", "Yorkshire_and_the_Humber", "North_East", "Scotland", "Isle_of_Man", "Northern_Ireland", "Southern_Ireland"];
$userAreas = [array(),array(),array(),array(),array(),array(),array(),array(),array(),array(),array(),array(),array(),array()];

while($row = $result->fetch_assoc()){
    $userAreas[array_search($row['Location'],$areas)][] = $row['id'];
}

    

$query = "SELECT * FROM Storage WHERE Energy != '';";

$result = $conn->query($query);

$productGTINs = array();
$products = array();

while($row = $result->fetch_assoc()){
    $productGTINs[] = $row['GTIN'];
    $products[] = $row;
}



$query = "SELECT * FROM Fridge_storage;";

$result = $conn->query($query);

$areaData = [array('name'=>"South_west",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"south_east",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"London",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"East_of_England",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"East_Midlands",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"Wales",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"West_Midlands",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"North_West",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"Yorkshire_and_the_Humber",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"North_East",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"Scotland",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"Isle_of_Man",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"Northern_Ireland",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0),
             array('name'=>"Southern_Ireland",'num'=>0, 'Energy'=>0,'Fat'=>0,'Saturates'=>0,'Sugars'=>0,'Salt'=>0)];

while($row = $result->fetch_assoc()){
    $current = $products[array_search($row['GTIN'], $productGTINs)];
    $areaNum = 0;
    for($x=0; $x<count($userAreas); $x++){
        if(in_array($row['User_ID'], $userAreas[$x]) && !$stop){
            $areaNum = $x;
            break;
        }
    }
    $areaData[$areaNum]['num'] = $areaData[$areaNum]['num'] + 1;
    $areaData[$areaNum]['Energy'] = $areaData[$areaNum]['Energy'] + intval($current['Energy']);
    $areaData[$areaNum]['Fat'] = $areaData[$areaNum]['Fat'] + intval($current['Fat']);
    $areaData[$areaNum]['Saturates'] = $areaData[$areaNum]['Saturates'] + intval($current['Saturates']);
    $areaData[$areaNum]['Sugars'] = $areaData[$areaNum]['Sugars'] + intval($current['Sugars']);
    $areaData[$areaNum]['Salt'] = $areaData[$areaNum]['Salt'] + intval($current['Salt']);
}

echo json_encode($areaData);
?>