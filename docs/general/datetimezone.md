Date Time Zone
--------------
Specifies the time zone used for formatted date-time values. This is based on the [SimpleDateFormat](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html#rfc822timezone) specification.

> [!NOTE]
> If no time zone is specified, a default value of `GMT` will be used.

### Example: ###

**Sheet name: `Games`**

Name | Release Date
---- | -------
OOT | 11/21/1998
MM | 4/27/2000

*Default Output:*

JSON:
```json
{
  "Games": [
    {
      "Name": "OOT",
      "Release Date": "1998-11-21T05:00:00.000Z"
    },
    {
      "Name": "MM",
      "Release Date": "2000-04-27T04:00:00.000Z"
    }
  ]
}
```

XML:
```xml
<Games>
  <OOT Release_Date="Sat Nov 21 1998 00:00:00 GMT-0500 (Eastern Standard Time)" />
  <MM Release_Date="Thu Apr 27 2000 00:00:00 GMT-0400 (Eastern Daylight Time)" />
</Games>
```

*Custom Date Format Outputs:*

Setting | Value
------- | -----
Time Zone | GMT
Format String | yyyy-mm-dd z

JSON:
```json
{
  "Games": [
    {
      "Name": "OOT",
      "Release Date": "1998-00-21 GMT"
    },
    {
      "Name": "MM",
      "Release Date": "2000-00-27 GMT"
    }
  ]
}
```

XML:
```xml
<Games>
  <OOT Release_Date="1998-00-21 GMT" />
  <MM Release_Date="2000-00-27 GMT" />
</Games>
```

See also
--------
- [Date-Time Values](../tips/datetimes.md)
- [Date Format](dateformat.md)
- [Date Format String](dateformatstring.md)