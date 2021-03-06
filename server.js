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
        response.write('<body bgcolor="#2a3141"><script>var _hmt = _hmt || [];(function() {var hm = document.createElement("script");hm.src = "//hm.baidu.com/hm.js?6dc574baf57d60ada5dc334d04f5d5e8";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm, s);})();</script>')
        response.write('<style>body{TEXT-ALIGN: center;}.bannerImg{ MARGIN-RIGHT: auto;MARGIN-LEFT: auto;height:100px;width:300px;vertical-align:middle;}.bannerImg img{width:100%;height:100%;}.bannerTitle{ MARGIN-RIGHT: auto;MARGIN-LEFT: auto;height:20px;font-family:"STHeitiSC-Light","Monaco","Trebuchet MS","Courier New";font-size: 0.95rem;color:#888;width:600px;vertical-align:middle;line-height:20px;}</style><a href=""><div class="bannerImg"><img style="width:100%;height:width;" src="http://fnoz-blog.bj.bcebos.com/20160717_00.png"></div></a>')
        var t = JSON.parse(resData.join(""))
        response.write('<div style="position:relative;margin-top:0px;margin-left:120px;margin-right:120px">')
        for (var i = 0; i < t.results.length; i++) {
          response.write("<a href='"+t.results[i].artworkUrl512+"' title='"+t.results[i].trackName+"'' rel='nofollow' download=''><img src='"+t.results[i].artworkUrl100+"' width='80' height='80' vspace = '10' hspace = '10'/></a>")
        }
        response.write('</div">')
        response.write("</body>")
        response.end()
    	})
	  })
  }	
}).listen(18080)
console.log('GetAppIcon is running.')