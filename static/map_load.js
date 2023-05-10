let bmapcfg = {
  'imgext'      : '.png',   //瓦片图的后缀 ------ 根据需要修改，一般是 .png .jpg
  'tiles_dir'   : '',       //普通瓦片图的地址，为空默认在 offlinemap/tiles/ 目录
  'tiles_hybrid': '',       //卫星瓦片图的地址，为空默认在 offlinemap/tiles_hybrid/ 目录
  'tiles_self'  : ''        //自定义图层的地址，为空默认在 offlinemap/tiles_self/ 目录
};

let scripts = document.getElementsByTagName("script");
let JS__FILE__ = scripts[scripts.length - 1].getAttribute("src");  //获得当前js文件路径
bmapcfg.home = JS__FILE__.substr(0, JS__FILE__.lastIndexOf("/")+1); //地图API主目录
