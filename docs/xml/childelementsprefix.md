---
layout: docs
title: Child Elements Prefix
description: Documentation for Export Sheet Data's 'Child elements prefix' option.
group: xml
---

Child elements prefix
---------------------
Force columns with keys using the specified prefix to export as child elements of their row's XML element.

Default value: `CE_`

<b>Example:</b>

Sheet: `Planets`<br>
Keys: `Name|Orbit|CE_Description`<br>
Values: `Earth|1 AU|A pale blue dot suspended in a sunbeam.`

Default Output:
```
<data>
  <Planets>
    <Earth Orbit="1 AU" CE_Descripition="A pale blue dot suspended in a sunbeam." />
  </Planets>
</data>
```

With "Child elements prefix" enabled:
```
<data>
  <Planets>
    <Earth Orbit="1 AU">
      <Description>A pale blue dot suspended in a sunbeam.</Description>
    </Earth>
  </Planets>
</data>
```
