<?php
require_once('config.inc.php');
ob_start();
require_once('mysql_connect.php');

if(isset($_POST['tel'])){
	if(empty($_POST['tel'])){
		echo "请输入你的手机号";
	}else if(preg_match('#^1[0-9]{10}#',$_POST['tel'])){
		$tel = $_POST['tel'];
		$query = "SELECT tel FROM users WHERE tel='$tel'";
		$result = mysql_query($query);
		if(mysql_num_rows($result)){
			$tel = false;
			echo "该手机号已注册";
		}else{
			echo "1";
		}
	}else{
		echo "请输入正确的手机号";
	}
}

// 验证邮箱：由字母、数字、下划线、短线"-"、点号"." @ 字母、数字、短线"-"、域名后缀组成
if(isset($_POST['email'])){
	if(empty($_POST['email'])){
		echo "请输入你的邮箱号码";
	}else if(preg_match('#^[[:alnum:]][a-z0-9_\.\-]*@[a-z0-9\-]+\.[a-z]{2,4}$#',$_POST['email'])){
		$email = $_POST['email'];
		$query = "SELECT email FROM users WHERE email='$email'";
		$result = mysql_query($query);
		if(mysql_num_rows($result)){
			$email = false;
			echo "该邮箱已经被绑定，请更换邮箱";
		}else{
			echo "1";
		}
	}else{
		echo "请检查邮箱格式后重新输入";
	}
}

// 验证密码
if(isset($_POST['pass1'])){
	$strenth = '弱';
	if(empty($_POST['pass1'])){
		$errText = "请设置你的密码";
	}else{
		$pass1 = $_POST['pass1'];
		if(preg_match('#[[:alnum:][:punct:]]{6,20}#',$pass1)){
			$first = true;
		}else{
			$first = false;
		}
		if(preg_match('#[[:alnum:][:punct:]]+#',$pass1)){
			$second = true;	
		}else{
			$second = false;
		}
		if((preg_match('#[[:alpha:]]+#',$pass1)&&preg_match('#[0-9]+#',$pass1)) || 
			(preg_match('#[[:alpha:]]+#',$pass1)&&preg_match('#[[:punct:]]+#',$pass1)) ||
			(preg_match('#[0-9]+#',$pass1)&&preg_match('#[[:punct:]]+#',$pass1))){
			$three = true;
		}else{
			$three = false;
		}

		if(strlen($pass1)>16 && (preg_match('#[[:alpha:]]+#',$pass1)&&preg_match('#[0-9]+#',$pass1)&&preg_match('#[[:punct:]]+#',$pass1))){
			$strenth = '强';
		}else if(strlen($pass1)>8 && (preg_match('#[[:alpha:]]+#',$pass1)&&preg_match('#[0-9]+#',$pass1)) || 
			(preg_match('#[[:alpha:]]+#',$pass1)&&preg_match('#[[:punct:]]+#',$pass1)) ||
			(preg_match('#[0-9]+#',$pass1)&&preg_match('#[[:punct:]]+#',$pass1))){
			$strenth = '中';
		}else{
			$strenth = '弱';
		}

		if(!($first && $second && $three)){
			$pass1 = false;
			$errText = "你的密码不符合要求";
		}else{
			$pass1 = $_POST['pass1'];
		}		
	}
	$status = array(
			"first" => $first,
			"second" => $second,
			"three" => $three,
			"strenth" => $strenth,
			"errText" => $errText
			);
	echo json_encode($status);
}

if(isset($_POST['pass2'])){

	if(empty($_POST['pass2'])){
		echo "请再次输入你的密码";
	}else if($_POST['pass2'] == $_POST['p']){
		$pass2 = $_POST['pass2'];
		echo "1";
	}else{
		echo "两次输入的密码不一致，请重新输入";
	}
}

// 验证会员名
if(isset($_POST['vip-name'])){
	if(empty($_POST['vip-name'])){
		echo "请设置你的会员名，请不要包含除下划线以外的特殊符号";
	}else if(preg_match('#[[:alnum:]_]{5,25}#',$_POST['vip-name'])){
		$name = $_POST['vip-name'];
		$query = "SELECT name FROM users WHERE name='$name'";
		$result = mysql_query($query);
		if(mysql_num_rows($result)){
			$name = false;
			echo "该用户名已存在";
		}else{
			echo "1";
		}
	}else{
		echo "5-25个字符，推荐使用中文，请勿包含<br>姓名/身份证/银行卡等隐私信息，一旦设置成功无法修改";
	}
}

if(isset($_POST['submit'])){
	if($tel && $email && $pass1 && $pass2 && $name){
		$query = "INSERT INTO users (tel,email,password,name,register_date) VALUES ('$tel','$email',SHA('$pass1'),'$name',NOW())";
		$result = mysql_query($query);
	}
}
?>