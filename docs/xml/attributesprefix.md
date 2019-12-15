---
layout: docs
title: Attributes Prefix
description: Documentation for Export Sheet Data's 'Attributes prefix' option.
group: xml
---

Attributes prefix
-----------------
Force columns with keys using the specified prefix to export as attributes of their row's XML element.

By default, cells export as attributes of their row XML element. This option is only useful if options like [Export columns as child elements](exportcolumnsaschildelements.md) are enabled.

Default value: `ATT_` (short for "**ATT**ribute")

### Example: ###

**Sheet: `Planets`**

Name | ATT_Orbit | Description
---- | --------- | -----------
Earth | 1 AU | A pale blue dot suspended in a sunbeam.

*Default Output:*
```
<data>
  <Planets>
    <Earth>
      <ATT_Orbit>1 AU</ATT_Orbit>
      <Descripition>A pale blue dot suspended in a sunbeam.</Description>
    </Earth>
  </Planets>
</data>
```

*With "Attributes prefix" and "Export columns as child elements" enabled:*
```
<data>
  <Planets>
    <Earth Orbit="1 AU">
      <Description>A pale blue dot suspended in a sunbeam.</Description>
    </Earth>
  </Planets>
</data>
```
