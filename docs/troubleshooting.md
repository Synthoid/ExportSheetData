Troubleshooting
---------------

This page contains suggestions for common issues you may encounter when using ESD.

Multiple Accounts
-----------------
There is a known bug when using add-ons while multiple accounts are signed in which seems to be caused by apps script using the incorrect account to execute the add-on. Unfortunately this is on ***Google's side*** so ESD cannot fix the issue directly. This is even more frustrating because the issue will not *always* show up when multiple accounts are signed in so it is possible for you to use ESD for a while before it suddenly occurs.

***Most issues encountered when using ESD can be fixed by just logging out of all but one account***.

After a brief period of experiencing the bug repeatedly, I believe the the problem comes when the currently active account is not the first (or possibly just the default) account in the currently signed in accounts. It is difficult to reproduce, but ESD will continue to try and work around this bug as not being able to have multiple accounts signed in is very frustrating.

My sidebar is not functioning or I have a popup saying settings couldn't be loaded
----------------------------------------------------------------------------------
See [multiple accounts](#multiple-accounts) for more details.

If you run into a situation where the ESD sidebar doesn't seem to load or export data, try signing out of any extra accounts and opening the sidebar. More information about this bug can be found [here](https://sites.google.com/site/scriptsexamples/home/announcements/multiple-accounts-issue-with-google-apps-script).

As of v61, ESD will attempt to catch this bug and show a popup window to let you know that there was a problem. If you see this, you should log out of all but one account and try opening the sidebar again.

My file is taking a long time to export
---------------------------------------
Google allocates resources for Apps Script operations as they are available. This means that exports can vary in their duration depending on time of day and traffic, and of course the amount of data being exported.

Currently, XML exports of large data sets (ie 1,000's of lines) can take a few minutes to export due to using [XmlService](https://developers.google.com/apps-script/reference/xml-service/xml-service) to create XML. A custom version of XmlService is being written currently that exports dramatically faster (less than 1 second vs 80 seconds). This is targeted to be released with v67.

***NOTE: Google does not allow processes to run longer than 360 seconds (6 minutes). If an export process takes longer than this, it will fail.***

My JSON export is missing rows
------------------------------
JSON does not support multiple fields with the same key. A sheet with the following values:

id | name | age
-- | ---- | ---
LoZ | Link | 18
SMB | Mario | 25
SF | Fox | 21
LoZ | Zelda | 17

Would produce the following JSON:

```json
{
  "LoZ": {
    "name": "Zelda",
    "age": 17
  },
  "SMB": {
    "name": "Mario",
    "age": 25
  },
  "SF": {
    "name": "Fox",
    "age": 21
  }
}
```

Note that the first field contains data from the 4th row. This is because the fourth row has the same ID as the first row. Since it is the last row with that ID, its values are used for the `LoZ` field.

My JSON export only contains one row
------------------------------------
This issue can arrise when arise when [Nested Elements](general/nestedelements.md) is enabled and keys have not been properly formatted. See the [Nested Elements Wiki](https://github.com/Synthoid/ExportSheetData/wiki/Nested-Elements#advanced-key-formatting) for more details.

Boolean and number values are exporting as strings
--------------------------------------------------
There are two possibilities here. The first thing to check is if the [Force string values](json/forcestringvalues.md) option in enabled. If that is not enabled, make sure the cell is properly declared as a boolean or number. JSON value types are pulled from the sheet itself, so if the sheet sees the value `true` as a string instead of a boolean, or the value `101` as a string instead of an integer, they will be exported as strings. This can occur if the cell value in question was formatted to be plain text.
