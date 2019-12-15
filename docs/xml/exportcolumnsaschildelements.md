---
layout: docs
title: Export Columns as Child Elements
description: Documentation for Export Sheet Data's 'Export columns as child elements' option.
group: xml
---

Export columns as child elements
--------------------------------

Force cells to be exported as child elements of their row element instead of attributes.

### Example: ###

**Sheet name: `Arrows`**

Type | Damage | Effect
---- | ------ | ------
Normal | 1 | None
Fire | 3 | Burn
Ice | 2 | Freeze
Light | 5 | Flare

*Default Output:*
```
<data>
  <Arrows>
    <Normal Damage="1" Effect="None"/>
    <Fire Damage="3" Effect="Burn"/>
    <Ice Damage="2" Effect="Freeze"/>
    <Light Damage="5" Effect="Flare"/>
  </Arrows>
</data>
```

*Child Elements Output:*
```
<data>
  <Arrows>
    <Normal>
      <Damage>1</Damage>
      <Effect>None</Effect>
    </Normal>
    <Fire>
      <Damage>3</Damage>
      <Effect>Burn</Effect>
    </Fire>
    <Ice>
      <Damage>2</Damage>
      <Effect>Freeze</Effect>
    </Ice>
    <Light>
      <Damage>5</Damage>
      <Effect>Flare</Effect>
    </Light>
  </Arrows>
</data>
```
