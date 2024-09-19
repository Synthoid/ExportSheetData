Export cell arrays
------------------
Export a cell's value as a JSON array if the cell contains commas (`,`), or whatever separator char is specified by [Array separator character](arrayseparatorcharacter.md).

Each value in the generated array will be converted into it's parsed type. For example: `Test,1,false` will export as `[ "Test", 1, false ]`

> [!TIP]
> To prevent data containing a comma from being exported as separate array elements, wrap your value with quotation marks (`""`).

### Example: ###

**Sheet name: `Spies`**

Name | Age | Aliases
---- | --- | -------
Sterling | 42 | Duchess, Randy, "Sterling Archer, world's greatest spy"
Kane | 32 | ,
Figgis | 45 | 
Dylan | 36 | "Other" Barry,

*Default Output:*
```json
{
  "Spies": {
    "Sterling": {
      "Age": 42,
      "Aliases": "Duchess, Randy, \"Sterling Archer, world's greatest spy\""
    },
    "Kane": {
      "Age": 32,
      "Aliases": ","
    },
    "Figgis": {
      "Age": 45,
      "Aliases": null
    },
    "Dylan": {
      "Age": 36,
      "Aliases": "\"Other\" Barry,"
    }
  }
}
```

*Cell Array Output:*
```json
{
  "Spies": {
    "Sterling": {
      "Age": 42,
      "Aliases": [
        "Duchess",
        "Randy",
        "Sterling Archer, world's greatest spy"
      ]
    },
    "Kane" : {
      "Age": 32,
      "Aliases": []
    },
    "Figgis": {
      "Age": 45,
      "Aliases": null
    },
    "Dylan": {
      "Age": 36,
      "Aliases": [
        "\"Other\" Barry"
      ]
    }
  }
}
```
