//========================================================
// 登录页开始
//========================================================
DOMReady(function() {
	var oLogin = getById('login');
	if (oLogin) {
		var oLoginBox   = getById('login-box');
		var oAccountBox = getByClass(oLoginBox, 'lg-account')[0];
		var oQrcodeBox  = getByClass(oLoginBox, 'lg-qrcode')[0];
		var wayIcons    = getByClass(oLoginBox, 'way-icon');
		var oTabWay     = getById('tab-way');
		var oQrcodeMain = getByClass(oQrcodeBox, 'qrcode-main')[0];
		var oQrcodeErr  = getByClass(oQrcodeBox, 'qrcode-err')[0];
		var oFreshBtn   = getById('fresh');

		//点击图标切换登录方式为二维码登录
		wayIcons[0].onclick = function() {
			oQrcodeBox.style.display = 'block';
			oAccountBox.style.display = 'none';
			//3分钟后二维码生效
			setTimeout(function() {
				oQrcodeErr.style.display = 'block';
				oQrcodeMain.style.opacity = '0';
				oQrcodeMain.style.filter = 'alpha(opacity=0)';
			}, 18000);
		}

		//点击图标切换登录方式为账号密码登录
		wayIcons[1].onclick = oTabWay.onclick = function() {
			oQrcodeBox.style.display = 'none';
			oAccountBox.style.display = 'block';
		}

		//刷新二维码
		oFreshBtn.onclick = function() {
			oQrcodeErr.style.display = 'none';
			doMove(oQrcodeMain, {
				"opacity": 100
			}, 200);
		}

		//
		var oAccountForm = getById('account-form');
		var oUser        = oAccountForm.username;
		var oPass        = oAccountForm.password;
		var oLoginBtn    = oAccountForm.submit;
		var oClearBtn    = getById('clear-icon');

		//清除用户名表单内容
		oUser.onkeyup = function() {
			oClearBtn.style.display = 'block';
		}

		//登录
		oLoginBtn.onclick = login;
		document.onkeydown = function(ev) {
			var ev = ev || event;
			if (ev.keyCode == 13) {
				login();
			}
		}
	}

	function login() {
		var oError = getById('lg-error');
		var oErrorTxt = getByName(oError, 'span')[0];
		var oH4 = getByName(oAccountBox, 'h4')[0];
		var data = {
			"username": oUser.value,
			"password": SHA1(oPass.value)
		};
		//通过ajax请求后台判断用户与密码是否可行
		ajax('POST', 'php/login.php', data, function(data) {
			if (data) {
				oError.style.display = 'block';
				oErrorTxt.innerHTML = data;
				oH4.style.visibility = 'hidden';
				oLoginBtn.value = "登录";
			} else {
				oError.style.display = 'none';
				oLoginBtn.value = "正在登录...";
				window.location.href = "index.html";
			}
		});
	}
});
//========================================================
// 登录页结束
//========================================================

//========================================================
//注册页开始
//========================================================

//Header部分搜索框的智能提示与搜索开始
//====================================
DOMReady(function() {
	//Header搜索
	var oHeader = getById('header');
	if (getById('search')) {
		var oSearchHeader = new Search('search', oHeader);
		oSearchHeader.getSearch();
		oSearchHeader.toBoxClick();
		oSearchHeader.toKeyUp();
		oSearchHeader.toBtnClick();
		oSearchHeader.toDocClick();
	}
});


//搜索框对象开始
//====================================

