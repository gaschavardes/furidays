(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{309:function(t,n,e){"use strict";e.r(n);var r=e(126),o=e(127);e(27),e(72),e(73),e(177);if("performance"in window==!1&&(window.performance={}),Date.now=Date.now||function(){return(new Date).getTime()},"now"in window.performance==!1){var h=Date.now();performance.timing&&performance.timing.navigationStart&&(h=performance.timing.navigationStart),window.performance.now=function(){return Date.now()-h}}var c=function(){function t(){Object(r.a)(this,t),this.funcs={},this.lastPass={},this.framerates={},this.nextFramePendingFuncs=[],this.nextFrameFuncs=[],this.postFrameFuncs=[],this.dt=1/0,this.timeElapsed=0,this.frame=0,this.dictonary=[],this.last=performance.now(),this.initTime=performance.now(),this.init(),this.isIOS=!!navigator.platform&&/iPad|iPhone|iPod/.test(navigator.platform)}return Object(o.a)(t,[{key:"suscribe",value:function(t,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;this.dictonary.includes(t)||(this.dictonary.push(t),this.funcs[t]=n,this.lastPass[t]=Date.now(),this.framerates[t]=null!==e?1/e:e)}},{key:"unsuscribe",value:function(t){this.funcs[t]&&(this.dictonary.splice(this.dictonary.indexOf(t),1),delete this.funcs[t])}},{key:"init",value:function(){this.update=this.update.bind(this),this.update()}},{key:"nextFrame",value:function(t){this.nextFramePendingFuncs.push(t)}},{key:"postFrame",value:function(t){this.postFrameFuncs.push(t)}},{key:"update",value:function(){for(requestAnimationFrame(this.update),this.frame++,this.isIOS?this.dt=16:this.dt=performance.now()-this.last,this.timeElapsed+=this.dt;this.nextFrameFuncs.length>0;)this.nextFrameFuncs.splice(0,1)[0]();for(;this.nextFramePendingFuncs.length>0;)this.nextFrameFuncs.push(this.nextFramePendingFuncs.splice(0,1)[0]);for(var t=Date.now(),i=0;i<this.dictonary.length;i++)null!==this.framerates[this.dictonary[i]]&&t-this.lastPass[this.dictonary[i]]<1e3*this.framerates[this.dictonary[i]]||"function"==typeof this.funcs[this.dictonary[i]]&&(this.lastPass[this.dictonary[i]]=t,this.funcs[this.dictonary[i]]());for(;this.postFrameFuncs.length>0;)this.postFrameFuncs.splice(0,1)[0]();this.last=performance.now()}}]),t}(),f=new c;n.default=f}}]);