Namespaces
----------
Namespaces used for the exported XML's elements. Attributes and elements can be declared with a namespace by using a name prefix. For example: `ss:Type`, `x:Width`, `mx:Platform`, ect. To add a namespace, click the `+` button next to the Namespaces label. To remove a namespace, click the `-` button next to the namespace's prefix label.

There are two values associated with a namespace:
 - `Prefix`
    - The actual prefix used in element names.
 - `URI`
    - Unique string for the namespace. This is commonly a URL or URN, but can really be any unique string. See [External Resources](#external-resources) for more.

These are defined via `xmlns:prefix` attributes in the document's root element.

**NOTES:** 
  - Prefixes are case sensitive. `sA:test` will not recognize a namespace with the prefix `sa`.
  - When using namespaces in conjuction with prefix options like [Attributes prefix](attributesprefix.md), ESD prefixes must come *after* the namespace prefix.
    - &#9989; Good
      - `x:ATT_value`
    - &#10060; Bad
      - `ATT_x:value`

### Example: ###

**Sheet: `SheetPrograms`**

Name | Company | ss:ID
---- | ------- | -----
sm:Excel | Microsoft | MS
sg:Sheets | Google | G
sa:Numbers | Apple | A

*No namespaces set:*
```xml
<data>
  <SheetPrograms>
    <sm_Excel Company="Microsoft" ss_ID="MS" />
    <sg_Sheets Company="Google" ss_ID="G" />
    <sa_Numbers Company="Apple" ss_ID="A" />
  </SheetPrograms>
</data>
```

> [!NOTE]
> Colons (`:`) have been replaced with underscores (`_`) in this export, as colons are not valid XML tag characters unless they are used for namespaces.

*Various namespaces set:*
```xml
<data xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:sa="https://www.apple.com" xmlns:sg="https://www.google.com" xmlns:sm="https://www.microsoft.com">
  <SheetPrograms>
    <sm:Excel Company="Microsoft" ss:ID="MS" />
    <sg:Sheets Company="Google" ss:ID="G" />
    <sa:Numbers Company="Apple" ss:ID="A" />
  </SheetPrograms>
</data>
```

As a sidenote, you can use namespaces with or without a [root namespace](rootnamespaceuri.md) for the XML document. The above examples do not include a root namespace for simplicity, but it could be included if desired:
```xml
<data xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:sa="https://www.apple.com" xmlns:sg="https://www.google.com" xmlns:sm="https://www.microsoft.com">
  <SheetPrograms>
    <sm:Excel Company="Microsoft" ss:ID="MS" />
    <sg:Sheets Company="Google" ss:ID="G" />
    <sa:Numbers Company="Apple" ss:ID="A" />
  </SheetPrograms>
</data>
```

See also
--------
 - [Root namespace URI](rootnamespaceuri.md)
 
External resources
------------------
For more information on XML namespaces, check out [w3schools' page on the subject](https://www.w3schools.com/xml/xml_namespaces.asp).
