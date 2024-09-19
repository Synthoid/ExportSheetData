Export Sheet(s)
---------------

Export Sheet(s) is used to select the sheet tabs to export. This can be all sheets, the currently active sheet only, or a custom set of sheets.

### Example: ###

**Sheet name: `Planets`**

Name | Radius
---- | ------
Earth | 6371
Mars | 3389.5
Jupiter | 69911

**Sheet name: `Moons`**

Name | Planet | Radius
---- | ------ | ------
Moon | Earth | 1737.4
Phobos | Mars | 11
Io | Jupiter | 1821.6

*`All sheets` Output:*

JSON:
```json
{
  "Planets": {
    "Earth": {
      "Name": "Earth",
      "Radius": 6371
    },
    "Mars": {
      "Name": "Mars",
      "Radius": 3389.5
    },
    "Jupiter": {
      "Name": "Jupiter",
      "Radius": 69911
    }
  },
  "Moons": {
    "Moon": {
      "Name": "Moon",
      "Planet": "Earth",
      "Radius": 1737.4
    },
    "Phobos": {
      "Name": "Phobos",
      "Planet": "Mars",
      "Radius": 11
    },
    "Io": {
      "Name": "Io",
      "Planet": "Jupiter",
      "Radius": 1821.6
    }
  }
}
```

*`Current sheet only` Output (while viewing **Planets**):*

JSON:
```json
{
  "Earth": {
    "Name": "Earth",
    "Radius": 6371
  },
  "Mars": {
    "Name": "Mars",
    "Radius": 3389.5
  },
  "Jupiter": {
    "Name": "Jupiter",
    "Radius": 69911
  }
}
```

*`Custom` Output (with only **Planets** selected):*

JSON:
```json
{
  "Planets": {
    "Earth": {
      "Name": "Earth",
      "Radius": 6371
    },
    "Mars": {
      "Name": "Mars",
      "Radius": 3389.5
    },
    "Jupiter": {
      "Name": "Jupiter",
      "Radius": 69911
    }
  }
}
```
