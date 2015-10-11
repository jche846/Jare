// constants
var COMBOBOX = "combobox";
var CHECKBOX = "checkbox";
var NUMERIC = "numeric";
var FREETEXT = "freetext";

var client = new UoACalendarClient({ apiToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmlnX2lhdCI6MTQyMjQ5ODk0OSwiZXhwIjoxNDIyNDk5MjQ5LCJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6ImRldmVsb3BlciIsImVtYWlsIjoidGVzdEBhdWNrbGFuZC5hYy5ueiJ9.7jLkEBovT2HvT2noL4xdIhddaY8wpZpEVYEDHnnNm1Y"});
var calendarID = 78;

getCalendarClick();

var goalsRef = new Firebase("https://jare-diary.firebaseio.com/goals/");

// array of existing goals
var goals = loadGoals();
//console.log(JSON.stringify(goals));

// load and store using localStorage
function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
}

//function getGoals() {
//    goalsRef.once("value", function(data) {
//        return data.val();
//    });
//}

function loadGoals() {
    var goals = JSON.parse(localStorage.getItem("goals"));
    if (goals == null) {
        goals = [];
    }
    return goals;
}

function cleanArray(ary) {
    cleanAry = []
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] != null) {
            cleanAry.push(ary[i]);
        }
    }
    return cleanAry;
}

// Goal constructor
function Goal(title, description, dataEntryType, comboBoxFields, start, end) {
    this.title = title; // string
    this.description = description; // string
    this.dataEntryType = dataEntryType.toLowerCase(); // string
    this.comboBoxFields = comboBoxFields; // string array
    
    // set hours of start to 0
    start.setUTCHours(0, 0, 0, 0);
    this.start = start; //datetime
    
    // TODO
    if (end == null || end.toDateString().localeCompare("Invalid Date") == 0) {
        // create endDate to be +1? years from now (endless goal)
        end = new Date();
        // set hours of end to 23
        end.setUTCHours(23, 0, 0, 0);
        end.setDate(end.getDate() + 30);// TODO 365);
    }
    end.setUTCHours(23, 0, 0, 0);
    this.end = end;
  
    this.idList = [];
}

function getGoalIndexFromArray(goal) {
    for (var i = 0; i < goals.length; i++) {
        if (goals[i] != null && goals[i].title.localeCompare(goal.title) == 0) {
            return i;
        }
    }
    return -1; // not found
}

function getCalendarClick()
{
	client.getCalendar(calendarID,
        /**
        * onSuccess callback
        * @param res: response
        * @param data: deserialized new calendar data e.g. { name: "My Calendar", id: 1 }
        */
        function(res, data) {
            console.log(res);
            console.log(data);
            calendarID = data.id; //Sign new calendar id to global
            //alert('Succeeded. Calendar id: ' + data.id);
        },

        /**
        * onError callback
        * @param res: response
        */
        function(res, data) {
            alert('Failed to get calendar');
        }
	);
}

function createGoalClick(title, description, dataEntryType, comboBoxFields, start, end) {

    var goal = new Goal(title, description, dataEntryType, comboBoxFields, start, end);
    console.log(goal);  
  
    addGoalToCloud(goal);
    

//    var isUniqueTitle = addGoal(goal);
//  
//    if (isUniqueTitle) {
//        
//        //addGoalEvent(goal);
//        goals.push(goal);
//      
//        saveGoals();
//    }
}

// add to goal list local
function addGoal(goal) {
    var success = false;
  
    // check if goal title already exists
    var titleExists = false;
    var index = getGoalIndexFromArray(goal);
    
    if (index != -1) {
        titleExists = true;
    }
    
    if (titleExists) {
//        // actually nvm too many problems associated with updating a goal
//        if (new Date() > sameGoal.end) { // so the same goal was completed already and can be replaced
//            // TODO delete?
//        }
        alert("Goal title already exists! Choose another title");
    } else {
        success = true;
        alert("Goal created/added!");
    }
  
    return success;
}

function addGoalToCloud(goal) {
    // check if goal title already exists
    var titleExists = false;
    goalsRef.once("value", function(data) {
        if (data.val() != null) {
            var goalTitles = Object.keys(data.val());

            for (var i = 0; i < goalTitles.length; i++) {
                console.log("checking goal");
                if (goalTitles[i].localeCompare(goal.title) == 0) {
                    alert("Goal title already exists! Choose another title - fb");
                    titleExists = true;
                    break;
                }
            }
        }
        
        if (!titleExists) {
            goalsRef.child(goal.title).set({
                title: goal.title,
                start: goal.start.toISOString(),
                description: goal.description,
                status: goal.dataEntryType,
                location: goal.comboBoxFields,
                end: goal.end.toISOString()
            });
            addGoalEvent(goal);
            alert("Goal created/added!");
        }
        console.log(data.val());
    });
}

