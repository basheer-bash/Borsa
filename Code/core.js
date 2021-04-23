//Selectors=====================================================================
var table=document.querySelector("#myTable");
var tbody=table.querySelector("tbody");
var select=document.querySelector("#searchSector");
var pageselect=document.querySelector("#selectPage");
var next=document.querySelector("#next");
var prev=document.querySelector("#prev");
var pages=13;
/* Create an array to save moved elements */
var removedTRs=document.createElement("tbody"); 
//Functions=====================================================================
function addElements(dailyObj,sectorsObj){
    var tr,td;
    var set=new Set();
    for(let key in dailyObj){
        tr=document.createElement("tr");
        // First: dailyArr[id][0]
        td=document.createElement("td");
        td.appendChild(document.createTextNode(dailyObj[key][0]));
        tr.appendChild(td);
        // Second: dailyArr[id][1]
        td=document.createElement("td");
        td.appendChild(document.createTextNode(dailyObj[key][1]));
        tr.appendChild(td);
        // Third: id
        td=document.createElement("td");
        td.appendChild(document.createTextNode(key));
        tr.appendChild(td);
        // Fourth: sectorsObj[id][0] (if it exist)
        td=document.createElement("td");
        if(!!sectorsObj[key]){
            td.appendChild(document.createTextNode(sectorsObj[key][1]));
            set.add(sectorsObj[key][1]);
        }
        tr.appendChild(td);
        // Fifth: dailyArr[id][2]
        td=document.createElement("td");
        td.appendChild(document.createTextNode(dailyObj[key][2]));
        tr.appendChild(td);
        // Sixth: dailyArr[id][3]
        td=document.createElement("td");
        td.appendChild(document.createTextNode(dailyObj[key][3]));
        tr.appendChild(td);
        // Seventh: Percent
        td=document.createElement("td");
        var percent=(100*Math.abs((dailyObj[key][3]-dailyObj[key][2])/dailyObj[key][2])).toFixed(2);
        td.appendChild(document.createTextNode(percent));
        tr.appendChild(td);
        // Eight: ↑ / ↓
        td=document.createElement("td");
        var arr=((dailyObj[key][2]-dailyObj[key][3]<0)?"↑":((dailyObj[key][2]-dailyObj[key][3]>0)?"↓":"-"))
        td.appendChild(document.createTextNode(arr));
        tr.appendChild(td);
        if(arr==="↑")tr.classList.add("Up");
        else if(arr==="↓")tr.classList.add("Down");
        //Append to tbody
        tbody.appendChild(tr);
    }
    AddToList(set);
}
//--Add to Select List--
function AddToList(set){
    var option;
    var optionG=document.createElement("optgroup");
    optionG.setAttribute('label','ענף');
    option=document.createElement("option");
    option.appendChild(document.createTextNode("***ללא***"));
    optionG.appendChild(option);
    for(let el of set){
        option=document.createElement("option");
        option.appendChild(document.createTextNode(el));
        optionG.appendChild(option);
    }
    select.appendChild(optionG);
    //Rest
    optionG=document.createElement("optgroup");
    optionG.setAttribute('label','שינוי');
    option=document.createElement("option");
    option.appendChild(document.createTextNode("-"));
    optionG.appendChild(option);
    option=document.createElement("option");
    option.appendChild(document.createTextNode("↑"));
    optionG.appendChild(option);
    option=document.createElement("option");
    option.appendChild(document.createTextNode("↓"));
    optionG.appendChild(option);
    option=document.createElement("option");
    option.appendChild(document.createTextNode("חריג (מעל 10%)"));
    optionG.appendChild(option);
    select.appendChild(optionG);
}
function updateTable(){
    var option=select.value;
    switch(select.options[select.selectedIndex].parentElement.label){
        case "כללי": 
        //All of the table
        displayTrs(1,option);
        break;
        case "שינוי": 
        //Using last column
        displayTrs(2,option);
        break;
        case "ענף": 
        //Using the fourth column
        if(option==="***ללא***")option="";
        displayTrs(3,option);
        break;
        default: 
        //we are screwed
        console.log("Error: was not suppose to fire");
        break;
    }
}
function displayTrs(cat,element){
    var trs=tbody.querySelectorAll("tr");
    // console.log(trs);
    if(cat===1){
        trs.forEach((tr)=>{tr.style.display=""});
        return;
    }
    var query;
    if(cat===2){
        if(element==="חריג (מעל 10%)"){
            trs.forEach((tr)=>{
                if(tr.querySelector("td:nth-of-type(7)").innerText>10)
                    tr.style.display="";//change to classes
                else
                tr.style.display="none";
            });
            return;
        }
        else
            query="td:nth-of-type(8)";
    }
    if(cat===3){
        query="td:nth-of-type(4)";
    }
    trs.forEach((tr)=>{
        if(tr.querySelector(query).innerText===element)
            tr.style.display="";//change to classes
        else
        tr.style.display="none";
    });
}
//TESTING
function updateTablev2(){
    var option=select.value;
    switch(select.options[select.selectedIndex].parentElement.label){
        case "כללי": 
        //All of the table
        displayTrsv2(1,option);
        break;
        case "שינוי": 
        //Using last column
        displayTrsv2(2,option);
        break;
        case "ענף": 
        //Using the fourth column
        if(option==="***ללא***")option="";
        displayTrsv2(3,option);
        break;
        default: 
        //we are screwed
        console.log("Error: was not suppose to fire");
        break;
    }
    Paging();
    removeArrows();
}
function displayTrsv2(cat,element){
    var trs=tbody.querySelectorAll("tr");
    var removedtrs=removedTRs.querySelectorAll("tr")
    // console.log(trs);
    if(cat===1){
        removedtrs.forEach((tr)=>{removedTRs.removeChild(tr);tbody.appendChild(tr)});
        return;
    }
    if((cat===2&& element!=="חריג (מעל 10%)") || cat===3){
        //move on removedTRs
        var query="td:nth-of-type(8)";
        if(cat===3)query="td:nth-of-type(4)";
        //need to remove from arr
        removedtrs.forEach((tr)=>{
            if(tr.querySelector(query).innerText===element){
                removedTRs.removeChild(tr);
                tbody.appendChild(tr);
            }
        });
        trs.forEach((tr)=>{
            if(tr.querySelector(query).innerText!==element){
                tbody.removeChild(tr);
                removedTRs.appendChild(tr);
            }
        });
    }else{
        //move on removedTRs
        var query="td:nth-of-type(7)";
        //need to remove from arr
        removedtrs.forEach((tr)=>{
            if(tr.querySelector(query).innerText>10){
                removedTRs.removeChild(tr);
                tbody.appendChild(tr);
            }
        });
        trs.forEach((tr)=>{
            if(tr.querySelector(query).innerText<=10){
                tbody.removeChild(tr);
                removedTRs.appendChild(tr);
            }
        });
    }
}
//--Paging Tools--
function setToPageN(trs,n){
    //var trs=tbody.querySelectorAll("tr");
    for(let i=0;i<trs.length;i++){
        (Math.ceil((i+1)/10)!==n)?trs[i].style.display="none":trs[i].style.display="";
    }
}
function setDropNumber(pages){
    var option;
    pageselect.innerHTML="";
    for(let i=1;i<=pages;i++){
        option=document.createElement("option");
        option.appendChild(document.createTextNode(i));
        pageselect.appendChild(option);
    }
}
function UpdateButtons(option){
    if(option===1)prev.disabled=true;
    else prev.disabled=false;
    if(option===pages)next.disabled=true;
    else next.disabled=false;
}
function PageSelect(){
    var option=Number(pageselect.value);
    var trs=tbody.querySelectorAll("tr");
    //Buttons update
    UpdateButtons(option);
    //Set Pages
    setToPageN(trs,option);
}
function Paging(){
    var trs=tbody.querySelectorAll("tr");
    pages=Math.ceil(trs.length/10);
    setDropNumber(pages);
    setToPageN(trs,1);
    //Buttons update
    UpdateButtons(1);
}
function clickNext(){
    var option=Number(pageselect.value);//5
    pageselect.selectedIndex=option;//
    var trs=tbody.querySelectorAll("tr");
    //Buttons update
    UpdateButtons(option+1);
    //Set Pages
    setToPageN(trs,option+1);
}function clickPrev(){
    var option=Number(pageselect.value);
    pageselect.selectedIndex=option-2;
    var trs=tbody.querySelectorAll("tr");
    //Buttons update
    UpdateButtons(option-1);
    //Set Pages
    setToPageN(trs,option-1);
}
function removeArrows(){
    var icon=document.querySelectorAll('th span');
    icon.forEach((span)=>{
        span.parentNode.removeChild(span);
    });
}
function addSortDirection(asc,th){
    var span=document.createElement("span");
    removeArrows();
    if(asc)
        span.appendChild(document.createTextNode("▼")) 
    else
        span.appendChild(document.createTextNode("▲")) 
    th.appendChild(span);
}
//--Sorting Tools--
const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
    Array.from(tbody.querySelectorAll('tr'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => tbody.appendChild(tr) );
        Paging();
        addSortDirection(!this.asc,th)
})));
//Execute=====================================================================
addElements(shareValue,sectors);
Paging();