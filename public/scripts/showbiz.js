$(function() {
  if (navigator.geolocation) {
    // geolocation is supported
    navigator.geolocation.getCurrentPosition(success_handler, failure_handler);
  } else {
    console.log("Geolocation is not supported");
  }
})
//global variables that will need description and venue + time if available
var latlon = {};
//var glovalue = {};
var output = "<ul>";
var checker; //to check if API request was successful
var display;
//var collection;
var collection = {};
var pgsize;

function success_handler(position) {
  latlon.latitude = position.coords.latitude;
  latlon.longitude = position.coords.longitude;
  $("<p>Using Latitude & Longitude " + latlon.latitude + "," + latlon.longitude + "</p>").appendTo("#locationInfo");
  event();
  //event(latitude);
  //event(longitude);
  //click a refresh button that turns collection = undefined then runs event()
}

function refresher(){
	//collection = undefined;
	event();
} 

//either do events inside angular, or angular inside events - 
//so if wow == true then next button is active
//my global variable is set to something and there are events to click through 



function event() 
{
//https://robots.thoughtbot.com/buttons-with-hold-events-in-angularjs
var categoryid = document.getElementById("category").value;
var venue = document.getElementById("venue").value;
var within = document.getElementById("points").value;
pgsize = document.getElementById("eventsno").value;
var oArgs = {
  app_key: "bPDvt9DqVLJPqVL8",
  where: encodeURI(String(latlon.latitude)+","+String(latlon.longitude)),
  within: String(within),
  category: String(categoryid),
  //performers: String(performers),
  venue_name: String(venue),
  page_size: String(pgsize)
};
checker = EVDB.API.call("/events/search", oArgs, function(oData) 
{//store in a variable, if true - angular
	//console.log(oData);
    collection = oData.events.event;
	$.each(collection, function(index, value) {
		//(index + ":" + value); 
		$("#venue").append("<option>"+ (value.venue_name) + "</option>");
		
	});
	//Do a venue one with the jquery ALL to get venue!
	
	//$("#shower").append("<li>"+ (oData) + "</li>");
	event_handler(); //hold the values //because we are in API Execution context  - GEt DAta!
	if (checker == true)
	{
		console.log('There is Data, Submit to Start ANGULAR!!!!');
		//MainCtrl();
	}
	else
	{
		console.log('Sorry theres problem with API')
		//A LINK REDIRECT PAGE NECESSARY HERE!!!
	}
	//display(); //if checker is true then display
	//console.log(checker);
	
});//End of API call
}

function event_handler()
{
	//console.log(collection); //it is defined in the API call
	console.log(checker);
	//if 
}
///angular runs immediately,  find a way to await click to display
//I dont immediately show an event because I need Async Event to finish callback before executing angular
//Hide Submit button till CHecker = true (so callback is done)
angular.module('eventsApp', []) 
  .controller('MainCtrl', function($scope) {
	  //MAke sure to hide button until Data is displayed
	  //Try Display Image Object, and it should be shared to facebook
	  //Facebook profilevpicture when logged in
	  //$scope.submitData = event();
	  $scope.submitData = function(){
		  var self = this; 
		  var i = 0;
		  var a = [];
		  var j = 0;
		  var phide;
		  var nhide;
		  //a[j] = collection[j];
		  //a.push(collection);
		  //console.log(a);
		  //j = [++j]; 
		  //Control so it does not display nulls or nothing
		  //Clean so it arranges it in expected proper html format or just delete rubbish
		  self.events = collection;
		  
		  //j = j + 1;
		  console.log(self.events);
		  self.event = self.events[i];
		  self.prevEvent = function() {
			  self.event = self.events[--i];
		  };
		  self.nextEvent = function() {
			  self.event = self.events[++i];
			  //if (collection.length === self.events[i])
			  //{
			//	  nhide = true;
			 // }
		  };
		  
		  //while (0 === i - 1)
		  //{
		//	  phide = true;
		 // }
		  //need to add prev & control it to so no next at the last event
		  //Display length and how many more descriptions you have and next disappears when its the last one!
		  //Previous is not present for the first one. 	  
	  };
  });

	//holder.hold would contain string
	//to get concert location with events API
  //var location = document.getElementById("userInput").value; 

  //var search = encodeURI(string+location);
  //document.getElementById("result").innerHTML = "You have entered " ;//+ location;
  //able to click more for more information in lists
  //able to specify type of sorting wanted for information
 
function failure_handler(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      msg = "User refused permission";
      break;
    case error.POSITION_UNAVAILABLE:
      msg = "Cannot obtain current position";
      break;
    case error.TIMEOUT:
      msg = "Timed out";
      break;
    default:
      msg = "Don't know what's happening here!";
      break;
  };
  $("<p>Location information is not available because: " 
    + msg + "</p>").appendTo("#locationInfo");
}
