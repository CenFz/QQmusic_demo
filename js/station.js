;(function(){
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

    function extend(a,b) {
        for ( var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }
    function getEvent(e) {
        return e || window.event;
    }
    function delegateEvent(delegateElement, targetTag, eventName, handler) {
		delegateElement.addEventListener(eventName, function (event) {
		    var target = event.target;
		    if (target.nodeName.toLowerCase() === targetTag.toLowerCase()) {
		        return handler(event);
		    }
    	}, false);
    }

    function stationTabs(el,options){
        this.el = el;
        //console.log(el);

        this.options = extend( {}, this.options );
        extend( this.options,options);
        this.init()
    }

    stationTabs.prototype = {
        options : {start : 0 },
        init : function() {
            console.log(document.getElementsByClassName('tabs'));
            if (document.getElementsByClassName('tabs').length > 0) {
                this.page = {
                    tabs : [].slice.call(this.el.querySelectorAll('nav > ul > li')),
                    items : [].slice.call(this.el.querySelectorAll('.content-wrap > section')),
                    selecteds : [].slice.call(this.el.querySelectorAll('.m-list > .m-info > li '))
                }
                //console.log(this.page.selecteds);
                this.current = -1;
                this.show();
                this.initEvent();
            }
            if ($('.i-info')) {
                this.pageHandler();
            }
            if ($('#musicPage')) {
                this.musicPageHandler();
            }
        },
        initEvent : function(){
            var me = this;
            this.page.tabs.forEach( function(tab,idx){
                tab.addEventListener('click',function( ev ){
                    ev.preventDefault();
                    me.show(idx);
                })
            })
            this.page.selecteds.forEach( function(selected,idx) {
                selected.addEventListener('click',function(ev) {

                    ev.preventDefault();
                    me.show(idx);
                })

            });
        },

        pageHandler : function() {

            var me = this;

            var songlist = $('.i-info');
            var songli = songlist.getElementsByTagName('li');
            console.log(songli);
            for (var i = 0; i < songli.length; i++) {
                (function(j) {
                    songli[j].addEventListener('mouseenter', function() {
                        var target =this;
                        target.style.backgroundColor = 'rgba(200,200,200,.7)';
                        if (me.createMyLikeSong(target)) {
                            var iPlayer = target.getElementsByClassName('player')[0];
                            var iBtn = iPlayer.getElementsByTagName('i');
                            iBtn[0].addEventListener('click',function() {

                                //播放该音乐
                            },false);
                            iBtn[1].addEventListener('click', function() {
                                //添加到我喜欢，如果已经在我喜欢的话，移出
                                me.toLikeEvent(this);
                            },false);
                            iBtn[2].addEventListener('click', function() {
                                //下载
                            },false);
                        };

                    },false);
                    songli[j].addEventListener('mouseleave',function() {
                        var target = this;
                        var iPlayer = target.getElementsByClassName('player')[0];
                        target.style.backgroundColor = '';
                        target.removeChild(iPlayer);

                    })
                })(i);

            }
            console.log(!!document.getElementsByClassName('tabs')[0]);


        },
        createMyLikeSong : function(selectedLi) {
            var ilike = true;
            var play = document.createElement('span');
            play.setAttribute('class','player');
            play.innerHTML = '<i class="iconfont i-player">&#xe6d2;</i><i class="iconfont i-like-t">&#xe624;</i><i class="iconfont i-down">&#xe668;</i>';
            selectedLi.appendChild(play);
            return ilike;
        },
        toLikeEvent : function(ibtn) {
            if (ibtn.className == 'iconfont i-like-t') {
                ibtn.className = 'iconfont i-like-f';
                ibtn.innerHTML = '&#xe616;';

                this.dontLike(ibtn);
            } else if (ibtn.className == 'iconfont i-like-f') {
                ibtn.className = 'iconfont i-like-t';
                ibtn.innerHTML = "&#xe624;";
                this.like(ibtn);
            }
            //console.log(target);
        },
        like : function(ibtn) {
            //页面
            var isPage = document.getElementsByTagName('div')[0];
            if (isPage.id === 'myLikePage') {
                var selectedLi = ibtn.parentNode.parentNode;
                var list = document.getElementsByClassName('i-info')[0];
                console.log(list.getElementsByTagName('li')[0]);
                list.insertBefore(selectedLi, list.getElementsByTagName('li')[0]);
            }

        },
        dontLike : function(ibtn) {
            //页面
            var isPage = document.getElementsByTagName('div')[0];
            if (isPage.id === 'myLikePage') {
                var list = document.getElementsByClassName('i-info')[0];
                list.removeChild(ibtn.parentNode.parentNode);
            }
        },
        show : function(idx) {
            if (this.current >= 0) {
                if (this.page.tabs[ this.current ] && this.page.items[ this.current ] != 'undefined') {
                    this.page.tabs[ this.current ].className = this.page.items[ this.current ].className = '';
                } else if (this.page.selecteds != 'undefined') {
                    this.page.selecteds[this.current].className = '';
                }

                //this.page.tabs[this.current].className = this.page.items[this.current].className = "";
            }
            this.current = idx != undefined ? idx : this.options.start >= 0 && this.options.start < this.page.items.length ? this.options.start : 0;
            if (this.page.tabs[ this.current ] && this.page.items[ this.current ] != 'undefined') {
                this.page.tabs[ this.current ].className = 'tab-current';
                this.page.items[ this.current ].className = 'content-current';
            } else if (this.page.selecteds != 'undefined') {
                this.page.selecteds[this.current].className = 'm-current';
            }
            //this.page.items[ this.current ].className = 'content-current';
        },
        musicPageHandler : function(){
            var musicInfo = document.getElementsByClassName('music_info')[0],
                recommendSongs = musicInfo.getElementsByClassName('re_img'),
                recommendPlayer = musicInfo.getElementsByClassName('re_player');

            for (var i = 0; i < recommendSongs.length; i++) {
                (function(j){
                    recommendSongs[j].addEventListener('mouseenter', function(event) {
                        var target = event.target;
                        addClass(recommendPlayer[j], 'hover');
                    },false);
                    recommendPlayer[j].addEventListener('mouseleave', function(event) {
                        var target = event.target;
                        removeClass(target, 'hover')
                    },false);
                }(i));

            }
            var AlbList = document.getElementsByClassName('Alb_list')[0];
            console.log(AlbList);
            delegateEvent(AlbList, 'img', 'mouseenter',function(event) {
                var target = event.target;
                console.log(target);
                //var hover = target.getElementsByClassName('re_player')[0]
                addClass(target, 'hover');
            });
            delegateEvent(AlbList, 'div', 'mouseleave', function(event) {
                var target = event.target;
                removeClass(target, 'hover');
            });

        }
    }
    var win = win || window;
    win.stationTabs = stationTabs;
})(window);





/*checkHover : function(e,target) {
    var rel = getEvent(e).relatedTarget ,
    from = getEvent(e).fromElement ,
    to = getEvent(e).toElement;
    if (getEvent(e).type=="mouseover") {
        return !contains(target,rel || from) && !( (rel || from)===target );
    } else {
        return !contains(target,rel || to) && !( (rel || to)===target );
    }
},*/
/*mouseover : function(idx) {
    var songname = this.page.selecteds[idx].children[0].children[0];
    var songplay = this.page.selecteds[idx].children[0];
    var style = {
        width : '150px',
        overflow : 'hidden',
        textOverflow : 'ellipsis',
        whiteSpace : 'nowrap'
    }
    for ( var i in style) {
        this.page.selecteds[idx].children[0].children[0].style[i] = style[i];
    }
    this.page.selecteds[idx].style.backgroundColor = '#ddd';
    textcontent = songplay.innerHTML;
    //console.log(textcontent);
    var eli='<i class="iconfont">&#xe6d2;</i><i class="iconfont">&#xe624;</i><i class="iconfont">&#xe668;</i>';
    songplay.innerHTML = textcontent + eli;
    //this.page.selecteds[idx].children[0].style.overflow = 'hidden';

    //this.page.selecteds[idx].children[0].innerHTML = textcontent + eli;
    //console.log(textcontent);

},
mouseout : function(idx) {
    //var songname = this.page.selecteds[idx].children[0].children[0];
    //var songplay = this.page.selecteds[idx].children[0];
    //console.log(textcontent);
    this.page.selecteds[idx].style.backgroundColor ='';
    //textcontent = this.page.selecteds[idx].children[0].innerHTML;
    this.page.selecteds[idx].children[0].children[0].style.width = '260px';
    //console.log(this.page.selecteds[idx].children[0].children[0].style.width);
    //this.page.selecteds[idx].children[0].children[0].style.width = '260px';
    this.page.selecteds[idx].children[0].innerHTML=textcontent;
    //this.page.selecteds[idx].children[0].innerHTML = textcontent;
},*/

/*
mouseenter
*/
/*selected.addEventListener('mouseenter',function(ev){
    console.log(selected);
    ev.preventDefault();
    var songplay = selected.children[0];
    var songname = selected.children[0].children[0];
    text = songplay.innerHTML;
    selected.style.backgroundColor = '#ddd';
    console.log(songname);
    var style = {
        width : '150px',
        overflow : 'hidden',
        textOverflow : 'ellipsis',
        whiteSpace : 'nowrap'
    }
    for ( var i in style) {
        songname.style[i] = style[i];
    }
    picel = document.createElement('i');
    picel.setAttribute('class','iconfont');
    picel.innerHTML = '&#xe6d2;';
    songplay.appendChild(picel);
    //var elpic = '<i class="iconfont">&#xe6d2;</i><i class="iconfont">&#xe624;</i><i class="iconfont">&#xe668;</i>';
    //songplay.innerHTML +=elpic;
})
selected.addEventListener('mouseleave',function(ev) {
    ev.preventDefault();
    //me.mouseout(idx);
    selected.style.backgroundColor = '#fff';
    var songplay = selected.children[0];
    var songname = selected.children[0].children[0];
    songplay.removeChild(picel);
    songname.style.width = '260px';
    //songplay.innerHTML = text;
},false);*/
