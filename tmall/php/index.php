<?php
require_once('config.inc.php');
ob_start();
session_start();
require_once('mysql_connect.php');

if(isset($_SESSION['username'])){

	$uid = $_SESSION['user_id'];
	$name = $_SESSION['username'];


	$query = "SELECT name,score,message,cart,coupon FROM users WHERE user_id=$uid AND name='$name'";
	$result = mysql_query($query);
	$row = mysql_fetch_array($result,MYSQL_NUM);
	
	$info = array(
		'name' => $row[0],
		'score' => $row[1],
		'message' => $row[2],
		'cart' => $row[3],
		'coupon' => $row[4]);

	mysql_free_result($result);
	mysql_close();
	ob_end_clean();
	echo json_encode($info);
	exit();

}else{
	echo '1';
}
?>
