$(function(){
    var todos=[];
    if(localStorage.todo_data){
         todos=JSON.parse(localStorage.todo_data);
        render()
    }else{
        localStorage.todo_data=JSON.stringify(todos);
    }
//增加
    $('.item-one').on('click',function(){
        $('.content-box').addClass('zoom-in-up');
        $('.content-box .addevent').find('input').focus();
            addTodo();
        $('.content-box input').get(0).value='';
    });
function addTodo(){
    todos.push({title:'',state:0,isDel:0});
    localStorage.todo_data=JSON.stringify(todos);
    render();
}
function render(){
    $('.item-list').empty();
    $.each(todos,function(i,v){
        $('<li class="item"><a class="cirle-left"></a><span class="main">'+v.title+'</span><i class="right icon-font icon-shanchu"></i></li>')
            .addClass(function(){
                if(v.state){
                    return 'done';
                }
            }).appendTo('.item-list');
    })
}
//滑动事件
    var left=null;
    $('.item-list').on('touchstart','.item',function(e){
        left=e.originalEvent.changedTouches[0].pageX;
    });
    //move
    $('.item-list').on('touchmove','.item',function(e){
        var n=e.originalEvent.changedTouches[0].pageX;
        var x=n-left;
        if(x<-20){
            $(this).css('transform','translate3d(-0.7rem,0,0)');
        }else{
            $(this).css('transform','translate3d('+x+'px,0,0)')
        }

    });
    //touchend 动画完成
    $('.item-list').on('touchend','.item',function(e){
        $(this).css('transition','transform .8s ease');
        $(this).css('transform','translate3d(0,0,0)');
        $(this).delay(800).queue(function(){
            $(this).css('transition','none').dequeue();
        });
        var n=e.originalEvent.changedTouches[0].pageX;
        if((n>left)&&(n-left>40)){
            $(this).addClass('done');
            todos[$(this).index()].state=1;
            localStorage.todo_data=JSON.stringify(todos);
        }
    });
    //还原
    $('.item-list').on('click','.cirle-left',function(e){
        $(this).closest('li').removeClass('done');
        todos[$(this).closest('li').index()].state=0;
        localStorage.todo_data=JSON.stringify(todos);
    });
    //删除
    $('.item-list').on('touchstart','.right',function(e){
        var i=$(this).closest('li').index();
        todos.splice(i,1);
        $(this).closest('li').addClass('xiaoshi');
        $(this).closest('li').delay(800).queue(function(){
            $(this).remove().dequeue();
        });
        localStorage.todo_data=JSON.stringify(todos);
    });
    //清空
    $('.footer').on('click',function(){
          $('.done').removeClass('xiaoshi').addClass('hinge').delay(800).queue(function(){
              $(this).remove().dequeue();
          });
        todos=todos.filter(function(v,i){
            return v.state=0;
        });
        localStorage.todo_data=JSON.stringify(todos);
    });
  //阻止冒泡
  //   function stopDefault(e) {
  //       //阻止默认浏览器动作(W3C)
  //       if (e && e.preventDefault)
  //           e.preventDefault();
  //       //IE中阻止函数器默认动作的方式
  //       else
  //           window.event.returnValue = false;
  //       return false;
  //   }
    //新增，弹出输入框
    $('.item-list').on('click','span',function(){
        $('.reset').removeClass('reset');
        $(this).addClass('reset');
        $('.content-box').addClass('zoom-in-up');
        $('.content-box .addevent').find('input').focus();
        var text=$(this).text();
        $('.content-box input').get(0).value=text;
        // console.log(1)
    });
    //点击确定
    $('.yes').on('click',function(){
        var text=$('.content-box input').val();
        if($('.reset').length==0){
            var n=$('.main').length-1;
            $('.main').eq(n).addClass('reset')
        }
        var index= $('.main').index($('.reset'));
        $('.reset').get(0).innerHTML=text;
        $('.reset').removeClass('reset');
        $('.content-box').removeClass('zoom-in-up');
        $('.content-box input').attr('value','');
        todos[index].title=text;
        localStorage.todo_data=JSON.stringify(todos);
    })
    //点击返回
    $('.black').on('click',function(){
        $('.content-box').removeClass('zoom-in-up');
    })
})