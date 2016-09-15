//Header部分搜索框的智能提示与搜索开始
//====================================
DOMReady(function() {
	//Header搜索
	var oHeader = getById('header');
	var oSearchHeader = new Search('search', oHeader);
	oSearchHeader.getSearch();
	oSearchHeader.toBoxClick();
	oSearchHeader.toKeyUp();
	oSearchHeader.toBtnClick();
	oSearchHeader.toDocClick();

	//顶部搜索
	var oTop = getById('top-search');
	if (oTop) {
		//floor导航条
		var oFloorNav = getById('floor-nav');
		var oBrand = getByClass(document, 'hot-brand')[0];
		addHandler(window, 'scroll', function() {
			var scroll = document.documentElement.scrollTop || document.body.scrollTop;
			if (scroll > getTop(oBrand)) {
				oTop.style.display = 'block';
				oFloorNav.style.display = 'block';
			} else {
				oTop.style.display = 'none';
				oFloorNav.style.display = 'none';
			}
		});
		var oSearchTop = new Search('top-form', oTop);
		oSearchTop.getSearch();
		oSearchTop.toBoxClick();
		oSearchTop.toKeyUp();
		oSearchTop.toBtnClick();
		oSearchTop.toDocClick();
	}
});
// Header部分结束
//====================================


// 搜索框对象开始
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
		form.setAttribute('data-active', 'true');
		if (this.oSearchBox.value != '') {
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
	var oHeader     = getById('header');
	var oTop        = getById('top-search');
	var searchForms = getByName(document, 'form');
	var searchBoxs  = $(document, 'input[name="search-box"]');
	var searchTips  = getByClass(document, 'search-tip');

	for (var i = 0; i < searchBoxs.length; i++) {
		if (searchForms[i].getAttribute('data-active') === 'true') {
			search(searchBoxs[i], searchTips[i]);
			searchForms[i].setAttribute('data-active', 'false');
		}
	}

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

			searchTip.flag = false;
		} else {
			searchTip.style.display = 'none';
		}
	}
}
// 搜索框对象结束
//====================================

// 分类导航部分开始
//====================================
DOMReady(function() {
	var oCatagoryTab = getById('cg-tab');
	var oCatagoryDel = getById('cg-detail');
	var navItems     = getByClass(oCatagoryTab, 'nav-item');
	var icons        = getByClass(oCatagoryTab, 'nav-item-icon');
	var details      = getByClass(oCatagoryDel, 'detail');

	for (var i = 0; i < navItems.length; i++) {
		//是否是第一次mouseover至navItems[i]
		navItems[i].isFirst = true;
		//采用闭包访问i
		(function(i) {
			var links = getByName(navItems[i], 'a');

			addHandler(navItems[i], 'mouseover', function() {
				//获取自定义属性data-color
				var color = navItems[i].getAttribute('data-color');
				toggle('block', color, 'bold', '#fff');
				//当第一次mouseover至navItems[i]时进行图片加载
				if (navItems[i].isFirst) {
					var detailLogos = details[i].getElementsByTagName('img');
					for (var j = 0; j < detailLogos.length; j++) {
						lazyLoad(details[j]);
						navItems[i].isFirst = false;
					}

				}
			});
			addHandler(navItems[i], 'mouseout', function() {
				toggle('none', '#000', 'normal', 'rgb(238, 238, 238)');
			});
			addHandler(details[i], 'mouseover', function() {
				var color = navItems[i].getAttribute('data-color');
				toggle('block', color, 'bold', '#fff');
			});
			addHandler(details[i], 'mouseout', function() {
				toggle('none', '#000', 'normal', 'rgb(238, 238, 238)');
			});

			function toggle(display, color, fontW, bg) {
				oCatagoryDel.style.display = display;
				details[i].style.display = display;
				icons[i].style.color = color;
				icons[i].style.fontWeight = fontW;
				for (var j = 0; j < links.length; j++) {
					links[j].style.color = color;
				}
				navItems[i].style.fontWeight = fontW;
				navItems[i].style.background = bg;
			}
		})(i);
	}
});
// 分类导航部分结束
//====================================

