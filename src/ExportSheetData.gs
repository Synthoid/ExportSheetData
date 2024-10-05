/**
 * Current version number for ESD.
 * @type {number}
 **/
const esdVersion = 67;

//Popup Message
/**
 * Height for lines in popup messages.
 * @type {number}
 **/
const messageLineHeight = 10;

//Export Stats
/**
 * Start time for an export process.
 * @type {number}
 **/
var exportTime = 0;

//Consts
const SelectFileTimeoutDuration = 360;

/**
 * Subpath types used in Nested Element operations.
 * @enum {number}
 **/
const SubpathTypes = {
  None: 0,
  Key: 1, //JSON field or XML element key
  Array: 2, //JSON Array or XML element with child elements
  Object: 3, //JSON Object
  Attribute: 4 //XML element attribute
};

/**
 * Search types for key values used in Nested Element operations.
 * @enum {number}
 **/
const SearchTypes = {
  None: 0, //Not a valid search type
  Root: 1, //Set the target element to the root JSON object (#ROOT)
  Sheet: 2, //Set the target element to the sheet's root. (#SHEET)
  Row: 3, //Search for the index matching a row's index (#ROW)
  Field: 4, //Search for a specific field value (#FIELD_ID)
  Index: 5 //Search for a specific index (#1)
};

/**
 * MIME types for exported data files and picker operations.
 * @enum {string}
 **/
const MimeTypes = {
  Folder: "application/vnd.google-apps.folder",
  JSON: "application/json",
  XML: "application/xml",
  Text: "text/plain"
};

/**
 * Status values for select file operations using the file picker.
 * @enum {number}
 **/
const SelectFileStatus = {
  Inactive: 0,
  Active: 1,
  Completed: 2,
  Cancelled: 3,
  Timeout: 4,
  Error: 5
};

/**
 * Keys for key-value pairs used in file selection cache.
 * @enum {string}
 **/
const SelectFileKeys = {
  Status: "fileSelectStatus",
  File: "fileSelectData"
};

/**
 * Values for export formats.
 * @enum {string}
 **/
const ExportFormats = {
  JSON: "jsonFormat",
  XML: "xmlFormat"
};

/**
 * Values for export folder types.
 * @enum {string}
 **/
const ExportFolderLocations = {
  MyDrive: "MyDrive",
  Custom: "Custom"
};

/**
 * Values for replace file types.
 * @enum {string}
 **/
const ReplaceFileOptions = {
  Enabled: "Enabled",
  Disabled: "Disabled"
};

/**
 * Values for date-time format types.
 * @enum {string}
 **/
const DateTimeFormats = {
  Default: "Default",
  Custom: "Custom"
};

/**
 * GUIDs used to format popup strings.
 **/
const FormatGuids = {
  Visualize: {
    Data: '{f117b2c2-1d31-4d46-bcd1-d99dda128059}',
    Message: '{4297f144-6a18-49df-b298-29fdfcf1a092}',
    DownloadName: '{0808e0a8-de63-4422-8148-3e52c3e28179}',
    DownloadMime: '{9e027f4e-99ff-4378-9c83-447e983eac2d}',
    DownloadContent: '{bfb95863-4406-42cf-921e-df4aa4eb9ea4}',
  },
  Export: {
    Name: '{a7372abf-bd7e-4c13-8d54-0c0b3603a816}',
    Message: '{393b3288-20f3-48f6-9255-07f11a84e7e2}',
    ViewURL: '{e607f5a8-6dc2-4636-a4fc-1b94c97f1ea8}',
    DownloadURL: '{03d82c9a-41ba-4fcf-9757-addea4fdb371}'
  },
  Error: {
    Message: '{5fd5c101-9583-456a-8c32-857c0fe3d1db}',
    Error: '{34f48d68-d9b5-4c63-8a62-a25f5a412313}',
  },
  Picker: {
    FileType: '{9a53e586-c360-412c-86ab-e30cfdb2d26d}',
    SelectFolders: '{92448e1e-6921-4988-b669-722446bde3c6}',
    CallbackName: '{568234c9-e57f-49bf-ba26-0f2d886b0d08}'
  }
};

/**
 * Keys for various objects/blobs that are passed between functions.
 **/
const Keys = {
  FileSettings: {
    Filename: "filename", //string
    Content: "content", //string
    ExportFolder: "export-folder",
    ExportFolderId: "exportFolderId",
    Mime: "mime", //string
    Visualize: "visualize", //bool
    SingleSheet: "singleSheet", //bool
    ReplaceFile: "replace-file", //bool
    ReplaceFileId: "replaceFileId", //string
    Message: "message", //string
    MessageHeight: "message-height" //number
  },
  ExportSettings: {
    //Format
    Format: "exportType", //string
    //Export data
    ExportSheets: "exportSheets", //string
    TargetSheets: "targetSheets", //object
    //Data formatting
    MinifyData: "minifyData", //bool
    ExportBoolsAsInts: "exportBoolsAsInts", //bool
    IgnoreEmptyCells: "ignoreEmptyCells", //bool
    IncludeFirstColumn: "includeFirstColumn", //bool
    //Advanced
    UnwrapSingleRows: "unwrapSingleRows", //bool
    CollapseSingleRows: "collapseSingleRows", //bool
    //Ignore prefix
    IgnoreColumnsWithPrefix: "ignoreColumnsWithPrefix", //bool
    IgnorePrefix: "ignorePrefix", //string
    //Unwrap prefix
    UnwrapSheetsWithPrefix: "unwrapSheetsWithPrefix", //bool
    UnwrapPrefix: "unwrapPrefix", //string
    //Collapse prefix
    CollapseSheetsWithPrefix: "collapseSheetsWithPrefix", //bool
    CollapsePrefix: "collapsePrefix", //string,
    //Date-Time
    DateFormat: "dateFormat",
    DateTimeZone: "dateTimeZone",
    DateFormatString: "dateFormatString",
    //DateLocale: "dateLocale",
    //DateOptions: "dateOptions",
    //Nested Elements
    NestedElements: "nestedElements", //bool
    Export: {
      FolderType: "exportFolderType", //string
      FolderId: "exportFolderId", //string
      JSON: {
        ReplaceFileId: "replaceFileId", //string
        ReplaceFileType: "replaceFileType", //string
      },
      XML: {
        ReplaceFileId: "replaceFileId", //string
        ReplaceFileType: "replaceFileType", //string
      }
    },
    JSON: {
      ForceStringValues: "forceString", //bool
      ExportCellArray: "exportCellArray", //bool
      ExportSheetArray: "exportSheetArray", //bool
      ExportValueArray: "exportValueArray", //bool
      Advanced: {
        ExportContentsAsArray: "exportContentsAsArray", //bool
        ExportCellObject: "exportCellObject", //bool
        EmptyValueFormat: "emptyValueFormat", //string
        NullValueFormat: "nullValueFormat", //string
        SeparatorChar: "separatorChar", //string
        //ForceArrayWithPrefix: "forceArray", //bool
        ForceArrayPrefix: "forceArrayPrefix", //string
        //ForceNestedArrayWithPrefix: "forceArrayNest", //bool
        ForceNestedArrayPrefix: "forceArrayNestPrefix" //string
      }
    },
    XML: {
      ExportChildElements: "exportChildElements", //bool
      RootElement: "rootElement", //string
      Advanced: {
        NameReplacementChar: "nameReplacementChar", //string
        IncludeDeclaration: "includeDeclaration", //bool
        DeclarationVersion: "declarationVersion", //string
        DeclarationEncoding: "declarationEncoding", //string
        DeclarationStandalone: "declarationStandalone", //string
        //ForceAttributesWithPrefix: "forceAttributes", //bool
        AttributePrefix: "attributePrefix", //string
        //ForceChildElementsWithPrefix: "forceChildElements", //bool
        ChildElementPrefix: "childElementPrefix", //string
        //ForceInnerTextWithPrefix: "forceInnerText", //bool
        InnerTextPrefix: "innerTextPrefix", //string
        RootNamespace: "rootNamespace", //string
        Namespaces: "namespaces" //string array
      }
    }
  },
  Objects: {
    Export: "export",
    JSON: "json",
    XML: "xml",
    Advanced: "advanced"
  },
  Properties: {
    LatestVersion: "esd-latestVersion",
    Export: "export",
    Document: {
      Settings: "settings", //Main export settings
      PreviousSettings: "prev", //Previous export settings
    },
    User: {
      Settings: "settings",
      PreviousSettings: "prev",
      ExportFolder: "exportFolder", //Settings for custom export folder location
      ExportFileJson: "exportFileJson", //Settings for file to update JSON contents on
      ExportFileXml: "exportFileXml" //Settings for file to update XML contents on
    }
  },
  Secrets: {
    ApiKey: "apiKey",
    AppIdKey: "appId"
  }
};

//Special prefixes to allow XML nested elements
//const arrayPref = "ARRAY_";
//const attributePref = "ATTRIBUTE_";

/**
 * Returns the last settings for ESD in the open document as a stringified JSON blob.
 * @return {string}
 **/
function getProperties()
{
  let properties = PropertiesService.getDocumentProperties();
  
  return JSON.stringify(properties.getProperties());
}

/**
 * Saves the settings last used for ESD so the user doesn't need to reselect them next time ESD is opened.
 * @param {string} newProperties Stringified JSON blob representing properties.
 **/
function setProperties(newProperties)
{
  let properties = PropertiesService.getDocumentProperties();
  
  properties.setProperties(JSON.parse(newProperties));
}

/**
 * Returns the total export settings for ESD in the open document as a stringified JSON blob.
 * @param {string} documentKey Key for the target document property.
 * @return {string}
 **/
function getExportPropertiesInternal(documentKey)
{
  //This returns a composite of properties, with the general settings stored in document properties, and export folder/replacement files stored in user properties...
  let documentProperties = PropertiesService.getDocumentProperties();
  let documentExportProperties = documentProperties.getProperty(documentKey);
  let documentSettings = documentExportProperties != null ? JSON.parse(documentExportProperties) : {};
  
  return JSON.stringify(documentSettings);
}

/**
 * Saves the total export settings for ESD in the open document so the user doesn't need to reselect them next time ESD is opened.
 * @param {object} newProperties Stringified JSON blob representing properties.
 * @param {string} documentKey Key for the settings field in document properties.
 **/
function setExportPropertiesInternal(newProperties, documentKey)
{
  let documentProperties = PropertiesService.getDocumentProperties();
  let documentSettings = JSON.parse(newProperties);
  
  documentProperties.setProperty(documentKey, JSON.stringify(documentSettings));
}

/**
 * Returns the total export settings for ESD in the open document as a stringified JSON blob.
 * @return {string}
 **/
function getExportProperties()
{
  return getExportPropertiesInternal(Keys.Properties.Document.Settings, Keys.Properties.User.Settings);
}

/**
 * Saves the total export settings for ESD in the open document so the user doesn't need to reselect them next time ESD is opened.
 * @param {object} newProperties Stringified JSON blob representing properties.
 **/
function setExportProperties(newProperties)
{
  setExportPropertiesInternal(newProperties, Keys.Properties.Document.Settings, Keys.Properties.User.Settings);
}

/**
 * Clears ESD export settings for the current document.
 * @param {bool} showModal If true, a popup will be shown noting that settings have been cleared.
 **/
function clearExportProperties(showModal)
{
  let documentProperties = PropertiesService.getDocumentProperties();
  
  if(documentProperties.getProperty(Keys.Properties.Document.Settings) != null)
  {
    documentProperties.deleteProperty(Keys.Properties.Document.Settings);
  }
  
  if(showModal) SpreadsheetApp.getUi().alert("ESD export settings have been cleared! The sidebar will now refresh.");
  
  openSidebar();
}

/**
 * Returns the settings used in the last export as a stringified JSON blob.
 * @return {string}
 **/
function getPrevExportProperties()
{
  return getExportPropertiesInternal(Keys.Properties.Document.PreviousSettings, Keys.Properties.User.PreviousSettings);
}

/**
 * Saves the settings used in the last export.
 * @param {string} newProperties Stringified JSON blob representing properties.
 **/
function setPrevExportProperties(newProperties)
{
  setExportPropertiesInternal(newProperties, Keys.Properties.Document.PreviousSettings, Keys.Properties.User.PreviousSettings);
}

/**
 * Ensures the passed settings are valid and sets them if so.
 **/