function addGoalEvent(goal) {
    // goal is split daily so it occupies a slot for each day until its end date
    var startDate = goal.start;
    console.log(goal);
    while (startDate <= goal.end) { // TODO if goal end is not specified go +1 year

        client.addEvent(calendarID, { title: goal.title, start: startDate, description: goal.description, status: goal.dataEntryType, location: goal.comboBoxFields },

            /**
             * onSuccess callback
             * @param res: response
             * @param data: deserialized new event data e.g. { name: "Star Wars Release Date", id: 1 }
             */
            function(res, data) {
                console.log(res);
                console.log(data);
                //alert('Succeeded. Event id: ' + data.id);
                goal.idList.push(data.id);
            },

            /**
             * onError callback
             * @param res: response
             */
            function(res, data) {
                alert('Failed to add goal event');
            }
        );
        // to the next day
        startDate.setDate(startDate.getDate() + 1);
    } 
    
    // TODO redirect to main after 2s assuming successfully added
    setTimeout(function(){ window.location = "Main.html" }, 2000);
}

// args: goal obj from server that is to be deleted
function deleteGoalClick(goal) {
    deleteGoalEvent(goal.id);
    deleteGoal(goal);
  
    saveGoals();
}

// local delete
function deleteGoal(goal) {
    var success = false;
  
    var index = getGoalIndexFromArray(goal);
    
    if (index != -1) {
        delete goals[index];
        goals = cleanArray(goals);
        success = true;
    }
    
    if (success) {
        alert("Goal deleted!");
    } else {
        alert("Error deleting goal");
    }
    return success;
}

// TODO use list goal event
// check if title == goal to delete
// check if date is >= today (previous data is uneditable
//    if date is before today then 'deleteFromFB = false'
// delete this goal using the goal id
// don't delete from Firebase unless all goal events are removed, i.e. created and deleted on same day
// above^ delete id 'deleteFromFB = true
function deleteGoalEvent(eventId) {
    client.deleteEvent(calendarID, eventId,

        /**
         * onSuccess callback
         * @param res: response
         * @param data: deserialized new event data e.g. { name: "Star Wars Release Date", id: 1 }
         */
        function(res, data) {
            console.log(res);
            console.log(data);
            //alert('Succeeded. Event id: ' + data.id);
      
            // TODO redirect to main after 1.5s
            setTimeout(function(){ window.location = "Main.html" }, 1500);
        },

        /**
         * onError callback
         * @param res: response
         */
        function(res, data) {
            alert('Failed to delete event');
        }
    );
}

// update goal based on a change in the end date
function updateGoalClick(oldGoal, title, description, end) {
  
    updatedGoal = new Goal(title, description, null, null, oldGoal.start, end);
  
    var index = getGoalIndexFromArray(oldGoal);
    
    if (updatedGoal.end > oldGoal.end) { // goal has its end date extended so add more events
        // goal is split daily so it occupies a slot for each day until its end date
        var startDate = new Date(oldGoal.end); // TODO maybe +1 day??
        while (startDate <= updatedGoal.end) {

            client.addEvent(calendarID, { title: updatedGoal.title, start: startDate, description: updatedGoal.description, status: updatedGoal.dataEntryType, location: updatedGoal.comboBoxFields },

                /**
                 * onSuccess callback
                 * @param res: response
                 * @param data: deserialized new event data e.g. { name: "Star Wars Release Date", id: 1 }
                 */
                function(res, data) {
                    console.log(res);
                    console.log(data);
                    alert('Succeeded. Event id: ' + data.id);
                    goals[index].idList.push(data.id);
                },

                /**
                 * onError callback
                 * @param res: response
                 */
                function(res, data) {
                    alert('Failed to add goal');
                }
            );
            // to the next day
            startDate.setDate(startDate.getDate() + 1);
        }
    } else if (updatedGoal.end < oldGoal.end) { // goal has its end date shortened so delete those extra events
        var today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        
        var idList = oldGoal.idList;
        for (var i = 0; i < idList.length; i++) {
            client.getEvent(calendarID, idList[i],
                /**
                * onSuccess callback
                * @param res: response
                * @param data: deserialized new calendar data e.g. { name: "My Calendar", id: 1 }
                */
                function(res, data) {
                    console.log(res);
                    console.log(data);
                    alert('Succeeded. Event id: ' + data.id);

                    if (data.start > updatedGoal.end) { // this goal event is latter
                        deleteGoalEvent(data.id);
                        delete goals[index].idList[i];
                        goals[index].idList = cleanArray(goals[index].idList);
                    } else if (data.start >= today && data.start < updatedGoal.end) { // this goal event is before
                        // now update the goals from today's date to updatedGoal.end
                        client.updateEvent(calendarID, idList[i], { title: updatedGoal.title, start: data.start, description: updatedGoal.description },
                            /**
                            * onSuccess callback
                            * @param res: response
                            * @param data: deserialized new calendar data e.g. { name: "My Calendar", id: 1 }
                            */
                            function(res, data) {
                                console.log(res);
                                console.log(data);
                                alert('Succeeded. Event id: ' + data.id);
                            },

                            /**
                            * onError callback
                            * @param res: response
                            */
                            function(res, data) {
                                alert('Failed to update data entry');
                            }
                        );
                    }
                },

                /**
                * onError callback
                * @param res: response
                */
                function(res, data) {
                    alert('Failed to get event');
                }
            );
        }
    }
  
    // update the local oldGoal fields to updated
    goals[index].title = updatedGoal.title;
    goals[index].description = updatedGoal.description;
    goals[index].end = updatedGoal.end;
  
    saveGoals();
}

