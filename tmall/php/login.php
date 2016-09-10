<?php
require_once('config.inc.php');
ob_start();
session_start();

global $message;
require_once('mysql_connect.php');

$u = escape_data($_POST['username']);
$p = escape_data($_POST['password']);

$query = "SELECT user_id, name FROM users WHERE (name='$u' OR email='$u' OR tel='$u') AND password='$p'";
$result = mysql_query($query) or trigger_error("Query:$query\n<br>MySQL:".mysql_error());

if(mysql_num_rows($result)==1){
	$row = mysql_fetch_array($result,MYSQL_NUM);
	mysql_free_result($result);
	mysql_close();
	
	session_set_cookie_params(172800,'/','www.caojiacong.cn');
	$_SESSION['user_id'] = $row[0];
	$_SESSION['username'] = $row[1];

	ob_end_clean();
	exit();
}else if(empty($u) && empty($p)){
	$message = '请输入账户名和密码';
}else if(empty($u)){
	$message = '请输入账户名';
}else if(empty($p)){
	$message = '请输入密码';
}else{
	$message = '你输入的密码和账户名不匹配，是否<a href="#">忘记密码</a>或<a href="#">忘记会员名</a>';
}

echo "$message";
?>