//搜索框构造函数
function Search(id, parent) {
	this.oForm = getById(id);
	this.oSearchTip = getByClass(parent, 'search-tip')[0];
	//输入框的value是否为默认值
	this.isDefault = true;
}
//搜索框的原型对象
Search.prototype = {
	constructor: Search,
	//获取输入框与按钮
	getSearch: function() {
		this.oSearchBox = this.oForm['search-box'];
		this.oSearchBtn = this.oForm['search-btn'];
	},
	//输入框的点击事件
	toBoxClick: function() {
		var This = this;
		addHandler(this.oSearchBox, 'click', function(ev) {
			var ev = ev || event;
			if (This.isDefault) {
				this.value = '';
				This.isDefault = false;
			} else {
				This.oSearchTip.style.display = 'block';
			}
			this.placeholder = '精选单品 惊艳一夏';
			//取消事件的默认行为
			if (ev.preventDefault) {
				ev.preventDefault();
			}
			return false;
		});
	},
	//显示智能提示列表
	showTip: function(form, obj) {
		var oScriptCb = getById('cb');
		if (this.oSearchBox.value != '') {
			//动态创建script调用回调函数
			var oScript = document.createElement('script');
			oScript.src = 'https://suggest.taobao.com/sug?code=utf-8&q=' + this.oSearchBox.value + '&callback=searchCb';
			oScriptCb.parentNode.insertBefore(oScript, oScriptCb);
		} else {
			this.oSearchTip.style.display = 'none';
		}
	},
	//输入框键盘抬起事件
	toKeyUp: function(obj) {
		var This = this;
		addHandler(This.oSearchBox, 'keyup', function() {
			This.showTip(This.oForm, obj);
		});
	},
	//搜索按钮点击事件
	toBtnClick: function() {
		var This = this;
		addHandler(This.oSearchBtn, 'click', function() {
			This.oForm.action = 'https://list.tmall.com/search_product.htm?q=' + This.oSearchBox.value;
		});
	},
	//document点击事件
	toDocClick: function() {
		var This = this;
		addHandler(document, 'click', function(ev) {
			var ev = ev || event;
			var target = ev.target || ev.srcElement;
			//当触发事件的目标不是输入框时执行
			if (target != This.oSearchBox) {
				This.oSearchTip.style.display = 'none';
				if (This.oSearchBox.value == '') {
					This.oSearchBox.value = '精选单品 惊艳一夏';
					This.isDefault = true;
				}
			}
		});
	}
}

//搜索智能提示框跨域获取数据后执行的回调函数
function searchCb(data) {
	var oHeader   = getById('header');
	var searchBox = $(document, 'input[name="search-box"]')[0];
	var searchTip = getByClass(document, 'search-tip')[0];

	search(searchBox, searchTip);

	function search(searchBox, searchTip) {
		var html = '';
		var keyLen = searchBox.value.length;
		var dataLen = data.result.length;

		if (dataLen) {
			searchTip.style.display = 'block';

			for (var i = 0; i < dataLen; i++) {
				//从返回的数据中提取关键字
				var key = data.result[i][0].substring(0, keyLen);
				//从返回的数据中提取关键字后的其他智能提示信息
				var keyTip = data.result[i][0].substring(keyLen);
				//创建列表并指定链接地址以搜索宝贝
				html += '<li><a target="_blank" href="https://list.tmall.com/search_product.htm?q=' + data.result[i][0] + '&type=p&vmarket="><strong class="keyword">' + key + '</strong><span class="key-tip">' + keyTip + '</span>' + '<span class="count">约' + data.result[i][1] + '个结果</span></a></li>';
			}
			//最后一项列表是搜索店铺
			html += '<li><a target="_blank" href="https://list.tmall.com/search_product.htm?q=' + searchBox.value + '&type=p&style=w"><i class="iconfont shop-icon">&#xe627;</i>找<strong class="keyword">' + searchBox.value + '</strong>相关<span class="key-tip">店铺</span>';

			searchTip.innerHTML = html;
		} else {
			searchTip.style.display = 'none';
		}
	}
}
// header搜索框部分结束
//====================================

