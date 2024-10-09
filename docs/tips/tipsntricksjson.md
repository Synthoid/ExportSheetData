JSON Tips & Tricks
------------------
This section covers how to use some more obscure and esoteric JSON functionality in ESD. These tips only apply when targeting the JSON export format.

Escaping Array Content
----------------------
When [exporting cell arrays](../json/exportcellarrays.md), array values are converted to their native formats. Content can be escaped by wrapping values in double quotes ( `"` ). Escaped content will be exported as a single string value, regardless of original value type, and will treat separator chars as ordinary string characters.

> [!NOTE]
> To include double quotes in escaped content, place a backslash ( `\` ) in front of them.

A cell with the following value:

```
Test, 2test, false, 128, 1963/10/31, "Test3, \"test4\"", "true", "256", "1978/10/31"
```

Would export the following array:

```json
[
    "Test",
    "2test",
    false,
    128,
    "1963-10-31T05:00:00.000Z",
    "Test3, \"test4\"",
    "true",
    "256",
    "1978/10/31"
]
```

Note that the values in first half of the array have been converted into their native formats, including booleans, numbers, and dates. The second half are escapped and all exported as standard strings.