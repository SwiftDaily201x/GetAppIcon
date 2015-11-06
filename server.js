var http = require('http')
var url = require("url")
var fs = require('fs')
var index = fs.readFileSync('index.html')
var basecss = fs.readFileSync('css/base.css')
var stylecss = fs.readFileSync('css/style.css')
http.createServer(function (request, response) {
  var arg = url.parse(request.url,true).query
  if (arg.EMAIL) 
  {
    arg.appName=arg.EMAIL
  }
  if (!arg.appName) 
  {
    var pathname = url.parse(request.url).pathname
    var ext = pathname.match(/(\.[^.]+|)$/)[0]
    switch(ext){ 
    case ".css": 
    case ".js": 
    case ".ttf": 
      fs.readFile("."+request.url, 'utf-8',function (err, data) { 
        if (err) throw err 
        response.writeHead(200, { 
          "Content-Type": { 
          ".css":"text/css", 
          ".js":"application/javascript", 
          }[ext] 
        })
        response.write(data)
        response.end()
      })
      break
    case ".jpg":
    case ".png":
      fs.readFile("."+request.url, 'binary',function (err, file) {
        if (err) throw err
        response.writeHead(200, { 
          "Content-Type": 'image/jpeg'
        })
        response.write(file, "binary")
        response.end() 
      })
      break
    default: 
      fs.readFile('./index.html', 'utf-8',function (err, data) { 
        if (err) throw err
        response.writeHead(200, { 
          "Content-Type": "text/html" 
        }) 
        response.write(data)
        response.end()
      }) 
    } 
  }
  else
  {
  	var strUrl = 'http://itunes.apple.com/search?term='+arg.appName+'&entity=software'
	  http.get(strUrl, function(res){
    	res.setEncoding("utf-8")
    	var resData = []
    	res.on("data", function(chunk){
       	 	resData.push(chunk)
    	})
    	res.on("end", function(){
        response.writeHead(200, {'Content-Type': 'text/html'})
        response.write('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />')
        response.write('<link rel="shortcut icon" type="image/jpeg" href="../getAppIconLogo.png">');
        response.write('<body>')
        response.write('<a href=""><img style="width:100%;height:width;" src="http://7xl2dx.com1.z0.glb.clouddn.com/getAppIcon_appListBanner.png"/></a>')
        var t = JSON.parse(resData.join(""))
        for (var i = 0; i < t.results.length; i++) {
          response.write("<a href='"+t.results[i].artworkUrl512+"' title='"+t.results[i].trackName+"'' rel='nofollow' download=''><img src='"+t.results[i].artworkUrl60+"' width='80' height='80' vspace = '15' hspace = '15'/></a>")
        }
        response.write("</body>")
        response.end()
    	})
	  })
  }	
}).listen(18080)
console.log('GetAppIcon is running.')