Null value format
-----------------
Value exported for cells containing the string "null".

Null will export cells with a standard JSON `null` value while String will export a string `"null"`.

### Example: ###

**Sheet name: `Test`**

ID | Value
-- | -----
Null Value | null

*Null Output:*
```json
{
  "Test": {
    "Null Value": null
  }
}
```

*String Output:*
```json

{
  "Test": {
    "Null Value": "null"
  }
}
```
