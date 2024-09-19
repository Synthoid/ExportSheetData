Frequently Asked Questions
--------------------------
This page contains answers to some frequently asked questions about ESD.


Authorization Scopes
--------------------
ESD is an add-on for Google Sheets, and as such requires specific [authorization scopes](https://developers.google.com/workspace/add-ons/concepts/workspace-scopes) to function. ***These scopes are the minimum required scopes needed for ESD to function.*** While it is understandable for users to be scrupulous about authorizing certain functionality, every scope used is needed and ESD tries to ue the most restricted scopes possible. Your data is *your* data!

Scopes used by ESD are:

Scope | URL
----- | ---
Per-file access | `https://www.googleapis.com/auth/drive.file`
Current Sheets file access | `https://www.googleapis.com/auth/spreadsheets.currentonly`
Apps Script UI access | `https://www.googleapis.com/auth/script.container.ui`
Read user's email address | `https://www.googleapis.com/auth/userinfo.email`

A more detailed breakdown of these scopes, what they authorize, and how ESD uses them follows.

Scope | Authorizes | Functionality
----- | ---------- | -------------
`drive.file` | Grants access to Google Drive files and folders that were created by ESD or specifically targeted by you via the Google Picker. | - File creation when exporting data.<br>- Updating contents of files selected via file picker.<br>- Accessing folders via file picker when setting custom export locations.
`spreadsheets.currentonly` | Grants access to data in the current spreadsheet. | Needed to access spreadsheet data when exporting JSON or XML.
`script.container.ui` | Grants access to Google's UI. | Needed to add ESD UI and menu items.
`userinfo.email` | Grants access to email information about the user using ESD. | - Storing and loading settings for ESD.<br>- Executing ESD's various processes (when an add-on executes code, it is done under the email of the user)
