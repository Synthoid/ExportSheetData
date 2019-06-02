---
layout: docs
title: Export Sheet Arrays
description: Documentation for Export Sheet Data's 'Export sheet arrays' option.
group: json
---

Export sheet arrays
-------------------
Export sheet arrays will export sheets as JSON arrays with each row creating an element in the array.

### Example: ###

**Sheet name: `Companies`**

Name | Console
---- | -------
Microsoft | Xbox One
Nintendo | Switch
Sony | Playstation 4

*Default Output:*
```
{
  "Companies" : {
    "Microsoft" : {
      "Name":"Microsoft",
      "Console":"Xbox One"
    },
    "Nintendo" : {
      "Name":"Nintendo",
      "Console":"Switch"
    },
    "Sony" : {
      "Name":"Sony",
      "Console":"Playstation 4"
    }
  }
}
```

*Sheet Array Output:*
```
{
  "Companies" : [
    {
      "Name":"Microsoft",
      "Console":"Xbox One"
    },
    {
      "Name":"Nintendo",
      "Console":"Switch"
    },
    {
      "Name":"Sony",
      "Console":"Playstation 4"
    }
  ]
}
```
