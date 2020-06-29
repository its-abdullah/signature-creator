"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e,t){"object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).signatureCreator=t()}(void 0,function(){var c={makeSignatureEditor:function(t,e){(function(e){var t=!0,o=!1,n=void 0;try{for(var r,i=Object.keys(s)[Symbol.iterator]();!(t=(r=i.next()).done);t=!0){var l=r.value;null==e[l]?c.impl.options[l]=s[l]:c.impl.options[l]=e[l]}}catch(e){o=!0,n=e}finally{try{!t&&i.return&&i.return()}finally{if(o)throw n}}})(e=e||{}),e=c.impl.options,Promise.resolve(t).then(function(e){!function(e){e.classList.add("signature-container"),"rtl"===c.impl.options.dir&&e.setAttribute("dir",c.impl.options.dir);var t='<div class="signature">'+e.innerHTML+"</div>";e.innerHTML=t,function(e){var t='<div class="control-buttons preview-mode">\n                    <button class="btn btn-primary save" type="button">\n                    '+c.impl.options.saveBtnLabel+'\n                    </button>\n                    <button class="btn btn-outline-primary edit" type="button">\n                    '+c.impl.options.editBtnLabel+'\n                    </button>\n                    <button class="btn btn-outline-primary preview" type="button">\n                    '+c.impl.options.previewBtnLabel+"\n                    </button>\n                </div>";e.innerHTML+=t}(e)}(e)}).then(function(){var e;(e=t).querySelector(".control-buttons > .save").addEventListener("click",function(){!function(e){e.querySelector(".control-buttons").classList.add("hide"),document.querySelector("body").style.overflow="hidden";var t=e.querySelector(".control-buttons").classList.contains("edit-mode")?"EditMode":"PreviewMode";i(e,!1),l(e,!1),u(),window.scrollTo(0,0),e.querySelectorAll(".signature p").forEach(function(e){e.innerHTML=e.innerHTML.replace(/ /g,"&nbsp;")}),html2canvas(e.querySelector(".signature")).then(function(e){var t=document.createElement("a");document.body.appendChild(t),t.download=c.impl.options.fileName+".jpg",t.href=e.toDataURL("image/jpeg"),t.target="_blank",t.click()}),e.parentElement.querySelector(".control-buttons").classList.remove("hide"),document.querySelector("body").style.overflow=null,("EditMode"==t?n:o)(e,!1)}(e)}),e.querySelector(".control-buttons > .edit").addEventListener("click",function(){n(e)}),e.querySelector(".control-buttons > .preview").addEventListener("click",function(){o(e)}),e.querySelectorAll(".signature p").forEach(function(e){e.addEventListener("focus",function(){!function(e){{var t,o,n;document.body.createTextRange?((t=document.body.createTextRange()).moveToElementText(e),t.select()):window.getSelection?(o=window.getSelection(),(n=document.createRange()).selectNodeContents(e),o.removeAllRanges(),o.addRange(n)):console.warn("Could not select text in node: Unsupported browser.")}}(e)})})}).then(function(){r(t)})},impl:{options:{}}},s={dir:"ltr",saveBtnLabel:"Save As Image",editBtnLabel:"Edit Texts",previewBtnLabel:"Preview",fileName:"signature"};function o(e,t){e.querySelector(".control-buttons").classList.add("preview-mode"),e.querySelector(".control-buttons").classList.remove("edit-mode"),l(e,!1),u(),r(e,t)}function n(e,t){i(e,t),e.querySelector(".control-buttons").classList.add("edit-mode"),e.querySelector(".control-buttons").classList.remove("preview-mode"),l(e,!0),window.scrollTo(0,e.querySelector(".signature p").offsetTop,"smooth"),setTimeout(function(){e.querySelector(".signature p").focus(),window.scrollTo(0,e.querySelector(".signature p").offsetTop,"smooth")},200)}function r(e,t){var o;!(1<arguments.length&&void 0!==t)||t?e.querySelector(".signature").classList.remove("no-animation"):e.querySelector(".signature").classList.add("no-animation"),e.clientWidth!=e.scrollWidth&&(document.querySelector("body").style.overflow="hidden",o=e.clientWidth/e.scrollWidth,e.querySelector(".signature").style.transform="scale("+o+")",document.querySelector("body").style.overflow=null,setTimeout(function(){window.scrollTo(0,0,"smooth")},0))}function i(e,t){!(1<arguments.length&&void 0!==t)||t?e.querySelector(".signature").classList.remove("no-animation"):e.querySelector(".signature").classList.add("no-animation"),e.querySelector(".signature").style.transform=null}function l(e,t){e.querySelectorAll(".signature p").forEach(function(e){e.setAttribute("contenteditable",t)})}function u(){window.getSelection?window.getSelection().removeAllRanges():document.selection&&document.selection.empty()}return c});