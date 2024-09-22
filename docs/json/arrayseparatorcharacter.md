Array separator character
-------------------------
This is the character used to separate values when determining if a cell should be exported as a [JSON array](exportcellarrays.md).

The default value for this character is a comma (`,`). If no value is set, the default character (`,`) will be used to determine array separation.

### Example: ###

**Sheet name: `Tunics`**

Tunic | Properties
----- | ----------
Green | ,
Red | Heat Resistance, Double Damage Dealt
Blue | Water Breathing : Half Damage Received

*Comma (`,`) Output:*
```json
{
  "Green": {
    "Tunic": "Green",
    "Properties": []
  },
  "Red": {
    "Tunic": "Red",
    "Properties": [
      "Heat Resistance",
      "Double Damage Dealt"
    ]
  },
  "Blue": {
    "Tunic": "Blue",
    "Properties": "Water Breathing : Half Damage Received"
  }
}
```

*Colon (`:`) Output:*
```json
{
  "Green": {
    "Tunic": "Green",
    "Properties": ","
  },
  "Red": {
    "Tunic": "Red",
    "Properties": "Heat Resistance, Double Damage Dealt"
  },
  "Blue": {
    "Tunic": "Blue",
    "Properties": [
      "Water Breathing",
      "Half Damage Received"
    ]
  }
}
```
