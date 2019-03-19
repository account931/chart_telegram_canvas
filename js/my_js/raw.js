
$(function(){
	
	//canvas.width = window.innerWidth;     // equals window dimension
//canvas.height = window.innerHeight;


//canvas with chart
var graph = document.getElementById("graph");
var c = graph.getContext("2d");

//IF NOT IN Mobile, i.e on large screen, use special canvas width recalculation, on mobile left it as was (300x150).
//U may not use it, but on desktop canvas chart will be too small, only 300x150
if(screen.width >= 640){ 
    graph.width = window.innerWidth - 320; 
	graph.height = window.innerHeight - 320;
}



//canvas with tooltips dot
var tipCanvas = document.getElementById("tip");
var tipCtx = tipCanvas.getContext("2d");

//IF NOT IN Mobile, i.e on large screen, use special canvas width recalculation, on mobile left it as was (300x150) //NOT NECESSERY??????? Causes toolwip too wide on desktop???
/*
if(screen.width >= 640){ 
    tipCanvas.width = window.innerWidth - 320; 
	tipCanvas.height = window.innerHeight - 320;
}*/

//$(c.canvas).css("width", "80%");


var canvasOffset = $("#graph").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

var graph;
var xPadding = 30; //left padding of scales axis
var yPadding = 30;




// Y is a json values
/*
var json = {
    values: [
	    { X: 0,
          Y: 12,
		  date: "1.03" }, 
			
	    { X: 2,
          Y: 28,
		  date: "2.03"}, 
	    {
            X: 3,
            Y: 18,
		    date: "3.03"
        }, 
		{
        X: 4,
        Y: 34,
		date: "4.03"
    }, {
        X: 5,
        Y: 40,
		date: "5.03"
    }, {
        X: 6,
        Y: 80,
		date: "6.03"
    }, {
        X: 7,
        Y: 80,
		date: "7.03"
    }]
};
*/

//Json data from back-end Server
//structure var json = [ {chart1}, {chart2}];
var json = [
    { //chart 1
      column: [  {X: 0,Y: 12, date: 1551398400 /*i.e 1.03.2019*/}, {X: 2,Y: 28, date: 1551484800}, {X: 3,Y: 68, date: 1551571200}, {X: 4,Y: 34, date: 1551657600}, {X: 5,Y: 40, date: 1551744000/*5.03.19*/}, {X: 6,Y: 80, date: 1551830400}, {X: 7,Y: 69, date: 1551916800}],
	  type: 'line',
	  color: '#ff0000',  //red
	  name: 'nameX'
	},
	
	{ //chart 2
      column: [  {X: 0,Y: 4, date: 1551398400 /*i.e 1.03.2019*/}, {X: 2,Y: 7, date: 1551484800}, {X: 3,Y: 18, date: 1551571200}, {X: 4,Y: 17, date: 1551657600}, {X: 5,Y: 20, date: 1551744000/*5.03.19*/}, {X: 6,Y: 40, date: 1551830400}, {X: 7,Y:40, date: 1551916800}],
	  type: 'line',
	  color: '#ffe000',  //yellow
	  name: 'nameX2'
	},
	
	/*{ //chart 2
      column: [  {X: 0,Y: 16, date: "1.03"}, {X: 2,Y: 24, date: "2.03"}, {X: 3,Y: 2, date: "3.03"}, {X: 4,Y: 17, date: "4.03"}, {X: 5,Y: 2, date: "5.03"}, {X: 6,Y: 11, date: "6.03"}, {X: 7,Y:40}],
	  type: 'line',
	  color: 'green',  //yellow
	  name: 'nameX2'
	},*/
	
];




//alert(json[0].column.length);



// define tooltips for each json point //adding to array dots
var dots = [];


//it works, creates an array with objects for tooltips, creates in format [{x:$, y:$, rXr;$, tip:$}, {x:$, y:$, rXr;$, tip:$}]
//(90% copied from variant for 1 chart, just added additional inner for loop {for (var j = 0; j < json[i].column.length; j++)}
for (var i = 0; i < json.length; i++) {
	for (var j = 0; j < json[i].column.length; j++) {
	  var statusX;
	  if(i % 2 !=0){statusX = "Left";} else {statusX ="Joined";} //define value for status
	  
      dots.push({
        x: getXPixel(json[i].column[j].X),
        y: getYPixel(json[i].column[j].Y),
        r: 4,
        rXr: 16,
        color: "red", //NOT USED???
        tip: json[i].column[j].Y,  //"#text" + (i + 1)  //Mega error was here //text of tooltip,
		dateZ: json[i].column[j].date, //
		status: statusX // 1st or 2nd chart. Joined/Left
    });
	}
}


//Multilines charts. Working. Creates tooltips array dots[] in format [ {r:4, column:[x:$, y:$, tip:$, dateZ:$ ]}, {}]
//define tooltips for each json point //adding to array dots //Format od array dots[] is [ {r:4, column:[x:$, y:$, tip:$, dateZ:$ ]}, {}]
/*for (var i = 0; i < json.length; i++) {
    var temp_dots = {}; //creats temp object
    temp_dots.color = 'red';
	temp_dots.r = 4;
	temp_dots.rXr = 16;
	temp_dots.column = []; //creates temp array column[] in object temp_dots
		
	for (var j = 0; j < json[i].column.length; j++) { //iterates over column length
		var b = {}; //creats tem object which will contain x,y coord
		b.x = json[i].column[j].X;
		b.y = json[i].column[j].Y;	
		b.dateZ = json[i].column[j].date;
		b.tip = json[i].column[j].Y;
		temp_dots.column.push(b); //adding temp created object {x:3, y:6} to array temp_dots
	}
	
	//dots push
	dots.push(temp_dots);  //Mega error was using this dots.push(JSON.stringify(temp_dots));
}
*/





alert("dots" + JSON.stringify(dots, null, 4));
console.log(dots);










// request mousemove events
$("#graph").mousemove(function (e) {
    handleMouseMove(e);
});



// show tooltip when mouse hovers over dot  
//This variant was only used for tooltip dots[] array, when dots[] is in format [ {r:4, column:[x:$, y:$, tip:$, dateZ:$ ]}, {}]
/*function handleMouseMove(e) {
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // Put your mousemove stuff here
    var hit = false;
	
    for (var i = 0; i < dots.length; i++) { 
    for (var j = 0; j < dots[i].column.length; j++) { 
	(function(ix, p) {  //shooters, or u can just use {let i = 1} in loop instead of shooters //ix is {i}, p is {j} //SHOOTER is a must otherwise it jumps to last i at once
		//alert("tooltip " + i + " , j=" + j);
		//alert(dots[0].color);
		
        //var dot = dots[i].column[j];
        var dx = mouseX - dots[ix].column[p].x;
        var dy = mouseY - dots[ix].column[p].y;   //alert(dots[i].column[j].y);
		
		//alert(dots[i].rXr);
		//alert(dx * dx + dy * dy);
        if (dx * dx + dy * dy < dots[ix].rXr) {  //RETURN
			
			//Mine
			$("#tip").show(300); //show tooltip, by default in css: display: none. Is made to fix overlaping an empty tooltip
			
            tipCanvas.style.left = (dots[ix].column[p].x) + "px"; //tooltip margin left
            tipCanvas.style.top = (dots[ix].column[p].y - 40) + "px";  //tooltip margin bottom
            tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height ); //clearRect(marginLeft, width, height)
            //                  tipCtx.rect(0,0,tipCanvas.width,tipCanvas.height);
			
			//tooltip text
			var toolTipText_date = dots[ix].column[p].dateZ; //alert("tool " + toolTipText_date);
            var toolTipText_text = dots[ix].column[p].tip ; 			
			
			//in mobile only
			if(screen.width <= 640){ 
			    tipCtx.font = "60px Arial"; //set font size
				tipCtx.fillText(toolTipText_date, 25, 85); //(text, paddingLeft, paddingTop) //error was in $(dot.tip).val()
				tipCtx.fillText("______", 25, 85);
				tipCtx.fillText(toolTipText_text, 25, 145); 
			} else {
				//tipCtx.font = "20px Arial"; //set font size
                tipCtx.fillText(toolTipText_date, 5, 15); //(text, paddingLeft, paddingTop) //error was in $(dot.tip).val()
				tipCtx.fillText("_________", 5, 20);
				tipCtx.fillText(toolTipText_text, 5, 35); 
			}
            hit = true;
        } //RETURN
		//else {
			//$("#tip").hide(800);
		//}
		
	})(i, j); // end shooters 
	
	} // end j++
    } //end i++
    if (!hit) {
        tipCanvas.style.left = "-1000px";  //was 200px, this solution fixes bug when tooltip appears in left empty if not mouse overed
    }
	
}
*/





// show tooltip when mouse hovers over dot. Version for 2 or multilines charts
function handleMouseMove(e) {
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // Put your mousemove stuff here
    var hit = false;
    for (var i = 0; i < dots.length; i++) { //alert(dots.length);
        var dot = dots[i];
        var dx = mouseX - dot.x;
        var dy = mouseY - dot.y;
        if (dx * dx + dy * dy < dots[i].rXr) {
			
			//Mine
			$("#tip").show(300); //show tooltip, by default in css: display: none. Is made to fix overlaping an empty tooltip
			
            tipCanvas.style.left = (dots[i].x) + "px"; //tooltip margin left
            tipCanvas.style.top = (dots[i].y - 40) + "px";  //tooltip margin bottom
            tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height ); //clearRect(marginLeft, width, height)
            //                  tipCtx.rect(0,0,tipCanvas.width,tipCanvas.height);
			
			//define tooltip text
			var toolTipText_date = funct_convert_dateStamp(dots[i].dateZ) ; //converts dateUnix to normal
			//alert(toolTipText_date);
            var toolTipText_text = dots[i].tip + " " + dots[i].status ;  //defines tip + status, i.e "40 Left"
            if(dots[i].status == "Joined"){
				textColor = "green";
			} else {
				textColor = "red";
			}				
			
			tipCtx.fillStyle = "black"; //set initial text color to black
			
			//in mobile only. Here we specify fonr-size and text paddings for mobile devices
			if(screen.width <= 640){ 
			    tipCtx.font = "45px Arial"; //set font size
				tipCtx.textAlign = "center"; //set text to center, in order to center horiz, there must be 150 in .fillText(text, 150, paddingTop) // 150 is the anchor point
				tipCtx.fillText(/*$(dot.tip).val()*/toolTipText_date, 150, 65); //(text, paddingLeft, paddingTop)  // Tooltip Date
				//tipCtx.fillText("______", 25, 75);
				tipCtx.fillStyle = textColor; //set text color
				tipCtx.font = "60px Arial"; //set font size
				tipCtx.fillText(toolTipText_text, 150, 135);  //Tooltip text, i.e "40 Left"
			} else {
				//desktop
				tipCtx.font = "40px Arial"; //set font size
				tipCtx.textAlign = "center"; //set text to center, in order to center horiz, there must be 150 in .fillText(text, 150, paddingTop) // 150 is the anchor point
                tipCtx.fillText(/*$(dot.tip).val()*/toolTipText_date, 159, 45); //(text, paddingLeft, paddingTop)(was 45, 45)
				//tipCtx.fillText("____________________", 1, 50);
				tipCtx.fillStyle = textColor; //set text color
				tipCtx.fillText(toolTipText_text, 150, 105); //Tooltip text, i.e "40 Left" (was 70, 105)
			}
            hit = true;
        } /*else {
			$("#tip").hide(800);
		}*/
    }
    if (!hit) {
        tipCanvas.style.left = "-1000px";  //was 200px, this solution fixes bug when tooltip appears in left empty if not mouse overed
    }
}


















// unchanged code follows

// Returns the max Y value in our json list,in any of chart object(chart1, chart2....)  
function getMaxY() {
    var max = 0;
    for (var i = 0; i < json.length; i++) {
	    for (var j = 0; j < json[i].column.length; j++) {
            if (json[i].column[j].Y > max) {
                max = json[i].column[j].Y;
            }
	    }
    }
	//alert("max-> " + max);
    max += 10 - max % 10;
    return max;
}






// Returns the max X value in our json list!
function getMaxX() {
    var max = 0;
    for (var i = 0; i < json.length; i++) {
		for (var j = 0; j < json[i].column.length; j++) {
            if (json[i].column[j].X > max) {
                max = json[i].column[j].X;
            }
        }
	}
    // omited
    //max += 10 - max % 10;
	//alert("max " + max)
    return max;
}

//getMaxX();  //test only






 
 

// Return the x pixel for a graph point
function getXPixel(val) {
    // uses the getMaxX() function
    return ((graph.width - xPadding) / (getMaxX() + 1)) * val + (xPadding * 1.5);
    // was
    //return ((graph.width - xPadding) / getMaxX()) * val + (xPadding * 1.5);
}

// Return the y pixel for a graph point
function getYPixel(val) {
    return graph.height - (((graph.height - yPadding) / getMaxY()) * val) - yPadding;
}

//var graph = document.getElementById("graph"); //DUPLICATE
//var c = graph.getContext('2d');

c.lineWidth = 2; //width of XY axis scale
c.strokeStyle = '#333';
c.font = 'italic 8pt sans-serif';
c.textAlign = "center";

// Draw the axises scales
c.beginPath();
c.moveTo(xPadding, 0);
c.lineTo(xPadding, graph.height - yPadding);
c.lineTo(graph.width, graph.height - yPadding);
c.stroke();






// Draw the X value texts, draw text values in horizont axis!!!!!!
var maxXValue = getMaxX();
for (var i = 0; i <= maxXValue -1; i++) { //was originally (var i = 0; i <= maxXValue; i++), use -1 strictly for cases with dates
    // uses json.values[i].X
    c.fillText(i /*json.values[i].date*/ , getXPixel(i), graph.height - yPadding + 20);
}




// Draw the Y value texts, text in vertical axis
c.textAlign = "right"
c.textBaseline = "middle";

for (var i = 0; i < getMaxY(); i += 10) {
    c.fillText(i, xPadding - 10, getYPixel(i));
}

c.strokeStyle = '#f00';















//STOPPED HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 
 

// Draw the CHART graph Lines------------------------------------------------------------
// **************************************************************************************
// **************************************************************************************
//                                                                                     **
/*
function drawChart(i){
	c.lineTo(getXPixel(json.values[i].X), getYPixel(json.values[i].Y)); 
	c.stroke();
}

function getDrawer(i) {
    return function() {
        drawChart(i);
    }
}
*/

//var timeX;

c.beginPath();
//c.moveTo(getXPixel(json.values[0].X), getYPixel(json.values[0].Y)); //moveTo() method moves the path to the specified point in the canvas, without creating a line.
alert("json.values.length;" + json.length);
//c.lineTo(getXPixel(2), getYPixel(28));c.stroke();

for (var i = 0; i < json.length; i++) { // was i=1

//(function(iZ) {  //shooters, or u can just use {let i = 1} in loop instead of shooters
//alert("iZ-> " + iZ);
    
    for (var j = 0; j < json[i].column.length; j++) {
	    (function(ix, p) {  //shooters, or u can just use {let i = 1} in loop instead of shooters //ix is {i}, p is {j} //SHOOTER is a must otherwise it jumps to last i at once
	         setTimeout(function() {
	         
			     //alert("ix-> " + ix + " j-> " + p);
			 
			     //Mega Fix, sets the path to start position, out of for loop it was not working
			     //sets the path to start position in a very first iteration 
			     if(p == 0 ){ 
					 c.beginPath(); //mega fix to draw different colors lines
				     c.moveTo(getXPixel(json[ix].column[0].X), getYPixel(json[ix].column[0].Y));
			     }
			 
			 
	             //alert(ix);
		         //alert(json.values[ix].X + "  and " +  json.values[ix].Y + " i->" + ix);
			 
			     //all other iterations starting from 2nd, draw lines with {c.lineTo}
				 
		         c.lineTo(getXPixel(json[ix].column[p].X), getYPixel(json[ix].column[p].Y)); 
				 c.strokeStyle = json[ix].color ;
				 
		         c.stroke(); //stroke() method to actually draw the path on the canvas.
				 
		         //c.clearRect(0,0,graph.width,graph.height);
		         //drawChart();
		         //setTimeout(getDrawer(i), 1000);
		         //setTimeout(getDrawer(i), 1000);
		     
			 
			     //timeX = ix * p;
			 
	        }, /*ix*/1 * 500);
	    })(i, j); // end shooters 


   //c.lineTo(getXPixel(json.values[i].X), getYPixel(json.values[i].Y));
}
//})(i); // end shooters 
}
//c.stroke();
// **                                                                                  **
// **************************************************************************************
// **************************************************************************************
// END Draw the CHART graph Lines









// Draw the hoverable dots
// **************************************************************************************
// **************************************************************************************
//                                                                                     **

c.fillStyle = '#333'; //grey

for (var i = 0; i < json.length; i++) {
	for (var j = 0; j < json[i].column.length; j++) {
        c.beginPath();
        c.arc(getXPixel(json[i].column[j].X), getYPixel(json[i].column[j].Y), 8/*Radius*/, 0, Math.PI * 2, true);
        c.fill();
	}
}

// **                                                                                  **
// **************************************************************************************
// **************************************************************************************




//draw "Followers text"
c.font = "20px Georgia";
c.fillText("Followers", 130, 20);






//converts Unix to normal
function funct_convert_dateStamp(dateStampp)
{
  var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  var monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  var dateTime =  new Date(dateStampp*1000);//Mega Error, must be {dateStampp*1000}, was without *1000
  var curr_date = dateTime.getDate(); //gets the date
  var curr_month = dateTime.getMonth();// gets month //+ 1;  
  var curr_year = dateTime.getFullYear();
  var dayOfWeek = weekdays[dateTime.getDay()]; //day of the week
  var n = dayOfWeek + ", " + monthList[curr_month] + " " + curr_date/* + "-" + curr_year*/;
  

  return n;
}

//alert(funct_convert_dateStamp(1551398400));


});         