//注册页主体部分开始
//====================================
DOMReady(function() {
	if (getById('register')) {
		//注册协议部分====================
		var oRgTip     = getById('rg-tip');
		var oAgreenBtn = getByClass(oRgTip, 'rg-btn')[0];
		var oCloseBtn  = getByClass(oRgTip, 'close-icon')[0];
		oAgreenBtn.onclick = function() {
			oRgTip.style.display = 'none';
		}
		oCloseBtn.onclick = function() {
			window.location.href = 'index.html';
		}

		var oStep        = getById('step');
		var steps        = getByName(oStep, 'li');
		var oStepCon     = getById('step-con');
		var nextBtns     = getByClass(oStepCon, 'rg-btn');

		// 步骤一设置用户名      ==============
		var oFormName    = getById('set-username');
		var oFormAccount = getById('set-account');

		var oSelected    = getById('selected');
		var oArrow       = getByClass(oFormName, 'arrow')[0];
		var oSelectList  = getByClass(oFormName, 'select-list')[0];
		var oSelectItem  = getByName(oSelectList, 'li');

		// 下拉菜单部分
		oArrow.onclick = function() {
			oSelectList.style.display = 'block';
		}

		//事件委托实现每个li的点击事件
		oSelectList.onclick = function(ev) {
			var ev = ev || event;
			var target = ev.target || ev.srcElement;
			if (target.nodeName != 'LI') {
				oSelected.innerHTML = target.parentNode.innerHTML;
			} else {
				oSelected.innerHTML = target.innerHTML;
			}
			this.style.display = 'none';
		}
		document.onclick = function() {
			oSelectList.style.display = 'none';
		}

		//验证手机号码
		var oTel = oFormName['tel'];
		validate(oTel);

		//滑块的拖拽验证部分
		var oVerify     = getById('verify');
		var oVerifyIcon = getByClass(oVerify, 'verify-icon')[0];
		var oProcess    = getById('process');
		var oPass       = getByClass(oVerify.parentNode, 'pass')[0];
		var w           = oVerify.offsetWidth - oVerifyIcon.offsetWidth; //滑块可以移动的最大宽度
		oVerify.isPass  = false;
		//拖拽实现
		oVerifyIcon.onmousedown = function(ev) {
			var ev = ev || event;

			var disX = ev.clientX - this.offsetLeft;

			oTel.blur(); //点击滑块 应使oTel失去焦点

			//设置全局捕获以阻止IE下的默认行为
			if (oVerifyIcon.setCapture) {
				oVerifyIcon.setCapture();
			}

			document.onmousemove = function(ev) {
				var ev = ev || event;
				var offset = ev.clientX - disX;

				//特殊处理，限制在父元素里面拖拽
				if (offset >= w - 5) {
					offset = w;
				} else if (offset <= 0) {
					offset = 0;
				}

				//移动滑块
				oVerifyIcon.style.left = offset + 'px';
				// 改变进度条宽度
				oProcess.style.width = offset + 'px';
				// 移除高光扫描
				removeClass(oVerify, 'haslight');

				// 滑块到最右端后表示验证通过，并移除事件
				if (offset == w) {
					getByName(oProcess, 'span')[0].style.display = 'block';
					oPass.style.display = 'block';
					oVerifyIcon.onmousedown = null;
					oVerify.isPass = true;
					addClass(nextBtns[0], 'available');
				}

			}
			document.onmouseup = function() {
					document.onmousemove = document.onmouseup = null;
					// 当验证未通过时应返回起点并添加高光扫描
					if (parseInt(getStyle(oVerifyIcon, 'left')) < w) {
						doMove(oVerifyIcon, {
							"left": 0
						}, 30);
						doMove(oProcess, {
							"width": 0
						}, 30);
						setTimeout(function() {
							addClass(oVerify, 'haslight');
						}, 1000);
						oVerify.isPass = false;
					}
					//释放全局捕获 releaseCapture();
					if (oVerifyIcon.releaseCapture) {
						oVerifyIcon.releaseCapture();
					}
				}
				//阻止默认行为
			return false;
		}

		//下一步按钮
		nextBtns[0].onclick = function() {
			if (oTel.isPass && oVerify.isPass) {
				oFormName.style.display = 'none';
				oFormAccount.style.display = 'block';
				addClass(steps[1], 'active');
			}
			return false;
		}

		//步骤2填写账户信息================
		var oEmail     = oFormAccount['email'];
		var oPassword1 = oFormAccount['pass1'];
		var oPassword2 = oFormAccount['pass2'];
		var oVipName   = oFormAccount['vip-name'];
		var oSuccess   = getById('success');

		//验证各表单的合法性
		validate(oEmail);
		validate(oPassword1);
		validate(oPassword2);
		validate(oVipName);

		//密码规则与强度提示框的相关DOM元素
		var status1  = getByClass(document, 'status1-icon');
		var status2  = getByClass(document, 'status2-icon');
		var status3  = getByClass(document, 'status3-icon');
		var oStrenth = getById('strenth');
		var levels   = getByName(oStrenth, 'span');
		var oLevel   = getById('level');


		//提交按钮
		nextBtns[1].onclick = function() {
			if (oEmail.isPass && oPassword1.isPass && oPassword2.isPass && oVipName.isPass) {
				oFormAccount.style.display = 'none';
				oSuccess.style.display = 'block';
				addClass(steps[2], 'active');
				var data = {
					"tel": oTel.value,
					"email": oEmail.value,
					"pass1": oPassword1.value,
					"p": oPassword1.value,
					"pass2": oPassword2.value,
					"vip-name": oVipName.value,
					"submit": true
				}
				ajax('POST', 'php/register.php', data, function(data) {
					//自动跳转
					setTimeout(function() {
						window.location.href = 'login.html';
					}, 3000);
				});
			}

			return false;
		}
	}

	function validate(obj) {
		var parent   = obj.parentNode;
		var oRuleTip = getByClass(parent, 'rule-tip')[0];
		var oPass    = getByClass(parent, 'pass')[0];
		var oError   = getByClass(parent, 'error')[0];
		var oErrText = getByClass(parent, 'err-text')[0];

		obj.isPass = false;

		//获得焦点时显示规则提示，并隐藏其他
		obj.onfocus = function() {
			removeClass(obj, 'validate-error');
			if (oRuleTip) {
				oRuleTip.style.display = 'block';
			}
			oError.style.display = 'none';
			oPass.style.display = 'none';
		}

		if (obj != oPassword1) {
			//若刷新后浏览器保存了表单值，则应该check,而不是等到失去焦点再check
			if (obj.value) {
				check();
			}
			//当验证对象不是设置密码时直接调用check
			obj.onblur = check;

		} else { //当验证对象为设置密码时

			//按键抬起时实时的检测密码的合法性与强度
			oPassword1.onkeyup = function() {
					var data = {};
					data[this.name] = this.value;

					ajax('POST', 'php/register.php', data, function(data) {
						var data = JSON.parse(data);
						changeStatus(data.first, 0);
						changeStatus(data.second, 1);
						changeStatus(data.three, 2);

						if (data.first && data.second && data.three) {
							var levelText = getByClass(oPass, 'level-text')[0];
							levelText.innerHTML = data.strenth;
							oPassword1.isPass = true;
						} else {
							oErrText.innerHTML = data.errText;
							addClass(obj, 'validate-error');
							oPassword1.isPass = false;
						}

						oLevel.innerHTML = data.strenth;

						if (data.strenth == '弱') {
							addClass(levels[0], 'haslevel');
							removeClass(levels[1], 'haslevel');
							removeClass(levels[2], 'haslevel');
						} else if (data.strenth == '中') {
							addClass(levels[1], 'haslevel');
							removeClass(levels[2], 'haslevel');
						} else if (data.strenth == '强') {
							addClass(levels[2], 'haslevel');
						}

						function changeStatus(status, i) {
							if (status) {
								status1[i].style.display = 'none';
								status2[i].style.display = 'inline-block';
								status3[i].style.display = 'none';
							} else {
								status1[i].style.display = 'none';
								status2[i].style.display = 'none';
								status3[i].style.display = 'inline-block';
							}
						}
					});
				}
				//失去焦点后根据isPass属性显示相应信息
			oPassword1.onblur = function() {
				oRuleTip.style.display = 'none';
				if (this.isPass) {
					oPass.style.display = 'block';
					removeClass(obj, 'validate-error');
				} else {
					oError.style.display = 'block';
					addClass(obj, 'validate-error');
				}
			}
		}

		//通用验证函数
		function check() {
			if (oRuleTip) {
				oRuleTip.style.display = 'none';
			}
			var data = {};
			data[obj.name] = obj.value;
			if (obj == oPassword2) {
				data['p'] = oPassword1.value;
			}
			ajax('POST', 'php/register.php', data, function(data) {
				if (data == 1) {
					oPass.style.display = 'block';
					oError.style.display = 'none';
					removeClass(obj, 'validate-error');
					obj.isPass = true;
				} else {
					oError.style.display = 'block';
					oPass.style.display = 'none';
					addClass(obj, 'validate-error');
					oErrText.innerHTML = data;
					obj.isPass = false;
				}
			});
		}
	}


});
//====================================
//注册页结束
//====================================