// Banner部分开始
//====================================
DOMReady(function() {
	var oBanner   = getById('banner');
	var bannerBgs = getByClass(oBanner, 'banner-bg');
	var oSlider   = getByClass(oBanner, 'slider-nav')[0];
	var sliders   = $(oSlider, '.slider-nav li');
	var oLastBg   = bannerBgs[0];
	var oLastSd   = sliders[0];
	var iLen      = bannerBgs.length;
	var iNum      = 0;
	var timer     = null;

	//焦点图自动播放
	autoPlay();

	addHandler(oBanner, 'mouseover', function(ev) {
		clearInterval(timer);
	});
	addHandler(oBanner, 'mouseout', function() {
		autoPlay();
	});
	//利用事件委托实现轮播索引的mouseover
	addHandler(oSlider, 'mouseover', function(ev) {
		var ev = ev || event;
		var target = ev.target || ev.srcElement;
		for (var i = 0; i < iLen; i++) {
			if (sliders[i] == target) {
				iNum = i;
				change();
			}
		}
	});
	//自动播放函数
	function autoPlay() {
		clearInterval(timer);
		timer = setInterval(function() {
			iNum++;
			if (iNum == iLen) {
				iNum = 0;
			}
			change();
		}, 3000);
	}
	//banner轮播切换函数
	function change() {
		oLastBg.style.display = 'none';
		oLastSd.className = '';
		doMove(oLastBg, {
			'opacity': 0
		}, 5);
		bannerBgs[iNum].style.display = 'block';
		sliders[iNum].className = 'active';
		doMove(bannerBgs[iNum], {
			'opacity': 100
		}, 5);
		oLastBg = bannerBgs[iNum];
		oLastSd = sliders[iNum];
	}

	//Banner部分vip信息框的淡入
	var oVip = getById('vip');
	var oVipCon = getByClass(oVip, 'vip-con')[0];
	doMove(oVipCon, {
		"width": 100,
		"opacity": 100
	}, 20);
});
// Banner部分焦点图结束
//====================================

// 热门品牌~品牌旗舰区域开始
//====================================
DOMReady(function() {
	var oHeader = getById('header');
	//热门品牌~品牌旗舰图片懒加载
	var modules = getByClass(document, 'module');
	for (var i = 0; i < modules.length; i++) {
		if (i == 0) {
			judge(modules[i], oHeader);
		} else {
			judge(modules[i], modules[i - 1]);
		}
	}
	//广告懒加载
	var ads = getByClass(document, 'ad');
	for (var i = 0; i < ads.length; i++) {
		if (i == 0) {
			judge(ads[i], oHeader);
		} else {
			judge(ads[i], ads[i - 1]);
		}
	}

	// banner处文章列表轮播
	var oContent   = getById('content');
	var hotSliders = getByClass(oContent, 'slider-list');
	var iHeight    = -(getByName(hotSliders[0], 'li')[0].offsetHeight);


	for (var i = 0; i < hotSliders.length; i++) {
		autoPlay(i);
	}

	//自动轮播函数
	function autoPlay(num) {
		var n = 1
		setInterval(function() {
			doMove(hotSliders[num], {
				"top": n * iHeight
			}, 10, function() {
				n++;
				if (n == 4) {
					n = 1;
					hotSliders[num].style.top = 0;
				}
			});
		}, 3000);
	}

	/**
	 * 判断什么时候进行lazyLoad，当滚动条滚动到某区域的上一区域时就进行该区域的图片加载
	 * @param  {object} target 需要进行懒加载的区域对象
	 * @param  {object} base   懒加载时刻的依赖对象
	 * 
	 */
	function judge(target, base) {
		addHandler(window, 'scroll', function() {
			var scroll = document.documentElement.scrollTop || document.body.scrollTop;
			if (scroll > getTop(base) - base.offsetHeight) {
				lazyLoad(target);
			}
		});
	}
});

// 热门品牌~品牌旗舰区域结束
//====================================

