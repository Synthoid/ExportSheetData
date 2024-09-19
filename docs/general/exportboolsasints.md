Export bools as ints
--------------------
Export boolean values as integers. This is commonly done to reduce file size as number values like `1` and `0` are much smaller than boolean values like `true` or `false`.

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

*Default Outputs:*

JSON:
```json
{
  "Planets": {
    "Earth": {
      "Habitable": true
    },
    "Venus": {
      "Habitable": false
    }
  }
}
```
XML:
```xml
<data>
  <Planets>
    <Earth Habitable="true" />
    <Venus Habitable="false" />
  </Planets>
</data>
```

*Export bools as ints Outputs:*

JSON:
```json
{
  "Planets": {
    "Earth": {
      "Habitable": 1
    },
    "Venus": {
      "Habitable": 0
    }
  }
}
```
XML:
```xml
<data>
  <Planets>
    <Earth Habitable="1" />
    <Venus Habitable="0" />
  </Planets>
</data>
```
