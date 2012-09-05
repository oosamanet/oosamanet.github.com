/*
  Bitstream read/write library    Copywrite 2012 ZYYX Inc.
  update by y-sakai@zyyx.jp

usage:

  var bits=new Bitstream();
  bits.open([0xAF]);
  bits.read();        <- read 1bit = 1
  bits.read();        <- read 1bit = 0
  bits.read(6);       <- read 6bit = 47 == 2F

  bits.open();
  bits.write(1)       <- write 1bit -> [128]
  bits.write(0);      <- write 1bit -> [128]
  bits.write(0x2f,6); <- write 6bit -> [175]

*/
var Bitstream=function(){
  var self=this;
  self.curbit=0;
  self.data=[];
  self.open=function(data){
    if (data==undefined)
      data=[];
    self.curbit=0;
    self.data=data;
  };
  self.seek = function(to){
    if (to>=self.data.length*8){
      return -1;
    }
    self.curbit=to;
  };
  self.read = function(bits){
    if (self.curbit>=self.data.length*8){
      return -1;
    }
    if (bits==undefined){
      var ret = self.data[~~(self.curbit/8)] & (0x80>>(self.curbit%8)) ? 1:0;
      self.curbit++;
      return ret;
    }
    var value=0;
    for (var i=0;i<bits;i++){
      var bit=self.read();
      value<<=1;
      if (bit==1){
        value++;
      }
    }
    return value;
  };
  self.write = function(value,bits){
    if (bits==undefined){
      self.data[~~(self.curbit/8)] |= value!=0 ? 1<<(7-self.curbit%8) : 0;
      self.curbit++;
      return self.data;
    }
    var mask=1<<(bits-1);
    for (var i=0;i<bits;i++){
      self.write(value & mask);
      mask>>=1;
    }
    return self.data;
  };
};
