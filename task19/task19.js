/*
 * add handler to element
 */
function addHandler(element, type, handler) {
    if(element.addEventListener) {
        addHandler = function(element, type, handler) {
            element.addEventListener(type, handler, false);
        };
    } else if (element.attachEvent) {
        addHandler = function(element, type, handler) {
            element.attachEvent("on"+type, handler);
        };
    } else {
        addHandler = function(element, type, handler) {
            element["on"+type] = handler;
        };
    }
    return addHandler(element, type, handler);
};

/*
 * get target from event
 */
function getTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
};

/*
 * prevent default
 */
function preventDefault(event) {
    if(event.preventDefault) {
        preventDefault = function(event) {
            event.preventDefault;
        }
    } else {
        preventDefault = function(event) {
            event.returnValue = false;
        }
    }
    return preventDefault(event);
};

function init(queue, lin) {
    var randHeight, i, input = document.querySelector("input");
    queue.innerHTML = "";
    for(var i = 0; i < 10; i++) {
        input.value = Math.floor(Math.random() * 90) + 10;
        lin.click();
    }
};

function trim(word) {
    return word.replace(/^\s+|\s+$/g,"");
};

(function(){
    var btns        =document.querySelectorAll("button"),
        lin         =btns[0],
        rin         =btns[1],
        lout        =btns[2],
        rout        =btns[3],
        messBtn     =btns[4],
        bubbleBtn   =btns[5],
        selectionBtn=btns[6],
        insertionBtn=btns[7],
        queue       =document.querySelector("ul");

    addHandler(lin,"click",leftIn);
    addHandler(rin,"click",rightIn);
    addHandler(lout,"click",leftOut);
    addHandler(rout,"click",rightOut);
    addHandler(queue,"click",deleteEle);
    addHandler(messBtn,"click",function(){
        init(queue,lin);
    });
    addHandler(bubbleBtn,"click",function(){
        bubbleSort(queue);
    });
    addHandler(selectionBtn,"click",function(){
        selectionSort(queue);
    });
    addHandler(insertionBtn,"click",function(){
        insertionSort(queue);
    });

    init(queue,lin);
})();

function leftIn()
{
    var queue=document.querySelector("ul"),
        input=document.querySelector("input"),
        newEle=document.createElement("li"),
        oldEle=queue.querySelectorAll("li")[0],
        temp;

    if(!(temp=transValue(input)))
    {
        return false;
    }
    newEle.style.height=temp+"px";
    if(queueLength(queue)>=60)
    {
        alert("队列满了");
    }
    else if(!oldEle)
    {
        queue.appendChild(newEle);
    }
    else
    {
        queue.insertBefore(newEle,oldEle);
    }
}

function rightIn()
{
    var queue=document.querySelector("ul"),
        input=document.querySelector("input"),
        newEle=document.createElement("li"),
        temp;

    if(!(temp=transValue(input)))
    {
        return false;
    }
    newEle.style.height=temp+"px";
    if(queueLength(queue)>=60)
    {
        alert("队列满了");
    }
    else
    {
        queue.appendChild(newEle);
    }
}

function leftOut()
{
    var queue=document.querySelector("ul"),
        oldEle=queue.querySelectorAll("li")[0];

    if(!oldEle)
    {
        alert("队列空了");
    }
    else
    {
        alert(oldEle.offsetHeight);
        queue.removeChild(oldEle);
    }
}

function rightOut()
{
    var queue=document.querySelector("ul"),
        oldEle=queue.lastChild;

    if(!oldEle)
    {
        alert("队列空了");
    }
    else
    {
        alert(oldEle.offsetHeight);
        queue.removeChild(oldEle);
    }
}

function deleteEle(event)
{
    var oldEle=getTarget(event),
        queue=document.querySelector("ul");

    if(oldEle.tagName=="LI")
    {
        queue.removeChild(oldEle);
    }
}

/*
 * the number of elements in queue
 */
function queueLength(queue)
{
    return queue.querySelectorAll("li").length;
}

function transValue(input)
{
    var result=parseInt(input.value.replace(/\D/g,""),10);  //把非数字用替换为 空，只保留数字;10代表10进制

    if(result>100||result<10)
    {
        input.value="必须为10-100的整数";
        return false;
    }
    return result;
}

function swap(ele1,ele2)
{
    var temp=ele1.offsetHeight;

    ele1.offsetHeight=ele2.offsetHeight;
    ele1.style.height=ele2.offsetHeight+"px";
    ele2.offsetHeight=temp;
    ele2.style.height=temp+"px";

    // 如果只是相邻元素swap，可以使用下面这个方法直接交换dom元素
    // 但是考虑到非冒泡排序算法使用swap时不一定是交换相邻元素(比
    // 如插入排序)，所以使用交换高度的方法。注意ele.style.height
    // 和ele.offsetHeight都需要互换

    // ele1.parentNode.insertBefore(ele2, ele1);
}

function bubbleSort(queue)
{
    var eles=queue.querySelectorAll("li"),
        len=eles.length,
        i,j= 0,delay=100,timer;

    i=len-1;
    timer=setInterval(function(){       //setInterval按着一定时间调用函数
        if(i<1)
        {
            clearInterval(timer);       //结束
        }
        if(j==i)                        //一轮结束
        {
            --i;
            j=0;
        }
        if(eles[j].offsetHeight>eles[j+1].offsetHeight)
        {
            swap(eles[j],eles[j+1]);
        }
        ++j;
    },delay);
}

function selectionSort(queue)
{
    var eles=queue.querySelectorAll("li"),
        len=eles.length,
        i= 0,j= 1,min= 0,delay=100,timer;

    timer=setInterval(function(){
        if(i==len-1)
        {
            clearInterval(timer);
        }
        if(j==len)                      //到最右边，将最小值和位置元素互换
        {
            swap(eles[i],eles[min]);
            ++i;
            min=i;
            j=i+1;
        }
        if(eles[j] && eles[j].offsetHeight < eles[min].offsetHeight)
        {
            min=j;
        }
        ++j;

    },delay);
}

//用内外两个变量控制内外循环
function insertionSort(queue)
{
    var eles=queue.querySelectorAll("li"),
        len=eles.length,
        temp,i= 1,j= 0,timer,delay=100,outer=true,inner=false;

    timer=setInterval(function(){
        if(outer)
        {
            if(i==len)
            {
                clearInterval(timer);
                return;
            }
            if(eles[i].offsetHeight < eles[i-1].offsetHeight)
            {
                temp=eles[i].offsetHeight;
                j=i-1;
                outer=false;
                inner=true;
            }
            else
            {
                i++;
            }
        }
        if(inner)
        {
            if(j<0 || eles[j].offsetHeight < temp)
            {
                eles[j+1].style.height=temp+"px";
                eles[j+1].offsetHeight=temp;
                i++;
                inner=false;
                outer=true;
            }
            else
            {
                eles[j+1].style.height=eles[j].style.height;
                eles[j+1].offsetHeight=eles[j].offsetHeight;
                j--;
            }
        }
    },delay);
}
