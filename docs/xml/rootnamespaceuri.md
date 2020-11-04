---
layout: docs
title: Root Namespace URI
description: Documentation for Export Sheet Data's 'Root namespace URI' option.
group: xml
---

Root namespace URI
------------------
The root namespace used for the exported XML's elements.

This is defined via the `xmlns` attribute in the document's root element.

### Example: ###

**Sheet: `SheetPrograms`**

Name | Company | ID
---- | ------- | -----------
Excel | Microsoft | MS
Sheets | Google | G
Numbers | Apple | A

*Empty root namespace URI:*
```
<data>
  <SheetPrograms>
    <Excel Company="Microsoft" ID="MS" />
    <Sheets Company="Google" ID="G" />
    <Numbers Company="Apple" ID="A" />
  </SheetPrograms>
</data>
```

*Root namespace URI set to `urn:schemas-microsoft-com:office:spreadsheet`*
```
<data xmlns="urn:schemas-microsoft-com:office:spreadsheet">
  <SheetPrograms>
    <Excel Company="Microsoft" ID="MS" />
    <Sheets Company="Google" ID="G" />
    <Numbers Company="Apple" ID="A" />
  </SheetPrograms>
</data>
```
