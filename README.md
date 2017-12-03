Export Sheet Data is an add-on for Google Sheets that allows sheets to be exported as JSON or XML.

Goals
-----
**Convenient:** Export Sheet Data is meant to be simple to use but very powerful. No more exporting multiple CSVs then compiling data.

**Customizable:** Options and formats can be tweaked to reflect personal taste. Newline or sameline braces for JSON. Attributes or child elements for XML. Format your data the way you want.

Install
-------
You can install Export Sheet Data [here](https://chrome.google.com/webstore/detail/export-sheet-data/bfdcopkbamihhchdnjghdknibmcnfplk?utm_source=permalink)

How to use
----------

Currently the best way to figure out how to use ESD is by opening the sidebar, reading the tooltips of various options and experimenting with the output using the Visualize option.

If you want to create more advanced data structures, make sure to read the Wiki page about [Nested Elements](https://github.com/Synthoid/ExportSheetData/wiki/Nested-Elements).

Development Status
------------------
Export Sheet Data supports a wide variety of features. Currently, this includes:

**JSON**
* Forcing all data to string values
* Exporting individual cells as JSON arrays
* Exporting a sheet's contents as an array of JSON objects
* Unwrapping a sheet's JSON for easier access after exporting

**XML**
* Exporting columns as attributes, child elements, or inner text of a row
* Formatting XML illegal characters like &, <, and >
* XML declaration support
 
**General**
* Visualize data before exporting
* Newline or sameline formatting
* Exporting specific sheets
 
Contributing
------------
If you would like to add a feature to Export Sheet Data, be sure to read the [wiki page on contributing](https://github.com/Synthoid/ExportSheetData/wiki/Contributing). Also, take a look at the [notes on project structure](https://github.com/Synthoid/ExportSheetData/wiki/Project-Structure) and check out the [currently open issues](https://github.com/Synthoid/ExportSheetData/issues).

Credits
-------
Developed by Chris Ingerson.

License
-------
Export Sheet Data is licensed under the MIT License, see [LICENSE](https://github.com/Synthoid/ExportSheetData/blob/master/LICENSE) for more information.
