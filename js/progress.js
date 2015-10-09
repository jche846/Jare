var goalArray = [];
var filteredGoalArray = {};
//var checkboxType = {};
checkboxType = "";
//checkboxType = "numeric";
var filteredGoalSummaries = [];

var frequencyArray = [];

var barData = {};
var pieData = {};

//Example
var runday1 = new Goal("run 5km", "description hello", "checkbox", null, new Date(),null, "apple");
var runday2 = new Goal("run 5km", "description", "checkbox", null, new Date(),null, "banana");
var runday3 = new Goal("run 5km", "description", "checkbox", null, new Date(),null, "apple");
var runday4 = new Goal("run 5km", "description", "checkbox", null, new Date(),null, "apple");
var runday5 = new Goal("run 5km", "description", "checkbox", null, new Date(),null, "apple");
var runday6 = new Goal("run 5km", "description", "checkbox", null, new Date(),null, "apple");
var runday7 = new Goal("run 5km", "description", "checkbox", null, new Date(),null, "banana");

var rundays = [runday1,runday2,runday3,runday4,runday5,runday6,runday7];

function chartGenerateClick() {
    var days = getDays();
    var title = document.getElementById("goal").value;
    findEventClick(title, days); // this function calls chartGenerate() below
}

//onclick = chartGenerate()
function chartGenerate(gArray){
    goalArray = gArray;
	console.log("chartGenerate()");
	
//		var days = getDays();
//		console.log(days);
	//	goalArray = findEventClick(days);
	//	filteredGoalArray = filterGoal(goalArray);
		addGoalSummary(goalArray);
		console.log(filteredGoalSummaries);
		frequencyArray = countFrequency(filteredGoalSummaries);
		console.log(frequencyArray[0] + " " + frequencyArray[1]);
	
		populate(frequencyArray);
	
	
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
	if (goalArray[0].status == "checkbox"){ 
		populatePieData(frequencyArray);
		generatePieChart();
 	} 
 	else if (goalArray[0].status == "combobox"){
		populateBarData(frequencyArray);
		generateBarChart();
	}
	else{
		alert("can't generate graph for this goal");
	} 
	
	
	
	
}

function populatePieData(frequencyArray){
	
	pieData = [
				{
					value: frequencyArray[1][0],
					color:"#878BB6",
					label: frequencyArray[0][0]
				},
				{
					value : frequencyArray[1][1],
					color : "#F34353",
					label : frequencyArray[0][1],
					labelColor : 'white',
					labelFontSize : '16'
				}
			];
	
	
	
	
	console.log("populatePieData");
}
function generatePieChart(){
	var countries= document.getElementById("countries").getContext("2d");
	new Chart(countries).Pie(pieData, pieOptions);
	
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
	var income = document.getElementById("income").getContext("2d");
	new Chart(income).Bar(barData);
	
	console.log("populateBarChart");
}

var pieOptions = {
    animationSteps: 100,
	animationEasing: 'easeInOutQuart',
	inGraphDataShow: true,
    inGraphDataRadiusPosition: 2,
    inGraphDataFontColor: 'white'
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







