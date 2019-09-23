---
layout: docs
title: Export Cell Arrays
description: Documentation for Export Sheet Data's 'Export cell arrays' option.
group: json
---

Export cell arrays
------------------
Export a cell's value as a JSON array if the cell contains commas (`,`).

To prevent any data containing a comma from being exported as separate array elements, wrap your cell value with quotation marks (`""`). For example: `So, you're taking her side?!` will export as two elements, while `"So, you're taking her side?!"` will export as one.

### Example: ###

**Sheet name: `Spies`**

Name | Age | Aliases
---- | --- | -------
Sterling | 30 | Duchess, Randy, "Sterling Archer, world's greatest spy"

*Default Output:*
```
{
  "Spies" : {
    "Sterling" : {
      "Name":"Sterling",
      "Age":30,
      "Aliases":"Duchess, Randy, \"Sterling Archer, world's greatest spy\""
    }
  }
}
```

*Cell Array Output:*
```
{
  "Spies" : {
    "Sterling" : {
      "Name":"Sterling",
      "Age":30,
      "Aliases": [
        "Duchess",
        "Randy",
        "Sterling Archer, world's greatest spy"
      ]
    }
  }
}
```