function validateAndSetExportProperties(settingsString)
{
  let settings = JSON.parse(settingsString);
  let message = "Settings have been imported from another ESD document. The sidebar will now refresh.";
  
  //Target sheets
  if(settings.hasOwnProperty(Keys.ExportSettings.TargetSheets))
  {
    if(settings[Keys.ExportSettings.TargetSheets] !== "[]") message += "\n\nNote: Custom export sheet targets are not imported and will need to be set up.";
    
    settings[Keys.ExportSettings.TargetSheets] = "[]"; //Don't populate export sheets since those are likely to be custom per sheet.
  }

  //User export data
  if(settings.hasOwnProperty(Keys.Properties.Export))
  {
    message += "\n\nNote: Custom export location and file replacement settings are not imported due to scope limitations and will need to be set up.";

    settings[Keys.Properties.Export] = {};
  }
  
  setExportProperties(JSON.stringify(settings));
  
  SpreadsheetApp.getUi().alert(message);
  
  openSidebar();
}

/**
 * Returns the current version number of ESD.
 * @return {number}
 **/
function getVersion()
{
  return esdVersion;
}

/**
 * Returns the webViewLink for the file with the given ID, or an empty string if an issue arises when retrieving the file.
 * @param {string} id ID for the target file.
 * @return {string}
 **/
function getWebViewLinkFromId(id)
{
  let file = null;

  try
  {
    file = Drive.Files.get(id, { fields: 'webViewLink' });
  }
  catch(e)
  {
    return "";
  }

  return file.webViewLink;
}

/**
 * Returns the name of the file/folder with the given ID.
 * @param {string} id ID for the target file.
 * @return {string}
 **/
function getFileNameFromId(id)
{
  let file = null;

  try
  {
    file = Drive.Files.get(id, { fields: 'name' });
  }
  catch(e)
  {
    //openErrorModal("Could not get folder name", "There was an error getting the provided folder.", e.stack)
    return "";
  }

  return file.name;
}

/**
 * Returns an array of Sheet objects that should be included in an export.
 * @param {Array<number>} exportSheetIds Array of Sheet IDs.
 **/
function getActiveExportSheets(exportSheetIds)
{
  let spreadsheet = SpreadsheetApp.getActive();
  let sheets = spreadsheet.getSheets();
  let activeSheets = [];

  for(let i=0; i < sheets.length; i++)
  {
    if(exportSheetIds.includes(sheets[i].getSheetId())) activeSheets.push(sheets[i]);
  }

  return activeSheets;
}

/**
 * Returns true if the given value is an array.
 * @return {boolean}
 **/
function isArray(array)
{
  return Array.isArray(array);
}

/**
 * Returns true if the given value is an object and is not null.
 * @return {boolean}
 **/
function isObject(object)
{
  return (typeof(object) === 'object' && object !== null);
}

/**
 * Returns true if the given value is a string and some variant of "null"
 * @return {boolean}
 **/
function isNullString(value)
{
  return typeof(value) === 'string' && (value.localeCompare("null", "en", { sensitivity : "base" }) === 0);
}

/**
 * Returns true if the given value can be parsed as a valid number.
 * @return {boolean}
 **/
function isNumber(value)
{
  //Smoke test using parseFloat. Will catch values like "six" but not values like "6-7"
  if(isNaN(parseFloat(value))) return false;

  //Made it through the first round, so do a more thorough check.
  let isNumber = true;
  let minusCount = 0;
  let decimalCount = 0;
  
  //Parse float is unreliable, so loop through to make sure the string is actually a float
  for(let i=0; i < value.length; i++)
  {
    if(isNaN(value[i]))
    {
      if(value[i] === '.')
      {
        if(decimalCount > 0)
        {
          //More than one decimal, not a valid number...
          isNumber = false;
          break;
        }
        else
        {
          decimalCount++;
        }
      }
      else if(value[i] === '-')
      {
        if(i > 0)
        {
          //Dash not at the start of the number, not a valid number...
          isNumber = false;
          break;
        }
        if(minusCount > 0)
        {
          //More than one dash, not a valid number...
          isNumber = false;
          break;
        }
        else
        {
          minusCount++;
        }
      }
      else
      {
        isNumber = false;
        break;
      }
    }
  }

  return isNumber;
}

/**
 * Returns true if the given value is a date object.
 * @param {any} value Value to check.
 * @param {boolean} includeParsedDate If true, try to parse non-Date values to see if they are indeed dates.
 * @return {boolean}
 **/
function isDate(value, includeParsedDate)
{
  let isValueDate = value instanceof Date;

  if(!isValueDate && includeParsedDate)
  {
    if(!isNaN(new Date(value).valueOf()))
    {
      isValueDate = true;
    }
  }

  return isValueDate;
}

/**
 * Escape HTML special characters for showing text in a textarea
 * @param {string} content
 * @return {string}
 **/
function escapeHtml(content)
{
  return content
    .replace(/&/g, '&amp;') //&
    .replace(/</g, '&lt;')  //<
    .replace(/>/g, '&gt;'); //>
}

/**
 * Returns the index of the given value in an array.
 * @return {number}
 **/
function getIndexOf(array, value)
{
  if(!isArray(array)) return -1;
  
  let index = -1;
  
  for(let i=0; i < array.length; i++)
  {
    if(array[i] == value)
    {
      index = i;
      break;
    }
  }
  
  return index;
}

/**
 * Returns all of the sheet names in the current spreadsheet.
 * @return {Array<string>}
 **/
function getSheetNames()
{
  let spreadsheet = SpreadsheetApp.getActive();
  let sheets = spreadsheet.getSheets();
  let sheetNames = [];
  
  for(let i=0; i < sheets.length; i++)
  {
    sheetNames.push(sheets[i].getName());
  }
  
  return sheetNames;
}

/**
 * Returns the names and IDs for the sheets in the current spreadsheet.
 * @return {Array<Object>}
 **/
function getSheetNamesAndIds()
{
  let spreadsheet = SpreadsheetApp.getActive();
  let sheets = spreadsheet.getSheets();
  let sheetValues = [];
  
  for(let i=0; i < sheets.length; i++)
  {
    let sheetValue = {};
    
    sheetValue["name"] = sheets[i].getName();
    sheetValue["id"] = sheets[i].getSheetId();
    
    sheetValues.push(sheetValue);
  }
  
  return sheetValues;
}

/**
 * Returns the name of the currently active sheet in the spreadsheet. (ie the sheet that is visible)
 * @return {string}
 **/
function getActiveSheetName()
{
  let spreadsheet = SpreadsheetApp.getActive();
  
  return spreadsheet.getActiveSheet().getName();
}

/**
 * Returns the name and ID of the currently active sheet in the spreadsheet. (ie the sheet that is visible)
 * @return {Object}
 **/
function getActiveSheetNameAndId()
{
  let spreadsheet = SpreadsheetApp.getActive();
  let sheet = spreadsheet.getActiveSheet();
  let sheetValues = {};
  
  sheetValues["name"] = sheet.getName();
  sheetValues["id"] = sheet.getSheetId();
  
  return sheetValues;
}

/**
 * Converts the contents of a cell into an array by separating the cell value based on the given separator char.
 * Returns [1] if the cell was successfully converted into an array, [2] if it was a single string wrapped in quotes, [0] otherwise.
 * @param {any} cell Cell value to parse.
 * @param {string} separatorChar Char used to separate content.
 * @param {Array<any>} cellArray Array to populate will cell values.
 * @return {number}
 **/
function getCellContentArray(cell, separatorChar, cellArray)
{
  //If the cell isn't a string, it's value can't be split into an array.
  if(typeof(cell) !== "string")
  {
    if(cell != "") cellArray.push(cell);
    
    return 0;
  }
  
  let status = 1;
  let content = cell;
  let commaIndicies = [];
  let openQuoteIndicies = [];
  let closeQuoteIndicies = [];
  
  //Set the indicies for quotes and commas
  for(let i=0; i < content.length; i++)
  {
    if(content.charAt(i) == '"')
    {
      if(openQuoteIndicies.length == closeQuoteIndicies.length)
      {
        openQuoteIndicies.push(i);
      }
      else
      {
        closeQuoteIndicies.push(i);
      }
    }
    else if(content.charAt(i) == separatorChar)
    {
      commaIndicies.push(i);
    }
  }
  
  //Remove a comma if it is wrapped in quotes
  //Use the close quote indicies in the case of an open ended quote at the end of content
  for(let i=0; i < closeQuoteIndicies.length; i++)
  {
    for(let j=commaIndicies.length-1; j >= 0; j--)
    {
      if(commaIndicies[j] > openQuoteIndicies[i] && commaIndicies[j] < closeQuoteIndicies[i])
      {
        commaIndicies.splice(j, 1);
      }
    }
  }

  //Return early if no commas are detected...
  if(commaIndicies.length === 0)
  {
    status = 0;
  }
        
  //Populate the array
  if(commaIndicies.length > 0)
  {
    let startIndex = 0;
    let endIndex = 0;

    for(let i=0; i < commaIndicies.length; i++)
    {
      let arrayString = content.slice(startIndex, commaIndicies[i]);

      if(arrayString != "")
      {
        arrayString = arrayString.trim();

        if(arrayString.length > 2 && arrayString[0] === '"' && arrayString[arrayString.length-1] === '"')
        {
          //Get rid of wrapping quotes.
          cellArray.push(arrayString.replace('"', ' ').replace('"', ' ').trim());
        }
        else
        {
          //Check for dates, but only if not numbers or all numbers will be dates...
          if(isNumber(arrayString))
          {
            cellArray.push(new Number(arrayString));
          }
          else if(isDate(arrayString, true))
          {
            cellArray.push(new Date(arrayString));
          }
          else
          {
            cellArray.push(arrayString);
          }
        }
      }
      startIndex = commaIndicies[i] + 1; // +1 so the next string doesn't start with a comma
    }
    
    if(content[content.length - 1] == separatorChar) endIndex = content.length - 1;
    else endIndex = content.length;

    //Push the string from the last comma to the end of the content string
    let lastString = content.slice(startIndex, endIndex);
    //Get rid of wrapping quotes
    if(lastString != "")
    {
      lastString = lastString.trim();

      if(lastString.length > 2 && lastString[0] === '"' && lastString[lastString.length-1] === '"')
      {
        cellArray.push(lastString.replace('"', ' ').replace('"', ' ').trim());
      }
      else
      {
        //Check for dates, but only if not numbers or all numbers will be dates...
        if(isNumber(lastString))
        {
          cellArray.push(new Number(lastString));
        }
        else if(isDate(lastString, true))
        {
          cellArray.push(new Date(lastString));
        }
        else
        {
          cellArray.push(lastString);
        }
      }
    }
  }
  else
  {
    if(content != "") cellArray.push(content);
  }
  
  //Convert values to their correct type (float, bool, etc)
  for(let i=0; i < cellArray.length; i++)
  {
    //Numbers
    if(cellArray[i] instanceof Number)
    {
      continue;
    }
    /*else if(isNumber(cellArray[i]))
    {
      cellArray[i] = parseFloat(cellArray[i]);
    }*/
    //Dates
    else if(isDate(cellArray, false))
    {
      //Do nothing to date values...
      continue;
    }
    //Booleans
    else if(cellArray[i] === 'true') cellArray[i] = true;
    else if(cellArray[i] === 'false') cellArray[i] = false;
    //Null
    else if(cellArray[i] === 'null') cellArray[i] = null;
    //String
    else if(cellArray[i].length > 1)
    {
      //Strip wrapping quotes...
      if(cellArray[i][0] === '"' && cellArray[i][cellArray[i].length - 1] === '"')
      {
        cellArray[i] = cellArray[i].substring(1, cellArray[i].length - 1);
        //const subString = cellArray[i].substring(1, cellArray[i].length - 1);
        
        //If the cell was a single escaped string like "Test1, Test2", return a special status.
        if(cellArray.length == 1) status = 2;
      }
    }
  }

  return status;
}

/**
 * Formats a string to adhere to XML element naming conventions
 * See: https://www.w3schools.com/xml/xml_elements.asp
 * @param {stirng} value Name for an XML element or attribute.
 * @param {string} replacement Replacement char for invalid chars in the value.
 * @return {string}
 **/
