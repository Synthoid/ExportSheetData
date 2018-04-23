---
layout: docs
title: Force String Values
description: Documentation for Export Sheet Data's 'Force string values' option.
group: json
---

Force string values
-------------------
Force string values will convert all exported data to its string varient.

Example:

Sheet: `Heroes`<br>
Fields: `Name | Human | Age | Superpower`<br>
Values: `Batman | true | 30 | Money`

Default Output:
```
{
  "Heroes" : {
    "Batman" : {
      "Name":"Batman",
      "Human":true,
      "Age":30,
      "Superpower":"Money"
    }
  }
}
```

Force String Output:
```
{
  "Heroes" : {
    "Batman" : {
      "Name":"Batman",
      "Human":"true",
      "Age":"30",
      "Superpower":"Money"
    }
  }
}
```
