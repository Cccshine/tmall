<?php 
DEFINE('DB_USER','root');
DEFINE('DB_PASSWORD','0914');
// DEFINE('DB_PASSWORD','770809');
DEFINE('DB_HOST','localhost');
DEFINE('DB_NAME','tmall');

$br = '<br>';

if($dbc = mysql_connect(DB_HOST,DB_USER,DB_PASSWORD)){

	if(!mysql_select_db(DB_NAME)){//当选择数据库出错时，通过trigger_error使用自定义错误处理函数
		trigger_error('Could not select the database\n$br'.mysql_error());
		exit();
	}else{
		mysql_select_db(DB_NAME);
	}
}else{//当无法连接到数据库时，通过trigger_error使用自定义错误处理函数
	trigger_error('Could not connect to MySQL:\n$br'.mysql_error());
	exit();
}

//
function escape_data($data){

	//如果开启了Magic Quotes则将存在的‘\’删除，避免二次转义
	if(ini_get('get_magic_quotes_gpc')){
		$data = stripcslashes($data);
	}

	//判断函数是否存在后对字符串中的特殊字符进行转义
	if(function_exists('mysql_real_escape_string')){
		global $dbc;
		$data = mysql_real_escape_string(trim($data),$dbc);
	}else{
		$data = mysql_escape_string(trim($data));
	}

	return $data;
}
?>

