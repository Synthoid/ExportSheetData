Date Format
-----------
Determines how date-time values are formatted when exporting data. There are two possible values:

Value | Description
----- | -----------
Default | Use default JSON/XML date formats
Custom | Specify time zone and formatting string

> [!WARNING]
> If your custom settings are not valid, default date-time formatting will be used.

### Example: ###

**Sheet name: `Games`**

Name | Release Date
---- | -------
Awakening | `=DATE(1993,6,6)`
Oracles | 2/27/2001
4 Swords | 2002/12/1
Cap | 2004/11/04
Hourglass | 6/23/2007
Tracks | 12/7/2009
Worlds | 11/23/2013
Heroes | 10/22/2015

*Default Output:*

JSON:
```json
{
  "Games": [
    {
      "Name": "Awakening",
      "Release Date": "1993-06-06T04:00:00.000Z"
    },
    {
      "Name": "Oracles",
      "Release Date": "2001-02-27T05:00:00.000Z"
    },
    {
      "Name": "4 Swords",
      "Release Date": "2002-12-01T05:00:00.000Z"
    },
    {
      "Name": "Cap",
      "Release Date": "2004-11-04T05:00:00.000Z"
    },
    {
      "Name": "Hourglass",
      "Release Date": "2007-06-23T04:00:00.000Z"
    },
    {
      "Name": "Tracks",
      "Release Date": "2009-12-07T05:00:00.000Z"
    },
    {
      "Name": "Worlds",
      "Release Date": "2013-11-23T05:00:00.000Z"
    },
    {
      "Name": "Heroes",
      "Release Date": "2015-10-22T04:00:00.000Z"
    }
  ]
}
```

XML:
```xml
<Games>
  <Awakening Release_Date="Sun Jun 06 1993 00:00:00 GMT-0400 (Eastern Daylight Time)" />
  <Oracles Release_Date="Tue Feb 27 2001 00:00:00 GMT-0500 (Eastern Standard Time)" />
  <_4_Swords Release_Date="Sun Dec 01 2002 00:00:00 GMT-0500 (Eastern Standard Time)" />
  <Cap Release_Date="Thu Nov 04 2004 00:00:00 GMT-0500 (Eastern Standard Time)" />
  <Hourglass Release_Date="Sat Jun 23 2007 00:00:00 GMT-0400 (Eastern Daylight Time)" />
  <Tracks Release_Date="Mon Dec 07 2009 00:00:00 GMT-0500 (Eastern Standard Time)" />
  <Worlds Release_Date="Sat Nov 23 2013 00:00:00 GMT-0500 (Eastern Standard Time)" />
  <Heroes Release_Date="Thu Oct 22 2015 00:00:00 GMT-0400 (Eastern Daylight Time)" />
</Games>
```

*Custom Date Format Outputs:*

Setting | Value
------- | -----
Time Zone | GMT
Format String | dd MMM, yyyy'T'HH:mm zzzz

JSON:
```json
{
  "Games": [
    {
      "Name": "Awakening",
      "Release Date": "06 Jun, 1993T04:00 Greenwich Mean Time"
    },
    {
      "Name": "Oracles",
      "Release Date": "27 Feb, 2001T05:00 Greenwich Mean Time"
    },
    {
      "Name": "4 Swords",
      "Release Date": "01 Dec, 2002T05:00 Greenwich Mean Time"
    },
    {
      "Name": "Cap",
      "Release Date": "04 Nov, 2004T05:00 Greenwich Mean Time"
    },
    {
      "Name": "Hourglass",
      "Release Date": "23 Jun, 2007T04:00 Greenwich Mean Time"
    },
    {
      "Name": "Tracks",
      "Release Date": "07 Dec, 2009T05:00 Greenwich Mean Time"
    },
    {
      "Name": "Worlds",
      "Release Date": "23 Nov, 2013T05:00 Greenwich Mean Time"
    },
    {
      "Name": "Heroes",
      "Release Date": "22 Oct, 2015T04:00 Greenwich Mean Time"
    }
  ]
}
```

XML:
```xml
<Games>
  <Awakening Release_Date="06 Jun, 1993T04:00 Greenwich Mean Time" />
  <Oracles Release_Date="27 Feb, 2001T05:00 Greenwich Mean Time" />
  <_4_Swords Release_Date="01 Dec, 2002T05:00 Greenwich Mean Time" />
  <Cap Release_Date="04 Nov, 2004T05:00 Greenwich Mean Time" />
  <Hourglass Release_Date="23 Jun, 2007T04:00 Greenwich Mean Time" />
  <Tracks Release_Date="07 Dec, 2009T05:00 Greenwich Mean Time" />
  <Worlds Release_Date="23 Nov, 2013T05:00 Greenwich Mean Time" />
  <Heroes Release_Date="22 Oct, 2015T04:00 Greenwich Mean Time" />
</Games>
```

See also
--------
- [Date-Time Values](../tips/datetimes.md)
- [Date Time Zone](datetimezone.md)
- [Date Format String](dateformatstring.md)