// update local TODO deprecated
//function updateGoal(oldGoal, updatedGoal) {
//    var success = false;
//    
//    var addedGoal = addGoal(updatedGoal);
//    if (addedGoal)
//        success = deleteGoal(oldGoal);
//  
//    if (success) {
//        alert("Goal updated!");
//    } else {
//        alert("Error updating goal");
//    }
//    return success;
//}

// goal is the goal data from the server
// dataEntry is from the client input
function updateDataEntryClick(goal, dataEntry) {
    console.log(new Date(goal.start).toDateString(), new Date().toDateString());
    if (new Date(goal.start).toDateString().localeCompare(new Date().toDateString()) == 0) {
        updateDataEntry(goal, dataEntry);
    } else {
        alert("You may only input data for today's goals!");
    }
}

// update data entry for today
function updateDataEntry(goal, dataEntry) {  
    client.updateEvent(calendarID, goal.id, { title: goal.title, start: new Date(goal.start), summary: dataEntry },
        /**
        * onSuccess callback
        * @param res: response
        * @param data: deserialized new calendar data e.g. { name: "My Calendar", id: 1 }
        */
        function(res, data) {
            console.log(res);
            console.log(data);
            alert('Succeeded. Event id: ' + data.id);
        },

        /**
        * onError callback
        * @param res: response
        */
        function(res, data) {
            alert('Failed to update data entry');
        }
    );
}

// args: date object
function getEventClick(date) {
//    var today = new Date();
//    var dd = today.getDate();
//    var mm = today.getMonth()+1; //January is 0!
//    var yyyy = today.getFullYear();
    
    date.setUTCHours(23, 0, 0, 0);
    
    var startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
  
    //console.log(startDate, date);
    
    client.findEvents(calendarID, startDate, date,

        /**
         * onSuccess callback
         * @param res: response
         * @param data: deserialized event array e.g. [{name: "Star Wars Release Date", id: 1},
         * {name: "Lunch", id: 2}]
         */
        function(res, data) {
            console.log(res);
            //console.log(data);
            //alert('I found these events: ' + data.toString());
            
            for (var i = 0; i < data.length; i++) {
                if (new Date(data[i].start) < startDate || new Date(data[i].start) > date) {
                    delete data[i];
                }
            }
            data = cleanArray(data);
            console.log(data);
            populateMain(data); // function called in Main.html
            return data; // TODO don't need return
        },
        
        // onError callback
        function(res, data) {
            alert('Failed to find events');
        }
    );
}

// args: last x days
function findEventClick(goalTitle, days) {
//    var today = new Date();
//    var dd = today.getDate();
//    var mm = today.getMonth()+1; //January is 0!
//    var yyyy = today.getFullYear();
    
    var today = new Date();
    today.setUTCHours(23, 0, 0, 0);
    
    var startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);
    startDate.setUTCHours(0, 0, 0, 0);
    
    client.findEvents(calendarID, startDate, today,

        /**
         * onSuccess callback
         * @param res: response
         * @param data: deserialized event array e.g. [{name: "Star Wars Release Date", id: 1},
         * {name: "Lunch", id: 2}]
         */
        function(res, data) {
            console.log(res);
            //console.log(data);
            //alert('I found these events: ' + data.toString());
            
            for (var i = 0; i < data.length; i++) {
                if (data[i].title.localeCompare(goalTitle) != 0 || new Date(data[i].start) < startDate || new Date(data[i].start) > today) {
                    delete data[i];
                }
            }
      
            data = cleanArray(data);
            console.log(data);
      
            for (var i = 0; i < data.length; i++) {
                if (data[i].summary == "") {
                    if (data[i].status.localeCompare(CHECKBOX) == 0)
                        data[i].summary = 0;
                }
            }
      
            chartGenerate(data);
            
//            // for progress html
//            summary = [];
//            for (var i = 0; i < data.length; i++) {
//                if (data[i].summary == "") {
//                    if (data[i].status.localeCompare(CHECKBOX) == 0)
//                        data[i].summary = 0;
//                }
//                summary.push(data[i].summary);
//            }
//            console.log(summary);
//            console.log(data[0].status);
//      
//            return data; // TODO don't need return
        },
        
        // onError callback
        function(res, data) {
            alert('Failed to find events');
        }
    );
}