function formatXmlName(value, replacement)
{
  let xmlName = value;
  
  if(!isNaN(value)) xmlName = "_" + value.toString();
  else if(!isNaN(value[0])) xmlName = "_" + value; //XML element names cannot start with a number, so add a "_" to the start of the name
  
  if(xmlName.length >= 3)
  {
    if(xmlName.toLowerCase().indexOf("xml") === 0)
    {
      xmlName = "_" + xmlName; //XML element names cannot start with "XML" so add an underscore to the front
    }
  }
  
  xmlName = xmlName.replace(/([^A-Z0-9\-\_\.])/gim, replacement); //Replace non-alphanumeric, dash, underscore, or period chars with the replacement char
  
  if(xmlName.search(/[a-zA-Z\_]/g) > 0)
  {
    xmlName = "_" + xmlName; //XML element names must start with a letter or underscore, so add an underscore to the front
  }
  
  return xmlName;
}

/**
 * Returns an array with the name as the first element and the namespace as the second.
 * @param {any} value The XML name to evaluate. This can technically be anything, but should be a string.
 * @param namespaces {Array<XmlService.Namespace>} Current namespaces used in the document.
 * @param {XmlService.Namespace} rootNamespace Root namespace for the document.
 * @param {XmlService.Namespace} noNamespace Namespace representing no namespace.
 * @return {Array}
 **/
function getXmlNameAndNamespace(value, namespaces, rootNamespace, noNamespace)
{
  //TODO: Should format name and namespace values to comply with XML standards.
  //Should return an array of JSON objects?
  
  if(typeof(value) !== "string")
  {
    return [ value, rootNamespace ];
  }
  
  let values = value.split(':');
  let output = [];
  
  switch(values.length)
  {
    case 0: //"Test"
      output = [ "", rootNamespace ];
      break;
    case 1: //"Test:"
      output = [ values[0], rootNamespace ];
      break;
    default: //"ss:Test", "ss:x:Test", etc
      output = [ values[values.length-1], getXmlNamespace(values[0], namespaces, noNamespace) ];
      
      //If no valid namespace is found, use the noNamespace namespace, and set the value as the raw value.
      if(output[1] == noNamespace)
      {
        output[0] = value;
        output[1] = rootNamespace;
      }
      break;
  }
  
  return output;
}

/**
 * Returns a Namespace value with the given prefix, or no namespace if one cannot be found.
 * @param {string} prefix Prefix used by the desired namespace.
 * @param {Array<XmlService.Namespace>} namespaces Current namespaces used in the document.
 * @param {XmlService.Namespace} noNamespace Namespace representing no namespace.
 * @return {XmlService.Namespace}
 **/
function getXmlNamespace(prefix, namespaces, noNamespace)
{
  for(let i=0; i < namespaces.length; i++)
  {
    if(namespaces[i].getPrefix() === prefix) return namespaces[i];
  }
  
  return noNamespace;
}

/**
 * Formats the given date value based on user settings.
 * @param {Date} value Date value to format.
 * @param {string} timeZone Output timezone for the formatted date.
 * @param {string} formatting Formatting used to format date values.
 * @return {string}
 **/
function formatDateValue(value, timeZone, formatting)
{
  if(!(value instanceof Date))
  {
    value = new Date(value);
  }

  return Utilities.formatDate(value, timeZone, formatting);
}

/**
 * Formats the given XML value based on user settings.
 * @param {any} value Value to format.
 * @param {object} valueFormatSettings Settings for how values should be formatted.
 * @return {any}
 **/
function formatXmlValue(value, valueFormatSettings)
{
  const exportBoolsAsInts = valueFormatSettings["boolsAsInts"];
  const formatDates = valueFormatSettings["formatDates"];
  
  if(exportBoolsAsInts && typeof(value) === "boolean")
  {
    return value ? 1 : 0;
  }
  else if(formatDates && isDate(value, false))
  {
    const dateFormatting =  valueFormatSettings["dateFormatting"];
    const timeZone = dateFormatting["timeZone"];
    const formatString = dateFormatting["formatString"];

    return formatDateValue(value, timeZone, formatString);
  }
  
  return value;
}

/**
 * Formats the given JSON value based on user settings.
 * @param {any} value Value to format.
 * @param {object} valueFormatSettings Settings for how values should be formatted.
 * @return {any}
 **/
function formatJsonValue(value, valueFormatSettings)
{
  const exportBoolsAsInts = valueFormatSettings["boolsAsInts"];
  const formatDates = valueFormatSettings["formatDates"];
  const forceStrings = valueFormatSettings["forceStrings"];
  let newValue = value;

  if(isArray(newValue))
  {
    for(let i=0; i < newValue.length; i++)
    {
      newValue[i] = formatJsonValue(newValue[i], valueFormatSettings);
    }
  }
  else if(formatDates && isDate(newValue, false))
  {
    const dateFormatting =  valueFormatSettings["dateFormatting"];
    const timeZone = dateFormatting["timeZone"];
    const formatString = dateFormatting["formatString"];

    newValue = formatDateValue(newValue, timeZone, formatString);
  }
  else if(isObject(newValue))
  {
    for(key in newValue)
    {
      newValue[key] = formatJsonValue(newValue[key], valueFormatSettings);
    }
  }
  else
  {
    if(exportBoolsAsInts && typeof(value) === "boolean")
    {
      newValue = value ? 1 : 0;
    }

    if(forceStrings && newValue != null)
    {
      newValue = newValue.toString();
    }
  }
  
  return newValue;
}

/**
 * Returns true if a key starts with the specified prefix.
 * @param {string} key Key to evaluate.
 * @param {string} prefix Prefix to check for.
 * @return {boolean}
 **/
function keyHasPrefix(key, prefix)
{
  if(prefix == null || prefix.length === 0 || (prefix.length > key.length)) return false;
  
  let newKey = "";
  
  for(let i=0; i < prefix.length; i++)
  {
    newKey += key[i];
  }
  
  return newKey === prefix;
}

/**
 * Returns true if a key starts with any of the specified prefixes.
 * @param {string} key Key to evaluate.
 * @param {Array<string>} prefixes Prefixes to check for.
 * @return {boolean}
 **/
function keyHasPrefixes(key, prefixes)
{
  for(let i=0; i < prefixes.length; i++)
  {
    if(keyHasPrefix(key, prefixes[i]))
    {
      return true;
    }
  }
  
  return false;
}

/**
 * Returns an array indicating if specific prefixes are used in a given key.
 * Multiple string values can be passed in for the prefixes argument. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
 * @param {string} key
 * @param {...string} prefixes
 * @return {Array<boolean>}
 **/
function getPrefixes(key, prefixes)
{
  let values = [];
  let prefixArgs = [];
  
  //Set initial values
  for(let i=1; i < arguments.length; i++)
  {
    values.push(false);
    prefixArgs.push(arguments[i]);
  }
  
  //Loop through and set if each prefix is used.
  while(keyHasPrefixes(key, prefixArgs))
  {
    for(let i=1; i < arguments.length; i++)
    {
      if(keyHasPrefix(key, arguments[i]))
      {
        values[i-1] = true;
        key = stripPrefix(key, arguments[i]); //Strip the prefix from the key and start the loop again.
      }
    }
  }
  
  return values;
}

/**
 * Strips a given prefix from the passed key (so prefixes like forced JSON arrays' JA_ are not included in the actual exported key value)
 * @param {string} key Key to strip the prefix from.
 * @param {string} prefix Prefix to strip.
 * @return {string}
 **/
function stripPrefix(key, prefix)
{
  if(keyHasPrefix(key, prefix) === true)
  {
    let newKey = "";
    
    for(let i=prefix.length; i < key.length; i++)
    {
      newKey += key[i];
    }
    
    return newKey;
  }
  
  return key;
}

/**
 * Strips the specified prefixes from the passed key.
 * @param {string} key Key to strip prefixes from.
 * @param {...string} prefixes Prefixes to strip.
 * @return {string}
 **/
function stripPrefixes(key, prefixes)
{
  let prefixArgs = [];
  
  //Set initial values
  for(let i=1; i < arguments.length; i++)
  {
    prefixArgs.push(arguments[i]);
  }
  
  //Loop through and set if each prefix is used.
  while(keyHasPrefixes(key, prefixArgs))
  {
    for(let i=1; i < arguments.length; i++)
    {
      if(keyHasPrefix(key, arguments[i]))
      {
        key = stripPrefix(key, arguments[i]); //Strip the prefix from the key and start the loop again.
      }
    }
  }
  
  return key;
}

/**
 * Is the subpath a search pattern (prefixed with #), or is it a hardset path?
 * @param {string} subpath
 * @return {boolean}
 **/
function isSearchSubpath(subpath)
{
  return subpath.length > 0 ? subpath[0] === '#' : false;
}

//TODO: Remove index paths? ({#1}, {#ID}, etc)
//That will only cover paths that end in an index, not paths with multiple indexes in their center... Should add implicit values to path string instead?
//Actually, should function since implied indexes are set as a path iterates
/**
 * Generates a path from sub-paths up to the given index.
 * @param {Array<string>} path Array of sub-paths.
 * @param {number} index Target index to create a path up to.
 * @return {string}
 **/
function getKeyPathString(path, index)
{
  let pathstring = "";
  
  for(let i=0; i < path.length; i++)
  {
    if(index <= i) break;
    if(path[i].length <= 2 || path[i][1] !== '#') pathstring += path[i]; //Only add the suppath if it is not a search path
  }
  
  return pathstring;
}

/**
 * Returns an array representing a key separated into subpaths. Used for nested objects.
 * @param {string} key
 * @return {Array<string>}
 **/
function getKeyPath(key, implicitNames, implicitValues, nestedElements)
{
  let path = [];
  
  if(!keyHasPrefix(key, '[') && !keyHasPrefix(key, '{') || !nestedElements) //TODO: Need to strip out special prefixes like NOEX_
  {
    path.push(key);
  }
  else
  {
    let subPath = "";
    let pathType = "";
  
    for(let i=0; i < key.length; i++)
    {
      if(pathType === "") pathType = key[i];
      
      subPath += key[i];
      
      if((pathType === '[' && key[i] === ']') || (pathType === '{' && key[i] === '}'))
      {
        path.push(subPath);
        
        //Inject implied values when needed and able
        if(pathType === '[' && i < key.length-1 && key[i+1] !== '{')
        {
          let pathInjectString = getKeyPathString(path, path.length);
          
          if(getIndexOf(implicitNames, pathInjectString) >= 0)
          {
            path.push("{#" + (implicitValues[getIndexOf(implicitNames, pathInjectString)] + 1) + "}");
          }
        }
        
        subPath = "";
        pathType = "";
      }
    }
    
    if(subPath.length > 0) path.push(subPath);
    
    //Check that the last element in the path is a key path type. If not, make one from the last existing element.
    if(getSubpathTypeJson(path[path.length-1]) !== SubpathTypes.Key)
    {
      let keyPath = trimKeySubpath(path[path.length-1]);
      
      if(isSearchSubpath(keyPath)) keyPath = keyPath.substring(1);
      
      //If the last part of the key path is a number, make the last key path an actual Number
      //if(!isNaN(keyPath)) keyPath = Number(keyPath);
      
      path.push(keyPath);
    }
  }
  
  return path;
}

/**
 * Trims leading and trailing reserved chars such as '{' and '['
 * @param {string} key
 * @return {string}
 **/
function trimKeySubpath(key)
{
  return key.substring(1, key.length-1);
}

/**
 * Returns the type of a subpath in an XML export nested element key.
 * @param {string} subpath
 * @return {number}
 **/
function getSubpathTypeXml(subpath)
{
  let type = SubpathTypes.Key;
  
  if(subpath.length > 0)
  {
    switch(subpath[0])
    {
      case '[':
      type = SubpathTypes.Array;
      break;
      
      case '{':
      type = SubpathTypes.Attribute;
      break;
    }
  }
  
  return type;
}

/**
 * Returns the type of a subpath in a JSON export nested element key.
 * @param {string} subpath
 * @return {number}
 **/
function getSubpathTypeJson(subpath)
{
  let type = SubpathTypes.Key;
  
  if(subpath.length > 0)
  {
    switch(subpath[0])
    {
      case '[':
        type = SubpathTypes.Array;
        break;
      
      case '{':
        type = SubpathTypes.Object;
        break;
    }
  }
  
  return type;
}

/**
 * What type of search does the subpath indicate?
 * @param {string} subpath
 * @return {number}
 **/
