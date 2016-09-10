<?php
$live = TRUE;
function my_error_handler($e_number,$e_message,$e_file,$e_line,$e_vars){
	global $live;
	$br = '<br>';
	$message = "An error occurred in script '$e_file' on line $e_line: \n<br>$e_message\n$br";
	$message .= "Date/Time: " . date('n-j-Y H:i:s') . "\n$br";
	$message .= "<pre>".print_r($e_vars,1)."</pre>\n$br";
	//当站点未运行时打印错误以便调试
	if(!$live){
		if($e_number != E_NOTICE){
			//当错误具没有特定类型时打印普通消息
			echo 'A system error occurred. We apologize for the inconvenience.</div>$br';
		}else { 
			//当错误具有特定类型时打印特定消息
			echo  $message ."$br";
		}	
	}
}
set_error_handler('my_error_handler');
?>