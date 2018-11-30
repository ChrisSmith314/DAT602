<?php 
function getItems(){
    $query = "SELECT * FROM Fridge_storage WHERE User_ID = '" . $_POST['userid'] . "';";
    $result = $GLOBALS['conn']->query($query);
    
    $gtin = [];
    $name = [];
    $quantity = [];
    $useby = [];
    
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $arrayPos = array_search($row['GTIN'], $gtin);
            if(!in_array($row['GTIN'], $gtin)){
                $gtin[] = $row['GTIN'];
                $name[] = $row['Name'];
                $quantity[] = array(1);
                $useby[] = array($row['Date_added']);
            } else {
                $subArrayPos = array_search($row['Date_added'], $useby[$arrayPos]);
                if(in_array($row['Date_added'], $useby[$arrayPos])){
                    $quantity[$arrayPos][$subArrayPos] = intval($quantity[$arrayPos]) + 1;
                } else {
                    $quantity[$arrayPos][] = 1;
                    $useby[$arrayPos][] = $row['Date_added'];
                }
            }
            //sleep(1);
        }
    
        for($x=0;$x<count($gtin);$x++){
            $query = "SELECT AvgShelfLife FROM Expiry_dates WHERE GTIN = '" . $gtin[$x] . "';";
            $result = $GLOBALS['conn']->query($query);
            if($result->num_rows > 0){
                while($row = $result->fetch_assoc()){
                    for($e=0;$e<count($useby[$x]);$e++){
                        $expires = date("m d Y", strtotime($useby[$x][$e] . " + " . $row['AvgShelfLife'] . " days"));
                        $useby[$x][$e] = $expires;
                    }
                }
            } else {
                $useby[$x] = "N/A";
            }
        }
        
        $return = array();
        $return['gtin'] = $gtin;
        $return['name'] = $name;
        $return['quantity'] = $quantity;
        $return['useby'] = $useby;
        echo json_encode($return);
    } else {
        echo "EMPTY FRIDGE";
    }
}
?>