function getSubpathSearchType(subpath)
{
  let type = SearchTypes.None;
  
  if(subpath.length > 0)
  {
    if(!isNaN(Number(subpath))) //Index
    {
      type = SearchTypes.Index;
    }
    //TODO: This can only work if sheetJsonArray/Object are added to the root object first...
    /*else if(subpath == "ROOT")
    {
      type = SearchTypes.Root;
    }*/
    else if(subpath == "SHEET")
    {
      type = SearchTypes.Sheet;
    }
    else if(subpath == "ROW") //Row based index
    {
      type = SearchTypes.Row;
    }
    else //Field
    {
      type = SearchTypes.Field;
    }
  }
  
  return type;
}

/**
 * Trims a value of whitespace if it is a string. Otherwise returns the value unaltered.
 * @param {any} value
 **/
function trimSafe(value)
{
  if(typeof(value) === 'string') return value.trim();

  return value;
}

/**
 * Formats empty cell values to use the appropriate value (null or "")
 * @param {string} formatType
 **/
function getEmptyCellValueJson(formatType)
{
  switch(formatType)
  {
    case "string": return "";
  }
  
  return null;
}

/**
 * Formats cell values containing the string "null" to use the appropriate value (null or "null")
 * @param {string} formatType
 **/
function getNullCellValueJson(formatType)
{
  switch(formatType)
  {
    case "string": return "null";
  }
  
  return null;
}

/**
 * Attempts to parse a JSON string representing an array and return its contents in an array.
 * @param {string} jsonString
 * @return {Array}
 **/
function tryParseJsonArrayString(jsonString)
{
  let newJsonString = '{"json":' + jsonString + '}'; //Make a JSON object string.
  let json = null;
  let results = null;
  
  try
  {
    json = JSON.parse(newJsonString); //Let the native JSON parser parse the array for us.
    results = json["json"];
  }
  catch(e)
  {
    results = []; //If the string can't be parsed, then return an empty array.
  }
  
  return results;
}

/**
 * Export data as XML.
 * @param {string} formatSettings Settings for the export process.
 * @param {function} callback Callback invoked to pass the exported XML.
 **/
function exportXml(formatSettings, callback)
{
  showCompilingMessage('Compiling XML...');
  
  exportTime = Date.now();
  
  try
  {
    exportSpreadsheetXml(formatSettings, callback == null ? exportDocument : callback);
  }
  catch (e)
  {
    openErrorModal('XML Export Error!', "Encountered an error while exporting XML. See the error below for more details.", e.stack);
    return;
  }
  
  let tempSettings = JSON.parse(formatSettings);
  
  tempSettings[Keys.FileSettings.Visualize] = false;
  
  formatSettings = JSON.stringify(tempSettings);
  
  setPrevExportProperties(formatSettings);
}

/**
 * Export data as JSON.
 * @param {string} formatSettings Settings for the export process.
 * @param {function} callback Callback invoked to pass the exported JSON.
 **/
function exportJson(formatSettings, callback)
{
  showCompilingMessage('Compiling JSON...');
  
  exportTime = Date.now();
  
  try
  {
    exportSpreadsheetJson(formatSettings, callback == null ? exportDocument : callback);
  }
  catch (e)
  {
    openErrorModal('JSON Export Error!', "Encountered an error while exporting JSON. See the error below for more details.", e.stack);
    return;
  }
  
  let tempSettings = JSON.parse(formatSettings);
  
  tempSettings[Keys.FileSettings.Visualize] = false;
  
  formatSettings = JSON.stringify(tempSettings);
  
  setPrevExportProperties(formatSettings);
}

/**
 * Convert sheet data into an XML string. The string, along with relevant publishing data, will be passed to the given callback function.
 * @param {string} formatSettings
 * @param {function} callback
 **/
function exportSpreadsheetXml(formatSettings, callback)
{
  //Settings
  let settings = JSON.parse(formatSettings);
  let exportSettings = settings[Keys.Objects.Export];
  let exportXmlSettings = exportSettings[Keys.Objects.XML];
  let xmlSettings = settings[Keys.Objects.XML];
  let xmlAdvancedSettings = xmlSettings[Keys.Objects.Advanced];
  
  //File settings
  let exportFolderType = exportSettings[Keys.ExportSettings.Export.FolderType];
  let exportFolderId = exportSettings[Keys.ExportSettings.Export.FolderId];
  let replaceFile = exportXmlSettings[Keys.ExportSettings.Export.XML.ReplaceFileType] === ReplaceFileOptions.Enabled;
  let replaceFileId = exportXmlSettings[Keys.ExportSettings.Export.XML.ReplaceFileId];

  let visualize = settings[Keys.FileSettings.Visualize];
  let singleSheet = settings[Keys.FileSettings.SingleSheet];
  let customSheets = settings[Keys.ExportSettings.TargetSheets];
  //General
  let minifyData = settings[Keys.ExportSettings.MinifyData];
  let exportBoolsAsInts = settings[Keys.ExportSettings.ExportBoolsAsInts];
  let ignoreEmpty = settings[Keys.ExportSettings.IgnoreEmptyCells];
  let includeFirstColumn = settings[Keys.ExportSettings.IncludeFirstColumn];
  //Advanced
  let unwrap = settings[Keys.ExportSettings.UnwrapSingleRows];
  let collapse = settings[Keys.ExportSettings.CollapseSingleRows] && !unwrap;
  let ignorePrefix = settings[Keys.ExportSettings.IgnorePrefix];
  let unwrapPrefix = settings[Keys.ExportSettings.UnwrapPrefix];
  let collapsePrefix = settings[Keys.ExportSettings.CollapsePrefix];
  let dateFormatType = settings[Keys.ExportSettings.DateFormat];
  let shouldFormatDate = dateFormatType !== DateTimeFormats.Default;
  let dateTimeZone = settings[Keys.ExportSettings.DateTimeZone];
  let dateFormatString = settings[Keys.ExportSettings.DateFormatString];

  //Nested Elements
  //let nestedElements = settings[Keys.ExportSettings.NestedElements];
  
  //XML settings
  let useChildElements = xmlSettings[Keys.ExportSettings.XML.ExportChildElements];
  let rootElement = xmlSettings[Keys.ExportSettings.XML.RootElement];
  //Advanced
  let nameReplacementChar = xmlAdvancedSettings[Keys.ExportSettings.XML.Advanced.NameReplacementChar];
  let declarationVersion = xmlAdvancedSettings[Keys.ExportSettings.XML.Advanced.DeclarationVersion];
  let declarationEncoding = xmlAdvancedSettings[Keys.ExportSettings.XML.Advanced.DeclarationEncoding];
  let declarationStandalone = xmlAdvancedSettings[Keys.ExportSettings.XML.Advanced.DeclarationStandalone];
  let attributePrefix = xmlAdvancedSettings[Keys.ExportSettings.XML.Advanced.AttributePrefix];
  let childElementPrefix = xmlAdvancedSettings[Keys.ExportSettings.XML.Advanced.ChildElementPrefix];
  let innerTextPrefix = xmlAdvancedSettings[Keys.ExportSettings.XML.Advanced.InnerTextPrefix];
  //Namepsaces
  let rootNamespaceRaw = xmlAdvancedSettings[Keys.ExportSettings.XML.Advanced.RootNamespace];
  let namespacesRaw = xmlAdvancedSettings[Keys.ExportSettings.XML.Advanced.Namespaces];
  
  //Set up actual XmlNamespace values
  let noNamespace = XmlService.getNoNamespace();
  let rootNamespace = rootNamespaceRaw === "" ? XmlService.getNoNamespace() : XmlService.getNamespace(rootNamespaceRaw);
  let namespaces = [];
  
  for(let i=0; i < namespacesRaw.length; i++)
  {
    if(namespacesRaw[i]["prefix"] !== "" && namespacesRaw[i]["uri"] !== "")
    {
      namespaces.push(XmlService.getNamespace(namespacesRaw[i]["prefix"], namespacesRaw[i]["uri"]));
    }
  }

  //Value format data
  let valueFormatSettings = {
    "boolsAsInts" : exportBoolsAsInts,
    "formatDates" : shouldFormatDate
  };

  if(shouldFormatDate)
  {
    valueFormatSettings["dateFormatting"] = {
      "timeZone": dateTimeZone,
      "formatString" : dateFormatString
    };
  }
  
  //Sheets info
  let spreadsheet = SpreadsheetApp.getActive();
  let sheets = spreadsheet.getSheets();
  let exportMessage = "";
  let exportMessageHeight = 0;
  
  if(customSheets != null)
  {
    sheets = getActiveExportSheets(customSheets);
  }
  
  let fileName = spreadsheet.getName() + (singleSheet ? (" - " + sheets[0].getName()) : "") + ".xml";
  //let sheetValues = [[]];
  
  //Create the root XML element. https://developers.google.com/apps-script/reference/xml-service/
  let xmlRoot = XmlService.createElement(formatXmlName(rootElement, nameReplacementChar), rootNamespace);
  
  if(namespaces.length > 0)
  {
    //Manual parsing is needed because Apps Script doesn't support declaring more than one namespace per element currently.
    let rootString = "<" + formatXmlName(rootElement, nameReplacementChar);
    
    if(rootNamespaceRaw !== "") rootString += ` xmlns="${rootNamespaceRaw}"`;
    
    for(let i=0; i < namespaces.length; i++)
    {
      rootString += ` xmlns:${namespaces[i].getPrefix()}="${namespaces[i].getURI()}"`;
    }
    
    rootString += " />";
    
    let tempDoc = XmlService.parse(rootString);
    
    xmlRoot = tempDoc.getRootElement();
    xmlRoot.detach(); //Detatch root element from the parsed XmlDocument for later use.
  }
  
  let cachedRowNames = {};
  
  for(let i=0; i < sheets.length; i++)
  {
    let cachedColumnNames = {};
    //let cachedColumnNamespaces = {};
    let sheetName = sheets[i].getName();
    let range = sheets[i].getDataRange();
    let values = range.getValues();
    let rows = range.getNumRows();
    let columns = range.getNumColumns();
    let unwrapSheet = unwrap && rows <= 2;
    let collapseSheet = collapse && rows <= 2;
    
    let forceUnwrap = false;
    let forceCollapse = false;
    
    //Get the prefixes used by this sheet
    let activePrefixes = getPrefixes(sheetName, unwrapPrefix, collapsePrefix);
    sheetName = stripPrefixes(sheetName, unwrapPrefix, collapsePrefix);
    
    let sheetXml = XmlService.createElement(formatXmlName(sheetName, nameReplacementChar), rootNamespace);
    
    if(activePrefixes[0])
    {
      forceUnwrap = true;
    }
    
    if(activePrefixes[1])
    {
      forceCollapse = true;
    }
    
    if(forceUnwrap)
    {
      unwrapSheet = true;
      collapseSheet = false;
    }
    else if(forceCollapse)
    {
      unwrapSheet = false;
      collapseSheet = true;
    }
    
    let columnNamesAndNamespaces = [];
    
    for(let j=0; j < columns; j++)
    {
      columnNamesAndNamespaces.push(getXmlNameAndNamespace(values[0][j], namespaces, rootNamespace, noNamespace));
    }
    
    //j = 1 because we don't need the keys to have a row
    for(let j=1; j < rows; j++)
    {
      //Skip rows with the ignore prefix
      if(keyHasPrefix(values[j][0], ignorePrefix)) continue;

      //If the first cell in a row starts with !--, treat the row as a comment
      let isComment = (values[j][0] === "!--");
      let attributeKeys = [];
      let childElementKeys = [];
      let innerTextKeys = [];
      let attributes = [];
      let childElements = [];
      let innerTextElements = [];
      let attributeNamespaces = [];
      let childElementNamespaces = [];
      
      //Build the actual row XML
      let rowXml = XmlService.createElement("Comment");
      
      //Separate columns into those that export as child elements or attributes
      //Exclude the first column by default since it is used as the name of the row element, or because this is a comment element
      let startIndex = (includeFirstColumn && !isComment) ? 0 : 1;
      
      for(let k=startIndex; k < columns; k++)
      {
        if(values[0][k] === "" || values[0][k] == null) continue; //Skip columns with empty keys
        if((ignoreEmpty || isComment) && values[j][k] === "") continue; //Skip empty cells if desired or a comment
        
        if(isComment)
        {
          if(values[j][k] == null) continue; //Skip empty cells
          
          let text = rowXml.getText();
          rowXml.setText((text === "") ? values[j][k] : (text + "\n" + values[j][k])); //TODO: Expose separation char
        }
        else
        {
          let columnNameAndNamespace = columnNamesAndNamespaces[k];
          
          //TODO: Cached column name should use the prefix stripped values...
          //if(!cachedColumnNames.hasOwnProperty(columnNameAndNamespace[0])) cachedColumnNames[columnNameAndNamespace[0]] = formatXmlName(columnNameAndNamespace[0], nameReplacementChar);

          //Skip columns with the ignore prefix
          if(keyHasPrefix(columnNameAndNamespace[0], ignorePrefix)) continue;
        
          let columnNamespace = columnNameAndNamespace[1];

          //Child Elements
          if((useChildElements && !keyHasPrefix(columnNameAndNamespace[0], attributePrefix) && !keyHasPrefix(columnNameAndNamespace[0], innerTextPrefix)) || 
            keyHasPrefix(columnNameAndNamespace[0], childElementPrefix))
          {
            if(!cachedColumnNames.hasOwnProperty(columnNameAndNamespace[0])) cachedColumnNames[columnNameAndNamespace[0]] = formatXmlName(stripPrefix(columnNameAndNamespace[0], childElementPrefix), nameReplacementChar);
            
            childElementKeys.push(cachedColumnNames[columnNameAndNamespace[0]])//stripPrefix(columnNameAndNamespace[0], childElementPrefix));
            childElements.push(values[j][k]);
            childElementNamespaces.push(columnNamespace);
          }
          //Attributes
          else if(!keyHasPrefix(columnNameAndNamespace[0], innerTextPrefix))
          {
            if(!cachedColumnNames.hasOwnProperty(columnNameAndNamespace[0])) cachedColumnNames[columnNameAndNamespace[0]] = formatXmlName(stripPrefix(columnNameAndNamespace[0], attributePrefix), nameReplacementChar);
            
            attributeKeys.push(cachedColumnNames[columnNameAndNamespace[0]])//stripPrefix(columnNameAndNamespace[0], attributePrefix));
            attributes.push(values[j][k]);
            attributeNamespaces.push(columnNamespace);
          }
          //Inner Text
          else
          {
            if(!cachedColumnNames.hasOwnProperty(columnNameAndNamespace[0])) cachedColumnNames[columnNameAndNamespace[0]] = formatXmlName(stripPrefix(columnNameAndNamespace[0], innerTextPrefix), nameReplacementChar);
            
            innerTextKeys.push(cachedColumnNames[columnNameAndNamespace[0]])//stripPrefix(columnNameAndNamespace[0], innerTextPrefix));
            innerTextElements.push(values[j][k]);
          }
          
          //Make a note if an element name gets formatted so users know they do not have proper formatting
          if(exportMessage === "" && columnNameAndNamespace[0] !== cachedColumnNames[columnNameAndNamespace[0]])//formatXmlName(columnNameAndNamespace[0], nameReplacementChar))
          {
            exportMessage = "Some keys have been auto-formatted to match XML standards.";
            exportMessageHeight = 25;
          }
        }
      }
      
      //Finish Comment logic
      if(isComment)
      {
        //Replace '-' with '_' as hyphens cause errors in comment nodes
        sheetXml.addContent(XmlService.createComment(rowXml.getText().replace(/[-]/g, '_')));
        
        continue;
      }
      
      let rowNameAndNamespace = getXmlNameAndNamespace(values[j][0], namespaces, rootNamespace, noNamespace);
      let rowNamespace = rowNameAndNamespace[1];
      
      if(!cachedRowNames.hasOwnProperty(rowNameAndNamespace[0])) cachedRowNames[rowNameAndNamespace[0]] = formatXmlName(rowNameAndNamespace[0], nameReplacementChar);
      
      //Build the actual row XML
      rowXml = XmlService.createElement(cachedRowNames[rowNameAndNamespace[0]], rowNamespace);//formatXmlName(rowNameAndNamespace[0], nameReplacementChar), rowNamespace);
      
      //Set attributes
      for(let k=0; k < attributes.length; k++)
      {
        //Atributes without custom namespaces will throw an error when attempting to set them with a default namespace so just use a namespace-less creation method.
        //if(attributeNamespaces[k].getPrefix() === "") rowXml.setAttribute(formatXmlName(attributeKeys[k], nameReplacementChar), formatXmlValue(trimSafe(attributes[k]), exportBoolsAsInts));
        //else rowXml.setAttribute(formatXmlName(attributeKeys[k], nameReplacementChar), formatXmlValue(trimSafe(attributes[k]), exportBoolsAsInts), attributeNamespaces[k]);
        if(attributeNamespaces[k].getPrefix() === "") rowXml.setAttribute(attributeKeys[k], formatXmlValue(trimSafe(attributes[k]), valueFormatSettings));
        else rowXml.setAttribute(attributeKeys[k], formatXmlValue(trimSafe(attributes[k]), valueFormatSettings), attributeNamespaces[k]);
      }
      
      //Set child elements
      for(let k=0; k < childElements.length; k++)
      {
        //let childXml = XmlService.createElement(formatXmlName(childElementKeys[k], nameReplacementChar), childElementNamespaces[k]);
        let childXml = XmlService.createElement(childElementKeys[k], childElementNamespaces[k]);
        
        childXml.setText(formatXmlValue(trimSafe(childElements[k]), valueFormatSettings));
        
        rowXml.addContent(childXml);
      }
      
      //Set inner text
      if(innerTextElements.length > 0)
      {
        let innerText = "";
        
        for(let k=0; k < innerTextElements.length; k++)
        {
          innerText += formatXmlValue(trimSafe(innerTextElements[k]), valueFormatSettings);
          
          if(k < innerTextElements.length - 1) innerText += "\n";
        }
        
        let xmlText = XmlService.createText(innerText);
        
        rowXml.addContent(xmlText);
      }
      
      sheetXml.addContent(rowXml);
    }
    
    if(singleSheet || unwrapSheet)
    {
      //Detach the sheet's child content and add them to the document directly.
      let sheetChildren = sheetXml.getAllContent();
      
      for(let k=0; k < sheetChildren.length; k++)
      {
        sheetChildren[k].detach();
        xmlRoot.addContent(sheetChildren[k]);
      }
    }
    else
    {
      if(collapseSheet)
      {
        let sheetChildren = sheetXml.getAllContent();
        
        for(let k=0; k < sheetChildren.length; k++)
        {
          sheetChildren[k].detach();
          let rowChildren = sheetChildren[k].getAllContent();
          
          for(let l=0; l < rowChildren.length; l++)
          {
            rowChildren[l].detach();
            sheetXml.addContent(rowChildren[l]);
          }
        }
      }
      
      xmlRoot.addContent(sheetXml);
    }
  }
  
  let xmlDoc = XmlService.createDocument(xmlRoot); //Create the final XML document for export.
  let xmlFormat = minifyData ? XmlService.getRawFormat() : XmlService.getPrettyFormat(); //Select which format to export the XML as.
  xmlFormat.setOmitDeclaration(true); //Remove the default XML declaration so we can build our own if desired.
  
  if(declarationVersion !== "" && declarationEncoding !== "") xmlFormat.setEncoding(declarationEncoding); //Set the encoding method used by the XML document
  
  let xmlRaw = xmlFormat.format(xmlDoc);
  
  if(declarationVersion !== "")
  {
    //TODO: Can probably do this with XmlService? https://developers.google.com/apps-script/reference/xml-service/doc-type
    let xmlDeclaration = '<?xml version="' + declarationVersion + '"';
    
    if(declarationEncoding !== "") xmlDeclaration += ' encoding="' + declarationEncoding + '"';
    if(declarationStandalone !== "") xmlDeclaration += ' standalone="' + declarationStandalone + '"';
    
    xmlDeclaration += '?>\n';
    
    xmlRaw = xmlDeclaration + xmlRaw;
  }

  let fileSettings = {};

  fileSettings[Keys.FileSettings.Filename] = fileName;
  fileSettings[Keys.FileSettings.Mime] = MimeTypes.XML;
  fileSettings[Keys.FileSettings.Visualize] = visualize;
  fileSettings[Keys.FileSettings.ExportFolder] = exportFolderType;
  fileSettings[Keys.FileSettings.ExportFolderId] = exportFolderId;
  fileSettings[Keys.FileSettings.ReplaceFile] = replaceFile;
  fileSettings[Keys.FileSettings.ReplaceFileId] = replaceFileId;
  fileSettings[Keys.FileSettings.Message] = exportMessage;
  fileSettings[Keys.FileSettings.MessageHeight] = exportMessageHeight;
  fileSettings[Keys.FileSettings.Content] = xmlRaw;
  
  callback(JSON.stringify(fileSettings));
}

