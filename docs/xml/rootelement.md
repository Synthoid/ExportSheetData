---
layout: docs
title: Root Element
description: Documentation for Export Sheet Data's 'Root element' option.
group: xml
---

Root element
------------
Specifies the name for the exported XML document's root element. By default, this value is "data".

<b>Example:</b>

Sheet: `Colors`<br>
Fields: `Name | R | G | B`<br>
Values: `Red | 1 | 0 | 0`<br>
`Green | 0 | 1 | 0`<br>
`Blue | 0 | 0 | 1`

Default Root Element:
```
<data>
  <Colors>
    <Red R="1" G="0" B="0"/>
    <Green R="0" G="1" B="0"/>
    <Blue R="0" G="0" B="1"/>
  </Colors>
</data>
```

Root Element "Art":
```
<Art>
  <Colors>
    <Red R="1" G="0" B="0"/>
    <Green R="0" G="1" B="0"/>
    <Blue R="0" G="0" B="1"/>
  </Colors>
</Art>
```
