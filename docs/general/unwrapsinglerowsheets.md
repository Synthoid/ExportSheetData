---
layout: docs
title: Unwrap Single Row Sheets
description: Documentation for Export Sheet Data's 'Unwrap single row sheets' option.
group: general
---

Unwrap single row sheets
-------------
Unwrap single row sheets will remove the wrapping element of a sheet that has only one row (not including the keys row).

This can be useful when you want certain data to be in the root element of your exported data.


This is similar to [collapsing single row sheets](collapsesinglerowsheets.md) but places sheet fields in the root JSON or XML element directly.

### Example: ###

**Sheet name: `Character`**

Name | Age | Role
---- | --- | ----
Cid | 25 | Fighter

*Default Outputs:*

JSON:
```
{
  "Character" : {
    "Cid" : {
      "Name":"Cid",
      "Age":25,
      "Role":"Fighter"
    }
  }
}
```
XML:
```
<data>
  <Character>
    <Cid>
      <Name>Cid</Name>
      <Age>25</Age>
      <Role>Fighter</Role>
    </Cid>
  </Character>
</data>
```

*Unwrapped Output:*

JSON:
```
{
  "Name":"Cid",
  "Age":25,
  "Role":"Fighter"
}
```
XML:
```
<data>
  <Cid>
    <Name>Cid</Name>
    <Age>25</Age>
    <Role>Fighter</Role>
  </Cid>
</data>
```

*Collapsed Output:*

JSON:
```
{
  "Character" : {
    "Name":"Cid",
    "Age":25,
    "Role":"Fighter"
  }
}
```
XML:
```
<data>
  <Character>
    <Name>Cid</Name>
    <Age>25</Age>
    <Role>Fighter</Role>
  </Character>
</data>
```
