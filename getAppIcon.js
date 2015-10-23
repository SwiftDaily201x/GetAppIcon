var appName = 'icon4app!'
console.log('AppName is :'+appName+', By Fnoz')

// var readline = require('readline');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Input your keyword of App:\n\n", function(answer) {
	rl.close();
	var http = require("http");
	var url = require("url");
	var strUrl = 'http://itunes.apple.com/search?term='+answer+'&entity=software'
	http.get(strUrl, function(res){
    	res.setEncoding("utf-8");
    	var resData = [];
    	res.on("data", function(chunk){
       	 	resData.push(chunk);
    	})
    	.on("end", function(){
        	var t = JSON.parse(resData.join(""));  
        	console.log('\nThere are '+t.resultCount+' Apps in AppStore with keyword '+answer+' \ntheir logos\' url are bellow:'+'\n')
        	for (var i = 0; i < t.results.length; i++) {
    			console.log((i+1)+'. '+t.results[i].artworkUrl512+'\n')
    		};
    	});
	});
});

