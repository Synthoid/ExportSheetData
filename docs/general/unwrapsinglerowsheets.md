Unwrap single row sheets
-------------
Unwrap single row sheets will remove the wrapping element of a sheet that has only one row (not including the keys row).

This can be useful when you want certain data to be in the root element of your exported data.


This is similar to [collapsing single row sheets](collapsesinglerowsheets.md) but places sheet fields in the root JSON or XML element directly.

### Example: ###

**Sheet name: `Character`**

Name | Age | Role
---- | --- | ----
Cid | 25 | Fighter

*Default Outputs:*

JSON:
```json
{
  "Character" : {
    "Cid" : {
      "Name":"Cid",
      "Age":25,
      "Role":"Fighter"
    }
  }
}
```
XML:
```xml
<data>
  <Character>
    <Cid>
      <Name>Cid</Name>
      <Age>25</Age>
      <Role>Fighter</Role>
    </Cid>
  </Character>
</data>
```

*Unwrapped Output:*

JSON:
```json
{
  "Name":"Cid",
  "Age":25,
  "Role":"Fighter"
}
```
XML:
```xml
<data>
  <Cid>
    <Name>Cid</Name>
    <Age>25</Age>
    <Role>Fighter</Role>
  </Cid>
</data>
```

*Collapsed Output:*

JSON:
```json
{
  "Character" : {
    "Name":"Cid",
    "Age":25,
    "Role":"Fighter"
  }
}
```
XML:
```xml
<data>
  <Character>
    <Name>Cid</Name>
    <Age>25</Age>
    <Role>Fighter</Role>
  </Character>
</data>
```
