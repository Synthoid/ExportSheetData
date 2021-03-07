---
layout: docs
title: Export Cell Objects
description: Documentation for Export Sheet Data's 'Export cell objects' option.
group: json
---

Export cell objects
-------------------
Export cells that begin with an open brace (`{`) and end with a close brace (`}`) as a JSON object. You can also export cells that begin with an open bracket (`[`) and end with a close bracket (`]`) as a JSON array. This allows you to pack JSON data into a single cell and export it as a JSON object or array.

***Note: If your cell value is not properly formatted for JSON, an empty JSON object (`{}`) or array (`[]`) will be exported instead.***

### Example: ###

**Sheet name: `Items`**

ID | Object | Array
-- | ----- | -----
Sword | {"Price":10} | [{"Price":10},{"Price":15},[{"Price":10},{"Price":15}]]
Sword (Fail 01) | {"Price":te} | [{"Price":t10},[{"Price":10},{"Price":15}]]
Sword (Fail 02) | {"Price":nul"} | [{"Price":10},{"Price":15},[{"Price":nul}]]

*Default Output:*
```json
{
  "Items": {
    "Sword": {
      "Object": "{\"Price\":10}",
      "Array": "[{\"Price\":10},{\"Price\":15},[{\"Price\":10},{\"Price\":15}]]"
    },
    "Sword (Fail 01)": {
      "Object": "{\"Price\":te}",
      "Array": "[{\"Price\":t10},[{\"Price\":10},{\"Price\":15}]]"
    },
    "Sword (Fail 02)": {
      "Object": "{\"Price\":nul\"}",
      "Array": "[{\"Price\":10},{\"Price\":15},[{\"Price\":nul}]]"
    }
  }
}
```

*Export cell objects Output:*
```json
{
  "Items": {
    "Sword": {
      "Object": {
        "Price": 10
      },
      "Array": [
        {
          "Price": 10
        },
        {
          "Price": 15
        },
        [
          {
            "Price": 10
          },
          {
            "Price": 15
          }
        ]
      ]
    },
    "Sword (Fail 01)": {
      "Object": {},
      "Array": []
    },
    "Sword (Fail 02)": {
      "Object": {},
      "Array": []
    }
  }
}
```

Note that the two fail elements have empty object and array values. This is because their object and array values were not correctly formatted JSON, so empty values were used as a safe fallback.
