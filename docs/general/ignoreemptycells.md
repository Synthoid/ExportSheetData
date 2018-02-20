---
layout: docs
title: Ignore Empty Cells
description: Documentation for Export Sheet Data's 'Ignore empty cells' option.
group: general
---

Ignore empty cells
------------------
Ignore empty cells will cause cells with empty values to not be exported.

This is useful for reducing file size and clutter by removing elements with no value.

Example:

Sheet: `Flame Pokemon`<br>
Fields: `Name | Type1 | Type2`<br>
Values: `Charmander | Fire | null`<br>
  `Charmeleon | Fire | null`<br>
  `Charizard | Fire | Flying`
  
  <b>Default Outputs:</b>
  
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
  
   <b>Ignore Outputs:</b>
  
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