// 猜你喜欢开始
//====================================
DOMReady(function() {
	var oFavorite = getByClass(document, 'favorite-list')[0];
	var oScriptCb = getById('cb');

	//页码（全局）
	iPage = 1;
	//是否需要进行加载，主要为了避免滚动事件连续触发导致一次加载多个页面的情况（全局）
	isNeed = true;

	addHandler(window, 'scroll', getList);

	//获取猜你喜欢的商品数据函数
	function getList() {
		var scroll = document.documentElement.scrollTop || document.body.scrollTop;
		if (!iPage) {
			removeHandler(window, 'scroll', getList);
			isNeed = null;
		}
		if (scroll + document.documentElement.clientHeight > getTop(oFavorite) + oFavorite.offsetHeight / 2) {
			if (isNeed) {
				var oScript = document.createElement('script');
				oScript.src = 'https://aldh5.tmall.com/recommend2.htm?page=' + iPage + '&pageSize=20&appId=201509290&callback=floorCb';
				oScriptCb.parentNode.insertBefore(oScript, oScriptCb);
				iPage++;
				isNeed = false;
			}
		}
	}
});

//获取猜你喜欢的数据后的回调函数
function floorCb(data) {
	var oFavorite = getByClass(document, 'favorite-list')[0];
	var realData  = data[201509290].data;
	var dataLen   = realData.length;
	for (var i = 0; i < dataLen; i++) {
		//获得价格的整数部分与小数部分
		var price     = realData[i].price.split('.');
		var html      = '<a href="' + realData[i].action + '"><img src=' + realData[i].imgUrl + '><div class="item-desc"><h5 title=' + realData[i].title + '>' + realData[i].title + '</h5><span class="item-price"><span class="price-rmb">￥</span><span class="price-interger">' + price[0] + '</span>' + '<span class="price-decimal">.' + price[1] + '</span></span></div></a>'
		var oLi       = document.createElement('li');
		oLi.innerHTML = html;
		oLi.className = 'favorite-item';
		oFavorite.appendChild(oLi);
	}
	//当没有更多数据时将相应滚动事件移除,通过变量iPage来传递是否移除的信息(这样是为了避免出现访问getList函数错误)
	if (!data[201509290].hasMore) {
		iPage = null;
	}
	isNeed = true;
}
/*猜你喜欢结束*/


// floor导航开始
//====================================
DOMReady(function() { // 此处floor导航的显示与隐藏与顶部搜索框的一致
	var oFloorNav = getById('floor-nav');
	var modules   = getByClass(document, 'module');
	var links     = getByName(oFloorNav, 'a');
	var oLastLk   = null;
	for (var i = 0; i < links.length - 1; i++) {
		//是否为当前floor的标志
		links[i].isActive = false;

		addHandler(links[i], 'mouseover', function() {
			this.style.background = this.getAttribute('data-color');
		});

		addHandler(links[i], 'click', function() {
			//将当前floor的标志设为true，并将前一floor设为false
			this.isActive = true;
			if (oLastLk) {
				oLastLk.isActive = false;
			}
			oLastLk = this;
		});

		addHandler(links[i], 'mouseout', function() {
			if (!this.isActive) {
				this.style.background = 'rgb(96,96,96)';
			}
		});

		judge(links[i], modules[i + 1]);
	}

	//判断当前到哪个floor，并进行高亮
	function judge(target, base) {

		addHandler(window, 'scroll', function() {
			var scroll = document.documentElement.scrollTop || document.body.scrollTop;
			//滚动距离大于base的某一高度后，target进行高亮。
			//为避免其他已经被滚动过去的base参与，应该进行限制，限制条件是滚动距离scroll应小于一定值
			if (scroll > getTop(base) + (0.9 * base.offsetHeight) && scroll < getTop(base) + 2 * base.offsetHeight) {
				for (var i = 0; i < links.length - 1; i++) {
					links[i].style.background = 'rgb(96,96,96)';
					links[i].isActive = false;
				}

				target.style.background = target.getAttribute('data-color');
				target.isActive = true;

			}
		});
	}
});
// floor导航结束
//====================================

