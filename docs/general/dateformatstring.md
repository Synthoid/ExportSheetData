Date Format String
------------------
Formatting string used for custom date formats. This is based on the [SimpleDateFormat](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html) specification.

> [!NOTE]
> If no format string is specified, a default value of `yyyy-MM-dd'T'HH:mm:sszZ` will be used.

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
Format String | yyyy-MM-dd'T'HH:mm:sszZ

JSON:
```json
{
  "Games": [
    {
      "Name": "OOT",
      "Release Date": "1998-11-21T05:00:00GMT+0000"
    },
    {
      "Name": "MM",
      "Release Date": "2000-04-27T04:00:00GMT+0000"
    }
  ]
}
```

XML:
```xml
<Games>
  <OOT Release_Date="1998-11-21T05:00:00GMT+0000" />
  <MM Release_Date="2000-04-27T04:00:00GMT+0000" />
</Games>
```

Setting | Value
------- | -----
Time Zone | GMT
Format String | EEE dd MMMM yyyy

JSON:
```json
{
  "Games": [
    {
      "Name": "OOT",
      "Release Date": "Sat 21 November 1998"
    },
    {
      "Name": "MM",
      "Release Date": "Thu 27 April 2000"
    }
  ]
}
```

XML:
```xml
<Games>
  <OOT Release_Date="Sat 21 November 1998" />
  <MM Release_Date="Thu 27 April 2000" />
</Games>
```

See also
--------
- [Date-Time Values](../tips/datetimes.md)
- [Date Format](dateformat.md)
- [Date Time Zone](datetimezone.md)