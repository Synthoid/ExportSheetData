Child elements prefix
---------------------
Force columns with keys using the specified prefix to export as child elements of their row's XML element.

Default value: `CE_` (short for "**C**hild **E**lement")

### Example: ###

**Sheet name: `Planets`**

Name | Orbit | CE_Description
---- | ----- | --------------
Earth | 1 AU | A pale blue dot suspended in a sunbeam.

*Default Output:*
```xml
<data>
  <Planets>
    <Earth Orbit="1 AU" CE_Descripition="A pale blue dot suspended in a sunbeam." />
  </Planets>
</data>
```

*With "Child elements prefix" enabled:*
```xml
<data>
  <Planets>
    <Earth Orbit="1 AU">
      <Description>A pale blue dot suspended in a sunbeam.</Description>
    </Earth>
  </Planets>
</data>
```
