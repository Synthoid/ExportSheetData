---
layout: docs
title: Troubleshooting
description: Support page for dealing with common issues.
group: overview
---

Troubleshooting
---------------

This page contains suggestions for common issues you may encounter when using ESD.

Multiple Accounts
-----------------
There is a known bug when using add-ons while multiple accounts are signed in which seems to be caused by apps script using the incorrect account to execute the add-on. Unfortunately this is on Google's side so ESD cannot fix the issue directly. This is even more frustrating because the issue will not *always* show up when multiple accounts are signed in so it is possible for you to use ESD for a while before it suddenly occurs. **Most issues encountered when using ESD can be fixed by just logging out of all but one account**.

My sidebar is not functioning or I have a popup saying settings couldn't be loaded
----------------------------------------------------------------------------------
See [multiple accounts](#multiple-accounts) for more details.

If you run into a situation where the ESD sidebar doesn't seem to load or export data, try signing out of any extra accounts and opening the sidebar. More information about this bug can be found [here](https://sites.google.com/site/scriptsexamples/home/announcements/multiple-accounts-issue-with-google-apps-script).

As of v61, ESD will attempt to catch this bug and show a popup window to let you know that there was a problem. If you see this, you should log out of all but one account and try opening the sidebar again.

My JSON export only contains one row
------------------------------------
This issue can arrise when arise when [Nested Elements](general/nestedelements.md) is enabled and keys have not been properly formatted. See the [Nested Elements Wiki](https://github.com/Synthoid/ExportSheetData/wiki/Nested-Elements#advanced-key-formatting) for more details.

Boolean and number values are exporting as strings
--------------------------------------------------
There are two possibilities here. The first thing to check is if the [Force string values](json/forcestringvalues.md) option in enabled. If that is not enabled, make sure the cell is properly declared as a boolean or number. JSON value types are pulled from the sheet itself, so if the sheet sees the value `true` as a string instead of a boolean, or the value `101` as a string instead of an integer, they will be exported as strings.
