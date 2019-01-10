<?php 
include("database.php");

if($mode == "promptRemoval")promptRemoval();
if($mode == "removeItem")removeItem();

function promptRemoval(){
    $size = 0 - $_POST['size'];//Convert the negative number to a positive
    $sizeRange = array($size*0.8, $size*1.2);//Creates a range 20% above and below the items size
    $query = "SELECT * FROM Fridge_storage WHERE Weight BETWEEN " . $sizeRange[0] . " AND " . $sizeRange[1] . " AND User_ID = " . $_POST['userid'] . ";";
    $result = $GLOBALS['conn']->query($query);
    
    $foundItems = [];
    $usedGtin = [];
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            if(!in_array($row['GTIN'], $usedGtin)){
                $usedGtin[] = $row['GTIN'];
                $foundItems[] = $row;
            }
        }
        
        echo json_encode($foundItems);
    } else {
        echo "Unknown Item Removed";
    }
}

function removeItem(){
    /*Gets the current number of items in the Storage*/
    $query = "SELECT * FROM Storage WHERE GTIN = " . $_POST['gtin'] . ";";
    $result = $GLOBALS['conn']->query($query);
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $quantity = $row['Quantity'] - 1;
        }
    }
    if($quantity <= 0){
        $query = "DELETE FROM Storage WHERE GTIN = " . $_POST['gtin'] . ";";
    } else {
        $query = "UPDATE Storage SET Quantity = " . $quantity . " WHERE GTIN = " . $_POST['gtin'] . ";";
    }
    
    $result = $GLOBALS['conn']->query($query);
    
    $query = "DELETE FROM Fridge_storage WHERE ID = " . $_POST['id'] . ";";
    $result = $GLOBALS['conn']->query($query);
    
    echo "Item Removed";
}
?>