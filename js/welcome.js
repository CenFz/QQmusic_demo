(function() {

    function addClass(element,className) {
        if (hasClass(element,className) == false) {
            element.className += " "+className;
        }
    }

    function hasClass(element,className) {
        return !!element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
        //return !!(className in element.className);
    }

    function removeClass(element,className) {
        var currentClass = element.className;
        if (hasClass(element,className)) {
            currentClass = currentClass.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),' ');
            currentClass = currentClass.replace(/(^\s*)|(\s*$)/g,'');
            element.className = currentClass;
        }
    }

    function toggleClass(element,className) {
        if(hasClass(element,className)) {
            removeClass(element,className);
        }else{
            addClass(element,className);
        }
    }

    function $(element) {
        return document.querySelector(element);
    }

    function extend(targer,source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                targer[p] = source[p];
            }
        }
        return targer;
    }
    /*tabs切换*/
    /*构造函数*/
    function welcome(){
        this.init();

    }
    welcome.prototype = {
        /*弹出登录框*/
        getLoginPage : function() {
            var me = this.page;
            if (hasClass(me.portrait,'nologin')) {
                addClass(me.loginpage,'show');
            } else {
                //个人信息页面
                console.log();
            }
        },
        /*退出登陆框*/
        outLoginPage : function(){
            var me = this.page;
            if (hasClass(me.loginpage,'show')) {
                removeClass(me.loginpage,'show');
            }
        },
        /*登录*/
        login : function(user,passwd) {
            var me = this.page;
            if (user=="Cent" && passwd ==123) {
                //登录成功
                removeClass(me.portrait,'nologin');
                addClass(me.portrait,'login');
                me.portrait.src="images/back.jpg";
                var accountName = $('.accountName');
                console.log(accountName);
                accountName.innerHTML = user;
                this.outLoginPage();
                console.log(me.listAdd);
                me.listAdd.style.display = 'block';
                me.collectSong.style.display = 'block';
            } else {
                //登录失败
                alert("账号或密码错误");
            }
        },
        //退出
        userExit : function() {
            var me = this.page;
            removeClass(me.portrait, 'login');
            me.portrait.src="images/user-login1.png";
            var accountName = $('.accountName');
            accountName.textContent = '';
            addClass(me.portrait, 'nologin');
            me.listAdd.style.display = 'none';
            me.collectSong.style.display = 'none';
        },
        //我喜欢
        myLike : function() {

        },
        //一些操作
        action : function() {
            var me = this, b = this.page.btn, nt = this.page.nodetext, c = this.page.cutover;
            var timer = null;
            //登录界面
            this.page.portrait.addEventListener('click',function(){
                me.getLoginPage();
            })
            //关闭登录界面
            b.outlogin.addEventListener('click',function(){
                me.outLoginPage();
            })
            //登录用户
            b.loginbtn.addEventListener('click', function() {
                var user = nt.accountName.value;
                var passwd = nt.accountPasswd.value;
                me.login(user,passwd);
            })
            //出现用户信息
            me.page.portrait.addEventListener('mouseover', function() {
                if (hasClass(me.page.portrait,'login')) {
                    addClass(me.page.userinfo,'show');
                    clearTimeout(timer);
                }
            })
            //隐藏用户信息
            me.page.portrait.addEventListener('mouseout', function(){
                if (hasClass(me.page.portrait,'login')) {
                    timer = setTimeout(function() {
                        removeClass(me.page.userinfo,'show');
                    },2000);
                }
            })
            me.page.portrait.addEventListener('click',function(){
                if (hasClass(me.page.portrait,'login')) {
                    me.page.ifrpage.src = "user.html";

                }
            })

            b.homepage.addEventListener('click', function() {
                me.page.ifrpage.src = "user.html";
            },false);
            //退出用户
            b.exitUser.addEventListener('click', function() {
                me.userExit()
            },false);
        },
        options : {
            start : 0
        },
        initEvent : function() {
            var me = this;
            me.page.tabs.forEach(function(tab,idx) {
                tab.addEventListener('click',function(ev){
                    ev.preventDefault();
                    console.log(tab);
                    me.show(idx);
                    console.log(idx);
                })
            })
        },
        show : function(idx) {

            if (this.current >= 0) {
                removeClass(this.page.tabs[this.current],'action');
                //this.page.tabs[this.current].className = '';
            }
            //改变current
            this.current = idx != undefined ? idx : this.options.start >=0 && this.options.start < this.page.tabs.length ? this.options.start : 0 ;
            this.page.tabs[this.current].className+= ' action';
            this.page.ifrpage.src = this.page.tabs[this.current].title;
        },
        /*初始化*/
        init : function() {
            //缓存DOM结构
            this.page = {
                portrait : $(".main_page .lhead"),
                loginpage : $(".main_page .login-cover"),
                userinfo : $('.main_page .user_info'),
                ifrpage : $('.main_page #main-info'),
                tabs : [].slice.call($('.main_page .left_nav').querySelectorAll('dl > dd > a')),  //tabs elems
                listAdd : $('.main_page  .list_add'),
                collectSong : $('.main_page  .collectSong'),
                cutover : {
                    musicpage : $('.main_page .musicpage'),
                    rankingpage : $('.main_page .rankingpage'),
                    songlistpage : $('.main_page .songlistpage'),
                    stationpage : $('.main_page .stationpage'),
                    mylovepage : $('.main_page .mylovepage'),
                    downpage : $('.main_page .downpage'),
                    historypage : $('.main_page .historypage'),
                },
                nodetext : {
                    accountName : $('.main_page .account'),
                    accountPasswd : $('.main_page .passwd'),
                },
                btn : {
                    outlogin : $(".main_page .close_bg"),
                    loginbtn : $('.main_page .welcome-btn'),
                    homepage : $('.main_page .home'),
                    exitUser : $('.main_page .exit')
                }
            };
            this.current = -1;
            this.action();
            this.initEvent();
            console.log(this.page.tabs);
        }
    };
    var win = win || window;
    //重新封装，实例化后返回一个全局对象
    win.Welcome = function() {
        return new welcome();
    };
})(window);
