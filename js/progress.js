/* 	
	<script src="js/progress.js" type="text/javascript"></script>

	var chartData = [{
		"country": "USA",
		"visits": 4252
	}, {
		"country": "China",
		"visits": 1882
	}, {
		"country": "Japan",
		"visits": 1809
	}, {
		"country": "Germany",
		"visits": 1322
	}, {
		"country": "UK",
		"visits": 1122
	}, {
		"country": "France",
		"visits": 1114
	}, {
		"country": "India",
		"visits": 984
	}, {
		"country": "Spain",
		"visits": 711
	}, {
		"country": "Netherlands",
		"visits": 665
	}, {
		"country": "Russia",
		"visits": 580
	}, {
		"country": "South Korea",
		"visits": 443
	}, {
		"country": "Canada",
		"visits": 441
	}, {
		"country": "Brazil",
		"visits": 395
	}, {
		"country": "Italy",
		"visits": 386
	}, {
		"country": "Australia",
		"visits": 384
	}, {
		"country": "Taiwan",
		"visits": 338
	}, {
		"country": "Poland",
		"visits": 328
	}];
var chart2Data = [{title:"Pie I have eaten",value:70},{title:"Pie I haven\'t eaten",value:30}];	

AmCharts.ready(function() {
	var chart = new AmCharts.AmSerialChart();
	chart.dataProvider = chartData;
	chart.categoryField = "country";
	
	var graph = new AmCharts.AmGraph();
	graph.valueField = "visits";
	graph.type = "column";
	chart.addGraph(graph);
	chart.write('chartdiv');
			
	var chart2 = new AmCharts.AmPieChart();
	chart2.valueField = "value";
	chart2.titleField = "title";
	chart2.dataProvider = chart2Data;
	chart2.write("chartdiv2");
	console.log("sstest");
	
}); 

<body>
    <div id="chartdiv" style="width: 640px; height: 400px;"></div>
</body>

 <body>
    <div id="chartdiv2" style="width: 640px; height: 400px;"></div>
</body>  

*/


//<body>
//    <div id="chartdiv" style="width: 640px; height: 400px;"></div>
//</body>

window.onload = function(){
	var barData = {
	labels : ["January","February","March","April","May","June"],
	datasets : [
		{
			fillColor : "#48A497",
			strokeColor : "#48A4D1",
			data : [456,479,324,569,702,600]
		},
		{
			fillColor : "rgba(73,188,170,0.4)",
			strokeColor : "rgba(72,174,209,0.4)",
			data : [364,504,605,400,345,320]
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

var pieOptions = {
      animationSteps: 100,
 		animationEasing: 'easeInOutQuart',
		  inGraphDataShow: true,
    inGraphDataRadiusPosition: 2,
    inGraphDataFontColor: 'white'
}


var income = document.getElementById("income").getContext("2d");
new Chart(income).Bar(barData);

var countries= document.getElementById("countries").getContext("2d");
new Chart(countries).Pie(pieData, pieOptions);
}






