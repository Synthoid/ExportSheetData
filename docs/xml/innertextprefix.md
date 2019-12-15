---
layout: docs
title: Inner Text Prefix
description: Documentation for Export Sheet Data's 'Inner text prefix' option.
group: xml
---

Inner text prefix
-----------------
Force columns with keys using the specified prefix to export as inner text for their row's XML element.

Default value: `IT_` (short for "**I**nner **T**ext")

### Example: ###

**Sheet name: `Planets`**

Name | Orbit | IT_Description
---- | ----- | --------------
Earth | 1 AU | A pale blue dot suspended in a sunbeam.

*Default Output:*
```
<data>
  <Planets>
    <Earth Orbit="1 AU" IT_Descripition="A pale blue dot suspended in a sunbeam." />
  </Planets>
</data>
```

*With "Inner text prefix" enabled:*
```
<data>
  <Planets>
    <Earth Orbit="1 AU">
      A pale blue dot suspended in a sunbeam.
    </Earth>
  </Planets>
</data>
```
