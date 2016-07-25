;(function($){
    var Carousel = function(poster) {
        var self = this;
        //保存单个旋转木马对象
        this.poster = poster;
        this.posterItemMain = poster.find('ul.poster_list');
        this.nextBtn = poster.find('a.slide_next');
        this.prevBtn = poster.find('a.slide_prev');
        this.posterItems = poster.find('li.poster_item');
        this.posterFirstItem = this.posterItems.first();
        this.posterLastItem = this.posterItems.last();
        this.rotateFlag = true;
        //默认配置参数
        this.setting = {
            "width":800,  //幻灯片宽带
            "height":210,   //幻灯片高度
            "posterWidth":525,  //幻灯片第一张宽度
            "posterHeight":210, //幻灯片第一贞高度
            "scale":0.9,        //记录关系比例
            "speed":500,
            "delay":2000,
            "autoPlay":false,
            "vertcalAlign":"middle"
        };
        $.extend(this.setting,this.getSetting());
        //设置配置参数值
        this.setSettingValue();
        this.setPosterPos();

        this.nextBtn.click(function(){
            if (self.rotateFlag) {
                self.carouseRotate("left");
                self.rotateFlag = false;
            }

        });
        this.prevBtn.click(function(){
            if (self.rotateFlag) {
                self.rotateFlag = false;
                self.carouseRotate("right");
            }

        });
        
        //是否开启自动播放
        if (this.setting.autoPlay) {
            this.autoPlay();
            this.poster.hover(function(){
                window.clearInterval(self.timer);
            },function(){
                self.autoPlay();
            });
        };
    }
    Carousel.prototype = {
        //自动播放
        autoPlay:function(){
            var self = this;

            this.timer=window.setInterval(function(){
                self.nextBtn.click()
            },this.setting.delay);
        },
        //旋转
        carouseRotate:function(dir){
            var _this_ = this;
            var zIndexArr = [];
            if (dir === "left") {
                this.posterItems.each(function(){
                    var self = $(this),
                        prev = self.prev().get(0) ? self.prev() : _this_.posterLastItem,
                        width = prev.width(),
                        height = prev.height(),
                        zIndex = prev.css("zIndex"),
                        left = prev.css("left"),
                        top = prev.css("top");
                        zIndexArr.push(zIndex);
                        self.animate({
                            width:width,
                            height:height,
                            //zIndex:zIndex,
                            left:left,
                            top:top
                        }, function(){
                            _this_.rotateFlag = true;
                        });
                });
                this.posterItems.each(function(i){
                    $(this).css("zIndex",zIndexArr[i])
                });
            } else if (dir === "right") {
                this.posterItems.each(function(){
                    var self = $(this),
                        next = self.next().get(0) ? self.next() : _this_.posterFirstItem,
                        width = next.width(),
                        height = next.height(),
                        zIndex = next.css("zIndex"),
                        left = next.css("left"),
                        top = next.css("top");
                        zIndexArr.push(zIndex);
                        self.animate({
                            width:width,
                            height:height,
                            //zIndex:zIndex,
                            left:left,
                            top:top
                        },function(){
                            _this_.rotateFlag = true;
                        });
                });
                this.posterItems.each(function(i){
                    $(this).css("zIndex",zIndexArr[i])
                });
            }
        },
        //设置剩余的帧的位置关系
        setPosterPos:function(){
            var self = this;
            var sliceItems = this.posterItems.slice(1),
            sliceSize = sliceItems.size()/2,
            rightSlice = sliceItems.slice(0,sliceSize),
            level = Math.floor(this.posterItems.size()/2),
            leftSlice = sliceItems.slice(sliceSize);
            //alert(level);
        //设置右边帧的位置关系和高宽度top
            var rw = this.setting.posterWidth,
                rh = this.setting.posterHeight,
                gap = (this.setting.width-this.setting.posterWidth)/2;
            var fristLeft = (this.setting.width-this.setting.posterWidth)/2;
            //fixOffsetLeft
            var fixOffsetLeft = fristLeft + rw;
            rightSlice.each(function(){
                level--;
                rw = rw * self.setting.scale;
                rh = rh * self.setting.scale;

                $(this).css({
                    zIndex:level,
                    width:rw,
                    height:rh,
                    //opacity:1/(++i),
                    left:fixOffsetLeft+gap-rw,
                    top:(self.setting.height-rh)/2
                });
            });
            //左边的位置关系
            var lw = rightSlice.last().width(),
                lh = rightSlice.last().height();
            leftSlice.each(function(i){

                $(this).css({
                    zIndex:i,
                    width:lw,
                    height:lh,
                    //opacity:1/(++i),
                    left:0,
                    top:(self.setting.height-lh)/2
                });
            lw = lw / self.setting.scale;
            lh = lh / self.setting.scale;
            });

        },
        //设置垂直排列对齐
        /*setVertucalAlign:function(){
            var verticalType = this.vertcalAlign,
                top = 0;
            if(verticalType === "middle") {
                top = (this.setting.height-height)/2;
            } else if (verticalType === "top") {
                top = 0;
            } else if (verticalType == "bottom") {
                top = this.setting.height-height;
            } else {
                top = (this.setting.height-height)/2;
            }

            return top;
        },*/
        //设置配置参数值去控制基本的宽高度
        setSettingValue:function(){
            this.poster.css({
                width:this.setting.width,
                height:this.setting.height
            });
            this.posterItemMain.css({
                width:this.setting.width,
                height:this.setting.height
            });
            //上下切换按钮宽度
            var w = (this.setting.width-this.setting.posterWidth)/2
            this.nextBtn.css({
                width:w,
                height:this.setting.height,
                zIndex:Math.ceil(this.posterItems.size()/2)
            });
            this.prevBtn.css({
                width:w,
                height:this.setting.height,
                zIndex:Math.ceil(this.posterItems.size()/2)
            });
            //第一贞
            this.posterFirstItem.css({
                width:this.setting.posterWidth,
                height:this.setting.posterHeight,
                left:w,
                zIndex:Math.floor(this.posterItems.size()/2)
            })
        },
        //获取人工配置参数
        getSetting:function(){
            var setting = this.poster.attr("data-setting");
            if (setting&&setting!="") {
                return $.parseJSON(setting);
            } else {
                return {};
            }
        }
    }
    Carousel.init = function(posters) {
        var _this_ = this;
        posters.each(function(){
            new _this_($(this));
        });
    }
    window["Carousel"] = Carousel;
})(jQuery);