/**
 * Convert sheet data into a JSON string. The string, along with relevant publishing data, will be passed to the given callback function.
 * @param {string} formatSettings Settings for the export operation.
 * @param {function} callback Callback invoked to pass data used when creating a document.
 **/
function exportSpreadsheetJson(formatSettings, callback)
{
  //Settings
  let settings = JSON.parse(formatSettings);
  let exportSettings = settings[Keys.Objects.Export];
  let exportJsonSettings = exportSettings[Keys.Objects.JSON];
  let jsonSettings = settings[Keys.Objects.JSON];
  let jsonAdvancedSettings = jsonSettings[Keys.Objects.Advanced];
  
  //File settings
  let exportFolderType = exportSettings[Keys.ExportSettings.Export.FolderType];
  let exportFolderId = exportSettings[Keys.ExportSettings.Export.FolderId];
  let replaceFile = exportJsonSettings[Keys.ExportSettings.Export.JSON.ReplaceFileType] === ReplaceFileOptions.Enabled;
  let replaceFileId = exportJsonSettings[Keys.ExportSettings.Export.JSON.ReplaceFileId];

  let visualize = settings[Keys.FileSettings.Visualize];
  let singleSheet = settings[Keys.FileSettings.SingleSheet];
  let customSheets = settings[Keys.ExportSettings.TargetSheets];
  //General
  let minifyData = settings[Keys.ExportSettings.MinifyData];
  let exportBoolsAsInts = settings[Keys.ExportSettings.ExportBoolsAsInts];
  let includeFirstColumn = settings[Keys.ExportSettings.IncludeFirstColumn];
  let ignoreEmpty = settings[Keys.ExportSettings.IgnoreEmptyCells];
  //Advanced
  let unwrap = settings[Keys.ExportSettings.UnwrapSingleRows];
  let collapse = settings[Keys.ExportSettings.CollapseSingleRows] && !unwrap;
  let ignorePrefix = settings[Keys.ExportSettings.IgnorePrefix];
  let unwrapPrefix = settings[Keys.ExportSettings.UnwrapPrefix];
  let collapsePrefix = settings[Keys.ExportSettings.CollapsePrefix];
  let dateFormatType = settings[Keys.ExportSettings.DateFormat];
  let shouldFormatDate = dateFormatType !== DateTimeFormats.Default;
  let dateTimeZone = settings[Keys.ExportSettings.DateTimeZone];
  let dateFormatString = settings[Keys.ExportSettings.DateFormatString];
  
  //Nested Settings
  let nestedElements = settings[Keys.ExportSettings.NestedElements];

  //JSON settings
  let forceString = jsonSettings[Keys.ExportSettings.JSON.ForceStringValues];
  let exportCellArray = jsonSettings[Keys.ExportSettings.JSON.ExportCellArray];
  let sheetArrayJson = jsonSettings[Keys.ExportSettings.JSON.ExportSheetArray];
  let valueArray = jsonSettings[Keys.ExportSettings.JSON.ExportValueArray];
  //JSON Advanced
  let contentsArray = jsonAdvancedSettings[Keys.ExportSettings.JSON.Advanced.ExportContentsAsArray];
  let exportCellObjectJson = jsonAdvancedSettings[Keys.ExportSettings.JSON.Advanced.ExportCellObject];
  let emptyValueFormat = jsonAdvancedSettings[Keys.ExportSettings.JSON.Advanced.EmptyValueFormat];
  let nullValueFormat = jsonAdvancedSettings[Keys.ExportSettings.JSON.Advanced.NullValueFormat];
  let separatorChar = jsonAdvancedSettings[Keys.ExportSettings.JSON.Advanced.SeparatorChar];
  let arrayPrefix = jsonAdvancedSettings[Keys.ExportSettings.JSON.Advanced.ForceArrayPrefix];
  let nestedArrayPrefix = jsonAdvancedSettings[Keys.ExportSettings.JSON.Advanced.ForceNestedArrayPrefix];

  //Value format data
  let valueFormatSettings = {
    "boolsAsInts" : exportBoolsAsInts,
    "formatDates" : shouldFormatDate,
    "forceStrings": forceString
  };

  if(shouldFormatDate)
  {
    valueFormatSettings["dateFormatting"] = {
      "timeZone": dateTimeZone,
      "formatString" : dateFormatString
    };
  }
  
  //Sheets info
  let spreadsheet = SpreadsheetApp.getActive();
  let sheets = spreadsheet.getSheets();
  
  if(customSheets != null)
  {
    sheets = getActiveExportSheets(customSheets);
  }
  
  let fileName = spreadsheet.getName() + (singleSheet ? (" - " + sheets[0].getName()) : "") + ".json"; //TODO: Need to strip prefixes
  //let sheetValues = [[]];
  let rawValue = "";
  let objectValue = {};
  let exportMessage = "";
  let exportMessageHeight = 0;
  let nestedFormattingError = false;
  let nestedFormattingErrorMessage = "There was a problem with nested formatting for these fields:\n";
  
  for(let i=0; i < sheets.length; i++)
  {
    let range = sheets[i].getDataRange();
    let values = range.getValues();
    let rows = range.getNumRows();
    let columns = range.getNumColumns();
    //Will this sheet be unwrapped?
    let unwrapSheet = unwrap && rows <= 2;
    //Will this sheet be collapsed
    let collapseSheet = collapse && rows <= 2 && !unwrapSheet;
    let sheetName = sheets[i].getName();
    let sheetArray = sheetArrayJson;
    //Is this sheet a value array?
    let sheetIsValueArray = (valueArray && columns === 1);
    let sheetJsonObject = {};
    let sheetJsonArray = [];
    //Used to keep associations with implicit key values per row.
    let rowImplicitNames = [];
    let rowImplicitValues = [];
    //Will be set to true if any nesting occurs.
    let hasNesting = false;
    //If true, the sheet's contents will be in an array
    let useNestingArray = false;
    //If true, all keys in the sheet will have "{#SHEET}{#ROW}" inserted at their beginning.
    let forceNestedArray = false;
    
    let forceUnwrap = false;
    let forceCollapse = false;
    
    //Get the prefixes used by this sheet
    let activePrefixes = getPrefixes(sheetName, nestedArrayPrefix, arrayPrefix, unwrapPrefix, collapsePrefix);
    sheetName = stripPrefixes(sheetName, nestedArrayPrefix, arrayPrefix, unwrapPrefix, collapsePrefix);
    
    //Nested Array Prefix
    if(activePrefixes[0] === true)
    {
      forceNestedArray = true;
      useNestingArray = true;
    }
    
    //JSON Array Prefix
    if(activePrefixes[1] === true)
    {
      sheetArray = true;
    }
    
    //Unwrap prefix
    if(activePrefixes[2] === true)
    {
      forceUnwrap = true;
    }
    
    //Collapse prefix
    if(activePrefixes[3] === true)
    {
      if(!forceUnwrap) forceCollapse = true;
    }
    
    //Determine forced unwrap / collapse values
    if(forceCollapse)
    {
      unwrapSheet = false;
      collapseSheet = true;
    }
    else if(forceUnwrap)
    {
      unwrapSheet = true;
      collapseSheet = false;
    }
    
    //If we are exporting all contents as a raw JSON array, force sheet array to be true.
    if(contentsArray && singleSheet && rows > 2)
    {
      sheetArray = true;
    }
    
    //If both nested elements and sheet arrays are enabled, need to know which to use for this sheet
    if(sheetArray && nestedElements && !useNestingArray)
    {
      //At least one column is using nested element syntax
      let keyNesting = false;
      //At least one column is not set up to use nested array syntax (prefaced with {#SHEET}{#ROW})
      let keyNestingIsArray = true;
      
      for(let j=0; j < columns; j++)
      {
        //Skip columns with empty keys
        if(values[0][j] === "" || values[0][j] == null) continue;
        
        let keyPath = getKeyPath(values[0][j], rowImplicitNames, rowImplicitValues, nestedElements);
        
        if(keyPath.length == 1) continue;
        else keyNesting = true;
        
        if(keyPath.length <= 2)
        {
          keyNestingIsArray = false;
          break;
        }
        else if(keyPath[0] !== "{#SHEET}" || keyPath[1] !== "{#ROW}")
        {
          keyNestingIsArray = false;
        }
        
        if(keyNesting && !keyNestingIsArray) break;
      }
      
      if(!keyNesting || keyNestingIsArray) useNestingArray = true;
    }
    
    if(unwrap && rows > 2 && !forceUnwrap) unwrapSheet = false;
    
    //j = 1 because we don't need the keys to have a row
    for(let j=1; j < rows; j++)
    {
      //Skip rows with the ignore prefix
      if(keyHasPrefix(values[j][0], ignorePrefix)) continue;
    
      //let rowArray = [];
      let rowObject = {};
      //Used to keep associations with row indexes correct
      let rowIndexNames = [];
      let rowIndexValues = [];
      
      if(!sheetIsValueArray)
      {
        let startIndex = (includeFirstColumn || sheetArray || nestedElements) ? 0 : 1;
        
        for(let k=startIndex; k < columns; k++)
        {
          let keyPrefix = "";
          
          //Skip columns with empty keys
          if(values[0][k] === "" || values[0][k] == null) continue;
          //Skip empty cells if desired (can help cut down on clutter)
          if(ignoreEmpty && (values[j][k] === "" || values[j][k] == null)) continue;
          
          let key = values[0][k];
          
          //Strip prefixes from front of nested key so they can be added to the actual key
          if(keyHasPrefix(key, ignorePrefix))
          {
            key = stripPrefix(key, ignorePrefix);
            keyPrefix = ignorePrefix;
          }
          else if(keyHasPrefix(key, arrayPrefix))
          {
            key = stripPrefix(key, arrayPrefix);
            keyPrefix = arrayPrefix;
          }
          
          //Get the path specified by the key (for nested object support)
          let keyPath = getKeyPath(key, rowImplicitNames, rowImplicitValues, nestedElements);
          //Get the actual key value
          key = keyPath[keyPath.length-1];
          
          if(keyPrefix !== "") key = keyPrefix + key;
          //Skip columns with the ignore prefix
          if(keyHasPrefix(key, ignorePrefix)) continue;
          
          if(forceNestedArray) //Insert forced {#SHEET} and {#ROW} values
          {
            if(keyPath[0] !== "{#SHEET}") //Only insert sheet path if it doesn't already exist
            {
              keyPath.splice(0, 0, "{#SHEET}");
            }
            
            if(keyPath[1] !== "{#ROW}") //Only insert row path if it doesn't already exist
            {
              keyPath.splice(1, 0, "{#ROW}");
            }
          }
          
          let content = trimSafe(values[j][k]);
          
          //if(typeof(content) === 'string') content = content.trim();
          
          //We want to export this cell as a json object, so attempt to parse it to an object format, and make it empty if that fails
          if(exportCellObjectJson && typeof(content) === 'string')
          {
            if(content[0] === '{' && content[content.length-1] === '}')
            {
              try
              {
                content = JSON.parse(content);
              }
              catch(e)
              {
                content = {};
              }
            }
            else if(content[0] === '[' && content[content.length-1] === ']')
            {
              content = tryParseJsonArrayString(content);
            }
          }
          
          //We want to export cell arrays, or this column should be exported as an array, so convert the target cell's value to an array of values.
          if(exportCellArray || keyHasPrefix(key, arrayPrefix))
          {
            let forceArray = keyHasPrefix(key, arrayPrefix);
            let cellArray = [];
            let cellArrayStatus = getCellContentArray(content, separatorChar, cellArray);

            switch(cellArrayStatus)
            {
              case 0: //Value isn't a string, so can't be an array.
                //Force arrays when exporting due to prefix.
                if(forceArray) content = cellArray;
                break;
              case 1: //Full array
                content = cellArray;
                break;
              case 2: //Escaped single string
                if(forceArray) content = cellArray;
                else content = cellArray[0];
                break;
            }
          }

          content = formatJsonValue(content, valueFormatSettings);
          
          //Convert the key to a string and strip unneeded prefixes
          if(arrayPrefix != "") key = stripPrefix(key.toString(), arrayPrefix);
          else key = key.toString();
          
          //TODO: Need a NONEST_ prefix to ignore nested formatting for a column
          let element = useNestingArray ? sheetJsonArray : sheetJsonObject; 
          
          //Check that we are using nested objects and the key's path has more than one element to it.
          if(nestedElements && keyPath.length > 1)
          {
            if(!hasNesting) hasNesting = true;
            
            rowObject[key] = content;
            
            //Loop through the key path (minus the actual key)
            for(let l=0; l < keyPath.length-1; l++)
            {
              let cachedElement = element;
              let subpathType = getSubpathTypeJson(keyPath[l]);
              let subpath = trimKeySubpath(keyPath[l]);
              let foundMatch = false;
              //If searching through an array, need to ensure that values are only added to an object element, not an int or string.
              let firstObjectIndex = -1;
              
              //Check if the subpath points to an object and is meant to be searched for somehow (either by key or index)
              if(subpathType == SubpathTypes.Object && isSearchSubpath(subpath))
              {
                //Get the substring of the key so we know what type of search to perform
                subpath = subpath.substring(1);
                //Get the type of search specified by nesting formatting in the column key
                let searchType = getSubpathSearchType(subpath);
                
                switch(searchType)
                {
                  //Search for a field with a matching name and value
                  case SearchTypes.Field:
                  //The current element is an array, so look through each element for the first element with the target field with a matching value
                  if(isArray(element))
                  {
                    //Fieldless element is used to find an element in the array that doesn't have the specified subpath field.
                    let fieldlessElement = -1;
                    
                    for(let m=0; m < element.length; m++)
                    {
                      //Should only examine array elements if they are objects, not types like int or string
                      if(isObject(element[m]))
                      {
                        if(firstObjectIndex < 0) firstObjectIndex = m;
                        
                        let arrayElement = element[m];
                        
                        if(arrayElement.hasOwnProperty(subpath))
                        {
                          if(arrayElement[subpath] === rowObject[subpath])
                          {
                            foundMatch = true;
                            element = arrayElement;
                            break;
                          }
                        }
                        else
                        {
                          if(m < 0) fieldlessElement = m;
                        }
                      }
                    }
                    
                    if(!foundMatch && firstObjectIndex >= 0)
                    {
                      if(fieldlessElement >= 0) firstObjectIndex = fieldlessElement;
                      else firstObjectIndex = element.length;
                      
                      //Set values for implicit association
                      if(getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l)) < 0)
                      {
                        rowImplicitNames.push(getKeyPathString(keyPath, l));
                        rowImplicitValues.push(firstObjectIndex);
                      }
                      else
                      {
                        rowImplicitValues[getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l))] = firstObjectIndex;
                      }
                    }
                  }
                  else
                  {
                    //The current element is an array, so look through its elements to find the target element
                    if(element.hasOwnProperty(subpath))
                    {
                      if(element[subpath] === rowObject[subpath])
                      {
                        foundMatch = true;
                        element = element[subpath];
                      }
                    }
                  }
                  break;
                  
                  case SearchTypes.Root:
                  foundMatch = true;
                  element = objectValue;
                  break;
                  
                  case SearchTypes.Sheet:
                  foundMatch = true;
                  element = useNestingArray ? sheetJsonArray : sheetJsonObject;
                  break;
                  
                  //Search for an array element at the index matching this row's index
                  case SearchTypes.Row:
                  //Only update the value if the element is an array
                  if(isArray(element))
                  {
                    //j - 1, subtracting 1 for the key row
                    let rowIndex = j - 1;
                    
                    if(getIndexOf(rowIndexNames, (getKeyPathString(keyPath, l) + "|" + (j-1))) >= 0)
                    {
                      rowIndex = rowIndexValues[getIndexOf(rowIndexNames, (getKeyPathString(keyPath, l) + "|" + (j-1)))];
                    }
                    
                    foundMatch = true;
                    
                    //Check that an element exists for this row's index
                    if(rowIndex >= element.length - 1)
                    {
                      if(getIndexOf(rowIndexNames, (getKeyPathString(keyPath, l) + "|" + (j-1))) < 0)
                      {
                        element.push({});
                        rowIndexNames.push(getKeyPathString(keyPath, l) + "|" + (j-1));
                        rowIndexValues.push(element.length - 1);
                        rowIndex = element.length - 1;
                      }
                    }
                    
                    //Set values for implicit association
                    if(getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l)) < 0)
                    {
                      rowImplicitNames.push(getKeyPathString(keyPath, l));
                      rowImplicitValues.push(rowIndex);
                    }
                    else
                    {
                      rowImplicitValues[getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l))] = rowIndex;
                    }
                    
                    element = element[rowIndex]; //TODO: Need a safety check here to handle non-object/array elements
                  }
                  break;
                  
                  //Search for an array element at the specified index
                  case SearchTypes.Index:
                  if(isArray(element))
                  {
                    let subpathIndex = Number(subpath) - 1;
                    
                    //Clamp the target index
                    if(subpathIndex < 0) subpathIndex = 0;
                    
                    //Set values for implicit association
                    if(getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l)) < 0)
                    {
                      rowImplicitNames.push(getKeyPathString(keyPath, l));
                      rowImplicitValues.push(subpathIndex);
                    }
                    else
                    {
                      rowImplicitValues[getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l))] = subpathIndex;
                    }
                    
                    foundMatch = true;
                    
                    //Check that an element exists at the specified index. If not, create empty objects until reaching the appropriate number.
                    if(subpathIndex >= element.length)
                    {
                      let delta = subpathIndex - (element.length - 1);
                      
                      while(delta > 0)
                      {
                        element.push({});
                        delta--;
                      }
                    }
                    
                    if(l < keyPath.length-2 || isNaN(key)) element = element[subpathIndex];
                  }
                  break;
                }
              }
              else
              {
                //find the object or array key matching the subpath
                for(objectField in element)
                {
                  if(objectField === subpath)
                  {
                    element = element[objectField];
                    
                    foundMatch = true;
                    break;
                  }
                }
              }
              
              if(element === undefined)//isUndefined(element))
              {
                if(!nestedFormattingError)
                {
                  nestedFormattingError = true;
                  exportMessageHeight += messageLineHeight;
                }
                
                nestedFormattingErrorMessage += (sheets[i].getName() + " | " + values[0][k] + "\n");
                exportMessageHeight += messageLineHeight;
                element = cachedElement;
              }
              
              if(!foundMatch)
              {
                //Create the element at the expected path.
                switch(subpathType)
                {
                  case SubpathTypes.Array:
                  if(isArray(element))
                  {
                    if(firstObjectIndex < element.length-1)
                    {
                      element[firstObjectIndex][subpath] = [];
                      element = element[firstObjectIndex][subpath];
                      
                      //Set values for implicit association
                      if(getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l)) < 0)
                      {
                        rowImplicitNames.push(getKeyPathString(keyPath, l));
                        rowImplicitValues.push(firstObjectIndex);
                      }
                      else
                      {
                        rowImplicitValues[getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l))] = firstObjectIndex;
                      }
                    }
                    else
                    {
                      element.push({});
                      element[element.length-1][subpath] = {};
                      
                      //Set values for implicit association
                      if(getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l)) < 0)
                      {
                        rowImplicitNames.push(getKeyPathString(keyPath, l));
                        rowImplicitValues.push(element.length-1);
                      }
                      else
                      {
                        rowImplicitValues[getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l))] = element.length-1;
                      }
                      
                      element = element[element.length-1];
                    }
                  }
                  else
                  {
                    element[subpath] = [];
                    element = element[subpath];
                  }
                  break;
                  
                  case SubpathTypes.Object:
                  if(isArray(element))
                  {
                    if(firstObjectIndex < element.length-1)
                    {
                      element[firstObjectIndex][subpath] = {};
                      
                      //Set active element
                      if(trimKeySubpath(keyPath[keyPath.length - 2].substring(1)) === key)
                      {
                        element = element[firstObjectIndex];
                      }
                      else
                      {
                        element = element[firstObjectIndex][subpath];
                      }
                      
                      //Set values for implicit association
                      if(getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l)) < 0)
                      {
                        rowImplicitNames.push(getKeyPathString(keyPath, l));
                        rowImplicitValues.push(firstObjectIndex);
                      }
                      else
                      {
                        rowImplicitValues[getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l))] = firstObjectIndex;
                      }
                    }
                    else
                    {
                      element.push({});
                      element[element.length-1][subpath] = {};
                      
                      //Set the new value if the rowObject has a value for it.
                      if(rowObject.hasOwnProperty(subpath)) element[element.length-1][subpath] = rowObject[subpath];
                      
                      //Set values for implicit association
                      if(getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l)) < 0)
                      {
                        rowImplicitNames.push(getKeyPathString(keyPath, l));
                        rowImplicitValues.push(element.length-1);
                      }
                      else
                      {
                        rowImplicitValues[getIndexOf(rowImplicitNames, getKeyPathString(keyPath, l))] = element.length-1;
                      }
                      
                      element = element[element.length-1];
                    }
                  }
                  else
                  {
                    element[subpath] = {};
                    element = element[subpath];
                  }
                  break;
                }
              }
            }
            
            //If the key is a number and the element is an array, subtract one from the key to use 0 based indexing (1 becomes 0, 2 becomes 1, etc)
            if(!isNaN(key) && isArray(element))
            {
              if(key > 0) key -= 1;
            }
            
            //Format empty and null content
            if(content === "") content = getEmptyCellValueJson(emptyValueFormat);
            else if(isNullString(content)) content = getNullCellValueJson(nullValueFormat);
            
            element[key] = content;
          }
          else
          {
            //Format empty and null content
            if(content === "") content = getEmptyCellValueJson(emptyValueFormat);
            else if(isNullString(content)) content = getNullCellValueJson(nullValueFormat);
          
            rowObject[key] = content;
            
            if(nestedElements) element[key] = content;
          }
        }
      }
      else
      {
        //The sheet has only one column, so export each row as a single value in a JSON array
        if(values[0][0] === "" || values[0][0] == null) continue; //Skip columns with empty keys
        if(ignoreEmpty && values[j][0] === "") continue; //Skip empty cells if desired
        if(keyHasPrefix(values[0][0], ignorePrefix)) continue; //Skip columns with the ignore prefix
        
        let content = values[j][0];
        
        //We want to export cell arrays, or this column should be exported as an array, so convert the target cell's value to an array of values.
        if(exportCellArray || keyHasPrefix(values[0][0], arrayPrefix))
        {
          let forceArray = keyHasPrefix(values[0][0], arrayPrefix);
          let cellArray = [];
          let cellArrayStatus = getCellContentArray(content, separatorChar, cellArray);

          switch(cellArrayStatus)
          {
            case 0: //Value isn't a string, so can't be an array.
              //Force arrays when exporting due to prefix.
              if(forceArray) content = cellArray;
              break;
            case 1: //Full array
              content = cellArray;
              break;
            case 2: //Escaped single string
              if(forceArray) content = cellArray;
              else content = cellArray[0];
              break;
          }
        }

        content = formatJsonValue(content, valueFormatSettings);
        
        //Format empty and null content
        if(content === "") content = getEmptyCellValueJson(emptyValueFormat);
        else if(isNullString(content)) content = getNullCellValueJson(nullValueFormat);
        
        if(unwrapSheet) sheetJsonObject[key] = content;
        else sheetJsonArray.push(content);
      }
      
      if((!nestedElements || sheetArray) && !hasNesting)
      {
        if(!sheetIsValueArray)
        {
          if(sheetArray && !unwrapSheet && (!nestedElements || useNestingArray))
          {
            sheetJsonArray.push(rowObject);
          }
          else
          {
            if(unwrapSheet)
            {
              if(rows > 2)
              {
                sheetJsonObject[values[j][0]] = rowObject;
              }
              else
              {
                for(field in rowObject)
                {
                  sheetJsonObject[field] = rowObject[field];
                }
              }
            }
            else if(collapseSheet)
            {
              sheetJsonObject = rowObject; //TODO: Collapse Sheet not working yet...
            }
            else
            {
              sheetJsonObject[values[j][0]] = rowObject;
            }
          }
        }
        else if(sheetIsValueArray)
        {
          for(field in rowObject)
          {
            sheetJsonArray.push(rowObject[field]);
          }
        }
      }
    }
    
    if(((!nestedElements && sheetArray) || (nestedElements && useNestingArray) || (sheetIsValueArray)) && !unwrapSheet && !collapseSheet)
    {
      objectValue[sheetName] = sheetJsonArray;
    }
    else
    {
      if(unwrapSheet)
      {
        for(field in sheetJsonObject)
        {
          objectValue[field] = sheetJsonObject[field];
        }
      }
      else if(collapseSheet)
      {
        objectValue[sheetName] = sheetArray ? sheetJsonArray : sheetJsonObject;
      }
      else if(singleSheet)
      {
        objectValue = sheetArray ? sheetJsonArray : sheetJsonObject;
      }
      else
      {
        objectValue[sheetName] = sheetArray ? sheetJsonArray : sheetJsonObject;
      }
    }
  }
  
  if(contentsArray)
  {
    let arrayValue = [];
    
    if(sheetArrayJson)
    {
      for(field in objectValue)
      {
        arrayValue = objectValue[field];
      }
    }
    else
    {
      for(field in objectValue)
      {
        arrayValue.push(objectValue[field]);
      }
    }
    
    rawValue = JSON.stringify(arrayValue, null, minifyData ? 0 : 2);
  }
  else
  {
    rawValue = JSON.stringify(objectValue, null, minifyData ? 0 : 2);
  }
  
  if(nestedFormattingError)
  {
    exportMessage += nestedFormattingErrorMessage;
  }
  
  let fileSettings = {};

  fileSettings[Keys.FileSettings.Filename] = fileName;
  fileSettings[Keys.FileSettings.Mime] = MimeTypes.JSON;
  fileSettings[Keys.FileSettings.Visualize] = visualize;
  fileSettings[Keys.FileSettings.ExportFolder] = exportFolderType;
  fileSettings[Keys.FileSettings.ExportFolderId] = exportFolderId;
  fileSettings[Keys.FileSettings.ReplaceFile] = replaceFile;
  fileSettings[Keys.FileSettings.ReplaceFileId] = replaceFileId;
  fileSettings[Keys.FileSettings.Message] = exportMessage;
  fileSettings[Keys.FileSettings.MessageHeight] = exportMessageHeight;
  fileSettings[Keys.FileSettings.Content] = rawValue;
  
  callback(JSON.stringify(fileSettings));
}

