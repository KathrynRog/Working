var http = require('http');
var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();
var port = process.env.PORT || 8090;
const bodyParser = require('body-parser');


app.use(express.static('public'));
    
app.use(express.json()); 
app.use(express.json()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/events2017/index.html', function (req, res){
	res.sendFile(__dirname + "/index.html");
});

app.use(express.static('public'));
app.get('/events2017/admin.html', function (req, res){
	res.sendFile(__dirname + "/admin.html");
});

app.use(express.static('public'));
app.get('/events2017/style.css', function (req, res){
	res.sendFile(__dirname + "/style.css");
});



//functions


app.use(express.static('./')); 

app.get('/', (req,res)=>{
    res.sendFile('index.html');
});

app.use( bodyParser.json() );

app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/venues', function (req, res){
	fs.readFile("venues.json", 'utf8', function (err, data){
		if (err) throw err;
		res.send(data);
	});
});

app.get('/events', function (req, res){
	fs.readFile("events.json", 'utf8', function (err, data){
		if (err) throw err;
		res.send(data);
	});
});

app.get('/admin.html', function (req, res){
	fs.readFile("admin.html", 'utf8', function (err, data){
		if (err) throw err;
		res.send(data);
	});
});

app.get('/events/get/:', function (req, res){ 
	var searchKey	= ' ';
	searchKey = req.query.ID;
		fs.readFile('events.json', 'utf8', function (err, data){
			var dataE = JSON.parse(data);
			x = "";
			x = dataE["events"][searchKey];
			if (x == undefined){
				var y = {
							"error":"no such event"
							}
				res.send(y);
			}
			else {
				res.send(x);
			}
		})
});

app.get('/venues/get/:', function (req, res){ 
	var searchKey	= ' ';
	searchKey = req.query.venue;
		fs.readFile('venues.json', 'utf8', function (err, data){
			var dataV = JSON.parse(data);
			x = "";
			x = dataV["venues"][searchKey];
			if (x == undefined){
				var y = {
					"error":"no such event"
				}
				res.send(y);
			}
			else {
				res.send(x);
			}
		})
});

app.get('/events/search', function (req, res){ 
	name = undefined;
	date = undefined;
	var givenName = req.query.search;
	if (givenName == ""){
		name = false;
	}
	else {
		name = true;
	}
	
	var givenDate = req.query.date;
	if (givenDate == ""){
		date = false;
	}
	else {
		date = true;
	}
	
	var error = {
		"error" : "no matching events. please try other search criteria"
	}
	console.log(name);
	console.log(date);
	
		if ((name == true) && (date == false)){
		fs.readFile('events.json', 'utf8', function (err, data){
		var thisSearch = JSON.parse(data);
		if (err) throw err;
		for(var key in thisSearch.events){
			if(thisSearch.events[key].title.includes(givenName)){
				res.send(thisSearch.events[key]);
			}
		}
		})
		}	
		
		else if ((name == false) && (date == true)){
		fs.readFile('events.json', 'utf8', function (err, data){
		var thisSearch = JSON.parse(data);
		if (err) throw err;
		for(var key in thisSearch.events){
			if(thisSearch.events[key].date.includes(givenDate)){
				res.send(thisSearch.events[key]);
			}
		}
		})
		}	
		
		else if ((name == false) && (date == false)){
			res.send(error);
		}
		
		else if ((name == true) && (date == true)){
			fs.readFile('events.json', 'utf8', function (err, data){
			var thisSearch = JSON.parse(data);
			if (err) throw err;
			for (var key in thisSearch.events){
				if(thisSearch.events[key].date.includes(givenDate) && thisSearch.events[key].title.includes(givenName)){
						res.send(thisSearch.events[key]);
					
				}
			}
			})
		}
		
});
	
	app.post('/admin/addVenue', function (req, res){

	var venue = req.body;
	newVenue = JSON.parse(JSON.stringify(venue));
	
	var auth_token = newVenue.auth_token;	
	var venueName = newVenue.name;
	var venuePostcode = newVenue.postcode;
	var venueTown = newVenue.town;
	var venueUrl = newVenue.url;
	var venueIcon = newVenue.icon;


	var newVenueToAdd = {
			"name" : venueName,
			"postcode" : venuePostcode,
			"town" : venueTown,
			"url" : venueUrl,
			"icon" : venueIcon
	}
	
	var nullAuthToken = undefined;
	var nullVenueName = undefined;


	if (auth_token == ""){
		nullAuthToken = true;
	}
	if (venueName == ""){
		nullVenueName = true;
	}
	
	if (nullVenueName == true || nullAuthToken == true){
		console.log("entered error");
		res.statusCode = 404;
		var error = {
					"error": "You are missing a require parameter. Please ensure you have provided an authorization token and venue name"
					}
		res.send(error);
		return;
	}

	
	//First read existing users

	fs.readFile("venues.json", 'utf8', function (err, data){
		data = JSON.parse(data);
		data.venues.v_3 = newVenueToAdd;
		console.log(data);
		data = JSON.stringify(data);
	fs.writeFile("venues.json", data, function (err){
		if (err) throw err;
		console.log("Replaced");
	});
		
	});

});


app.post('/admin/addEvent', function (req, res){
	console.log("entered function");

	var ev = req.body;
	newEv = JSON.parse(JSON.stringify(ev));
	
	var ev_auth_token = newEv.auth_token;	
	var evId = newEv.event_id
	var evTitle = newEv.title;
	var evVenueId = newEv.venue_id;
	var evBlurb = newEv.blurb;
	var evDate = newEv.eventDate;
	var evUrl = newEv.eventUrl;



	var newEventToAdd = {
			"title" : evTitle,
			"blurb" : evBlurb,
			"date" : evDate,
			"url" : evUrl
	}
	
	var nullEvAuthToken = undefined;
	var nullEvId = undefined;
	var nullEvTitle = undefined;
	var nullEvVenueId = undefined;
	var nullEvDate = undefined;


	if (ev_auth_token == ""){
		nullEvAuthToken = true;
	}
	if (evId == ""){
		nullEvId = true;
	}
	if (evTitle == ""){
		nullEvTitle = true;
	}
	if (evVenueId == ""){
		nullEvVenueId = true;
	}
	if (evDate == ""){
		nullEvDate = true;
	}
	
	if (nullEvAuthToken == true || nullEvId == true || nullEvTitle == true || nullEvVenueId == true || nullEvDate ==true ){
		console.log("entered error");
		res.statusCode = 404;
		var error = {
					"error": "You are missing a require parameter. Please ensure you have provided authorisation token, event ID, event title, venue ID, and event date"
					}
		res.send(error);
		return;
	}

	
	//First read existing users

	fs.readFile("events.json", 'utf8', function (err, data){
		data = JSON.parse(data);
		data.events.e_3 = newEventToAdd;
		console.log(data);
		data = JSON.stringify(data);
	fs.writeFile("events.json", data, function (err){
		if (err) throw err;
		console.log("Replaced");
	});
		
	});

});

	app.listen(8090, function(){
	console.log("RESTful API server started on: " + port);
 });

		