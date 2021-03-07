---
layout: docs
title: Empty value format
description: Documentation for Export Sheet Data's 'Empty value format' option.
group: json
---

Empty value format
------------------
Value exported for empty cells.

Null will export empty cells with a standard JSON `null` value while Empty String will export an empty string `""`.

### Example: ###

**Sheet name: `Directors`**

Name | Skill
---- | ------
George | Creation
JJ | 

*Null Output:*
```json
{
  "Directors" : {
    "George" : {
      "Name" : "George",
      "Skill" : "Creation"
    },
    "JJ" : {
      "Name" : "JJ",
      "Skill" : null
    }
  }
}
```

*Empty String Output:*
```json
{
  "Directors" : {
    "George" : {
      "Name" : "George",
      "Skill" : "Creation"
    },
    "JJ" : {
      "Name" : "JJ",
      "Skill" : ""
    }
  }
}
```
