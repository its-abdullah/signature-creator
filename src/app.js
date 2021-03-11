var signatureCreator = {
  makeSignatureEditor: makeSignatureEditor,
  impl: {
    options: {},
  },
};

// Default impl options
var defaultOptions = {
  dir: "ltr",
  saveBtnLabel: "Save As Image",
  editBtnLabel: "Edit Texts",
  previewBtnLabel: "Preview",
  fileName: "signature",
};

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options
 * */
function makeSignatureEditor(node, options) {
  options = options || {};
  copyOptions(options);
  options = signatureCreator.impl.options;

  buildHTMLStructure(node);
  bindFunctions(node);
  fittingZoom(node);
}

function copyOptions(options) {
  for (var key of Object.keys(defaultOptions)) {
    if (options[key] == undefined)
      signatureCreator.impl.options[key] = defaultOptions[key];
    else signatureCreator.impl.options[key] = options[key];
  }
}

function buildHTMLStructure(node) {
  node.classList.add("signature-container");

  if (signatureCreator.impl.options.dir === "rtl")
    node.setAttribute("dir", signatureCreator.impl.options.dir);

  var userHTML = node.innerHTML;
  var signatureHTML = `<div class="signature">${userHTML}</div>`;

  node.innerHTML = signatureHTML;

  bindControls(node);
}

function bindControls(node) {
  var html = `<div class="control-buttons preview-mode">
                    <button class="btn btn-primary save" type="button">
                    ${signatureCreator.impl.options.saveBtnLabel}
                    </button>
                    <button class="btn btn-outline-primary edit" type="button">
                    ${signatureCreator.impl.options.editBtnLabel}
                    </button>
                    <button class="btn btn-outline-primary preview" type="button">
                    ${signatureCreator.impl.options.previewBtnLabel}
                    </button>
                </div>`;

  node.innerHTML += html;
}

function bindFunctions(node) {
  node
    .querySelector(".control-buttons > .save")
    .addEventListener("click", function () {
      download(node);
    });

  node
    .querySelector(".control-buttons > .edit")
    .addEventListener("click", function () {
      edit(node);
    });

  node
    .querySelector(".control-buttons > .preview")
    .addEventListener("click", function () {
      preview(node);
    });

  node.querySelectorAll(".signature p").forEach(function (e) {
    e.addEventListener("focus", function () {
      selectText(e);
    });
  });
}

function download(node) {
  node.querySelector(".control-buttons").classList.add("hide");
  document.querySelector("body").classList.add("no-overflow");

  var currentView = node
    .querySelector(".control-buttons")
    .classList.contains("edit-mode")
    ? "EditMode"
    : "PreviewMode";

  originalZoom(node, false);

  toggleContentEditable(node, false);

  clearSelection();

  window.scrollTo(0, 0);

  node.querySelectorAll(".signature p").forEach(function (e) {
    e.innerHTML = e.innerHTML.replace(/ /g, "&nbsp;");
  });

  html2canvas(node.querySelector(".signature")).then(function (canvas) {
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.download = signatureCreator.impl.options.fileName + ".jpg";
    link.href = canvas.toDataURL("image/jpeg");
    link.target = "_blank";
    link.click();
  });

  node.parentElement.querySelector(".control-buttons").classList.remove("hide");
  document.querySelector("body").classList.remove("no-overflow");

  if (currentView == "EditMode") edit(node, false);
  else preview(node, false);
}

function preview(node, animation) {
  node.querySelector(".control-buttons").classList.add("preview-mode");
  node.querySelector(".control-buttons").classList.remove("edit-mode");

  toggleContentEditable(node, false);

  clearSelection();

  fittingZoom(node, animation);

  // window.scrollTo(0, 0);
}

function edit(node, animation) {
  //to be used later with input focusing
  var sideOffset =
    node.querySelector(".signature p").offsetLeft +
    (signatureCreator.impl.options.dir == "rtl"
      ? node.querySelector(".signature p").scrollWidth + 10
      : -10);
  sideOffset =
    sideOffset > window.innerWidth
      ? sideOffset - window.innerWidth
      : sideOffset;

  originalZoom(node, animation);

  node.querySelector(".control-buttons").classList.add("edit-mode");
  node.querySelector(".control-buttons").classList.remove("preview-mode");

  toggleContentEditable(node, true);

  node.querySelector(".signature p").focus();
  node.querySelector(".signature p").scrollIntoView();

  window.scrollTo(sideOffset, window.scrollY, "smooth");

  setTimeout(function () {
    node.querySelector(".signature p").focus();
    node.querySelector(".signature p").scrollIntoView();
    window.scrollTo(sideOffset, window.scrollY, "smooth");
  }, 200);
}

function fittingZoom(node, animation = true) {
  if (animation)
    node.querySelector(".signature").classList.remove("no-animation");
  else node.querySelector(".signature").classList.add("no-animation");

  node.style.width = null;
  if (node.clientWidth == node.scrollWidth) return;

  document.querySelector("body").style.overflow = "hidden";

  var fittingZoomNumb = (node.clientWidth) / node.scrollWidth;

  node.querySelector('.signature').style.transform =
      "scale(" + fittingZoomNumb + ")";

  document.querySelector("body").style.overflow = null;

  setTimeout(function () {
    window.scrollTo(0, 0, "smooth");
  }, 0);
}

function originalZoom(node, animation = true) {
  if (animation)
    node.querySelector(".signature").classList.remove("no-animation");
  else node.querySelector(".signature").classList.add("no-animation");

  node.querySelector(".signature").style.transform = null;

  node.style.width = node.querySelector(".signature").scrollWidth + "px";
}

function toggleContentEditable(node, toggleState) {
  node.querySelectorAll(".signature p").forEach(function (e) {
    e.setAttribute("contenteditable", toggleState);
  });
}

// Utilities
function selectText(node) {
  if (document.body.createTextRange) {
    const range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn("Could not select text in node: Unsupported browser.");
  }
}

function clearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

export default signatureCreator;