/**
 * Exports a file using settings from the previous export process.
 * This should be called when attempting automation.
 **/
function reexportFile()
{
  let props = getPrevExportProperties();
  let parsedProps = JSON.parse(props);
  
  if(parsedProps[Keys.ExportSettings.Format] === ExportFormats.XML)
  {
    exportXml(props);
  }
  else
  {
    exportJson(props);
  }
}

/**
 * Export the given content as a file with the given properties.
 * @param {string} exportSettings Stringified JSON of settings for the export process.
 **/
async function exportDocument(exportSettings)
{
  let blob = JSON.parse(exportSettings);
  
  exportTime = (Date.now() - exportTime) / 1000; //Date.now() returns miliseconds, so divide by 1000
  
  let visualize = blob[Keys.FileSettings.Visualize];
  let filename = blob[Keys.FileSettings.Filename]; // test.json | test.xml
  let content = blob[Keys.FileSettings.Content]; // Raw JSON/XML
  let type = blob[Keys.FileSettings.Mime]; //application/json | application/xml
  let exportMessage = blob[Keys.FileSettings.Message];
  let exportMessageHeight = blob[Keys.FileSettings.MessageHeight];
  
  if(visualize === true)
  {
    let formatting = [
      { id : FormatGuids.Visualize.Data, value : escapeHtml(content) }, //Visualized data
      { id : FormatGuids.Visualize.Message, value : (exportMessage === "" ? '' : exportMessage) }, //Custom message
      { id : FormatGuids.Visualize.DownloadName, value : filename }, //Filename for download
      { id : FormatGuids.Visualize.DownloadMime, value : type }, //MIME type for download
      { id : FormatGuids.Visualize.DownloadContent, value : encodeURIComponent(content) } //Base64 encoding for download
    ];
    
    //530
    openFormattedModal('Modal_Visualize', formatting, `Visualize: ${filename} (${exportTime} sec)`, 600, 430 + exportMessageHeight, false);
  }
  else
  {
    let exportFolderType = blob[Keys.FileSettings.ExportFolder];
    let exportFolderId = blob[Keys.FileSettings.ExportFolderId];
    let replaceFile = blob[Keys.FileSettings.ReplaceFile];
    let replaceFileId = blob[Keys.FileSettings.ReplaceFileId];
    let file = null;
    //Only return fields needed for our uses: https://developers.google.com/drive/api/guides/fields-parameter
    const fieldsData = { 'fields' : 'id,name,webViewLink,webContentLink' };

    //Update existing file...
    if(replaceFile === true && replaceFileId !== "")
    {
      try
      {
        let fileBlob = Utilities.newBlob(content, type);

        //Since we only need to update content, we pass an empty object for file resource.
        file = Drive.Files.update({}, replaceFileId, fileBlob, fieldsData);
      }
      catch (e)
      {
        file = null;
        exportMessage += "There was an issue replacing the target file so a new file has been created. Please reselect a file to update file contents.";
        exportMessageHeight += 25;
      }
    }

    //Create a new file...
    if(file == null)
    {
      let newFile = {
        name: filename,
        mimeType: type,
      };

      //Set parent folder if exporting to a custom location.
      if(exportFolderType === ExportFolderLocations.Custom && exportFolderId !== "")
      {
        newFile.parents = [ exportFolderId ]
      }

      let fileBlob = Utilities.newBlob(content, type);

      //https://developers.google.com/drive/api/reference/rest/v3/files#File
      file = await Drive.Files.create(newFile, fileBlob, fieldsData);
    }
    
    let message = '';
    let height = 150;
    
    if(exportMessage !== "")
    {
      message += exportMessage + "<br><br>";
      height += exportMessageHeight + 25;
    }
    
    let formatting = [
      { id : FormatGuids.Export.ViewURL, value : file.webViewLink }, //Set the file URL
      { id : FormatGuids.Export.Name, value : file.name }, //Set the file name
      { id : FormatGuids.Export.Message, value : message }, //Set the message
      { id : FormatGuids.Export.DownloadURL, value : file.webContentLink } //Set the download URL
    ];
    
    openFormattedModal('Modal_Export', formatting, `Export Complete! (${exportTime} sec)`, 400, height, false);
  }
}

