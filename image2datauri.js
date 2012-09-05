	image2datauri=function(url,onloadfunc){
		var base64encode=function(data){
			var table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
			var mod = data.length%3;
			var b64 = "";
			var i, tmp = 0;
			var pad = "";
			if (mod){
			  for (i=3-mod;i>0;i--){
			    data[data.length] = 0;
			  }
			}

      for (i=0;i<data.length; i+=3){
        tmp = (data[i]<<16) | (data[i+1]<<8) | data[i+2];
        b64 += table[(tmp >>>18) & 0x3f]
          + table[(tmp >>>12) & 0x3f]
          + table[(tmp >>> 6) & 0x3f]
          + table[tmp & 0x3f];
      }

      if (mod){
        mod = 3- mod;
        b64 = b64.substr(0, b64.length - mod);
        while (mod--){
          b64+="=";
        }
      }
      return b64;
		}
		var xhr = new XMLHttpRequest();
		xhr.open("get", url);
		xhr.onload = function(){
			if ((xhr.readyState == 4) && (xhr.status == 200)){
				var bytes = [];
				var byteData = xhr.responseText;
				for (var i=0; i<byteData.length; i++){
				  bytes[i] = byteData.charCodeAt(i) & 0xff;
				}
				var ext=url.split(".");
				ext=ext[ext.length-1].toLowerCase();
				var datauri='data:image/';
				if (ext=='jpg'){
					datauri+="jpeg";
				}else if (ext=='png'){
					datauri+="png";
				}else if (ext=='gif'){
					datauri+="gif";
				}
				datauri+=';base64,';
				datauri+=base64encode(bytes);
				onloadfunc(datauri);
			}else{
				// ■エラーの場合の処理
				alert("通信エラーです："+xhr.status);
			}
		}
		xhr.overrideMimeType("text/plain;charset=x-user-defined");
		xhr.send(null);
	}
