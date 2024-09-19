Nested array prefix
-------------------
When the [Nested Elements](../general/nestedelements.md) option is enabled, sheet tabs starting with this string will force the sheet to be exported as a nested element array.

This is basically shorthand for prefacing all keys in a sheet with `{#SHEET}{#ROW}`.

### Example: ###

**Sheet name: `NA_Sample`**

ID | Element | [Effects]{#1}Name | [Effects]{#1}Type | [Effects]{#2}Name	| [Effects]{#2}Type
--- | --- | --- | --- | --- | ---
1	| Water |	Quench | Heal | Extinguish | Heal
2	| Fire | Burn | Damage | | 

*Output:*
```json
{
  "Sample": [
    {
      "ID": 1,
      "Element": "Water",
      "Effects": [
        {
          "Name": "Quench",
          "Type": "Heal"
        },
        {
          "Name": "Extinguish",
          "Type": "Heal"
        }
      ]
    },
    {
      "ID": 2,
      "Element": "Fire",
      "Effects": [
        {
          "Name": "Burn",
          "Type": "Damage"
        }
      ]
    }
  ]
}
```

The nested array prefix is shorthand for exporting a sheet as an array with `{#SHEET}{#ROW}` key paths. This lets you avoid prefacing every key with `{#SHEET}{#ROW}` and will automatically export a sheet as an array. The above sheet with the nested array prefix enabled produces the same result as the sheet below with [Export sheet arrays](exportsheetarrays.md) enabled.

**Sheet name: `Sample`**

{#SHEET}{#ROW}ID | {#SHEET}{#ROW}Element | {#SHEET}{#ROW}[Effects]{#1}Name | {#SHEET}{#ROW}[Effects]{#1}Type | {#SHEET}{#ROW}[Effects]{#2}Name	| {#SHEET}{#ROW}[Effects]{#2}Type
--- | --- | --- | --- | --- | ---
1	| Water |	Quench | Heal | Extinguish | Heal
2	| Fire | Burn | Damage | | 
