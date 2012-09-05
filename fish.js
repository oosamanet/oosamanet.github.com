/*
  fish encode/decode library
  update by y-sakai@zyyx.jp

usage:

  var fish=new Fish();
  fish.encode("ABC");      <- 鰯鱗魷鮩
  fish.decode("鰯鱗魷鮩"); <- ABC

*/
var Fish=function(){
// 6bit table
//  var fishstr="鯏鯵鰺鮩鯇鮎鮑鰒鮟魷魦鮻鱊鯆鰛鰮鰯鮇鯎鰻鱗鱏鱛魵鰕鰓魞鮖鰍鯑鰹魳鱲魪鰈鮍鱚鱜鯢鯨鯉鯒鮗鰶鱓鱔鮴鮏鮭鯹鮄鯖鮫鱵鰆鱪鱰鯱鱐鮊鯳鮓鮨鱸";
// 7bit table
  var fishstr="鮮鯏鯵鰺鮩鯇鮎鮑鰒魷魦鮻鱊鯆鰛鰮鰯鮇鯎鰻鱗鱏鱛魵鰕鰓魞鮖鰍鯑鰹魳鱲魪鰈鮍鱚鱜鯢鯨鯉鯒鮗鰶鱓鱔鮴鮏鮭鯹鮄鯖鮫鱵鰆鱪鱰鯱鱐鮊鯳鮓鮨鱸鯐鯣鰑鮬鮉鯛鰖鮹鱆魛魣鰱鱮鱈鰔鱅鱘魡鰢鯲鰌魹魸鱠鮀鯰鯡鰊鮸鯁鰣鰰鱩魬鱧鮋鮠鰷鰚鰉鯷鮃鰭鰾鱶鮐鯸鮒鰤鮱鯔鮪鮅鱒鮲鯧鯥鱫鰘鱞鰥鰙鰐鱷";
  var fishdic={};
  for (var i=0;i<fishstr.length;i++){
    fishdic[fishstr.charAt(i)]=i;
  }
  var bits=new Bitstream();
  var self=this;
  self.data2s = function(data){
      var str="";
      for (var i=0; i<data.length; i++){
        var tmp=data[i];
        if (tmp==255){
          tmp=data[++i];
          str+=String.fromCharCode((tmp<<8)+data[++i]);
        }else{
          str+=String.fromCharCode(tmp);
        }
      }
      return str;
  };
  self.s2data = function(str){
      var data=[];
      for (var i=0; i<str.length; i++){
        var tmp=str.charCodeAt(i);
        if (tmp>255){
          data.push(0xff);
          data.push(tmp>>8);
          data.push(tmp&0xFF);
        }else{
          data.push(tmp);
        }
      }
      return data;
  };
  self.encode=function(str){
    var out="",v;
    var data=self.s2data(str);

    bits.open(data);
    while (true){
      v=bits.read(7);
      if (v==-1)
        break;
      out += self.n2fish(v);
    }
    return out;
  };
  self.decode=function(str){
    bits.open();
    for (var i=0;i<str.length;i++){
      bits.write(self.fish2n(str.charAt(i)),7);
    }
    return self.data2s(bits.data);
  };
  self.n2fish=function(n){
    return fishstr.charAt(n);
  }
  self.fish2n=function(fish){
    return fishdic[fish];
  }
};
