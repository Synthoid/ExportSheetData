---
layout: docs
title: Index
description: Index page for Export Sheet Data's documentation.
group: overview
---

Welcome to the Export Sheet Data documentation compendium!
----------------------------------------------------------

Here you can find detailed descriptions for each of ESD's various options and settings, as well as a few guidelines for how to properly use ESD.

**This documentation is still being written, so please bear with us and forgive any missing content while it is being completed.**

Format Settings
---------------
These settings determine which format (JSON or XML) to export your data to, as well as the target sheets to export.

- [Select Format](format/selectformat.md) - Select the data format to export to (JSON or XML)
- [Select Sheet(s)](format/selectsheets.md) - Select the data range to include in the exported data

General Settings
----------------
These settings affect both JSON and XML data.

- [Replace existing file(s)](general/replaceexistingfiles.md) - Trash files with the same name in the output folder as the exported data
- [Unwrap single row sheets](general/unwrapsinglerowsheets.md) - Place elements from a sheet containing one row in the root element
- [Ignore empty cells](general/ignoreemptycells.md) - Don't export cells with no value
- [Nested Elements](general/nestedelements.md) - Create complex data sets by using specific key syntax
- [Ignore prefix](general/ignoreprefix.md) - Don't export columns whose keys start with a specific string

JSON Settings
-------------
These settings only affect exported JSON data.

### Basic

- [Force string values](json/forcestringvalues.md)
- Export cell arrays
- Export sheet arrays
- Export value arrays

### Advanced

- Export contents as array
- Export cell objects
- Array separator character
- Array prefix

XML Settings
------------
These settings only affect exported XML data.

### Basic

- [Export columns as child elements](xml/exportcolumnsaschildelements.md)
- Don't format illegal characters
- Include first column in export

### Advanced

- Root element
- Name replacement char
- Include XML declaration
  - XML version
  - XML encoding
  - Standalone
- Attributes prefix
- Child elements prefix
- Inner text prefix
