<?php 
$conn = new mysqli("localhost", "smartfridge", "7RmpQQMjxGn6u2Vt", "everyware");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$query = "SELECT IP_address FROM Users WHERE id = '" . $_POST['userid'] . "';";
$result = $conn->query($query);
while($row = $result->fetch_assoc()){
    echo $row['IP_address'];
}
?>