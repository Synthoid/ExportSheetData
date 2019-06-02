---
layout: docs
title: Export Contents as Array
description: Documentation for Export Sheet Data's 'Export contents as array' option.
group: json
---

Export content as array
-----------------------
Converts exported JSON data from a standalone JSON object to a raw JSON array.

This produces JSON that does not function alone, but can be used in specific situations and workflows.

### Example: ###

**Sheet name: `Items`**

Item | Cost | Description
---- | ---- | -----------
Wooden Sword | 2 | A simple wooden sword. Guess you could hit people with it.
Iron Sword | 5 | A dull iron sword. More bat than blade honestly.
Diamond Shield | 1000 | Ha! You can only carry 999 monies!
Health Potion | 3 | Restores some health.

*Default Output:*

```
{
  "Items": {
    "Wooden Sword": {
      "Item": "Wooden Sword",
      "Cost": 2,
      "Description": "A simple wooden sword. Guess you could hit people with it."
    },
    "Iron Sword": {
      "Item": "Iron Sword",
      "Cost": 5,
      "Description": "A dull iron sword. More bat than blade honestly."
    },
    "Diamond Shield": {
      "Item": "Diamond Shield",
      "Cost": 1000,
      "Description": "Ha! You can only carry 999 monies!"
    },
    "Health Potion": {
      "Item": "Health Potion",
      "Cost": 3,
      "Description": "Restores some health."
    }
  }
}
```

*Export Contents As Array Output:*

```
[
  {
    "Wooden Sword": {
      "Item": "Wooden Sword",
      "Cost": 2,
      "Description": "A simple wooden sword. Guess you could hit people with it."
    },
    "Iron Sword": {
      "Item": "Iron Sword",
      "Cost": 5,
      "Description": "A dull iron sword. More bat than blade honestly."
    },
    "Diamond Shield": {
      "Item": "Diamond Shield",
      "Cost": 1000,
      "Description": "Ha! You can only carry 999 monies!"
    },
    "Health Potion": {
      "Item": "Health Potion",
      "Cost": 3,
      "Description": "Restores some health."
    }
  }
]
```

*Export Contents As Array Output (with [Select Sheets(s)](../format/selectsheets.md) set to `Current sheet only`):*

```
[
  {
    "Item": "Wooden Sword",
    "Cost": 2,
    "Description": "A simple wooden sword. Guess you could hit people with it."
  },
  {
    "Item": "Iron Sword",
    "Cost": 5,
    "Description": "A dull iron sword. More bat than blade honestly."
  },
  {
    "Item": "Diamond Shield",
    "Cost": 1000,
    "Description": "Ha! You can only carry 999 monies!"
  },
  {
    "Item": "Health Potion",
    "Cost": 3,
    "Description": "Restores some health."
  }
]
```
