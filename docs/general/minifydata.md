---
layout: docs
title: Minify Data
description: Documentation for Export Sheet Data's 'Minify data' option.
group: general
---

Minify Data
-----------
Removes human readability formatting from exported data to produce a smaller file. The data is exactly the same, just without indentation and formatting used to make it more easily readable by humans.

This is usually a good option to enable when exporting data that will only be read by parsers, not people.

### Example: ###

**Sheet name: `Pokemon`**

Name | Type1 | Type2 | Move1 | Move2 | Move3 | Move4
---- | ----- | ----- | ----- | ----- | ----- | -----
Bulbasaur | Grass | | Tackle | Growl | Leech Seed | Vine Whip
Ivysaur | Grass | Poison | Leech Seed | Vine Whip | Sleep Powder | Take Down
Venusaur | Grass | Poison | Leech Seed | Razor Leaf | Synthesis | Solar Beam



*Default Outputs:*

JSON:
```
{
  "Pokemon": [
    {
      "Name": "Bulbasaur",
      "Type1": "Grass",
      "Move1": "Tackle",
      "Move2": "Growl",
      "Move3": "Leech Seed",
      "Move4": "Vine Whip"
    },
    {
      "Name": "Ivysaur",
      "Type1": "Grass",
      "Type2": "Poison",
      "Move1": "Leech Seed",
      "Move2": "Vine Whip",
      "Move3": "Sleep Powder",
      "Move4": "Take Down"
    },
    {
      "Name": "Venusaur",
      "Type1": "Grass",
      "Type2": "Poison",
      "Move1": "Leech Seed",
      "Move2": "Razor Leaf",
      "Move3": "Synthesis",
      "Move4": "Solar Beam"
    }
  ]
}
```

XML:
```
<data>
  <Pokemon>
    <Bulbasaur>
      <Name>Bulbasaur</Name>
      <Type1>Grass</Type1>
      <Move1>Tackle</Move1>
      <Move2>Growl</Move2>
      <Move3>Leech Seed</Move3>
      <Move4>Vine Whip</Move4>
    </Bulbasaur>
    <Ivysaur>
      <Name>Ivysaur</Name>
      <Type1>Grass</Type1>
      <Type2>Poison</Type2>
      <Move1>Leech Seed</Move1>
      <Move2>Vine Whip</Move2>
      <Move3>Sleep Powder</Move3>
      <Move4>Take Down</Move4>
    </Ivysaur>
    <Venusaur>
      <Name>Venusaur</Name>
      <Type1>Grass</Type1>
      <Type2>Poison</Type2>
      <Move1>Leech Seed</Move1>
      <Move2>Razor Leaf</Move2>
      <Move3>Synthesis</Move3>
      <Move4>Solar Beam</Move4>
    </Venusaur>
  </Pokemon>
</data>
```

*Minify Outputs:*

JSON:
```
{"Pokemon":[{"Name":"Bulbasaur","Type1":"Grass","Move1":"Tackle","Move2":"Growl","Move3":"Leech Seed","Move4":"Vine Whip"},{"Name":"Ivysaur","Type1":"Grass","Type2":"Poison","Move1":"Leech Seed","Move2":"Vine Whip","Move3":"Sleep Powder","Move4":"Take Down"},{"Name":"Venusaur","Type1":"Grass","Type2":"Poison","Move1":"Leech Seed","Move2":"Razor Leaf","Move3":"Synthesis","Move4":"Solar Beam"}]}
```

XML:
```
<data><Pokemon><Bulbasaur><Name>Bulbasaur</Name><Type1>Grass</Type1><Move1>Tackle</Move1><Move2>Growl</Move2><Move3>Leech Seed</Move3><Move4>Vine Whip</Move4></Bulbasaur><Ivysaur><Name>Ivysaur</Name><Type1>Grass</Type1><Type2>Poison</Type2><Move1>Leech Seed</Move1><Move2>Vine Whip</Move2><Move3>Sleep Powder</Move3><Move4>Take Down</Move4></Ivysaur><Venusaur><Name>Venusaur</Name><Type1>Grass</Type1><Type2>Poison</Type2><Move1>Leech Seed</Move1><Move2>Razor Leaf</Move2><Move3>Synthesis</Move3><Move4>Solar Beam</Move4></Venusaur></Pokemon></data>
```
