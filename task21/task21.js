//跨浏览器时间绑定
function addEventHandler(ele,event,handler)
{
    if(ele.addEventListener)
    {
        ele.addEventListener(event,handler,false);
    }
    else if(ele.attachEvent)
    {
        ele.attachEvent("on"+event,handler);
    }
    else
    {
        ele["on"+event]=handler;
    }
}

var tagInput=document.getElementById("tag_input"),
    tagList=document.getElementById("tag_list"),
    hobbyInput=document.getElementById("hobby_input"),
    hobbyList=document.getElementById("hobby_list"),
    hobbyBtn=document.getElementsByTagName("button")[0];

//实例对象
var tagObj=new CreateList(tagList),
    hobbyObj=new CreateList(hobbyList);

window.onload=function()    //页面加载后执行函数
{
    alert("1");
    addEventHandler(tagInput,"keyup",showTag);      //绑定事件
    addEventHandler(hobbyBtn,"click",showHobby);    //绑定事件

    addEventHandler(tagList,"mouseover",function(e){
        if(e.target && e.target.nodeName=="span")
        {
            e.target.firstChild.insertData(0,"点击删除");
            e.target.style.background="red";
        }
    });
    addEventHandler(tagList,"mouseout",function(e){
        if(e.target && e.target.nodeName=="span")
        {
            e.target.firstChild.deleteDate(0,4);
            e.target.style.background="#78BCFB";
        }
    });
    addEventHandler(tagList,"click",function(e){
        if(e.target && e.target.nodeName=="span")
        {
            tagList.removeChild(e.target);
        }
    })
}

//构造函数模式与原型模式结合
function CreateList(divList)
{
    this.queue=[];
    this.render=function(){
        var str="";
        this.queue.forEach(function(e){
            str+="<span>"+e+"</span>";
        });
        divList.innerHTML=str;
    }
}
CreateList.prototype.rightPush=function(str)
{
    this.queue.push(str);
    this.render();
};
CreateList.prototype.leftShift=function(str)
{
    this.queue.shift(str);
    this.render();
};

//对输入内容分割成数组
function splitInput(str)
{
    var inputArray=str.trim().split(/[,，;；、。.\s\n]+/);
    return inputArray;
}

function showTag()
{
        if(/[,，;；、。.\s\n]+/.test(tagInput.value) || event.keyCode==13)  //enter键的ASCII是13
        {
            var data=splitInput(tagInput.value),
                newTag=data[0];
            if(tagObj.queue.indexOf(newTag)===-1)
            {
                tagObj.rightPush(newTag);
                if(tagObj.queue.length>10)
                {
                    tagObj.leftShift();
                }
            }
            tagObj.render();
            tagInput.value="";
        }
}

function showHobby()
{
    var data=splitInput(hobbyInput.value);
    data.forEach(function(e){
        if(hobbyObj.queue.indexOf(e)===-1)
        {
            hobbyObj.rightPush(e);
            if(hobbyObj.queue.length>10)
            {
                hobbyObj.leftShift();
            }
        }
        hobbyObj.render();
        hobbyInput.value="";
    });
}