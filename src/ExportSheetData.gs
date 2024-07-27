//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
/**
 * Current version number for ESD.
 * @type {number}
 **/
const esdVersion = 65;

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

//Special prefixes to allow XML nested elements
//const arrayPref = "ARRAY_";
//const attributePref = "ATTRIBUTE_";

/**
 * Returns the last settings for ESD in the open document as a stringified JSON blob.
 * @return {string}
 **/
function getProperties()
{
  var properties = PropertiesService.getDocumentProperties();
  
  return JSON.stringify(properties.getProperties());
}

/**
 * Saves the settings last used for ESD so the user doesn't need to reselect them next time ESD is opened.
 * @param {string} newProperties Stringified JSON blob representing properties.
 **/
function setProperties(newProperties)
{
  var properties = PropertiesService.getDocumentProperties();
  
  properties.setProperties(JSON.parse(newProperties));
}

/**
 * Returns the script properties for ESD as a stringified JSON blob.
 * @return {string}
 **/
function getScriptProperties()
{
  var properties = PropertiesService.getScriptProperties();
  
  return JSON.stringify(properties.getProperties());
}

/**
 * Sets script properties for ESD.
 * @param {string} newProperties Stringified JSON blob representing properties.
 **/
function setScriptProperties(newProperties)
{
  var properties = PropertiesService.getScriptProperties();
  
  properties.setProperties(JSON.parse(newProperties));
}

/**
 * Returns the total export settings for ESD in the open document as a stringified JSON blob.
 * @return {string}
 **/
function getExportProperties()
{
  var properties = PropertiesService.getDocumentProperties();
  
  return properties.getProperty("settings");
}

/**
 * Saves the total export settings for ESD in the open document so the user doesn't need to reselect them next time ESD is opened.
 * @param {string} newProperties Stringified JSON blob representing properties.
 **/
function setExportProperties(newProperties)
{
  var properties = PropertiesService.getDocumentProperties();
  
  properties.setProperty("settings", newProperties);
}

/**
 * Clears ESD export settings for the current document.
 * @param {bool} showModal If true, a popup will be shown noting that settings have been cleared.
 **/
function clearExportProperties(showModal)
{
  var properties = PropertiesService.getDocumentProperties();
  
  if(properties.getProperty("settings") != null) properties.deleteProperty("settings");
  
  if(showModal) SpreadsheetApp.getUi().alert("ESD export settings have been cleared! The sidebar will now refresh.");
  
  openSidebar();
}

/**
 * Returns the settings used in the last export as a stringified JSON blob.
 * @return {string}
 **/
function getPrevExportProperties()
{
  var properties = PropertiesService.getDocumentProperties();
  
  return properties.getProperty("prev");
}

/**
 * Saves the settings used in the last export.
 * @param {string} newProperties Stringified JSON blob representing properties.
 **/
function setPrevExportProperties(newProperties)
{
  var properties = PropertiesService.getDocumentProperties();
  
  properties.setProperty("prev", newProperties);
}

/**
 * Returns the ESD properties for a specific user as a stringified JSON blob.
 * @return {string}
 **/
function getUserProperties()
{
  var properties = PropertiesService.getUserProperties();
  
  return JSON.stringify(properties.getProperties());
}

/**
 * Saves user settings for ESD.
 * @param {string} newProperties Stringified JSON blob representing properties.
 **/
function setUserProperties(newProperties)
{
  var properties = PropertiesService.getUserProperties();
  
  properties.setProperties(JSON.parse(newProperties));
}

/**
 * Ensures the passed settings are valid and sets them if so.
 **/
function validateAndSetExportProperties(settingsString)
{
  var settings = JSON.parse(settingsString);
  var message = "Settings have been imported from another ESD document. The sidebar will now refresh.";
  
  if(settings.hasOwnProperty("targetSheets"))
  {
    if(settings["targetSheets"] !== "{}") message += "\n\nNote: Custom export sheet targets are not imported and will need to be set up.";
    
    settings["targetSheets"] = "{}"; //Don't populate export sheets since those are likely to be custom per sheet.
  }
  
  setExportProperties(JSON.stringify(settings));
  
  SpreadsheetApp.getUi().alert(message);
  
  openSidebar();
}

/**
 * Returns the current version of ESD.
 * @return {number}
 **/
function getVersion()
{
  return esdVersion;
}

/**
 * Returns the name of the folder with the given ID.
 * @return {string}
 **/
function getFolderNameFromId(id)
{
  return DriveApp.getFolderById(id).getName();
}

/**
 * Returns true if the passed value is an array.
 * @return {boolean}
 **/
function isArray(array)
{
  return Array.isArray(array);
}

/**
 * Returns true if the pased value is an object and is not null.
 * @return {boolean}
 **/
function isObject(object)
{
  return (typeof(object) === 'object' && object !== null);
}

//Returns true if the passed value is undefined.
/*function isUndefined(value)
{
  return (typeof(value) === 'undefined');
}*/

/**
 * Returns the index of the given value in an array.
 * @return {number}
 **/
function getIndexOf(array, value)
{
  if(!isArray(array)) return -1;
  
  var index = -1;
  
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
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  var sheetNames = [];
  
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
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  var sheetValues = [];
  
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
  var spreadsheet = SpreadsheetApp.getActive();
  
  return spreadsheet.getActiveSheet().getName();
}

/**
 * Returns the name and ID of the currently active sheet in the spreadsheet. (ie the sheet that is visible)
 * @return {Object}
 **/
