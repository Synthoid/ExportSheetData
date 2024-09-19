Collapse single row sheets
-------------
Remove the wrapping element of a sheet that has only one row (not including the keys row).

This is similar to [unwrapping single row sheets](unwrapsinglerowsheets.md) but does not place sheet fields in the root JSON or XML element directly.

### Example: ###

**Sheet name: `Character`**

Name | Age | Role
---- | --- | ----
Cid | 25 | Fighter

*Default Output:*

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
      <Age>25</Age>
      <Role>Fighter</Role>
    </Cid>
  </Character>
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
    <Age>25</Age>
    <Role>Fighter</Role>
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
    <Age>25</Age>
    <Role>Fighter</Role>
  </Cid>
</data>
```
