Don't format illegal characters
-------------------------------
Don't convert [XML illegal characters](https://technet.microsoft.com/en-us/library/ms145315(v=sql.90).aspx) to their XML safe encodings.

By default, all XML exported by ESD is formatted for proper XML use. This means that certain characters are replaced with their XML safe encoding.

> [!NOTE]
> Keys are always encoded.

The affected characters and their XML safe encodings are:

Character | Encoded Value
--------- | -------------
`<` | `&lt;`
`>` | `&gt;`
`'` | `&apos;`
`"` | `&quot;`
`&` | `&amp;`
