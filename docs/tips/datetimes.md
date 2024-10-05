Date-Time Values
----------------
Date-time values in Sheets are exported as standard JSON/XML time formats. These values can optionally be formatted using the [SimpleDateFormat](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html) specification.

### Example: ###

**Sheet name: `Dates`**

Name | Formula | Month/Day/Year | Year/Month/Day | Hour | Month-Day | Month/Day | Month-Year | Month-Year-Escaped | Plaintext | Array
---- | ------- | -------------- | -------------- | ---- | --------- | --------- | ---------- | ------------------ | --------- | -----
Date | `=DATE(2024,10,31)` | 10/31/2024 | 2024/10/31 | 3:33 AM | 10-31 | 10/31 | 10-2024 | "10-2024" | 10-2024 | 10/31/1963,1978/10/31,"10/31/2018"

> [!NOTE]
> The Plaintext value here is a cell manually formatted to be plaintext.

Date-time values are stored as actual [Date](https://developers.google.com/apps-script/reference/document/date) objects in Sheets. So even if the cell *visually* has a value of `3:33 AM` it *really* has a more complicated value that points to a specific date-time. Review the [documentation on Date formats in Sheets](https://developers.google.com/sheets/api/guides/formats#about_date_time_values) for more specific information. Here is a breakdown of the above *visual* values and their corresponding `Date` values.

Name | Date
---- | ----
10/31/2024 | 2024-10-31T04:00:00.000Z
2024/10/31 | 2024-10-31T04:00:00.000Z
3:33 AM | 1899-12-30T08:33:00.000Z
10-31 | 2024-10-31T04:00:00.000Z
10/31 | 2024-10-31T04:00:00.000Z
10-2024 | 2024-10-01T04:00:00.000Z
"10-2024" | n/a
10-2024 (plain text) | n/a
10/31/1963,1978/10/31,"10/31/2018" | JSON Array, n/a

*Default Output:*

JSON:
```json
{
  "Date": {
    "Formula": "2024-10-31T04:00:00.000Z",
    "Month/Day/Year": "2024-10-31T04:00:00.000Z",
    "Year/Month/Day": "2024-10-31T04:00:00.000Z",
    "Hour": "1899-12-30T08:33:00.000Z",
    "Month-Day": "2024-10-31T04:00:00.000Z",
    "Month/Day": "2024-10-31T04:00:00.000Z",
    "Month-Year": "2024-10-01T04:00:00.000Z",
    "Month-Year-Escaped": "10-2024",
    "Plaintext": "10-2024",
    "Array": [
      "1963-10-31T05:00:00.000Z",
      "1978-10-31T05:00:00.000Z",
      "10/31/2018"
    ]
  }
}
```

XML:
```xml
<data>
  <Date>
    <Formula>Thu Oct 31 2024 00:00:00 GMT-0400 (Eastern Daylight Time)</Formula>
    <Month_Day_Year>Thu Oct 31 2024 00:00:00 GMT-0400 (Eastern Daylight Time)</Month_Day_Year>
    <Year_Month_Day>Thu Oct 31 2024 00:00:00 GMT-0400 (Eastern Daylight Time)</Year_Month_Day>
    <Hour>Sat Dec 30 1899 03:33:00 GMT-0500 (Eastern Standard Time)</Hour>
    <Month-Day>Thu Oct 31 2024 00:00:00 GMT-0400 (Eastern Daylight Time)</Month-Day>
    <Month_Day>Thu Oct 31 2024 00:00:00 GMT-0400 (Eastern Daylight Time)</Month_Day>
    <Month-Year>Tue Oct 01 2024 00:00:00 GMT-0400 (Eastern Daylight Time)</Month-Year>
    <Month-Year-Escaped>"10-2024"</Month-Year-Escaped>
    <Plaintext>10-2024</Plaintext>
    <Array>10/31/1963,1978/10/31,"10/31/2018"</Array>
  </Date>
</data>
```

*Custom Date Format Outputs:*

Setting | Value
------- | -----
Time Zone | EST
Format String | dd MMM, yyyy'T'HH:mm zzzz

JSON:
```json
{
  "Date": {
    "Formula": "30 Oct, 2024T23:00 Eastern Standard Time",
    "Month/Day/Year": "30 Oct, 2024T23:00 Eastern Standard Time",
    "Year/Month/Day": "30 Oct, 2024T23:00 Eastern Standard Time",
    "Hour": "30 Dec, 1899T03:33 Eastern Standard Time",
    "Month-Day": "30 Oct, 2024T23:00 Eastern Standard Time",
    "Month/Day": "30 Oct, 2024T23:00 Eastern Standard Time",
    "Month-Year": "30 Sep, 2024T23:00 Eastern Standard Time",
    "Month-Year-Escaped": "10-2024",
    "Plaintext": "10-2024",
    "Array": [
      "31 Oct, 1963T00:00 Eastern Standard Time",
      "31 Oct, 1978T00:00 Eastern Standard Time",
      "10/31/2018"
    ]
  }
}
```

XML:
```xml
<data>
  <Date>
    <Formula>30 Oct, 2024T23:00 Eastern Standard Time</Formula>
    <Month_Day_Year>30 Oct, 2024T23:00 Eastern Standard Time</Month_Day_Year>
    <Year_Month_Day>30 Oct, 2024T23:00 Eastern Standard Time</Year_Month_Day>
    <Hour>30 Dec, 1899T03:33 Eastern Standard Time</Hour>
    <Month-Day>30 Oct, 2024T23:00 Eastern Standard Time</Month-Day>
    <Month_Day>30 Oct, 2024T23:00 Eastern Standard Time</Month_Day>
    <Month-Year>30 Sep, 2024T23:00 Eastern Standard Time</Month-Year>
    <Month-Year-Escaped>"10-2024"</Month-Year-Escaped>
    <Plaintext>10-2024</Plaintext>
    <Array>10/31/1963,1978/10/31,"10/31/2018"</Array>
  </Date>
</data>
```

JSON and XML each have ways to prevent strings from being parsed into Dates:

Format | Escape Method(s)
------ | -------------
JSON | Wrap values in double quotes ( `"` ), format cell as Plaintext
XML | Format cell as Plaintext

See also
--------
- [Date Format](../general/dateformat.md)
- [Date Time Zone](../general/datetimezone.md)
- [Date Format String](../general/dateformatstring.md)