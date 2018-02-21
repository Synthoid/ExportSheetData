---
layout: docs
title: Include First Column in Export
description: Documentation for Export Sheet Data's 'Include first column in export' option.
group: xml
---

Include first column in export
------------------------------
Include the first column of each row as an XML element in addition to it being used for the name of the row element.

By default, the first column of a row is not exported as a distinct XML element as it is used to name the row XML element. Enabling this will cause the first column to be exported as both the name of the row's element as well as its own distinct element like the other columns in a row.

<b>Example:</b>

Sheet: `Seasons`<br>
Fields: `Name | Temperature`<br>
Values: `Spring | Warm`<br>
`Summer | Hot`<br>
`Fall | Cool`<br>
`Winter | Cold`

Default Output:
```
<data>
  <Seasons>
    <Spring Temperature="Warm"/>
    <Summer Temperature="Hot"/>
    <Fall Temperature="Cool"/>
    <Winter Temperature="Cold"/>
  </Seasons>
</data>
```

Include First Column Output:
```
<data>
  <Seasons>
    <Spring Name="Spring" Temperature="Warm"/>
    <Summer Name="Summer" Temperature="Hot"/>
    <Fall Name="Fall" Temperature="Cool"/>
    <Winter Name="Winter" Temperature="Cold"/>
  </Seasons>
</data>
```
