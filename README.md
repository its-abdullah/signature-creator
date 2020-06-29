# DateTimePicker
![Generic badge](https://img.shields.io/badge/status-beta-blue.svg)

Signature-creator is a js library providing editable html content (signature), to be genarated later as an image.

## Dependancy
* [html2canvas](https://github.com/niklasvh/html2canvas)

## Installation
Call the following files in your HTML:
* Add the dependecy file html2canvas.js
```sh
<script type="text/javascript" src="html2canvas.min.js"></script>
```
* Add signature-creator.js from this repo
```sh
<script type="text/javascript" src="signature-creator.js"></script>
```
* Also add signature-creator.css from this repo
```sh
<link rel="stylesheet" href="signature-creator.css" />
```
* After that, feel free to add your own custom css.
* Make an html div with a unique class, for example `my-div`.
* Add your own pharagraphs inside of this div, these pharagraphs will be the editable ones by the user.
* Call `signatureCreator.makeSignatureEditor` function and pass to it the following:
    * A selector of the div with the unique class.
    * Options.
    #### Example
    ```sh
    signatureCreator.makeSignatureEditor(
        document.querySelector('.my-div'),
        {
            fileName: 'congrats'
        }
    );
    ```


## Options
* ##### dir
    `default: rtl` `type: string` `Options: {rtl, ltr}`
    controls direction of signature div, most importantly the control buttons.

* ##### saveBtnLabel
    `default: Save As Image` `type: string`
    Label for Save button.

* ##### editBtnLabel
    `default: Edit Texts` `type: string`
    Label for Edit button.

* ##### previewBtnLabel
    `default: Preview` `type: string`
    Label for Preview button.

* ##### fileName
    `default: signature` `type: string`
    The name of the picture file.

## Examples
check the two html files under examples folder in the repo.


 ## What is next
* Giving the option of writing your own save image code.
* work on the animation.
