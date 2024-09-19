Force string values
-------------------
Force all data values to export as a string.

> [!NOTE]
> `null` values will remain standard `null` values. They will not be converted to `"null"`. See [Null value format](nullvalueformat.md) and [Empty value format](emptyvalueformat.md) for more information on null and empty values.

### Example: ###

**Sheet name: `Heroes`**

Name | Human | Age | Superpower
---- | ----- | --- | ----------
Batman | true | 30 | 

*Default Output:*
```json
{
  "Heroes": {
    "Batman": {
      "Name": "Batman",
      "Human": true,
      "Age": 30,
      "Superpower": null
    }
  }
}
```

*Force String Output:*
```json
{
  "Heroes": {
    "Batman": {
      "Name": "Batman",
      "Human": "true",
      "Age": "30",
      "Superpower": null
    }
  }
}
```
