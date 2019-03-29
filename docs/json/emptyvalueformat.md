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

<b>Example:</b>

Null:
```
{
  "Test" : null
}
```

Empty String:
```
{
  "Test" : ""
}
```
