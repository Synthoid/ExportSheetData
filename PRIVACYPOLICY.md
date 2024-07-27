Privacy Policy
--------------

Starting January 8, 2018, Google will require all apps and add-ons to be verified if they access "sensitive Google APIs." Since [Export Sheet Data](https://workspace.google.com/marketplace/app/export_sheet_data/903838927001) (ESD) must access users' Google Dive files to function, it needs to be verified so users are not shown a terrifying "Unverified App" screen. Part of that verification requires having a visible privacy policy which can be read below.

### When does ESD collect my personal information?

Never. Any personal information collected (which should be none) is purely done by internal Google processes. No personal data collection has been coded into ESD. Your data is YOUR data.

### Where does ESD send my personal information?

Nowhere. Any personal information sent anywhere (which should be nowhere) is purely done by internal Google processes. I have not coded any personal data sharing into ESD. Your data is no one else's business.

### Will ESD ever do anything with my personal information?

Probably not. The only information gathering likely to ever be done by ESD would be analytics to see how many users ESD has and how often it is used. This is not something it currently does, and if it ever is done it would purely be so I could look at pretty graphs when I get bored.

### Why make a privacy policy if you aren't collecting personal information?

Google requires it for verification. I would prefer new users not have to take extra steps to install ESD nor do I want users to feel uneasy because they are installing an "unverified add-on."

### What scopes are used by ESD and why?

The sensitive scopes used by ESD are listed and briefly explained below. A more detailed account of why these scopes are required can be found in the [FAQ](https://github.com/Synthoid/ExportSheetData/blob/master/docs/faq.md) page. You can view official definitions of each scope <a href="https://developers.google.com/identity/protocols/oauth2/scopes" target="_blank">here.</a>

- `https://www.googleapis.com/auth/userinfo.email`
  - Scope included in add-ons by default. Allows add-ons to view your email. Not used directly by ESD.
- `https://www.googleapis.com/auth/script.container.ui`
  - Scope included in add-ons by default. Allows access to the app's UI.
- `https://www.googleapis.com/auth/drive`
  - Allows reading and writing Google Drive files. This is used to create files for the data exported by ESD. Unfortunately there is no way to limit this to only creating or modifying files similar to .read-only scopes so ESD must have authority to read files as well, though it does not actually do so.</li>
- `https://www.googleapis.com/auth/spreadsheets.currentonly`
  - Allows access to data contained in the spreadsheets that have installed ESD. This is used to pull data into ESD for export.