/**
 * Invoked when an error is detected. Displays a modal with information about the error.
 * @param {object} error Exception object.
 **/
function catchExportError(error)
{
  openErrorModal('Export Error!', "Encountered an error while exporting data. See the error below for more details.", error.stack);
}

/**
 * Get sensitive data needed for OAuth workflows.
 **/
function getSecrets()
{
  let htmlString = HtmlService.createHtmlOutputFromFile('secrets.html').getContent();

  return JSON.parse(htmlString);
}

/**
 * Show a modal with a compiling spinner.
 * @param {string} message Title for the modal.
 **/
function showCompilingMessage(message)
{
  let html = HtmlService.createTemplateFromFile('Spinner').evaluate()
      .setWidth(300)
      .setHeight(100);
  
  SpreadsheetApp.getUi().showModelessDialog(html, message);
}

/**
 * Open ESD's sidebar.
 **/
function openSidebar()
{
  let html = HtmlService.createTemplateFromFile('Sidebar').evaluate()
    .setTitle('Export Sheet Data')
    .setWidth(300);

  SpreadsheetApp.getUi().showSidebar(html);
  
  checkVersionNumber();
}

/**
 * Open the settings modal.
 **/
function openSettingsModal()
{
  openGenericModal('Modal_Settings', 'Export/Import Settings', 500, 460, true);
}

