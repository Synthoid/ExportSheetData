---
layout: docs
title: Array Prefix
description: Documentation for Export Sheet Data's 'Array prefix' option.
group: json
---

Array prefix
------------
Converts columns or sheets using the given prefix into JSON arrays. When enabled, the prefix is stripped from the output keys. (So the field `JA_Effects` will export as `Effects`)

<b>Keys starting with this string will force all cells in the column to be exported as JSON arrays.</b>

This is useful when you may have certain cells with only one value, but you are expecting the element to be a JSON array.

### Example: ###

**Sheet name: `Spells`**

Spell | Description | JA_Effects
----- | ----------- | -------
Cold Touch | Deal frost damage to enemies in melee range. | Freeze
Fireball | Casts a fireball that can reach ranged enemies. | Burn
Frostfire | Creates an explosion of cold fire affecting everyone around you. | Burn, Freeze

*Default Output:*

```
{
  "Spells": {
    "Cold Touch": {
      "Spell": "Cold Touch",
      "Description": "Deal frost damage to enemies in melee range.",
      "JA_Effects": "Freeze"
    },
    "Fireball": {
      "Spell": "Fireball",
      "Description": "Casts a fireball that can reach ranged enemies.",
      "JA_Effects": "Burn"
    },
    "Frostfire": {
      "Spell": "Frostfire",
      "Description": "Creates an explosion of cold fire affecting everyone around you.",
      "JA_Effects": "Burn, Freeze"
    }
  }
}
```

*Array Prefix Output:*

```
{
  "Spells": {
    "Cold Touch": {
      "Spell": "Cold Touch",
      "Description": "Deal frost damage to enemies in melee range.",
      "Effects": [
        "Freeze"
      ]
    },
    "Fireball": {
      "Spell": "Fireball",
      "Description": "Casts a fireball that can reach ranged enemies.",
      "Effects": [
        "Burn"
      ]
    },
    "Frostfire": {
      "Spell": "Frostfire",
      "Description": "Creates an explosion of cold fire affecting everyone around you.",
      "Effects": [
        "Burn",
        "Freeze"
      ]
    }
  }
}
```

<b>Sheet tabs starting with this string will be exported as a JSON array.</b>

This is useful when you want some sheets to export as JSON arrays while others export as regular JSON blobs.

### Example: ###

**Sheetname: JA_Spells**

Spell | Description | JA_Effects
----- | ----------- | -------
Cold Touch | Deal frost damage to enemies in melee range. | Freeze
Fireball | Casts a fireball that can reach ranged enemies. | Burn
Frostfire | Creates an explosion of cold fire affecting everyone around you. | Burn, Freeze

*Default Output:*

```
{
  "JA_Spells": {
    "Cold Touch": {
      "Spell": "Cold Touch",
      "Description": "Deal frost damage to enemies in melee range.",
      "JA_Effects": "Freeze"
    },
    "Fireball": {
      "Spell": "Fireball",
      "Description": "Casts a fireball that can reach ranged enemies.",
      "JA_Effects": "Burn"
    },
    "Frostfire": {
      "Spell": "Frostfire",
      "Description": "Creates an explosion of cold fire affecting everyone around you.",
      "JA_Effects": "Burn, Freeze"
    }
  }
}
```

*Array Prefix Output:*

```
{
  "Spells": [
    {
      "Spell": "Cold Touch",
      "Description": "Deal frost damage to enemies in melee range.",
      "Effects": [
        "Freeze"
      ]
    },
    {
      "Spell": "Fireball",
      "Description": "Casts a fireball that can reach ranged enemies.",
      "Effects": [
        "Burn"
      ]
    },
    {
      "Spell": "Frostfire",
      "Description": "Creates an explosion of cold fire affecting everyone around you.",
      "Effects": [
        "Burn",
        "Freeze"
      ]
    }
  ]
}
```
