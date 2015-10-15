var goalArray = [];
var filteredGoalArray = {};
//var checkboxType = {};
checkboxType = "combobox";
//checkboxType = "numeric";
var filteredGoalSummaries = [];

var frequencyArray = [];

var barData = {};
var pieData = {};

var isPie = false; //pie = 0, bar = 1, 

//Example
var runday1 = new Goal("run 5km", "description hello", "combobox", null, new Date(),null, "not checked");
var runday2 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "not checked");
var runday3 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "not checked");
var runday4 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "not checked");
var runday5 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "checked");
var runday6 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "checked");
var runday7 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "checked");

var rundays = [runday1,runday2,runday3,runday4,runday5,runday6,runday7];

var drinkgoal1 = new Goal("run 5km", "description hello", "combobox", null, new Date(),null, "high");
var drinkgoal2 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "medium");
var drinkgoal3 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "low");
var drinkgoal4 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "high");
var drinkgoal5 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "medium");
var drinkgoal6 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "medium");
var drinkgoal7 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "medium");

var drinkdays = [drinkgoal1, drinkgoal2,drinkgoal3,drinkgoal4,drinkgoal5,drinkgoal6,drinkgoal7];
//drinkdays = gym
var realrunday1 = new Goal("run 5km", "description hello", "combobox", null, new Date(),null, "2");
var realrunday2 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "2");
var realrunday3 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "1");
var realrunday4 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "3");
var realrunday5 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "2");
var realrunday6 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "1");
var realrunday7 = new Goal("run 5km", "description", "combobox", null, new Date(),null, "3");

var realrundays = [realrunday1,realrunday2,realrunday3,realrunday4,realrunday5,realrunday6,realrunday7];


function chartGenerateClick() {
    var days = getDays();
    var title = document.getElementById("goal").value;
    findEventClick(title, days); // this function calls chartGenerate() below
}

//onclick = chartGenerate()
function chartGenerate(gArray){
    goalArray = gArray;
	console.log("chartGenerate()");
	var title = document.getElementById("goal").value;
	console.log(title);
	
//		var days = getDays();
//		console.log(days);
	//	goalArray = findEventClick(days);
	//	filteredGoalArray = filterGoal(goalArray);
	
		
	 	if (title == "checkbox"){
		checkboxType = "checkbox";
		addGoalSummary(rundays);
		}
		
		else if (title == "combobox2"){
		checkboxType = "combobox";
		addGoalSummary(drinkdays);
		console.log("HERE");
		}
		else{
		checkboxType = "combobox";
		addGoalSummary(realrundays);
		console.log("HERE");
		}
		console.log(filteredGoalSummaries);
		frequencyArray = countFrequency(filteredGoalSummaries);
		console.log(frequencyArray[0] + " " + frequencyArray[1]);
	
		populate(frequencyArray);
		switchPieBar(isPie);
	
	
}

function getDays(){
	console.log("getDays()");
	
 	var element = document.getElementById("timeperiod");
	var days = element.options[element.selectedIndex].value;
	if (days == "null"){
		alert("need timeperiod");
	}
	else{
		return days;
	}
	
	
	
}

function filterGoal(goalArray){
	/*
	var element = document.getElementById("goals");
	var op = element.options[element.selectedIndex].value;
	
	
	for (goal in goalArray){
		if goal.title == op{
			filteredGoalArray.push(goal);
			checkboxType = goal.status;  //adds the checkboxtype to checkboxtype
		}
	}
	return filteredGoalArray;
	
	*/
	
	
	console.log("filterGoal");
}
function addGoalSummary(filteredGoalArray){
	filteredGoalSummaries = [];
	for (i = 0; i < filteredGoalArray.length; i++){
		var goalSummary = filteredGoalArray[i].summary;
		filteredGoalSummaries.push(goalSummary);
		console.log(goalSummary);
	}
	console.log("addGoalSummary");
}


//returns [a,b] where a = the options, and b = no.of.occurences
function countFrequency(arr){
	
 	    var a = [], b = [], prev;
    
		arr.sort();
		for ( var i = 0; i < arr.length; i++ ) {
			if ( arr[i] !== prev ) {
				a.push(arr[i]);
				b.push(1);
			} else {
				b[b.length-1]++;
			}
			prev = arr[i];
		}
		console.log(b);
		return [a, b]; 
		
}



function populate(frequencyArray){
	console.log("populate");
	if (checkboxType == "checkbox"){
		isPie = 1;
		populatePieData(frequencyArray);
		generatePieChart();
 	} 
 	else if (checkboxType == "combobox"){
		isPie = 0;
		populateBarData(frequencyArray);
		generateBarChart();
	}
	else{
		alert("can't generate graph for this goal");
	} 
	
	
	
	
}

function switchPieBar(isPie){
	if (isPie){
		document.getElementById("pieChart").style.display = "initial";
		document.getElementById("barChart").style.display = "none";
	}
	else{
		document.getElementById("pieChart").style.display = "none";
		document.getElementById("barChart").style.display = "initial";		
	}
	 
 }
 
function populatePieData(frequencyArray){
	
	pieData = [
	
		{
					value : frequencyArray[1][1],
					color:"#878BB6",
					label : frequencyArray[0][1],
					labelColor : 'white',
					labelFontSize : '16'
				},
				{
					value: frequencyArray[1][0],
					color : "#F34353",
					label: frequencyArray[0][0]
				}
		
			];
	
	
	
	
	console.log("populatePieData");
}
function generatePieChart(){
	var pieChart= document.getElementById("pieChart").getContext("2d");
	new Chart(pieChart).Pie(pieData, pieOptions);
	
	console.log("generatePieChart");
}


function populateBarData(frequencyArray){
	
	barData = {
		labels : frequencyArray[0],
		datasets : [
		{
			fillColor : "#48A497",
			strokeColor : "#48A4D1",
			data : frequencyArray[1]
		}

	]
};
	console.log("populateBarData");
}

function generateBarChart(){
	var barChart = document.getElementById("barChart").getContext("2d");
	new Chart(barChart).Bar(barData, barOptions);
	
	console.log("populateBarChart");
}

var barOptions = {
	    scaleOverride : true,
        scaleSteps : 1,
        scaleStepWidth : 5,
        scaleStartValue : 0 
}

var pieOptions = {
    animationSteps: 100,
	animationEasing: 'easeInOutQuart',
	inGraphDataShow: true,
    inGraphDataRadiusPosition: 2,
    inGraphDataFontColor: 'black'
}


var barData = {
	labels : ["January","February","March","April","May","June"],
	datasets : [
		{
			fillColor : "#48A497",
			strokeColor : "#48A4D1",
			data : [456,479,324,569,702,600]
		}

	]
};

var pieData = [
	{
		value: 30,
		color:"#878BB6",
		label: "yo"
	},
	{
	                    value : 30,
                color : "#F34353",
                label : 'Sleep',
                labelColor : 'white',
                labelFontSize : '16'
	}
];







