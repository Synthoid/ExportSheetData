---
layout: docs
title: Include First Column in Export
description: Documentation for Export Sheet Data's 'Include first column in export' option.
group: general
---

Include first column in export
------------------------------
Include the first column of each row as a distinct element in addition to it being used for the name of the row element.

By default, the first column of a row is not exported as a distinct XML element or JSON value as it is used to name the row element. Enabling this will cause the first column to be exported as both the name (or key) of the row's element as well as its own distinct element like the other columns in a row.

<img src="../../images/esd_icon_json.svg" width="32px" height="32px"/> **JSON Notes:**

Some JSON settings will override this setting and always include the first column, specifically [Nested Elements](nestedelements.md) and [Export sheet arrays](../json/exportsheetarrays.md).

### Example: ###

**Sheet name: `Seasons`**

Name | Temperature
---- | -----------
Spring | Warm
Summer | Hot
Autumn | Cool
Winter | Cold

*Default Output:*

JSON:
```
{
  "Seasons": {
    "Spring": {
      "Temperature": "Warm"
    },
    "Summer": {
      "Temperature": "Hot"
    },
    "Autumn": {
      "Temperature": "Cool"
    },
    "Winter": {
      "Temperature": "Cold"
    }
  }
}
```

XML:
```
<data>
  <Seasons>
    <Spring Temperature="Warm"/>
    <Summer Temperature="Hot"/>
    <Autumn Temperature="Cool"/>
    <Winter Temperature="Cold"/>
  </Seasons>
</data>
```

*Include First Column Output:*

JSON:
```
{
  "Seasons": {
    "Spring": {
      "Name": "Spring",
      "Temperature": "Warm"
    },
    "Summer": {
      "Name": "Summer",
      "Temperature": "Hot"
    },
    "Autumn": {
      "Name": "Autumn",
      "Temperature": "Cool"
    },
    "Winter": {
      "Name": "Winter",
      "Temperature": "Cold"
    }
  }
}
```

XML:
```
<data>
  <Seasons>
    <Spring Name="Spring" Temperature="Warm"/>
    <Summer Name="Summer" Temperature="Hot"/>
    <Fall Name="Autumn" Temperature="Cool"/>
    <Winter Name="Winter" Temperature="Cold"/>
  </Seasons>
</data>
```
