---
layout: docs
title: XML Tips & Tricks
description: Tips for XML functionality.
group: xml
---

XML Tips & Tricks
-----------------
This section covers how to use some more obscure XML functionality in ESD. These tips only apply when targeting the XML export format.

XML Comments
---------------------
If the first cell in a row is the string `!--`, the row will be exported as an XML comment block.

### Example: ###

**Sheet: `Planets`**

Name | ATT_Orbit | Description
---- | --------- | -----------
Earth | 1 AU | A pale blue dot suspended in a sunbeam.
!-- | This is an XML comment! |
Mars | 1.52 AU | A red mote glittering in the dark

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
