---
layout: docs
title: Force String Values
description: Documentation for Export Sheet Data's 'Force string values' option.
group: json
---

Force string values
-------------------
Force all data values to export as a string.

NOTE: `null` values will remain standard `null` values. They will not be converted to `"null"`.

### Example: ###

**Sheet name: `Heroes`**

Name | Human | Age | Superpower
---- | ----- | --- | ----------
Batman | true | 30 | 

*Default Output:*
```
{
  "Heroes": {
    "Batman": {
      "Name": "Batman",
      "Human": true,
      "Age": 30,
      "Superpower": null
    }
  }
}
```

*Force String Output:*
```
{
  "Heroes": {
    "Batman": {
      "Name": "Batman",
      "Human": "true",
      "Age": "30",
      "Superpower": null
    }
  }
}
```
