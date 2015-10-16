var goalArray = [];
var filteredGoalArray = {};
//var checkboxType = {};
checkboxType = "";
//checkboxType = "numeric";
var filteredGoalSummaries = [];

var frequencyArray = [];

var barData = {};
var pieData = {};

var isPie = false; //pie = 0, bar = 1,

var maxValue = 0;
var description = ""; 

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
	
	//var days = getDays();
	//console.log(days);
	//	goalArray = findEventClick(days);
	//	filteredGoalArray = filterGoal(goalArray);
	addGoalSummary(goalArray);
	console.log(filteredGoalSummaries);
	frequencyArray = countFrequency(filteredGoalSummaries);
	console.log(frequencyArray[0] + " " + frequencyArray[1]);
	maxValue = getMaxValue(frequencyArray[1]);
	getDescription();
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
	if (goalArray[0].status == "checkbox"){
		isPie = 1;
		populatePieData(frequencyArray);
		generatePieChart();
 	} 
 	else if (goalArray[0].status == "combobox" || goalArray[0].status == "numeric"){
		isPie = 0;
		populateBarData(frequencyArray);
		generateBarChart();
	}
	else{
		alert("can't generate graph for this goal");
	} 

}

function getMaxValue(array){
	max = Math.max.apply(null, array);
	return max;
}

function getDescription(){
	description = goalArray[0].description;
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
					value: frequencyArray[1][0],
					color:"#878BB6",
					labelColor : "black",
					label: "Unchecked"
				},
				{
					value : frequencyArray[1][1],
					color : "#F34353",
					label : "Checked",
					labelColor : "white",
					labelFontSize : '16'
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
	new Chart(barChart).Bar(barData, 
	{
		scaleOverride: true,
		scaleSteps: maxValue,
		scaleStepWidth: 1,
		scaleStartValue: 0,
		xAxisLabel: description


	});
	
	console.log("populateBarChart");
}

var pieOptions = {
    animationSteps: 100,
	animationEasing: 'easeInOutQuart',
	inGraphDataShow : true, 
      inGraphDataAnglePosition : 2,
      inGraphDataRadiusPosition: 2,
      inGraphDataAlign : "center",
      inGraphDataVAlign : "middle",
      inGraphDataFontColor : "white",
      inGraphDataFontSize : 16
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







