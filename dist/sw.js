(function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s=0)})([function(){'use strict';self.addEventListener('install',function(a){return a.waitUntil(caches.open('jokr-static-v1').then(function(a){return a.addAll(['/Jokr/','/Jokr/main.min.css','/Jokr/jokr.bundle.min.js','/Jokr/images/buffer.svg','/Jokr/images/tick-mask.svg','/Jokr/images/tick.svg','https://fonts.googleapis.com/icon?family=Material+Icons','https://fonts.googleapis.com/css?family=Roboto:300,400,500,700'])}))}),self.addEventListener('message',function(a){'skipWaiting'==a.data.action&&self.skipWaiting()}),self.addEventListener('fetch',function(a){return a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))})}]);