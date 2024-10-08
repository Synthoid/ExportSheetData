Export sheet arrays
-------------------
Export sheet arrays will export sheets as JSON arrays with each row creating an element in the array.

> [!NOTE]
> This setting will force the first column to be included in each row's object.

### Example: ###

**Sheet name: `Companies`**

Name | Console
---- | -------
Microsoft | Xbox Series X
Nintendo | Switch
Sony | Playstation 5

*Default Output:*
```json
{
  "Companies": {
    "Microsoft": {
      "Console": "Xbox Series X"
    },
    "Nintendo": {
      "Console": "Switch"
    },
    "Sony": {
      "Console": "Playstation 5"
    }
  }
}
```

*Sheet Array Output:*
```json
{
  "Companies": [
    {
      "Name": "Microsoft",
      "Console": "Xbox Series X"
    },
    {
      "Name": "Nintendo",
      "Console": "Switch"
    },
    {
      "Name": "Sony",
      "Console": "Playstation 5"
    }
  ]
}
```
