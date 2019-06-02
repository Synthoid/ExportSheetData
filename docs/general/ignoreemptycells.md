---
layout: docs
title: Ignore Empty Cells
description: Documentation for Export Sheet Data's 'Ignore empty cells' option.
group: general
---

Ignore empty cells
------------------
Prevent cells with empty values from being exported.

This is useful for reducing file size and clutter by removing elements with no value.

### Example: ###

**Sheet name: `Flame Pokemon`**

Name | Type1 | Type2
---- | ----- | -----
Charmander | Fire | 
Charmeleon | Fire | 
Charizard | Fire | Flying
  
*Default Outputs:*
  
JSON:
```
{
  "Flame Pokemon" : {
    "Charmander" : {
      "Name":"Charmander",
      "Type1":"Fire",
      "Type2":null
    },
    "Charmeleon" : {
      "Name":"Charmeleon",
      "Type1":"Fire",
      "Type2":null
    },
    "Charizard" : {
      "Name":"Charizard",
      "Type1":"Fire",
      "Type2":"Flying"
    }
  }
}
```
XML:
```
<pokedex>
  <Flame_Pokemon>
    <Charmander>
      <Type1>Fire</Type1>
      <Type2></Type2>
    </Charmander>
    <Charmeleon>
      <Type1>Fire</Type1>
      <Type2></Type2>
    </Charmeleon>
    <Charizard>
      <Type1>Fire</Type1>
      <Type2>Flying</Type2>
    </Charizard>
  </Flame_Pokemon>
</pokedex>
```

*Ignore Outputs:*

JSON:
```
{
  "Flame Pokemon" : {
    "Charmander" : {
      "Name":"Charmander",
      "Type1":"Fire"
    },
    "Charmeleon" : {
      "Name":"Charmeleon",
      "Type1":"Fire"
    },
    "Charizard" : {
      "Name":"Charizard",
      "Type1":"Fire",
      "Type2":"Flying"
    }
  }
}
```
XML:
```
<pokedex>
  <Flame_Pokemon>
    <Charmander>
      <Type1>Fire</Type1>
    </Charmander>
    <Charmeleon>
      <Type1>Fire</Type1>
    </Charmeleon>
    <Charizard>
      <Type1>Fire</Type1>
      <Type2>Flying</Type2>
    </Charizard>
  </Flame_Pokemon>
</pokedex>
```