/**
 * Open the about modal.
 **/
function openAboutModal()
{
  openGenericModal('Modal_About', 'About ESD', 275, 185, false);
}

/**
 * Open the modal for cool people.
 **/
function openSupportModal()
{
  openGenericModal('Modal_Support', 'Support ESD', 375, 185, false);
}

/**
 * Open a modal to display the current version's new features.
 **/
function openNewVersionModal()
{
  openGenericModal('Modal_NewVersion', "What's New", 375, 300, true);
}

/**
 * Display an operation error in a modal.
 * @param {string} title Title for the modal.
 * @param {string} message Display message clarifying the situation.
 * @param {exception} error Data for the operation error.
 **/
function openErrorModal(title, message, error)
{
  let formatting = [
    { id : FormatGuids.Error.Message, value : message },
    { id : FormatGuids.Error.Error, value : error }
  ];
  
  openFormattedModal('Modal_Error', formatting, title, 360, 270, true);
}

/**
 * Open a generic modal.
 * @param {string} modal File name for the desired modal.
 * @param {string} title Title for the displayed modal.
 * @param {number} width Width of the modal.
 * @param {number} height Height of the modal.
 * @param {boolean} blockInput If true, the modal will prevent interactions with anything besides the modal.
 **/
function openGenericModal(modal, title, width, height, blockInput)
{
  let html = HtmlService.createTemplateFromFile(modal).evaluate()
    .setWidth(width)
    .setHeight(height);
  
  if(blockInput) SpreadsheetApp.getUi().showModalDialog(html, title);
  else SpreadsheetApp.getUi().showModelessDialog(html, title);
}

/**
 * Open a modal after formatting its raw HTML.
 * @param {string} modal File name for the desired modal.
 * @param {Array<object>} formatting Formatting values for the modal.
 * @param {string} title Title for the displayed modal.
 * @param {number} width Width of the modal.
 * @param {number} height Height of the modal.
 * @param {boolean} blockInput If true, the modal will prevent interactions with anything besides the modal.
 **/
function openFormattedModal(modal, formatting, title, width, height, blockInput)
{
  let htmlString = HtmlService.createTemplateFromFile(modal).getRawContent();
  
  for(let i=0; i < formatting.length; i++)
  {
    htmlString = htmlString.replace(formatting[i]["id"], formatting[i]["value"]);
  }
  
  let html = HtmlService.createHtmlOutput(htmlString)
    .setWidth(width)
    .setHeight(height);
      
  if(blockInput) SpreadsheetApp.getUi().showModalDialog(html, title);
  else SpreadsheetApp.getUi().showModelessDialog(html, title);
}

/**
 * Opens a toast modal in the corner of the screen that will auto close after a few seconds.
 * @param {string} message Text to display.
 **/
function openToast(message)
{
  SpreadsheetApp.getActive().toast(message, "", 3);
}

/**
 * Open the actual file picker modal.
 * @param {string} mimeType MIME type for the files the picker can select.
 * @param {string} title Title text for the picker modal window.
 * @param {function} callback callback invoked to pass the picked file.
 **/
function openPicker(mimeType, title, callback)
{
  let htmlString = HtmlService.createTemplateFromFile('FilePicker').getRawContent();
  
  htmlString = htmlString.replace(FormatGuids.Picker.FileType, mimeType);
  htmlString = htmlString.replace(FormatGuids.Picker.SelectFolders, mimeType === MimeTypes.Folder);
  htmlString = htmlString.replace(FormatGuids.Picker.CallbackName, callback.name);

  let html = HtmlService.createHtmlOutput(htmlString)
      .setWidth(700) //650
      .setHeight(500); //450
      
  SpreadsheetApp.getUi().showModalDialog(html, title);
}

/**
 * Open a file picker to select a file.
 * @param {string} mimeType MIME type for the files the picker can select.
 * @param {string} title Title text for the picker modal window.
 **/
async function openFilePicker(mimeType, title)
{
  //Create some cache values so they can be shared across operations...
  let cache = CacheService.getUserCache();
  cache.put(SelectFileKeys.Status, "active", SelectFileTimeoutDuration);
  cache.put(SelectFileKeys.File, "{}", SelectFileTimeoutDuration);

  try
  {
    openPicker(mimeType, title, onFileSelected);
  }
  catch(e)
  {
    openErrorModal("Error Selecting File", "There was an error selecting a JSON file to replace.", e.stack)
    return JSON.stringify({ "valid": false });
  }

  const startTime = Date.now();
  const timeoutTime = startTime + (SelectFileTimeoutDuration * 1000);

  while(cache != null && 
    cache.get(SelectFileKeys.Status) != null &&
    cache.get(SelectFileKeys.Status) == "active")
  {
    if(Date.now() >= timeoutTime)
    {
      //Break out if the user takes too long...
      cache.put(SelectFileKeys.Status, SelectFileStatus.Timeout.toString());
      break;
    }

    //Wait to let the user select a file...
    Utilities.sleep(100);
  }
  
  let cacheStatus = cache.get(SelectFileKeys.Status);
  let cachedSelectedFile = cache.get(SelectFileKeys.File);
  let selectFileStatus = Number.parseInt(cacheStatus);
  let isValid = false;

  switch(selectFileStatus)
  {
    case SelectFileStatus.Completed:
      isValid = true;
      break;
    case SelectFileStatus.Cancelled:
    case SelectFileStatus.Timeout:
    case SelectFileStatus.Error:
      break;
  }

  let fileData = {};

  fileData["file"] = cachedSelectedFile == null ? {} : JSON.parse(cachedSelectedFile);
  fileData["valid"] = isValid;

  //Clean up cache values...
  cache.remove(SelectFileKeys.Status);
  cache.remove(SelectFileKeys.File);

  return JSON.stringify(fileData);
}

/**
 * Callback invoked after selecting a file via the file picker.
 * @param {string} fileData Stringified JSON data for the selected file.
 * @param {number} status Status for the file selection operation.
 **/
function onFileSelected(fileData, status)
{
  let cache = CacheService.getUserCache();
  let selectedFileData = null;
  let selectedFileStatus = SelectFileStatus.Cancelled;
  
  switch(status)
  {
    /*case SelectFileStatus.Cancelled:
      selectedFileData = null;
      selectedFileStatus = SelectFileStatus.Cancelled;
      break;*/
    case SelectFileStatus.Completed:
      if(cache.get(SelectFileKeys.File) == null)
      {
        //If the cache value is null, then it's likely a timeout situation...
        selectedFileStatus = SelectFileStatus.Timeout;
        break;
      }

      selectedFileData = JSON.parse(fileData);
      selectedFileStatus = SelectFileStatus.Completed;
      break;
  }

  cache.put(SelectFileKeys.Status, selectedFileStatus.toString());
  cache.put(SelectFileKeys.File, selectedFileData == null ? "{}" : JSON.stringify(selectedFileData));
}

/**
 * Used in FilePicker.html to determine if the user has granted proper access for allowing file browsing.
 **/
function getOAuthToken()
{
  return ScriptApp.getOAuthToken();
}

/**
 * Server side function to insert html snippets in other html files when generating html templates.
 * https://developers.google.com/apps-script/guides/html/best-practices#code.gs
 **/
function include(filename)
{
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Check that the user has opened the newest version of ESD. If not, show the what's new modal.
 **/
function checkVersionNumber()
{
  const temp = PropertiesService.getUserProperties();
  const latestVersion = temp.getProperty(Keys.Properties.LatestVersion);
  
  if(latestVersion === "" || parseInt(latestVersion) !== esdVersion)
  {
    PropertiesService.getUserProperties().setProperty(Keys.Properties.LatestVersion, esdVersion.toString());

    openNewVersionModal();
  }
}

/**
 * Log various properties.
 **/
function checkProperties()
{
  const userProperties = PropertiesService.getUserProperties();
  const userSettingsProperties = userProperties.getProperty(Keys.Properties.User.Settings);
  const userSettings = userSettingsProperties == null ? {} : JSON.parse(userSettingsProperties);
  const documentProperties = PropertiesService.getDocumentProperties();
  const documentSettingsProperties = documentProperties.getProperty(Keys.Properties.Document.Settings);
  const documentSettings = documentSettingsProperties == null ? {} : JSON.parse(documentSettingsProperties);
  const exportProperties = getExportProperties();
  //const exportSettings = JSON.parse(exportProperties);

  Logger.log("User:\n" + JSON.stringify(userSettings));
  //Logger.log(userSettings);
  Logger.log("Document:\n" + JSON.stringify(documentSettings));
  //Logger.log(documentSettings);
  Logger.log("Export:\n" + exportProperties);
  //Logger.log(exportSettings);
}


function onInstall(e)
{
  onOpen(e);
}


function onOpen(e)
{
  let ui = SpreadsheetApp.getUi();
  ui.createAddonMenu()
  .addItem("Open Sidebar", "openSidebar")
  .addItem("Settings", "openSettingsModal")
  .addSeparator()
  .addItem("About (v" + esdVersion + ")", "openAboutModal")
  .addItem("Support ESD", "openSupportModal")
  //For testing purposes
  //.addSeparator()
  //.addItem("What's New", "openNewVersionModal")
  //.addItem("Check Properties", "checkProperties")
  .addToUi();
};