//====================================
//以下为工具函数部分
//====================================
/**
 * DOMReady,在页面的DOM内容加载完成后即触发，而无需等待其他资源的加载
 *
 * @class      DOMReady (name)
 * @param      {Function}  fn      需要执行的函数
 */
function DOMReady(fn) {
	//现代浏览器
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', fn, false);
	} else {
		IEContentLoaded(fn);
	}
	//IE浏览器模拟DOMContentLoaded
	function IEContentLoaded(fn) {
		var isDone = false;
		//确保fn只执行一次
		function init() {
			if (!isDone) {
				isDone = true;
				fn();
			}
		}

		(function() {
			try {
				// DOM树未创建完之前调用doScroll会抛出错误
				document.documentElement.doScroll('left');
			} catch (e) {
				//延迟后再次尝试能否调用doScroll
				setTimeout(arguments.callee, 50);
				return;
			}
			// 运行到此处表示可以调用doScroll,即表示DOM树创建完毕，应该立即执行fn
			init();
		})();

		//监听document的加载状态
		document.onreadystatechange = function() {
			if (document.readyState == 'interactive' || document.readyState == 'complete') {
				document.onreadystatechange = null;
				init();
			}
		}

	}
}

/**
 * 通过id获取DOM节点
 *
 * @param      {<type>}  id      要获取的节点的id
 * @return     {<type>}  要获取的节点
 */