function getActiveSheetNameAndId()
{
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet();
  var sheetValues = {};
  
  sheetValues["name"] = sheet.getName();
  sheetValues["id"] = sheet.getSheetId();
  
  return sheetValues;
}

/**
 * Returns a file's immediate parent folder.
 * @return {DriveApp.Folder}
 **/
function getFileParentFolder(file)
{
  var folders = file.getParents();
  var parentFolder;
    
  while(folders.hasNext())
  {
    parentFolder = folders.next();
  }
  
  return parentFolder;
}

/**
 * Returns the ID for the given file's parent folder, or the root Drive folder ID if the parent folder is null
 * @return {string}
 **/
function getFileParentFolderId(file)
{
  var folder = getFileParentFolder(file);
  
  if(folder == null)
  {
    folder = DriveApp.getRootFolder();
  }
  
  return folder.getId();
}

/**
 * Converts the contents of a cell into an array by separating the cell value based on the given separator char.
 * If the cell is not a string, an array with a single value is returned.
 * @param {string} separatorChar
 * @return {Array}
 **/
function getCellContentArray(cell, separatorChar)
{
  let cellArray = [];
  
  //If the cell isn't a string, it's value can't be split into an array.
  if(typeof(cell) !== "string")
  {
    cellArray.push(cell);
    return cellArray;
  }
  
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
        
  //Populate the array
  let startIndex = 0;
  for(let i=0; i < commaIndicies.length; i++)
  {
    let arrayString = content.slice(startIndex, commaIndicies[i]);
    if(arrayString != "") cellArray.push(arrayString.replace('"', ' ').replace('"', ' ').trim()); //Get rid of the wrapping quotes
    startIndex = commaIndicies[i] + 1; // +1 so the next string doesn't start with a comma
  }
  
  if(commaIndicies.length > 0)
  {
    let endIndex;
    
    if(content[content.length - 1] == separatorChar) endIndex = content.length - 1;
    else endIndex = content.length;
    
    let lastString = content.slice(startIndex, endIndex); //Push the string from the last comma to the end of the content string
    cellArray.push(lastString.replace('"', ' ').replace('"', ' ').trim()); //Get rid of wrapping quotes
  }
  
  if(commaIndicies.length == 0 && content !== "") // If there are no commas to make the array, return the whole content
  {
    cellArray.push(content);
  }
  
  //Convert values to their correct type (float, bool, etc)
  for(let i=0; i < cellArray.length; i++)
  {
    if(!isNaN(parseFloat(cellArray[i])))
    {
      let isNumber = true;
      let minusCount = 0;
      let decimalCount = 0;
      
      //Parse float is unreliable, so loop through to make sure the string is actually a float
      for(let j=0; j < cellArray[i].length; j++)
      {
        if(isNaN(cellArray[i][j]))
        {
          if(cellArray[i][j] === '.')
          {
            if(decimalCount > 0)
            {
              isNumber = false;
              break;
            }
            else
            {
              decimalCount++;
            }
          }
          else if(cellArray[i][j] === '-')
          {
            if(minusCount > 0)
            {
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
      
      if(isNumber) cellArray[i] = parseFloat(cellArray[i]);
    }
    else if(cellArray[i] === 'true') cellArray[i] = true;
    else if(cellArray[i] === 'false') cellArray[i] = false;
    else if(cellArray[i].length > 1)
    {
      Logger.log(`${cellArray[i]}: ${cellArray[i][0] === '"'} | ${cellArray[i][cellArray[i].length - 1] === '"'}`);
      //Strip wrapping quotes...
      if(cellArray[i][0] === '"' && cellArray[i][cellArray[i].length - 1] === '"')
      {
        cellArray[i] = cellArray[i].substring(1, cellArray[i].length - 1);
        Logger.log(cellArray[i]);
      }
    }
  }
  
  return cellArray;
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
  var xmlName = value;
  
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
  
  var values = value.split(':');
  var output = [];
  
  switch(values.length)
  {
    case 0:
      output = [ "", rootNamespace ];
      break;
    case 1:
      output = [ values[0], rootNamespace ];
      break;
    default:
      output = [ values[values.length-1], getXmlNamespace(values[0], namespaces, noNamespace) ];
      
      //TODO: Don't call XmlService here, check if the prefix and uri are empty strings?
      if(output[1] == noNamespace) output[1] = rootNamespace;
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
 * Formats the given XML value based on user settings.
 * @return {any}
 **/
function formatXmlValue(value, exportBoolsAsInts)
{
  //TODO: Move to JSON settings object
  /*if(settings["exportBoolsAsInts"] === true)
  {
    if(typeof(value) === "boolean")
    {
      return value ? "1" : "0";
    }
  }*/
  
  if(exportBoolsAsInts && typeof(value) === "boolean")
  {
    return value ? 1 : 0;
  }
  
  return value;
}

/**
 * @return {string}
 **/
function formatJsonString(value, asObject)
{
  if(value.length > 1)
  {
    //Get rid of wrapping quotes (")
    if(value[0] === '"' && value[value.length-1] === '"')
    {
      let endValue = value.length - 1;
      
      if(endValue < 1) endValue = 1;
      
      value = value.substring(1, endValue);
    }
    //Don't format object values (wrapped with {})
    if(asObject && value[0] === '{' && value[value.length-1] === '}')
    {
      //Need to format to match the rest of the file
      return value;
    }
  }
  
  return JSON.stringify(value);
}

/**
 * Returns true if a key starts with the specified prefix.
 * @param {string} key
 * @param {string} prefix
 * @return {boolean}
 **/
function keyHasPrefix(key, prefix)
{
  if(prefix.length === 0 || (prefix.length > key.length)) return false;
  
  var newKey = "";
  
  for(let i=0; i < prefix.length; i++)
  {
    newKey += key[i];
  }
  
  return newKey === prefix;
}

/**
 * Returns true if a key starts with any of the specified prefixes.
 * @param {string} key
 * @param {Array<string>} prefixes
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
  var values = [];
  var prefixArgs = [];
  
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
 * @param {string} key
 * @param {string} prefix
 * @return {string}
 **/
function stripPrefix(key, prefix)
{
  if(keyHasPrefix(key, prefix) === true)
  {
    var newKey = "";
    
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
 * @param {string} key
 * @param {...string} prefixes
 * @return {string}
 **/
function stripPrefixes(key, prefixes)
{
  var prefixArgs = [];
  
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
function getKeyPathString(path, index)
{
  var pathstring = "";
  
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
  var path = [];
  
  if(!keyHasPrefix(key, '[') && !keyHasPrefix(key, '{') || !nestedElements) //TODO: Need to strip out special prefixes like NOEX_
  {
    path.push(key);
  }
  else
  {
    var subPath = "";
    var pathType = "";
  
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
  var type = SubpathTypes.Key;
  
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
  var type = SubpathTypes.Key;
  
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
  var type = SearchTypes.None;
  
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
 **/
function trimSafe(value)
{
  if(typeof(value) === 'string') return value.trim();

  return value;
}

/**
 * Formats empty cell values to use the appropriate value (null or "")
 **/
function getEmptyCellValueJson(formatType)
{
  //TODO: Convert format type to int value...
  switch(formatType)
  {
    case "string": return "";
  }
  
  return null;
}

/**
 * Formats cell values containing the string "null" to use the appropriate value (null or "null")
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
  var newJsonString = '{"json":' + jsonString + '}'; //Make a JSON object string.
  var json = null;
  var results = null;
  
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
  
  var tempSettings = JSON.parse(formatSettings);
  
  tempSettings["visualize"] = false;
  
  formatSettings = JSON.stringify(tempSettings);
  
  setPrevExportProperties(formatSettings);
}

/**
 * Export data as JSON.
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
  
  var tempSettings = JSON.parse(formatSettings);
  
  tempSettings["visualize"] = false;
  
  formatSettings = JSON.stringify(tempSettings);
  
  setPrevExportProperties(formatSettings);
}

/**
 * Convert sheet data into an XML string. The string, along with relevant publishing data, will be passed to the given callback function.
 * @param {string} formatSettings
 **/
function exportSpreadsheetXml(formatSettings, callback)
{
  //Settings
  var settings = JSON.parse(formatSettings);
  
  //File settings
  var exportFolderType = settings["exportFolderType"];
  var exportFolder = settings["exportFolder"];
  var visualize = settings["visualize"];
  var singleSheet = settings["singleSheet"];
  var replaceFile = settings["replaceExistingFiles"];
  var unwrap = settings["unwrapSingleRows"];
  var collapse = settings["collapseSingleRows"];
  var ignoreEmpty = settings["ignoreEmptyCells"];
  var nestedElements = settings["nestedElements"];
  var minifyData = settings["minifyData"];
  var includeFirstColumn = settings["includeFirstColumn"];
  var ignorePrefix = settings["ignorePrefix"];
  var unwrapPrefix = settings["unwrapPrefix"];
  var collapsePrefix = settings["collapsePrefix"];
  var customSheets = settings["targetSheets"];
  
  //XML settings
  var useChildElements = settings["exportChildElements"];
  var exportBoolsAsInts = settings["exportBoolsAsInts"];
  var rootElement = settings["rootElement"];
  //Advanced
  var nameReplacementChar = settings["nameReplacementChar"];
  var declarationVersion = settings["declarationVersion"];
  var declarationEncoding = settings["declarationEncoding"];
  var declarationStandalone = settings["declarationStandalone"];
  var attributePrefix = settings["attributePrefix"];
  var childElementPrefix = settings["childElementPrefix"];
  var innerTextPrefix = settings["innerTextPrefix"];
  //Namepsaces
  var rootNamespaceRaw = settings["rootNamespace"];
  var namespacesRaw = settings["namespaces"];
  
  //Set up actual XmlNamespace values
  var noNamespace = XmlService.getNoNamespace();
  var rootNamespace = rootNamespaceRaw === "" ? XmlService.getNoNamespace() : XmlService.getNamespace(rootNamespaceRaw);
  var namespaces = [];
  
  for(let i=0; i < namespacesRaw.length; i++)
  {
    if(namespacesRaw[i]["prefix"] !== "" && namespacesRaw[i]["uri"] !== "")
    {
      namespaces.push(XmlService.getNamespace(namespacesRaw[i]["prefix"], namespacesRaw[i]["uri"]));
    }
  }
  
  //Sheets info
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  var exportMessage = "";
  var exportMessageHeight = 0;
  
  if(customSheets != null)
  {
    var exportSheets = sheets;
    sheets = [];
    
    for(let i=0; i < exportSheets.length; i++)
    {
      if(customSheets[exportSheets[i].getName()] === 'true')
      {
        if(spreadsheet.getSheetByName(exportSheets[i].getName()) != null)
        {
          sheets.push(spreadsheet.getSheetByName(exportSheets[i].getName()));
        }
      }
    }
  }
  
  var fileName = spreadsheet.getName() + (singleSheet ? (" - " + sheets[0].getName()) : "") + ".xml";
  var sheetValues = [[]];
  
  var xmlRoot = XmlService.createElement(formatXmlName(rootElement, nameReplacementChar), rootNamespace); //Create the root XML element. https://developers.google.com/apps-script/reference/xml-service/
  
  if(namespaces.length > 0)
  {
    //Manual parsing is needed because Apps Script doesn't support declaring more than one namespace per element currently.
    var rootString = "<" + formatXmlName(rootElement, nameReplacementChar);
    
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
  
  var cachedRowNames = {};
  
  for(let i=0; i < sheets.length; i++)
  {
    var cachedColumnNames = {};
    var cachedColumnNamespaces = {};
    var sheetName = sheets[i].getName();
    var range = sheets[i].getDataRange();
    var values = range.getValues();
    var rows = range.getNumRows();
    var columns = range.getNumColumns();
    var unwrapSheet = unwrap && rows <= 2;
    var collapseSheet = collapse && rows <= 2;
    
    var forceUnwrap = false;
    var forceCollapse = false;
    
    //Get the prefixes used by this sheet
    var activePrefixes = getPrefixes(sheetName, unwrapPrefix, collapsePrefix);
    sheetName = stripPrefixes(sheetName, unwrapPrefix, collapsePrefix);
    
    var sheetXml = XmlService.createElement(formatXmlName(sheetName, nameReplacementChar), rootNamespace);
    
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
    
    var columnNamesAndNamespaces = [];
    
    for(let j=0; j < columns; j++)
    {
      columnNamesAndNamespaces.push(getXmlNameAndNamespace(values[0][j], namespaces, rootNamespace, noNamespace));
    }
    
    for(let j=1; j < rows; j++) //j = 1 because we don't need the keys to have a row
    {
      if(keyHasPrefix(values[j][0], ignorePrefix)) continue; //Skip rows with the ignore prefix
      
      let isComment = (values[j][0] === "!--"); //If the first cell in a row starts with !--, treat the row as a comment
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
      let startIndex = (includeFirstColumn && !isComment) ? 0 : 1; //Exclude the first column by default since it is used as the name of the row element, or because this is a comment element
      
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
          
          //TODO: Chaced column name should use the prefix stripped values...
          //if(!cachedColumnNames.hasOwnProperty(columnNameAndNamespace[0])) cachedColumnNames[columnNameAndNamespace[0]] = formatXmlName(columnNameAndNamespace[0], nameReplacementChar);
          
          if(keyHasPrefix(columnNameAndNamespace[0], ignorePrefix)) continue; //Skip columns with the ignore prefix
        
          let columnNamespace = columnNameAndNamespace[1];
          
          if((useChildElements && !keyHasPrefix(columnNameAndNamespace[0], attributePrefix) && !keyHasPrefix(columnNameAndNamespace[0], innerTextPrefix)) || 
            keyHasPrefix(columnNameAndNamespace[0], childElementPrefix))
          {
            if(!cachedColumnNames.hasOwnProperty(columnNameAndNamespace[0])) cachedColumnNames[columnNameAndNamespace[0]] = formatXmlName(stripPrefix(columnNameAndNamespace[0], childElementPrefix), nameReplacementChar);
            
            childElementKeys.push(cachedColumnNames[columnNameAndNamespace[0]])//stripPrefix(columnNameAndNamespace[0], childElementPrefix));
            childElements.push(values[j][k]);
            childElementNamespaces.push(columnNamespace);
          }
          else if(!keyHasPrefix(columnNameAndNamespace[0], innerTextPrefix))
          {
            if(!cachedColumnNames.hasOwnProperty(columnNameAndNamespace[0])) cachedColumnNames[columnNameAndNamespace[0]] = formatXmlName(stripPrefix(columnNameAndNamespace[0], attributePrefix), nameReplacementChar);
            
            attributeKeys.push(cachedColumnNames[columnNameAndNamespace[0]])//stripPrefix(columnNameAndNamespace[0], attributePrefix));
            attributes.push(values[j][k]);
            attributeNamespaces.push(columnNamespace);
          }
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
        sheetXml.addContent(XmlService.createComment(rowXml.getText().replace(/[-]/g, '_'))); //Replace '-' with '_' as hyphens cause errors in comment nodes
        
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
        if(attributeNamespaces[k].getPrefix() === "") rowXml.setAttribute(attributeKeys[k], formatXmlValue(trimSafe(attributes[k]), exportBoolsAsInts));
        else rowXml.setAttribute(attributeKeys[k], formatXmlValue(trimSafe(attributes[k]), exportBoolsAsInts), attributeNamespaces[k]);
      }
      
      //Set child elements
      for(let k=0; k < childElements.length; k++)
      {
        //let childXml = XmlService.createElement(formatXmlName(childElementKeys[k], nameReplacementChar), childElementNamespaces[k]);
        let childXml = XmlService.createElement(childElementKeys[k], childElementNamespaces[k]);
        
        childXml.setText(formatXmlValue(trimSafe(childElements[k]), exportBoolsAsInts));
        
        rowXml.addContent(childXml);
      }
      
      //Set inner text
      if(innerTextElements.length > 0)
      {
        let innerText = "";
        
        for(let k=0; k < innerTextElements.length; k++)
        {
          innerText += formatXmlValue(trimSafe(innerTextElements[k]), exportBoolsAsInts);
          
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
      
      for(var k=0; k < sheetChildren.length; k++)
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
  
  var xmlDoc = XmlService.createDocument(xmlRoot); //Create the final XML document for export.
  var xmlFormat = minifyData ? XmlService.getRawFormat() : XmlService.getPrettyFormat(); //Select which format to export the XML as.
  xmlFormat.setOmitDeclaration(true); //Remove the default XML declaration so we can build our own if desired.
  
  if(declarationVersion !== "" && declarationEncoding !== "") xmlFormat.setEncoding(declarationEncoding); //Set the encoding method used by the XML document
  
  var xmlRaw = xmlFormat.format(xmlDoc);
  
  if(declarationVersion !== "")
  {
    //TODO: Can probably do this with XmlService? https://developers.google.com/apps-script/reference/xml-service/doc-type
    let xmlDeclaration = '<?xml version="' + declarationVersion + '"';
    
    if(declarationEncoding !== "") xmlDeclaration += ' encoding="' + declarationEncoding + '"';
    if(declarationStandalone !== "") xmlDeclaration += ' standalone="' + declarationStandalone + '"';
    
    xmlDeclaration += '?>\n';
    
    xmlRaw = xmlDeclaration + xmlRaw;
  }
  
  let exportSettings = {
    "filename" : fileName,
    "content" : xmlRaw,
    "export-folder" : (exportFolderType === "default" ? "" : exportFolder),
    "mime" : ContentService.MimeType.XML,
    "visualize" : visualize,
    "replace-file" : replaceFile,
    "message" : exportMessage,
    "message-height" : exportMessageHeight
  };
  
  callback(exportSettings);
}

/**
 * Convert sheet data into a JSON string. The string, along with relevant publishing data, will be passed to the given callback function.
 * @param {string} formatSettings
 **/
function exportSpreadsheetJson(formatSettings, callback)
{
  //Settings
  var settings = JSON.parse(formatSettings);
  
  //File settings
  var exportFolderType = settings["exportFolderType"];
  var exportFolder = settings["exportFolder"];
  var visualize = settings["visualize"];
  var singleSheet = settings["singleSheet"];
  var replaceFile = settings["replaceExistingFiles"];
  var unwrap = settings["unwrapSingleRows"];
  var collapse = settings["collapseSingleRows"] && !unwrap;
  var ignoreEmpty = settings["ignoreEmptyCells"];
  var ignorePrefix = settings["ignorePrefix"];
  var unwrapPrefix = settings["unwrapPrefix"];
  var collapsePrefix = settings["collapsePrefix"];
  var customSheets = settings["targetSheets"];
  var minifyData = settings["minifyData"];
  var includeFirstColumn = settings["includeFirstColumn"];
  
  //Nested Settings
  var nestedElements = settings["nestedElements"];
  var nestedArrayPrefix = settings["forceArrayPrefixNest"];
  
  //JSON settings
  var contentsArray = settings["exportContentsAsArray"];
  var exportCellObjectJson = settings["exportCellObject"];
  var exportArray = settings["exportCellArray"];
  var sheetArrayJson = settings["exportSheetArray"];
  var valueArray = settings["exportValueArray"];
  var forceString = settings["forceString"];
  var emptyValueFormat = settings["emptyValueFormat"];
  var nullValueFormat = settings["nullValueFormat"];
  var separatorChar = settings["separatorChar"];
  var arrayPrefix = settings["forceArrayPrefix"];
  
  //Sheets info
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  
  if(customSheets != null)
  {
    if((isObject(customSheets) && Object.keys(customSheets).length > 0) || (!isObject(customSheets) && customSheets.length > 2))
    {
      var exportSheets = sheets;
      sheets = [];
      
      for(var i=0; i < exportSheets.length; i++)
      {
        if(customSheets[exportSheets[i].getName()] === 'true')
        {
          if(spreadsheet.getSheetByName(exportSheets[i].getName()) != null)
          {
            sheets.push(spreadsheet.getSheetByName(exportSheets[i].getName()));
          }
        }
      }
    }
  }
  
  var fileName = spreadsheet.getName() + (singleSheet ? (" - " + sheets[0].getName()) : "") + ".json"; //TODO: Need to strip prefixes
  var sheetValues = [[]];
  var rawValue = "";
  var objectValue = {};
  var exportMessage = "";
  var exportMessageHeight = 0;
  var nestedFormattingError = false;
  var nestedFormattingErrorMessage = "There was a problem with nested formatting for these fields:\n";
  
  for(let i=0; i < sheets.length; i++)
  {
    var range = sheets[i].getDataRange();
    var values = range.getValues();
    var rows = range.getNumRows();
    var columns = range.getNumColumns();
    var unwrapSheet = unwrap && rows <= 2; //Will this sheet be unwrapped?
    var collapseSheet = collapse && rows <= 2 && !unwrapSheet; //Will this sheet be collapsed
    var sheetName = sheets[i].getName();
    var sheetArray = sheetArrayJson;
    var sheetIsValueArray = (valueArray && columns === 1); //Is this sheet a value array?
    var sheetJsonObject = {};
    var sheetJsonArray = [];
    
    var rowImplicitNames = []; //Used to keep associations with implicit key values per row.
    var rowImplicitValues = [];
    
    var hasNesting = false; //Will be set to true if any nesting occurs.
    var useNestingArray = false; //If true, the sheet's contents will be in an array
    var forceNestedArray = false; //If true, all keys in the sheet will have "{#SHEET}{#ROW}" inserted at their beginning.
    
    var forceUnwrap = false;
    var forceCollapse = false;
    
    //Get the prefixes used by this sheet
    var activePrefixes = getPrefixes(sheetName, nestedArrayPrefix, arrayPrefix, unwrapPrefix, collapsePrefix);
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
      var keyNesting = false; //At least one column is using nested element syntax
      var keyNestingIsArray = true; //At least one column is not set up to use nested array syntax (prefaced with {#SHEET}{#ROW})
      
      for(var j=0; j < columns; j++)
      {
        if(values[0][j] === "" || values[0][j] == null) continue; //Skip columns with empty keys
        
        var keyPath = getKeyPath(values[0][j], rowImplicitNames, rowImplicitValues, nestedElements);
        
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
    
    for(let j=1; j < rows; j++) //j = 1 because we don't need the keys to have a row
    {
      if(keyHasPrefix(values[j][0], ignorePrefix)) continue; //Skip rows with the ignore prefix
    
      let rowArray = [];
      let rowObject = {};
      let rowIndexNames = []; //Used to keep associations with row indexes correct
      let rowIndexValues = [];
      
      if(!sheetIsValueArray)
      {
        var startIndex = (includeFirstColumn || sheetArray || nestedElements) ? 0 : 1;
        
        for(let k=startIndex; k < columns; k++)
        {
          var keyPrefix = "";
          
          if(values[0][k] === "" || values[0][k] == null) continue; //Skip columns with empty keys
          if(ignoreEmpty && (values[j][k] === "" || values[j][k] == null)) continue; //Skip empty cells if desired (can help cut down on clutter)
          
          var key = values[0][k];
          
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
          
          var keyPath = getKeyPath(key, rowImplicitNames, rowImplicitValues, nestedElements); //Get the path specified by the key (for nested object support)
          key = keyPath[keyPath.length-1]; //Get the actual key value
          
          if(keyPrefix !== "") key = keyPrefix + key;
          
          if(keyHasPrefix(key, ignorePrefix)) continue; //Skip columns with the ignore prefix
          
          if(forceNestedArray)//Insert forced {#SHEET} and {#ROW} values
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
          
          var content = trimSafe(values[j][k]);
          
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
              catch (e)
              {
                content = {};
              }
            }
            else if(content[0] === '[' && content[content.length-1] === ']')
            {
              content = tryParseJsonArrayString(content);
            }
          }
          
          //TODO: Should strip double quotes from content around here... ie ["test, test"] should become [test, test] but only when exporting arrays?
          //We want to export cell arrays, or this column should be exported as an array, so convert the target cell's value to an array of values.
          if(exportArray && (getCellContentArray(content, separatorChar).length > 1) || keyHasPrefix(key, arrayPrefix))
          {
            content = getCellContentArray(content, separatorChar);
            
            //Force values in the array to be strings if desired
            if(forceString)
            {
              for(let l=0; l < content.length; l++)
              {
                if(content[l] !== "")
                {
                  if(isObject(content[l]))
                  {
                    for(field in content[l])
                    {
                      content[l][field] = content[l][field].toString();
                    }
                  }
                  else
                  {
                    content[l] = content[l].toString();
                  }
                }
              }
            }
          }
          else if(forceString)
          {
            //Force value to be a string if desired
            if(isObject(content))
            {
              for(field in content)
              {
                content[field] = content[field].toString().trim();
              }
            }
            else
            {
              content = content.toString().trim();
            }
          }
          
          Logger.log(`12: ${content}`);
          
          //Convert the key to a string and strip unneeded prefixes
          if(arrayPrefix != "") key = stripPrefix(key.toString(), arrayPrefix);
          else key = key.toString();
          
          //TODO: Need a NONEST_ prefix to ignore nested formatting for a column
          var element = useNestingArray ? sheetJsonArray : sheetJsonObject; 
          
          //Check that we are using nested objects and the key's path has more than one element to it.
          if(nestedElements && keyPath.length > 1)
          {
            if(!hasNesting) hasNesting = true;
            
            rowObject[key] = content;
            
            //Loop through the key path (minus the actual key)
            for(var l=0; l < keyPath.length-1; l++)
            {
              var cachedElement = element;
              var subpathType = getSubpathTypeJson(keyPath[l]);
              var subpath = trimKeySubpath(keyPath[l]);
              var foundMatch = false;
              
              //Check if the subpath points to an object and is meant to be searched for somehow (either by key or index)
              if(subpathType == SubpathTypes.Object && isSearchSubpath(subpath))
              {
                subpath = subpath.substring(1); //Get the substring of the key so we know what type of search to perform
                var searchType = getSubpathSearchType(subpath); //Get the type of search specified by nesting formatting in the column key
                var firstObjectIndex = -1; //If searching through an array, need to ensure that values are only added to an object element, not an int or string.
                
                switch(searchType)
                {
                  //Search for a field with a matching name and value
                  case SearchTypes.Field:
                  //The current element is an array, so look through each element for the first element with the target field with a matching value
                  if(isArray(element))
                  {
                    var fieldlessElement = -1; //Fieldless element is used to find an element in the array that doesn't have the specified subpath field.
                    
                    for(var m=0; m < element.length; m++)
                    {
                      //Should only examine array elements if they are objects, not types like int or string
                      if(isObject(element[m]))
                      {
                        if(firstObjectIndex < 0) firstObjectIndex = m;
                        
                        var arrayElement = element[m];
                        
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
                  if(isArray(element)) //Only update the value if the element is an array
                  {
                    var rowIndex = j - 1; //j - 1, subtracting 1 for the key row
                    
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
                    var subpathIndex = Number(subpath) - 1;
                    
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
                      var delta = subpathIndex - (element.length - 1);
                      
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
            else if(content === "null") content = getNullCellValueJson(nullValueFormat);
            
            element[key] = content;
          }
          else
          {
            //Format empty and null content
            if(content === "") content = getEmptyCellValueJson(emptyValueFormat);
            else if(content === "null") content = getNullCellValueJson(nullValueFormat);
          
            rowObject[key] = content;
            
            Logger.log(JSON.stringify(content));
            Logger.log(`${key}: ${rowObject[key]}`);
            
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
        
        var content = values[j][0];
        
        //We want to export cell arrays, or this column should be exported as an array, so convert the target cell's value to an array of values.
        if(exportArray && (getCellContentArray(content, separatorChar).length > 1) || (arrayPrefix != "" && keyHasPrefix(values[0][0], arrayPrefix)))
        {
          content = getCellContentArray(content, separatorChar);
          
          //Force array values to be strings if desired
          if(forceString)
          {
            for(let l=0; l < content.length; l++)
            {
              if(content[l] != "") content[l] = content[l].toString();
            }
          }
        }
        else if(forceString)
        {
          //Force value to be a string if desired
          content = content.toString();
        }
        
        //Format empty and null content
        if(content === "") content = getEmptyCellValueJson(emptyValueFormat);
        else if(content === "null") content = getNullCellValueJson(nullValueFormat);
        
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
              Logger.log(JSON.stringify(rowObject));
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
    var arrayValue = [];
    
    if(sheetArray)
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
  
  let exportSettings = {
    "filename" : fileName,
    "content" : rawValue,
    "export-folder" : (exportFolderType === "default" ? "" : exportFolder),
    "mime" : ContentService.MimeType.JSON,
    "visualize" : visualize,
    "replace-file" : replaceFile,
    "message" : exportMessage,
    "message-height" : exportMessageHeight
  };
  
  callback(exportSettings);
}

/**
 * Exports a file using the last settings used.
 * This should be called when attempting automation.
 **/
function reexportFile()
{
  var props = getPrevExportProperties();
  var parsedProps = JSON.parse(props);
  
  if(parsedProps["exportType"] == "xmlFormat")
  {
    exportXml(props);
  }
  else
  {
    exportJson(props);
  }
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
 * Export the given content as a file with the given properties.
 * @param {object} blob
 **/
function exportDocument(blob)
{
  exportTime = (Date.now() - exportTime) / 1000; //Date.now() returns miliseconds, so divide by 1000
  
  var visualize = blob["visualize"];
  var filename = blob["filename"];
  var content = blob["content"];
  var exportMessage = blob["message"];
  var exportMessageHeight = blob["message-height"];
  
  if(visualize == true)
  {
    let formatting = [
      { id : '{f117b2c2-1d31-4d46-bcd1-d99dda128059}', value : escapeHtml(content) }, //Visualized data
      { id : '{4297f144-6a18-49df-b298-29fdfcf1a092}', value : (exportMessage === "" ? '' : exportMessage) } //Custom message
    ];
    
    //530
    openFormattedModal('Modal_Visualize', formatting, `Visualize: ${filename} (${exportTime} sec)`, 600, 430 + exportMessageHeight, false);
  }
  else
  {
    var exportFolder = blob["export-folder"];
    var type = blob["mime"];
    var replaceFile = blob["replace-file"];
  
    //Creates the document and moves it into the same folder as the original file
    //If the user does not have permission to write in the specified location, the file will be created in the base folder in "My Drive"
    var user = Session.getEffectiveUser();
    var file = null;
    var rootFolder = DriveApp.getRootFolder();
    var currentFileId = SpreadsheetApp.getActive().getId();
    var currentFiles = DriveApp.getFilesByName(SpreadsheetApp.getActive().getName());
    var currentFile;
    
    var fileCounts = DriveApp.getFilesByName(filename);
    var count = 0;
    
    while(fileCounts.hasNext())
    {
      count += 1;
      fileCounts.next();
    }
    
    while(currentFiles.hasNext())
    {
      currentFile = currentFiles.next();
      
      if(currentFile.getId() == currentFileId) break;
    }
    
    var permission = DriveApp.Permission.VIEW;
    var parentFolder = exportFolder !== "" ? DriveApp.getFolderById(exportFolder) : getFileParentFolder(currentFile);
    var trueParentFolder = parentFolder; //Store the true parent folder for use in modal dialogues
    
    if(parentFolder != null) permission = parentFolder.getAccess(user);
    
    //If the parent folder for the file is null, use the root folder for Drive
    if(parentFolder == null) parentFolder = rootFolder;
    
    if(replaceFile)
    {
      currentFiles = parentFolder.getFiles();
      
      var matchingFiles = [];
      var newestIndex = -1;
      var newestDate = null;
      
      while(currentFiles.hasNext())
      {
        currentFile = currentFiles.next();
        if(currentFile.getName() == filename)
        {
          matchingFiles.push(currentFile);
          
          if(newestDate == null || (currentFile.getLastUpdated() > newestDate))
          {
            newestIndex = matchingFiles.length-1;
            newestDate = currentFile.getLastUpdated();
          }
        }
      }
      
      if(newestIndex > -1)
      {
        //Compare dates from files then delete all but the last updated and replace its contents
        for(var i=matchingFiles.length-1; i >= 0; i--)
        {
          if(i == newestIndex)
          {
            matchingFiles[newestIndex].setContent(content); // update file with new data
            file = matchingFiles[newestIndex];
          }
          else
          {
            matchingFiles[i].setTrashed(true);
          }
        }
      }
    }
    
    if (file == null) //Create a new file if an old one wasn't found.
    {
      //The user has the authority to create a file next to the original spreadsheet.
      if(permission == DriveApp.Permission.OWNER || permission == DriveApp.Permission.EDIT)
      {
        file = parentFolder.createFile(filename, content);
      } 
      else //The user doesn't have authority to create a file, so create it on their drive root folder instead.
      {
        file = DriveApp.createFile(filename, content);
      }
    }
    
    var message = '';
    var height = 150;
    
    if(permission != DriveApp.Permission.OWNER && permission != DriveApp.Permission.EDIT && trueParentFolder != rootFolder)
    {
      message = "Note: You do not have permission to write to this spreadsheet's parent folder, so the new file is in your 'My Drive' folder.<br><br>";
      height += 50;
    }
    
    if(exportMessage !== "")
    {
      message += exportMessage + "<br><br>";
      height += exportMessageHeight + 25;
    }
    
    let formatting = [
      { id : '{e607f5a8-6dc2-4636-a4fc-1b94c97f1ea8}', value : file.getUrl() }, //Set the file URL
      { id : '{a7372abf-bd7e-4c13-8d54-0c0b3603a816}', value : file.getName() }, //Set the file name
      { id : '{393b3288-20f3-48f6-9255-07f11a84e7e2}', value : message }, //Set the message
      { id : '{03d82c9a-41ba-4fcf-9757-addea4fdb371}', value : file.getDownloadUrl() } //Set the download URL
    ];
    
    openFormattedModal('Modal_Export', formatting, `Export Complete! (${exportTime} sec)`, 400, height, false);
  }
}

/**
 * Show a modal with a compiling spinner.
 * @param {string} message Title for the modal.
 **/
function showCompilingMessage(message)
{
  var html = HtmlService.createTemplateFromFile('Spinner').evaluate()
      .setWidth(300)
      .setHeight(100);
  
  SpreadsheetApp.getUi().showModelessDialog(html, message);
}

/**
 * Open ESD's sidebar.
 **/
function openSidebar()
{
  var html = HtmlService.createTemplateFromFile('Sidebar').evaluate()
    .setTitle('Export Sheet Data')
    .setWidth(300);

  SpreadsheetApp.getUi().showSidebar(html);
  
  checkVersionNumber();
}


function openSettingsModal()
{
  openGenericModal('Modal_Settings', 'Export/Import Settings', 500, 460, true);
}


function openAboutModal()
{
  openGenericModal('Modal_About', 'About ESD', 275, 185, false);
}


function openSupportModal()
{
  openGenericModal('Modal_Support', 'Support ESD', 375, 185, false);
}


function openNewVersionModal()
{
  openGenericModal('Modal_NewVersion', "What's New", 375, 250, true);
}


function openErrorModal(title, message, error)
{
  var formatting = [
    { id : '{5fd5c101-9583-456a-8c32-857c0fe3d1db}', value : message },
    { id : '{34f48d68-d9b5-4c63-8a62-a25f5a412313}', value : error }
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
  var html = HtmlService.createTemplateFromFile(modal).evaluate()
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
  var htmlString = HtmlService.createTemplateFromFile(modal).getRawContent();
  
  for(let i=0; i < formatting.length; i++)
  {
    htmlString = htmlString.replace(formatting[i]["id"], formatting[i]["value"]);
  }
  
  var html = HtmlService.createHtmlOutput(htmlString)
    .setWidth(width)
    .setHeight(height);
      
  if(blockInput) SpreadsheetApp.getUi().showModalDialog(html, title);
  else SpreadsheetApp.getUi().showModelessDialog(html, title);
}


function openFolderPicker()
{
  var html = HtmlService.createHtmlOutputFromFile('FolderPicker.html')
      .setWidth(650)
      .setHeight(450);
      
  SpreadsheetApp.getUi().showModalDialog(html, 'Select Export Folder');
}


function onFolderSelected(settings)
{
  setExportProperties(settings);
  openSidebar(); //TODO: This will wipe any unsaved settings... need to pass settings when calling openFolderPicker()?
}

//Used in FolderPicker.html to determine if the user has granted proper access for allowing file browsing.
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
  var temp = PropertiesService.getUserProperties();
  var latestVersion = temp.getProperty("esd-latestVersion");
  
  if(latestVersion === "" || parseInt(latestVersion) !== esdVersion)
  {
    PropertiesService.getUserProperties().setProperty("esd-latestVersion", esdVersion.toString());
    openNewVersionModal();
  }
}


function onInstall(e)
{
  onOpen(e);
}


function onOpen(e)
{
  var ui = SpreadsheetApp.getUi();
  ui.createAddonMenu()
  .addItem("Open Sidebar", "openSidebar")
  .addItem("Settings", "openSettingsModal")
  //.addItem("What's New", "openNewVersionModal") //For testing purposes
  .addSeparator()
  .addItem("About (v" + esdVersion + ")", "openAboutModal")
  .addItem("Support ESD", "openSupportModal")
  .addToUi();
};