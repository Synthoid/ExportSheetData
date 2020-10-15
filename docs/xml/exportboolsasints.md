---
layout: docs
title: Export Bools As Ints
description: Documentation for Export Sheet Data's 'Export bools as ints' option.
group: xml
---

Export bools as ints
-----------------
Export boolean values as integers. This is commonly done in XML to reduce file size as number values like `1` and `0` are much smaller than boolean values like `true` or `false`.

This will have the following conversions:

Boolean | Integer
------- | -------
true | 1
false | 0

### Example: ###

**Sheet: `Planets`**

Name | Habitable
---- | ---------
Earth | true
Venus | false

*Default Output:*
```
<data>
  <Planets>
    <Earth Habitable="true" />
    <Venus Habitable="false" />
  </Planets>
</data>
```

*With "Export bools as ints" enabled*
```
<data>
  <Planets>
    <Earth Habitable="1" />
    <Venus Habitable="0" />
  </Planets>
</data>
```