function getById(id) {
	return document.getElementById(id);
}

/**
 * 通过class获取DOM节点，返回包含classname中所有的类名的节点
 *
 * @param      {object}  parent     父级对象
 * @param      {string}  classname  类名
 * @return     {Array}   获取到的节点数组
 */
function getByClass(parent, classname) {
	if (parent.getElementsByClassName) {
		return parent.getElementsByClassName(classname);
	} else if (document.querySelectorAll) {
		return parent.querySelectorAll('.' + classname);
	} else {
		var elems = parent.getElementsByTagName('*');
		var result = [];
		var re = new RegExp('\\b' + classname + '\\b', 'i');
		for (var i = 0; i < elems.length; i++) {
			if (re.test(elems[i].className)) {
				console.log()
				result.push(elems[i]);
			}
		}
	}
	return result;
}

/**
 * 通过tagName获取DOM节点
 *
 * @param      {object}  parent     父级对象
 * @param      {string}  tagname    标签名
 * @return     {object}   获取到的节点NodeList对象.
 */
function getByName(parent, tagname) {
	return parent.getElementsByTagName(tagname);
}

/**
 * 通过css选择器获取DOM节点
 *
 * @param      {object}  parent     父级对象
 * @param      {string}   str   css选择器
 * @return     {object}   获取到的节点NodeList对象.
 */
function $(parent, str) {
	return parent.querySelectorAll(str);
}

/**
 * 添加事件处理程序
 *
 * @param      {object}  obj      需要绑定事件的对象
 * @param      {string}  type     事件类型
 * @param      {function}  handler  事件触发执行的事件处理函数
 */
