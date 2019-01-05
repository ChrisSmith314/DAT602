<?php 
//Script for setting the account ip
include("database.php");

if($_POST['mode'] == "setIP")setIP();
var_dump($_POST);

function setIP(){
    $query = "UPDATE Users set IP_address = '" . $_POST['ip'] . "' WHERE id = '" . $_POST['userid'] . "';";
    echo $query;
    $result = $GLOBALS['conn']->query($query);
    echo "SUCCESS";
}

function getIP(){
    //Get ip done in another script
}
?>