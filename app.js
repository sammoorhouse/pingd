var path = require('path');
var logger = require('morgan');
var http = require('http');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ping');

var Blob = mongoose.model(
	'Blob', {
		id: String,
		username: String,
		email: String,
		url: String,
		dates: [{
			date: Date,
			urlstatus: String
		}]
	})

	var all = Blob.find().exec(function(err, docs){docs.forEach(resolve)});
	var today = new Date();
	
	var resolve = function(doc) {
		var url = doc.url;
		console.log('attempting to resolve url ' + url)
		http.get(url, function(res){
			var status = res.statusCode;
			console.log('received ' + status + ' for url ' + url + ' at ' + today);
			doc.dates.push({date: today, urlstatus: 1});
			doc.save(function(err){
				if(err){
					console.log('upsert failed');
				}
				else{
					console.log('upsert succeeded!');
				}
			})
		}).on('error', function(e){
			console.log('Got error ' + e.message + ' at ' + today);
			doc.dates.push({date: today, urlstatus: 0});
			doc.save(function(err){
				if(err){
					console.log('upsert failed');
				}
				else{
					console.log('upsert succeeded!');
				}
			});
		})
	}