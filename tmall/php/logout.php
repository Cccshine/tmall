<?php
require_once('config.inc.php');
session_start();
//重置会话值，销毁会话数据
$_SESSION = array();
session_destroy();
setcookie(session_name(),'',time()-172800,'/','www.caojiacong.cn',0);

$url = 'http://' . $_SERVER['HTTP_HOST'];

if ((substr($url, -1) == '/') OR (substr($url, -1) == '\\') ) {
	$url = substr ($url, 0, -1); // Chop off the slash.
}

$url .= '/index.html';

header("Location: $url");
exit();
?>