function addHandler(obj, type, handler) {
	if (obj.addEventListener) {
		obj.addEventListener(type, handler, false);
	} else if (obj.attachEvent) {
		obj.attachEvent('on' + type, function() {
			//this原本指向window，通过call改变指向
			handler.call(obj);
		});
	} else {
		obj['on' + type] = handler;
	}
}

/**
 * ajax函数
 * @param  {string} method  请求方式
 * @param  {string} url     请求地址
 * @param  {object} data    键值对形式的数据
 * @param  {function} success 请求成功的回调函数
 */
function ajax(method, url, data, success) {
	var xhr = null;

	try {
		xhr = new XMLHttpRequest();
	} catch (e) {
		xhr = new ActiveXObject('Microsoft.XMLHTTP');
	}

	var method = method.toUpperCase();

	// 用于清除缓存
	var random = Math.random();

	//解析为字符串形式
	if (typeof data == 'object') {
		var str = '';
		for (var key in data) {
			str += key + '=' + data[key] + '&';
		}
		data = str.slice(0, -1);
	}

	if (method == 'GET') {
		if (data) {
			url += '?' + data;
		} else {
			url += '?t=' + random;
		}

	}

	xhr.open(method, url, true);

	if (method == 'GET') {
		xhr.send();
	} else {
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(data);
	}

	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				success && success(xhr.responseText);
			} else {
				console.log('出错了，错误码：' + xhr.status);
			}
		}
	}

}

/**
 * 动画函数
 * @param  {object} obj   需要添加动画的对象
 * @param  {json} json    JSON数据,名为attr,值为iTarget.
 * @param  {int} n        速度因子，控制速度
 * @param  {function} endFn 回调函数，可实现链式运动.连续运动
 *
 */
function doMove(obj, json, interval, endFn) {
	clearInterval(obj.timer);
	var iValue = 0;
	var iSpeed = 0;
	var iOffset = 0;
	obj.timer = setInterval(function() {
		var isStop = true;
		for (var attr in json) {
			var iTarget = json[attr];

			if (attr == 'opacity') {
				iValue = parseInt(parseFloat(getStyle(obj, attr)) * 100);
			} else {
				iValue = parseInt(getStyle(obj, attr));
			}

			iSpeed = (iTarget - iValue) / 10;
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			iOffset = iValue + iSpeed;

			if (iValue != iTarget) {
				isStop = false;
				if (attr == 'opacity') {
					obj.style.opacity = iOffset / 100;
					obj.style.filter = 'alpha(opacity=' + iOffset + ')';
				} else {
					obj.style[attr] = iOffset + 'px';
				}
			}
		}
		if (isStop) {
			clearInterval(obj.timer);
			endFn && endFn();
		}
	}, interval);
}

/**
 * 获取实际样式
 * @param  {object} obj  需要获取样式的对象
 * @param  {string} attr 需要获取的样式名
 * @return {string}      获取到的样式值
 */
function getStyle(obj, attr) {
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}

/**
 * 添加类名
 * @param {object} obj       要添加类名的对象
 * @param {string} classname 要添加的类名
 */
function addClass(obj, classname) {
	if (obj.className == '') {
		obj.className = classname;
	} else {
		var arrClassName = obj.className.split(' ');
		var index = arrIndexOf(arrClassName, classname)
		if (index == -1) {
			obj.className += ' ' + classname;
		}
	}
}

/**
 * 移除类名
 * @param  {object} obj       要移除类名的对象
 * @param  {string} classname 要移除的类名
 */
function removeClass(obj, classname) {
	if (obj.className == '') {
		// alert("没有可移除的类");
	} else {
		var arrClassName = obj.className.split(' ');
		var index = arrIndexOf(arrClassName, classname)
		if (index != -1) {
			arrClassName.splice(index, 1);
			obj.className = arrClassName.join(' ');
		}
	}

}

function arrIndexOf(arr, value) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == value) {
			return i;
		}
	}
	return -1;
}