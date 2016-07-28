;(function(){
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
    function stationTabs(el,options){
        this.el = el;
        //console.log(el);
        this.options = extend( {}, this.options );
        extend( this.options,options);
        this.init();
    }

    stationTabs.prototype = {
        options : {start : 0 },
        init : function() {
            this.page = {
                tabs : [].slice.call(this.el.querySelectorAll('nav > ul > li')),
                items : [].slice.call(this.el.querySelectorAll('.content-wrap > section')),
                selecteds : [].slice.call(this.el.querySelectorAll('.m-list > .m-info > li '))
            }
            //console.log(this.page.selecteds);
            this.current = -1;
            this.show();
            this.initEvent();

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
                /*
                mouseenter
                */
                selected.addEventListener('mouseover',function(ev){
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
                selected.addEventListener('mouseout',function(ev) {
                    ev.preventDefault();
                    //me.mouseout(idx);
                    selected.style.backgroundColor = '#fff';
                    var songplay = selected.children[0];
                    var songname = selected.children[0].children[0];
                    songplay.removeChild(picel);
                    songname.style.width = '260px';
                    //songplay.innerHTML = text;
                })
            })
        },
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
        }
    }
    var win = win || window;
    win.stationTabs = stationTabs;
})(window);
