---
layout: docs
title: Ignore Prefix
description: Documentation for Export Sheet Data's 'Ignore prefix' option.
group: general
---

Ignore prefix
-------------
Ignore prefix allows you to manually specify columns to ignore when exporting data. Keys starting with the specified string will be ignored.

By default, the ignore prefix is `NOEX_` (short for "NO EXport"). If the ignore prefix has been enabled but no prefix string has been set, the default ignore prefix (`NOEX_`) will be used.

### Example: ###

**Sheet name: `Monsters`**

Name | HP | MP | STR | CHR | INT | Special | NOEX_Notes
---- | -- | -- | --- | --- | --- | ------- | ----------
Gorgon |	64	| 50	| 13	| 15	| 14	| 10% chance to petrify. | https://en.wikipedia.org/wiki/Gorgon
Centaur |	15	| 25	| 15	| 7	| 13	| 5% chance to crit.	
Dragon	| 100	| 200	| 20	| 15	| 20	| 40% resist magic.	| Gary says this is too powerful. Reduce by 20%?
Wraith	| 2	| 10 |	5 |	3	| 4	| Immune to phyiscal attacks.	

*Default Outputs:*

JSON:
```
{
  "Monsters": {
    "Gorgon": {
      "Name": "Gorgon",
      "HP": 64,
      "MP": 50,
      "STR": 13,
      "CHR": 15,
      "INT": 14,
      "Special": "10% chance to petrify.",
      "NOEX_Notes": "https://en.wikipedia.org/wiki/Gorgon"
    },
    "Centaur": {
      "Name": "Centaur",
      "HP": 15,
      "MP": 25,
      "STR": 15,
      "CHR": 7,
      "INT": 13,
      "Special": "5% chance to crit.",
      "NOEX_Notes": null
    },
    "Dragon": {
      "Name": "Dragon",
      "HP": 100,
      "MP": 200,
      "STR": 20,
      "CHR": 15,
      "INT": 20,
      "Special": "40% resist magic.",
      "NOEX_Notes": "Gary says this is too powerful. Reduce by 20%?"
    },
    "Wraith": {
      "Name": "Wraith",
      "HP": 2,
      "MP": 10,
      "STR": 5,
      "CHR": 3,
      "INT": 4,
      "Special": "Immune to phyiscal attacks.",
      "NOEX_Notes": null
    }
  }
}
```

XML:
```
<data>
  <Monsters>
    <Gorgon>
      <HP>64</HP>
      <MP>50</MP>
      <STR>13</STR>
      <CHR>15</CHR>
      <INT>14</INT>
      <Special>10% chance to petrify.</Special>
      <NOEX_Notes>https://en.wikipedia.org/wiki/Gorgon</NOEX_Notes>
    </Gorgon>
    <Centaur>
      <HP>15</HP>
      <MP>25</MP>
      <STR>15</STR>
      <CHR>7</CHR>
      <INT>13</INT>
      <Special>5% chance to crit.</Special>
      <NOEX_Notes />
    </Centaur>
    <Dragon>
      <HP>100</HP>
      <MP>200</MP>
      <STR>20</STR>
      <CHR>15</CHR>
      <INT>20</INT>
      <Special>40% resist magic.</Special>
      <NOEX_Notes>Gary says this is too powerful. Reduce by 20%?</NOEX_Notes>
    </Dragon>
    <Wraith>
      <HP>2</HP>
      <MP>10</MP>
      <STR>5</STR>
      <CHR>3</CHR>
      <INT>4</INT>
      <Special>Immune to phyiscal attacks.</Special>
      <NOEX_Notes />
    </Wraith>
  </Monsters>
</data>

```

*Ignore Prefix Outputs:*

JSON:
```
{
  "Monsters": {
    "Gorgon": {
      "Name": "Gorgon",
      "HP": 64,
      "MP": 50,
      "STR": 13,
      "CHR": 15,
      "INT": 14,
      "Special": "10% chance to petrify."
    },
    "Centaur": {
      "Name": "Centaur",
      "HP": 15,
      "MP": 25,
      "STR": 15,
      "CHR": 7,
      "INT": 13,
      "Special": "5% chance to crit."
    },
    "Dragon": {
      "Name": "Dragon",
      "HP": 100,
      "MP": 200,
      "STR": 20,
      "CHR": 15,
      "INT": 20,
      "Special": "40% resist magic."
    },
    "Wraith": {
      "Name": "Wraith",
      "HP": 2,
      "MP": 10,
      "STR": 5,
      "CHR": 3,
      "INT": 4,
      "Special": "Immune to phyiscal attacks."
    }
  }
}
```

XML:
```
<data>
  <Monsters>
    <Gorgon>
      <HP>64</HP>
      <MP>50</MP>
      <STR>13</STR>
      <CHR>15</CHR>
      <INT>14</INT>
      <Special>10% chance to petrify.</Special>
    </Gorgon>
    <Centaur>
      <HP>15</HP>
      <MP>25</MP>
      <STR>15</STR>
      <CHR>7</CHR>
      <INT>13</INT>
      <Special>5% chance to crit.</Special>
    </Centaur>
    <Dragon>
      <HP>100</HP>
      <MP>200</MP>
      <STR>20</STR>
      <CHR>15</CHR>
      <INT>20</INT>
      <Special>40% resist magic.</Special>
    </Dragon>
    <Wraith>
      <HP>2</HP>
      <MP>10</MP>
      <STR>5</STR>
      <CHR>3</CHR>
      <INT>4</INT>
      <Special>Immune to phyiscal attacks.</Special>
    </Wraith>
  </Monsters>
</data>
```
