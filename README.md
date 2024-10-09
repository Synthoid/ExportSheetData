![Export Sheet Data](images/esd_banner.png)

Export Sheet Data is an add-on for Google Sheets that allows data to be exported as JSON or XML.

Install
-------
[Install link](https://workspace.google.com/marketplace/app/export_sheet_data/903838927001)

Export Sheet Data is available on the Google Workspace Marketplace.

> [!WARNING]
> There is a known bug that can affect add-ons while multiple accounts are signed in. If you run into a situation where the ESD sidebar doesn't seem to load, visit the [troubleshooting](docs/troubleshooting.md) page for help.

Documentation
-------------
[Documentation index page](docs/index.md)

The best way to learn how to use Export Sheet Data is by using it! Open the sidebar, read the tooltips of various seettings, and experiment by using the Visualize option.

For detailed descriptions on each option, including example inputs and outputs, take a look at ESD's documentation.

If you want to create more advanced data structures, make sure to read the Wiki page about [Nested Elements](https://github.com/Synthoid/ExportSheetData/wiki/Nested-Elements).

Troubleshooting
---------------
If you ever experience an issue or have difficulty using ESD, you can look at the [toubleshooting](docs/troubleshooting.md) page for help. This page contains solutions for common issues you may encounter, especially for the more complex features of ESD.

Should you notice anything the troubleshooting page does not cover, feel free to make a new issue to help improve ESD!

Frequently Asked Questions
--------------------------
You can see answers to frequently asked questions about ESD [here](docs/faq.md).

Goals
-----
**Convenient**

Export Sheet Data is meant to be simple to use but very powerful. No more exporting multiple CSVs then compiling data.

**Customizable**

Options and formats can be tweaked to reflect personal taste. Default or stringified values for JSON. Attributes or child elements for XML. Format your data the way you want!

Development Status
------------------
Export Sheet Data supports a wide variety of features. Currently, this includes:

**General**
- Visualize data
- Export files to Drive
- Replace target Drive file contents
- Download files directly
- Export specific sheets
- Unwrap or collapse a sheet's data for easier access after exporting
- Minify exported data to produce smaller files
- Export booleans as integers
- Format date-time values

**JSON**
- Force all data to string values
- Export individual cells as JSON objects or arrays
- Export a sheet's contents as an array of JSON objects
- Create complex data structures via Nested Elements

**XML**
- Export columns as attributes, child elements, or inner text of a row's element
- Automatic formatting of XML illegal characters like `&`, `<`, and `>`
- XML comments and declaration support
- XML namespaces
 
Contributing
------------
If you would like to add a feature to Export Sheet Data, be sure to read the [wiki page on contributing](https://github.com/Synthoid/ExportSheetData/wiki/Contributing). Also, take a look at the [notes on project structure](https://github.com/Synthoid/ExportSheetData/wiki/Project-Structure) and check out the [currently open issues](https://github.com/Synthoid/ExportSheetData/issues).

Supporting ESD
--------------
If you use ESD and want to help ensure its continued development, consider supporting ESD via GitHub Sponsors! While ESD will remain free for everyone to use, supporting development with a few dollars a month will go a long way to helping me create examples, develop new features, and fix existing bugs.

Credits
-------
Developed by Chris Ingerson with help from the community.

- Ignore rows support added by [jaeki-kim](https://github.com/jaeki-kim)
- Visualization window HTML escaping added by [tomyam1](https://github.com/tomyam1)
- Settings bug fixes by [pvirdone-s8](https://github.com/pvirdone-s8)

License
-------
Export Sheet Data is licensed under the MIT License, see [LICENSE](https://github.com/Synthoid/ExportSheetData/blob/master/LICENSE) for more information.