// 右侧提示条开始
//====================================
DOMReady(function() {
		var oTipBar  = getById('tip-bar');
		var oBarCon  = getByClass(oTipBar, 'bar-con')[0];
		var oBackTop = getByClass(oTipBar, 'back-top')[0];

		oTipBar.style.display = 'block';

		//滚动事件：回到顶部按钮的显示隐藏
		addHandler(window, 'scroll', function() {
			var scroll = document.documentElement.scrollTop || document.body.scrollTop;
			if (scroll > 5) {
				oBackTop.style.display = 'block';
				doMove(oBackTop, {
					"opacity": 100
				}, 20);
			} else {
				oBackTop.style.display = 'none';
				oBackTop.style.opacity = 0;
			}
		});

		//窗口变化事件
		addHandler(window, 'resize', function() {
			//当窗口最大化时显示完整的tip-bar，否则隐藏部分
			if (window.innerWidth == screen.availWidth) {
				doMove(oBarCon, {
					"right": 0
				}, 5);
				oTipBar.onmouseover = oTipBar.onmouseout = null;

			} else {
				oBarCon.style.right = '-35px';

				oTipBar.onmouseover = function() {
					doMove(oBarCon, {
						"right": 0
					}, 5);
				}
				oTipBar.onmouseout = function() {
					doMove(oBarCon, {
						"right": -35
					}, 5);
				}
			}
		});
	})
	//右侧提示条结束
	//====================================

// 登录后信息显示开始
//====================================
DOMReady(function() {
	//通过ajax获取数据库中的信息
	ajax('GET', 'php/index.php', {}, function(data) {
		var defaults = getByClass(document, 'default');
		var loggeds = getByClass(document, 'logged');
		//返回1时表示未登录，返回数据表示已登录
		if (data != 1) {
			var usernames  = getByClass(document, 'vip-name');
			var scores     = getByClass(document, 'score');
			var message    = getById('message');
			var cartCounts = getByClass(document, 'cart-count');
			var coupon     = getById('coupon');
			
			var data       = JSON.parse(data);

			for (var i = 0; i < defaults.length; i++) {
				defaults[i].style.display = 'none';
				loggeds[i].style.display = 'block';
			}

			usernames[0].innerHTML  = usernames[1].innerHTML = data.name;
			scores[0].innerHTML     = scores[1].innerHTML = data.score;
			cartCounts[0].innerHTML = cartCounts[1].innerHTML = data.cart;
			message.innerHTML       = data.message;
			coupon.innerHTML        = data.coupon;
		} else {
			for (var i = 0; i < defaults.length; i++) {
				defaults[i].style.display = 'block';
				loggeds[i].style.display = 'none';
			}

		}
	});
});
// 登录后信息显示结束
//====================================

/* 以下为工具函数部分*/

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
 * 图片懒加载
 * @param  {object} parent 父节点
 * 
 */
function lazyLoad(parent) {
	var imgs = parent.getElementsByTagName('img');
	var iLen = imgs.length;
	for (var i = 0; i < iLen; i++) {
		imgs[i].src = imgs[i].getAttribute('data-src');
	}
}

/**
 * 获取元素距离页面顶部的高度
 *
 * @param      {object}  obj     需要获取高度的对象
 * @return     {number}  The top. 距离页面顶部的高度
 */
function getTop(obj) {
	var top = 0;
	while (obj) {
		top += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return top;
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
 * 移除事件处理程序
 *
 * @param      {object}  obj      要移除事件的对象
 * @param      {string}  type     事件类型
 * @param      {function}  handler  要移除的事件处理函数
 */
function removeHandler(obj, type, handler) {
	if (obj.removeEventListener) {
		obj.removeEventListener(type, handler, false);
	} else if (obj.detachEvent) {
		obj.detachEvent('on' + type, handler);
	} else {
		obj['on' + type] = null;
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
function doMove(obj, json, n, endFn) {
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

			iSpeed = (iTarget - iValue) / n;
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
	}, 30);
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

	if (method === 'GET') {
		if (data) {
			url += '?' + data;
		} else {
			url += '?t=' + random;
		}

	}

	xhr.open(method, url, true);

	if (method === 'GET') {
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