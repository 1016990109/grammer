!window.crypto&&window.msCrypto&&(window.crypto=window.msCrypto),navigator.languages||(navigator.languages=[navigator.language,navigator.userLanguage,navigator.browserLanguage]);try{new Range}catch(e){window.Range=function(){return document.createRange()}}window.SVGElement&&!SVGElement.prototype.contains&&(SVGElement.prototype.contains=function(e){if(!(0 in arguments))throw new TypeError("1 argument is required");do{if(this===e)return!0}while(e=e&&e.parentNode);return!1}),document.contains||(document.contains=function(e){if(document===e||document.body===e||document.documentElement===e)return!0;if(document.documentElement&&document.documentElement.contains)return document.documentElement.contains(e);if(document.body&&document.body.contains)return document.body.contains(e);throw new Error("Cannot polyfill document.contains")}),function(e){try{return new MouseEvent("test"),!1}catch(e){}var t=function(t,n){n=n||{bubbles:!1,cancelable:!1};var o=document.createEvent("MouseEvent");return o.initMouseEvent(t,n.bubbles,n.cancelable,e,0,n.screenX||0,n.screenY||0,n.clientX||0,n.clientY||0,n.ctrlKey||!1,n.altKey||!1,n.shiftKey||!1,n.metaKey||!1,n.button||0,n.relatedTarget||null),o};t.prototype=Event.prototype,e.MouseEvent=t}(window),function(e){try{return new InputEvent("test"),!1}catch(e){}var t=function(t,n){n=n||{bubbles:!1,cancelable:!1};var o=document.createEvent("Event");return o.initEvent(t,n.bubbles,n.cancelable,e,0,n.screenX||0,n.screenY||0,n.clientX||0,n.clientY||0,n.ctrlKey||!1,n.altKey||!1,n.shiftKey||!1,n.metaKey||!1,n.button||0,n.relatedTarget||null),o};t.prototype=Event.prototype,e.InputEvent=t}(window),function(){if(!("parentElement"in Document.prototype)||!("parentElement"in Text.prototype)||!("parentElement"in Attr.prototype)){function e(){return this.parentNode instanceof Element?this.parentNode:null}try{Object.defineProperty(Attr.prototype,"parentElement",{configurable:!1,enumerable:!1,get:e})}catch(t){Attr.prototype.parentElement=e}try{Object.defineProperty(Text.prototype,"parentElement",{configurable:!1,enumerable:!1,get:e})}catch(n){Text.prototype.parentElement=e}try{Object.defineProperty(Element.prototype,"parentElement",{configurable:!1,enumerable:!1,get:e})}catch(o){Element.prototype.parentElement=e}try{Object.defineProperty(Document.prototype,"parentElement",{configurable:!1,enumerable:!1,get:e})}catch(r){Document.prototype.parentElement=e}}}();