var signatureCreator = {
    makeSignatureEditor: makeSignatureEditor,
    impl: {
        options: {}
    }
};

// Default impl options
var defaultOptions = {
    dir: 'ltr',
    saveBtnLabel: 'Save As Image',
    editBtnLabel: 'Edit Texts',
    previewBtnLabel: 'Preview'
};

/**
 * @param {Node} node - The DOM Node object to render
 * @param {Object} options - Rendering options
 * */
function makeSignatureEditor(node, options) {
    options = options || {};
    copyOptions(options);
    options = signatureCreator.impl.options;
    Promise.resolve(node)
        .then(function (node) {
            bindControls(node, options);
        })
        .then(function () {
            bindFunctions(node);
        })
        .then(function () {
            fittingZoom(node);
        });
}

function copyOptions(options) {
    // Copy options to impl options for use in impl
    if (typeof (options.dir) === 'undefined') {
        signatureCreator.impl.options.dir = defaultOptions.dir;
    } else {
        signatureCreator.impl.options.dir = options.dir;
    }

    if (typeof (options.saveBtnLabel) === 'undefined') {
        signatureCreator.impl.options.saveBtnLabel = defaultOptions.saveBtnLabel;
    } else {
        signatureCreator.impl.options.saveBtnLabel = options.saveBtnLabel;
    }

    if (typeof (options.editBtnLabel) === 'undefined') {
        signatureCreator.impl.options.editBtnLabel = defaultOptions.editBtnLabel;
    } else {
        signatureCreator.impl.options.editBtnLabel = options.editBtnLabel;
    }

    if (typeof (options.previewBtnLabel) === 'undefined') {
        signatureCreator.impl.options.previewBtnLabel = defaultOptions.previewBtnLabel;
    } else {
        signatureCreator.impl.options.previewBtnLabel = options.previewBtnLabel;
    }
}

function bindControls(node, options) {
    var html = `<div id="previewButtons" class="preview-buttons">
                    <button class="btn btn-primary save" type="button" id="save">
                    ${options.saveBtnLabel}
                    </button>
                    <button class="btn btn-outline-primary edit" type="button" id="edit">
                    ${options.editBtnLabel}
                    </button>
                    <button class="btn btn-outline-primary preview d-none" type="button" id="preview">
                    ${options.previewBtnLabel}
                    </button>
                </div>`;

    var controls = createElementFromHTML(html);

    node.parentElement.insertBefore(controls, null);

    return true;
}

function bindFunctions(node) {
    node.parentElement.querySelector('.save').addEventListener('click', function () {
        download(node);
    });

    node.parentElement.querySelector('.edit').addEventListener('click', function () {
        edit(node);
    });

    node.parentElement.querySelector('.preview').addEventListener('click', function () {
        preview(node);
    });

    node.querySelectorAll('p').forEach(function (e) {
        e.addEventListener('focus', function () {
            selectText(e);
        });
    });
}

function download(node) {
    node.parentElement.querySelector("#previewButtons").classList.add("d-none");
    document.querySelector("body").style.overflow = "hidden";

    var currentView = node.parentElement.querySelector("#previewButtons > .edit").classList.contains('d-none') ? "EditMode" : "PreviewMode";

    originalZoom(node, false);

    toggleContentEditable(node, false);

    clearSelection();

    window.scrollTo(0, 0);

    node.querySelectorAll('p').forEach(function (e) {
        e.innerHTML = e.innerHTML.replace(/ /g, "&nbsp;");
    });

    html2canvas(node).then(function (canvas) {
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "Eid-Congrats.jpg";
        link.href = canvas.toDataURL("image/jpeg");
        link.target = "_blank";
        link.click();
    });

    node.parentElement.querySelector("#previewButtons").classList.remove("d-none");
    document.querySelector("body").style.overflow = null;

    if (currentView == "EditMode")
        edit(node, false);
    else
        preview(node, false);
}

function preview(node, animation) {
    node.parentElement.querySelector(".edit").classList.remove("d-none");
    node.parentElement.querySelector(".preview").classList.add("d-none");

    toggleContentEditable(node, false);

    clearSelection();

    fittingZoom(node, animation);

    // window.scrollTo(0, 0);
}

function edit(node, animation) {
    originalZoom(node, animation);

    node.parentElement.querySelector(".edit").classList.add("d-none");
    node.parentElement.querySelector(".preview").classList.remove("d-none");

    toggleContentEditable(node, true);

    window.scrollTo(0, node.querySelector('p').offsetTop, 'smooth');

    setTimeout(function () {
        node.querySelector('p').focus();
        window.scrollTo(0, node.querySelector('p').offsetTop, 'smooth');
    }, 200);

    // window.scrollTo(0, node.querySelector('p').offsetTop);
}

function fittingZoom(node, animation = true) {
    if (animation)
        node.classList.remove('no-animation');
    else
        node.classList.add('no-animation');

    if (document.body.clientWidth == document.body.scrollWidth) return;

    document.querySelector("body").style.overflow = "hidden";
    var preZoomWidth = document.body.scrollWidth;

    var fittingZoomNumb =
        (document.body.clientWidth * 1) / document.body.scrollWidth;

    node.style.transform =
        "scale(" + fittingZoomNumb + ")";

    document.querySelector("body").style.overflow = null;

    setTimeout(function () {
        window.scrollTo(0, 0, 'smooth');
    }, 0);
}

function originalZoom(node, animation = true) {
    if (animation)
        node.classList.remove('no-animation');
    else
        node.classList.add('no-animation');

    node.style.transform = null;
}

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
    if (window.getSelection) { window.getSelection().removeAllRanges(); }
    else if (document.selection) { document.selection.empty(); }
}

function toggleContentEditable(node, toggleState) {
    node.querySelectorAll('p').forEach(function (e) {
        e.setAttribute("contenteditable", toggleState);
    });
}

// Utilities
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

export default signatureCreator;