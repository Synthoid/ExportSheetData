---
layout: docs
title: Collapse Single Row Sheets
description: Documentation for Export Sheet Data's 'Collapse single row sheets' option.
group: general
---

Collapse single row sheets
-------------
Remove the wrapping element of a sheet that has only one row (not including the keys row).

This is similar to [unwrapping single row sheets](docs/general/unwrapsinglerowsheets.md) but does not place sheet fields in the root JSON element directly. For example:

Sheet: `Character`<br>
Fields: `Name | Age | Role`<br>
Values: `Cid | 25 | Fighter`

Default Output:
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

Collapsed Output:
```
{
  "Character" : {
    "Name":"Cid",
    "Age":25,
    "Role":"Fighter"
  }
}
```

Unwrapped Output:
```
{
  "Name":"Cid",
  "Age":25,
  "Role":"Fighter"
}
```
