
(function (ph){
try{
var A = self['DSPCounter' || 'AdriverCounterJS'],
	a = A(ph);
a.reply = {
ph:ph,
rnd:'519258',
bt:62,
sid:227790,
pz:0,
sz:'product',
bn:0,
sliceid:0,
netid:0,
ntype:0,
tns:0,
pass:'',
adid:0,
bid:2864425,
geoid:14,
cgihref:'//ad.adriver.ru/cgi-bin/click.cgi?sid=227790&ad=0&bid=2864425&bt=62&bn=0&pz=0&xpid=DdLhCFH9vzyDycLA6WXbsQcGoINo054yYZutP2hs8YDeOY8kAutJc79qqQGUkh1anHU3y_6sYEqCZfcIw_iUt9G2GDg&ref=https:%2f%2fwww.sima%2dland.ru%2f&custom=128%3D1815.3000001907349%3B129%3D1.9.8%3B153%3Duser_id%3B157%3Dclient_id%3B158%3Dany_id%3B10%3D4472179%3B206%3DDSPCounter',
target:'_blank',
width:'0',
height:'0',
alt:'AdRiver',
mirror:A.httplize('//servers1.adriver.ru'), 
comp0:'0/script.js',
custom:{"10":"4472179","128":"1815.3000001907349","129":"1.9.8","153":"user_id","157":"client_id","158":"any_id","206":"DSPCounter"},
cid:'A_nKubd7Mi_C5iothSG_9Kw',
uid:1596028084677,
xpid:'DdLhCFH9vzyDycLA6WXbsQcGoINo054yYZutP2hs8YDeOY8kAutJc79qqQGUkh1anHU3y_6sYEqCZfcIw_iUt9G2GDg'
}
var r = a.reply;

r.comppath = r.mirror + '/images/0002864/0002864425/' + (/^0\//.test(r.comp0) ? '0/' : '');
r.comp0 = r.comp0.replace(/^0\//,'');
if (r.comp0 == "script.js" && r.adid){
	A.defaultMirror = r.mirror; 
	A.loadScript(r.comppath + r.comp0 + '?v' + ph) 
} else if ("function" === typeof (A.loadComplete)) {
   A.loadComplete(a.reply);
}
(function (o) {
	var i, w = o.c || window, d = document, y = 31;
	function oL(){
		if (!w.postMessage || !w.addEventListener) {return;}
		if (w.document.readyState == 'complete') {return sL();}
		w.addEventListener('load', sL, false);
	}
	function sL(){try{i.contentWindow.postMessage('pgLd', '*');}catch(e){}}
	function mI(u, oL){
		var i = d.createElement('iframe'); i.setAttribute('src', o.hl(u)); i.onload = oL; with(i.style){width = height = '10px'; position = 'absolute'; top = left = '-10000px'} d.body.appendChild(i);
		return i;
	}
	function st(u, oL){
		if (d.body){return i = mI(u, oL)}
		if(y--){setTimeout(function(){st(u, oL)}, 100)}
	}
	st(o.hl('https://content.adriver.ru/banners/0002186/0002186173/0/s.html?0&0&0&0&519258&0&1596028084677&14&213.139.250.41&javascript&' + (o.all || 0)), oL);
}({
	hl: function httplize(s){return ((/^\/\//).test(s) ? ((location.protocol == 'https:')?'https:':'http:') : '') + s},
        
	
	all: 1
	
}));
}catch(e){} 
}('1'));
