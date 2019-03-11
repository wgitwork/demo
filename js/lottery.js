var click=false;
var lotNum=0; //设置中奖位置
window.onload=function(){
	var allNum=10;
	$('.lottery_prize ul').luckDraw({
		width:1, //宽
		height:1, //高
		allNum:allNum,  //设置总数
		click:"" //点击对象
	});
	
    lottery.init('lottery_prize');
    var clickNum=0;
    $(".lot h3").click(function(){
        if (click) {//click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
        	console.log('第一次');
            return false;
        }else{
        	if(clickNum<2){  //剩余抽奖次数
	            lottery.speed=100;
	            roll();    //转圈过程不响应click事件，会将click置为false
	            click=true; //一次抽奖完成后，设置click为true，可继续抽奖
	            clickNum++;
	            return false;
            }else{
		    	alert('您的抽奖次数已用完');
		    	return false;
		    }
        }
    });
};

$.fn.extend({
	luckDraw:function(data){
		var anc = $(this); //祖父元素
		var lotteryBox=$(this).parent().parent();
		var lot=$(this).parent().prev();
		var list = anc.children("li");
		var click; //点击对象
		var allNum;//实际奖品总数
		var thisWidth;
		var thisHeight;
		var lineNumber;  //几行
		var listNumber;  //几列
		
		if(data.width==null){return;}else{thisWidth=data.width;}
		if(data.height==null){return;}else{thisHeight=data.height;}
		if(data.allNum==null){return;}else{allNum=data.allNum;}
		if(data.click==null){return;}else{click=data.click;}
		allNums(allNum);
		///---初始化
		var allWidth=thisWidth*listNumber+listNumber*0.04;
		var allHeight=thisHeight*lineNumber+lineNumber*0.04;
		lotteryBox.css({
			width:thisWidth*listNumber+listNumber*0.04+'rem',
			height:thisHeight*lineNumber+lineNumber*0.04+'rem',
			position:"relative"
		});
		lot.children('h3').css({
			'width':allWidth-(thisWidth*2+0.04*2)-0.04+'rem',
			'height':allHeight-(thisHeight*2+0.04*2)-0.04+'rem',
			'line-height':allHeight-(thisHeight*2+0.04*2)-0.04+'rem',
			'margin-top':-(allHeight-(thisHeight*2+0.04*2))/2+'rem',
			'margin-left':-(allWidth-(thisWidth*2+0.04*2))/2+'rem'
		})
		anc.css({
			width:thisWidth*listNumber+listNumber*0.04+'rem',
			height:thisHeight*lineNumber+lineNumber*0.04+'rem',
			position:"relative"
		});
		list.css({
			width:thisWidth+'rem',
			height:thisHeight+'rem',
			position:"absolute"
		});
		
		var all = listNumber*lineNumber - (lineNumber-2)*(listNumber-2)  //应该有的总数
		if(all>list.length){ //如果实际方块小于应该有的总数
			for(var i=0;i<all-list.length;i++){
				anc.append("<li class='lottery-unit lottery-unit-"+ list.length +"'><img src='images/3.png'/><p class='lottery_pitch'></p></li>");
			}
		}
		list = anc.children("li");
		list.css({
			width:thisWidth+'rem',
			height:thisHeight+'rem',
			position:"absolute"
		});
		lot.children('h3').css({
			width:allWidth-(thisWidth*2+0.04*2)-0.04+'rem',
			height:allHeight-(thisHeight*2+0.04*2)-0.04+'rem',
			'line-height':allHeight-(thisHeight*2+0.04*2)-0.04+'rem'
		})
		
		list.each(function(index){
			if(index < listNumber){  //---小于listNumber列
				if(index>0){
					$(this).css({
						left:index%listNumber*thisWidth+index*0.04+'rem'
					});
				}else{
					$(this).css({
						left:index%listNumber*thisWidth+'rem'
					});
				}
			}
			else if(index >= listNumber && index < listNumber+lineNumber-2){
				$(this).css({
					top:(index-(listNumber-1))*thisHeight+(index-(listNumber-1))*0.04+'rem',
					right:0
				});
			}
			else if(index >= listNumber+lineNumber-2 && index < all-lineNumber+2){
				if(index <= lineNumber+(listNumber-2)){
					$(this).css({
						bottom:0,
						right:(index-(lineNumber+(listNumber-2)))*thisWidth+'rem'
					});
				}else{
					$(this).css({
						bottom:0,
						right:(index-(lineNumber+(listNumber-2)))*thisWidth+(index-(lineNumber+(listNumber-2)))*0.04+'rem'
					});
				}
			}else{
				/*
				*/
				$(this).css({
					bottom:(index-(listNumber*2+(lineNumber-3)))*thisHeight+(index-(listNumber*2+(lineNumber-3)))*0.04+'rem',
					left:0
				});
			}
			if(index+1 > all){
				$(this).remove();
			}
		});
		//根据奖品总数计算行和列
		function allNums(num){
			//aNum为行
			//bNum为列
			for(var aNum=0;aNum<=40;aNum++){
				for(var bNum=0;bNum<=aNum;bNum++){
					if(aNum*bNum - (aNum-2)*(bNum-2)==num){
						lineNumber=bNum;
						listNumber=aNum;
						return false;
					}else if(aNum*bNum - (aNum-2)*(bNum-2)==num+1){
						lineNumber=bNum;
						listNumber=aNum;
						return false;
					}
				}
			}
		}
	}
});

//开始抽奖
var lottery={
    index:-1,    //当前转动到哪个位置，起点位置
    count:0,    //总共有多少个位置
    timer:0,    //setTimeout的ID，用clearTimeout清除
    speed:20,    //初始转动速度
    times:0,    //转动次数
    cycle:50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize:0,    //中奖位置
    init:function(className){
        if ($("."+className).find(".lottery-unit").length>0) {
            $lottery = $("."+className);
            $units = $lottery.find(".lottery-unit");
            this.obj = $lottery;
            this.count = $units.length;
            $lottery.find(".lottery-unit-"+this.index).addClass("active");
        };
    },
    roll:function(){
        var index = this.index;
        var count = this.count;
        var lottery = this.obj;
        $(lottery).find(".lottery-unit-"+index).removeClass("active");
        index += 1;
        if (index>count-1) {
            index = 0;
        };
        $(lottery).find(".lottery-unit-"+index).addClass("active");
        this.index=index;
        return false;
    },
    stop:function(index){
        this.prize=index;
        return false;
    }
};

function roll(){
    lottery.times += 1;
    lottery.roll();//转动过程调用的是lottery的roll方法，这里是第一次调用初始化
    if (lottery.times > lottery.cycle+10 && lottery.prize==lottery.index) {
        clearTimeout(lottery.timer);
        lottery.prize=2;
        lottery.times=0;
        click=false;
    }else{
        if (lottery.times<lottery.cycle) {
            lottery.speed -= 10;
        }else if(lottery.times==lottery.cycle) {
            var index = Math.random()*(lottery.count)|0;  //设置随机数
            lottery.prize = lotNum;  //控制中奖位置
        }else{
            if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
                lottery.speed += 110;
            }else{
                lottery.speed += 20;
            }
        }
        if (lottery.speed<40) {
            lottery.speed=40;
        };
        //console.log(lottery.times+'^^^^^^'+lottery.speed+'^^^^^^^'+lottery.prize);
        lottery.timer = setTimeout(roll,lottery.speed);//循环调用
    }
    return false;
}