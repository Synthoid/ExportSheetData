---
layout: docs
title: Unwrap Sheet Prefix
description: Documentation for Export Sheet Data's 'Unwrap sheet prefix' option.
group: general
---

Unwrap sheet prefix
-------------------
Sheets with names prefaced with the unwrap prefix value will be unwrapped.

By default, the unwrap prefix is `US_` (short for "**U**nwrap **S**heet"). If the unwrap prefix has been enabled but no prefix string has been set, the default prefix value (`US_`) will be used.

Unlike the [Unwrap single row sheets](unwrapsinglerowsheets.md) option, it is possible to unwrap a sheet with more than one row of data using the unwrap prefix.

<img src="../../images/esd_icon.svg" width="32px" height="32px"/> **General Note:**
- When exporting only the [current sheet](../format/exportsheets.md), the exported data is automatically unwrapped.

### Example: ###

**Sheet name: `US_Planets`**

Name | Orbit Index
---- | -----------
Mercury | 1
Venus | 2
Earth | 3
Mars | 4
Jupiter | 5
Saturn | 6
Uranus | 7
Neptune | 8

*Default Output:*

JSON:
```
{
  "US_Planets": {
    "Mercury": {
      "Orbit Index": 1
    },
    "Venus": {
      "Orbit Index": 2
    },
    "Earth": {
      "Orbit Index": 3
    },
    "Mars": {
      "Orbit Index": 4
    },
    "Jupiter": {
      "Orbit Index": 5
    },
    "Saturn": {
      "Orbit Index": 6
    },
    "Uranus": {
      "Orbit Index": 7
    },
    "Neptune": {
      "Orbit Index": 8
    }
  }
}
```
XML:
```
<data>
  <US_Planets>
    <Mercury Orbit_Index="1" />
    <Venus Orbit_Index="2" />
    <Earth Orbit_Index="3" />
    <Mars Orbit_Index="4" />
    <Jupiter Orbit_Index="5" />
    <Saturn Orbit_Index="6" />
    <Uranus Orbit_Index="7" />
    <Neptune Orbit_Index="8" />
  </US_Planets>
</data>
```

*Unwrapped Output:*

JSON:
```
{
  "Mercury": {
    "Orbit Index": 1
  },
  "Venus": {
    "Orbit Index": 2
  },
  "Earth": {
    "Orbit Index": 3
  },
  "Mars": {
    "Orbit Index": 4
  },
  "Jupiter": {
    "Orbit Index": 5
  },
  "Saturn": {
    "Orbit Index": 6
  },
  "Uranus": {
    "Orbit Index": 7
  },
  "Neptune": {
    "Orbit Index": 8
  }
}
```
XML:
```
<data>
  <Mercury Orbit_Index="1" />
  <Venus Orbit_Index="2" />
  <Earth Orbit_Index="3" />
  <Mars Orbit_Index="4" />
  <Jupiter Orbit_Index="5" />
  <Saturn Orbit_Index="6" />
  <Uranus Orbit_Index="7" />
  <Neptune Orbit_Index="8" />
</data>
```

See also
---------
- [Unwrap single row sheets](unwrapsinglerowsheets.md)
- [Collapse sheet prefix](collapseprefix.md)
