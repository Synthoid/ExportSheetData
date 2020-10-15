const esdVersion = 61;

//Popup message
const messageLineHeight = 10;

//Indenting
const indentValue = "  "; //'\t'
var indentAmount = 0;

//Subpath types
const jsonArraySubpath = "Array"; //JSON Array
const jsonObjectSubpath = "Object"; //JSON Object
const xmlArraySubpath = "Array"; //XML element with child elements
const xmlAttributeSubpath = "Attibute"; //XML element attribute
const keySubpath = "Key"; //JSON field or XML element key

//Search types
const searchTypeField = "Field"; //Search for a specific field value (#FIELD_ID)
const searchTypeRoot = "Root"; //Set the target element to the root JSON object (#ROOT)
const searchTypeSheet = "Sheet"; //Set the target element to the sheet's root. (#SHEET)
const searchTypeRow = "Row"; //Search for the index matching a row's index (#ROW)
const searchTypeIndex = "Index"; //Search for a specific index (#1)
const searchTypeNone = "None"; //Not a valid search type

//Special prefixes to allow XML nested elements
//const arrayPref = "ARRAY_";
//const attributePref = "ATTRIBUTE_";

//Gets the last settings for ESD in the open document.
function getProperties()
{
  var properties = PropertiesService.getDocumentProperties();
  
  return JSON.stringify(properties.getProperties());
}

//Saves the settings last used for ESD so the user doesn't need to reselect them next time ESD is opened.
function setProperties(newProperties)
{
  var properties = PropertiesService.getDocumentProperties();
  
  properties.setProperties(JSON.parse(newProperties));
}

//Gets the total export settings for ESD in the open document.
function getExportProperties()
{
  var properties = PropertiesService.getDocumentProperties();
  
  return properties.getProperty("settings");
}

//Saves the total export settings for ESD in the open document so the user doesn't need to reselect them next time ESD is opened.
function setExportProperties(newProperties)
{
  var properties = PropertiesService.getDocumentProperties();
  
  properties.setProperty("settings", newProperties);
}

//Gets the settings used in the last export.
function getPrevExportProperties()
{
  var properties = PropertiesService.getDocumentProperties();
  
  return properties.getProperty("prev");
}

//Saves the settings used in the last export.
function setPrevExportProperties(newProperties)
{
  var properties = PropertiesService.getDocumentProperties();
  
  properties.setProperty("prev", newProperties);
}

//Get the ESD properties for a specific user.
function getUserProperties()
{
  var properties = PropertiesService.getUserProperties();
  
  return JSON.stringify(properties.getProperties());
}

//Saves user settings for ESD.
function setUserProperties(newProperties)
{
  var properties = PropertiesService.getUserProperties();
  
  properties.setProperties(JSON.parse(newProperties));
}

//Get the current version of ESD.
function getVersion()
{
  return esdVersion;
}

//Returns the name of the folder with the given ID.
function getFolderNameFromId(id)
{
  return DriveApp.getFolderById(id).getName();
}

//Returns true if the passed value is an array.
function isArray(array)
{
  return Array.isArray(array);
}

//Returns true if the pased value is an object and is not null.
function isObject(object)
{
  return (typeof(object) === 'object' && object !== null);
}

//Returns true if the passed value is undefined.
function isUndefined(value)
{
  return (typeof(value) === 'undefined');
}

//Returns the index of the given value in an array.
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

//Gets the number of indents to use when formatting
function getIndent()
{
  var indent = "";
  
  for(let i=0; i < indentAmount; i++)
  {
    indent += indentValue;
  }
  
  return indent;
}

//Gets all of the sheet names in the current spreadsheet
function getSheetNames()
{
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  var sheetNames = new Array();
  
  for(let i=0; i < sheets.length; i++)
  {
    sheetNames.push(sheets[i].getName());
  }
  
  return sheetNames;
}

//Gets the active sheet name in the current spreadsheet
function getActiveSheetName()
{
  var spreadsheet = SpreadsheetApp.getActive();
  
  return spreadsheet.getActiveSheet().getName();
}

//Gets a file's parent folder
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

//Gets a file's parent folder's ID, or the root Drive folder ID if the parent folder is null
function getFileParentFolderId(file)
{
  var folder = getFileParentFolder(file);
  
  if(folder == null)
  {
    folder = DriveApp.getRootFolder();
  }
  
  return folder.getId();
}

//Converts the contents of a cell into an array by separating the cell value based on the given separator char.
function getCellContentArray(cell, separatorChar)
{
  var content = cell;
  var cellArray = new Array();
  var commaIndicies = new Array();
  var openQuoteIndicies = new Array();
  var closeQuoteIndicies = new Array();
  
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
  var startIndex = 0;
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
      var isNumber = true;
      var minusCount = 0;
      var decimalCount = 0;
      
      //Parse float is unreliable, so loop through to make sure the string is actually a float
      for(var j=0; j < cellArray[i].length; j++)
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
  }
  
  return cellArray;
}

//Formats a string to adhere to XML element naming conventions
//See: https://www.w3schools.com/xml/xml_elements.asp
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
  
  // /([^a-zA-Z0-9\-\_])/gm
  // /([^:A-Z0-9\-\_\.])/gim
  xmlName = xmlName.replace(/([^A-Z0-9\-\_\.])/gim, replacement); //Replace non-alphanumeric, dash, underscore, or period chars with an underscore
  
  if(xmlName.search(/[a-zA-Z\_]/g) > 0)
  {
    xmlName = "_" + xmlName; //XML element names must start with a letter or underscore, so add an underscore to the front
  }
  
  return xmlName;
}

//Returns an array with the name as the first element and the namespace as the second.
function getXmlNameWithNamespace(value)
{
  var values = value.split(':');
  var output = [];
  
  switch(values.length)
  {
    case 0:
      output = [ "", "" ];
      break;
    case 1:
      output = [ values[0], "" ];
      break;
    default:
      output = [ values[values.length-1], values[0] ];
      break;
  }
  
  return output;
}

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


function formatJsonString(value, asObject)
{
  if(value.length > 1)
  {
    //Get rid of wrapping quotes (")
    if(value[0] == '"' && value[value.length-1] == '"')
    {
      let endValue = value.length - 1;
      
      if(endValue < 1) endValue = 1;
      
      value = value.substring(1, endValue);
    }
    //Don't format object values (wrapped with {})
    if(asObject && value[0] == '{' && value[value.length-1] == '}')
    {
      //Need to format to match the rest of the file
      return value;
    }
  }
  
  return JSON.stringify(value);
}

//Returns true if a key starts with the specified prefix.
function keyHasPrefix(key, prefix)
{
  if(prefix.length > key.length || prefix.length === 0) return false;
  
  var newKey = "";
  
  for(let i=0; i < prefix.length; i++)
  {
    newKey += key[i];
  }
  
  return newKey === prefix;
}

//Returns true if a key starts with any of the specified prefixes.
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

//Returns an array indicating if specific prefixes are used in a given key.
//Multiple string values can be passed in for the prefixes argument.
function getPrefixes(key, prefixes)
{
  var values = new Array();
  var prefixArgs = new Array();
  
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

//Strips a given prefix from the passed key (so prefixes like forced JSON arrays' JA_ are not included in the actual exported key value)
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

//Strips the specified prefixes from the passed key.
function stripPrefixes(key, prefixes)
{
  var prefixArgs = new Array();
  
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

//Is the subpath a search pattern (prefixed with #), or is it a hardset path
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

//Returns an array representing a key separated into subpaths. Used for nested objects
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
    if(getSubpathTypeJson(path[path.length-1]) !== keySubpath)
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


function trimKeySubpath(key)
{
  return key.substring(1, key.length-1);
}

//Gets the type of a subpath in an XML export nested element key.
function getSubpathTypeXml(subpath)
{
  var type = keySubpath;
  
  if(subpath.length > 0)
  {
    switch(subpath[0])
    {
      case '[':
      type = xmlArraySubpath;
      break;
      
      case '{':
      type = xmlAttributeSubpath;
      break;
    }
  }
  
  return type;
}

//Gets the type of a subpath in a JSON export nested element key.
function getSubpathTypeJson(subpath)
{
  var type = keySubpath;
  
  if(subpath.length > 0)
  {
    switch(subpath[0])
    {
      case '[':
      type = jsonArraySubpath;
      break;
      
      case '{':
      type = jsonObjectSubpath;
      break;
    }
  }
  
  return type;
}

//What type of search does the subpath indicate?
function getSubpathSearchType(subpath)
{
  var type = searchTypeNone;
  
  if(subpath.length > 0)
  {
    //subpath = subpath.substring(1);
    
    if(!isNaN(Number(subpath))) //Index
    {
      type = searchTypeIndex;
    }
    //TODO: This can only work if sheetJsonArray/Object are added to the root object first...
    /*else if(subpath == "ROOT")
    {
      type = searchTypeRoot;
    }*/
    else if(subpath == "SHEET")
    {
      type = searchTypeSheet;
    }
    else if(subpath == "ROW") //Row based index
    {
      type = searchTypeRow;
    }
    else //Field
    {
      type = searchTypeField;
    }
  }
  
  return type;
}

//Trims a value of whitespace if it is a string. Otherwise returns the value unaltered.
function trimSafe(value)
{
  if(typeof(value) === 'string') return value.trim();

  return value;
}

//Formats empty cell values to use the appropriate value (null or "")
function getEmptyCellValueJson(formatType)
{
  switch(formatType)
  {
    case "string": return "";
  }
  
  return null;
}

//Formats cell values containing the string "null" to use the appropriate value (null or "null")
function getNullCellValueJson(formatType)
{
  switch(formatType)
  {
    case "string": return "null";
  }
  
  return null;
}

//Attempts to parse a JSON string representing an array and return its contents in a list.
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

//Export data as XML.
function exportXml(formatSettings, callback)
{
  showCompilingMessage('Compiling XML...');
  exportSpreadsheetXml(formatSettings, callback == null ? exportDocument : callback);
  
  var tempSettings = JSON.parse(formatSettings);
  
  tempSettings["visualize"] = false;
  
  formatSettings = JSON.stringify(tempSettings);
  
  setPrevExportProperties(formatSettings);
}

//Export data as JSON.
function exportJson(formatSettings, callback)
{
  showCompilingMessage('Compiling JSON...');
  exportSpreadsheetJson(formatSettings, callback == null ? exportDocument : callback);
  
  var tempSettings = JSON.parse(formatSettings);
  
  tempSettings["visualize"] = false;
  
  formatSettings = JSON.stringify(tempSettings);
  
  setPrevExportProperties(formatSettings);
}

//Convert sheet data into an XML string. The string, along with relevant publishing data, will be passed to the given callback function.
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
  
  //Sheets info
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  var exportMessage = "";
  var exportMessageHeight = 0;
  
  if(customSheets != null)
  {
    var exportSheets = sheets;
    sheets = new Array();
    
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
  
  var xmlRoot = XmlService.createElement(formatXmlName(rootElement, nameReplacementChar)); //Create the root XML element. https://developers.google.com/apps-script/reference/xml-service/
  
  for(let i=0; i < sheets.length; i++)
  {
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
    
    var sheetXml = XmlService.createElement(formatXmlName(sheetName, nameReplacementChar));
    
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
      
      //Build the actual row XML
      let rowXml = XmlService.createElement("Comment");
      
      //Separate columns into those that export as child elements or attributes
      let startIndex = (includeFirstColumn && !isComment) ? 0 : 1; //Exclude the first column by default since it is used as the name of the row element, or because this is a comment element
      
      for(let k=startIndex; k < columns; k++)
      {
        if(values[0][k] === "" || values[0][k] == null) continue; //Skip columns with empty keys
        if((ignoreEmpty || isComment) && values[j][k] === "") continue; //Skip empty cells if desired or a comment
        if(keyHasPrefix(values[0][k], ignorePrefix)) continue; //Skip columns with the ignore prefix
        
        if(isComment)
        {
          if(values[j][k] == null) continue; //Skip empty cells
          
          let text = rowXml.getText();
          rowXml.setText((text === "") ? values[j][k] : (text + "\n" + values[j][k]));
        }
        else
        {
          //Make a note if an element name gets formatted so users know they do not have proper formatting
          if(exportMessage === "" && values[0][k] !== formatXmlName(values[0][k], nameReplacementChar))
          {
            exportMessage = "Some keys have been auto-formatted to match XML standards.";
            exportMessageHeight = 25;
          }
        
          if((useChildElements && (attributePrefix === "" || !keyHasPrefix(values[0][k], attributePrefix)) && (innerTextPrefix === "" || !keyHasPrefix(values[0][k], innerTextPrefix))) || 
            (childElementPrefix !== "" && keyHasPrefix(values[0][k], childElementPrefix)))
          {
            childElementKeys.push(stripPrefix(values[0][k], childElementPrefix));
            childElements.push(values[j][k]); //TODO: Should convert values if needed. (ie export bools as ints)
          }
          else if(innerTextPrefix === "" || !keyHasPrefix(values[0][k], innerTextPrefix))
          {
            attributeKeys.push(stripPrefix(values[0][k], attributePrefix));
            attributes.push(values[j][k]);
          }
          else
          {
            innerTextKeys.push(stripPrefix(values[0][k], innerTextPrefix));
            innerTextElements.push(values[j][k]);
          }
        }
      }
      
      //Finish Comment logic
      if(isComment)
      {
        sheetXml.addContent(XmlService.createComment(rowXml.getText().replace(/[-]/g, '_'))); //Replace '-' with '_' as hyphens cause errors in comment nodes
        
        continue;
      }
      
      //Build the actual row XML
      rowXml = XmlService.createElement(formatXmlName(values[j][0], nameReplacementChar));
      
      //Set attributes
      for(let k=0; k < attributes.length; k++)
      {
        rowXml.setAttribute(formatXmlName(attributeKeys[k], nameReplacementChar), formatXmlValue(trimSafe(attributes[k]), exportBoolsAsInts));
      }
      
      //Set child elements
      for(let k=0; k < childElements.length; k++)
      {
        let childXml = XmlService.createElement(formatXmlName(childElementKeys[k], nameReplacementChar));
        
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
    //TODO: Can probably do this with XmlService?
    let xmlDeclaration = '<?xml version="' + declarationVersion + '"';
    
    if(declarationEncoding !== "") xmlDeclaration += ' encoding="' + declarationEncoding + '"';
    if(declarationStandalone !== "") xmlDeclaration += ' standalone="' + declarationStandalone + '"';
    
    xmlDeclaration += '?>\n';
    
    xmlRaw = xmlDeclaration + xmlRaw;
  }
  
  callback(fileName, xmlRaw, (exportFolderType === "default" ? "" : exportFolder), ContentService.MimeType.XML, visualize, replaceFile, exportMessage, exportMessageHeight);
}

//Convert sheet data into a JSON string. The string, along with relevant publishing data, will be passed to the given callback function.
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
      sheets = new Array();
      
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
    
      var rowArray = [];
      var rowObject = {};
      var rowIndexNames = []; //Used to keep associations with row indexes correct
      var rowIndexValues = [];
      
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
              if(subpathType == jsonObjectSubpath && isSearchSubpath(subpath))
              {
                subpath = subpath.substring(1); //Get the substring of the key so we know what type of search to perform
                var searchType = getSubpathSearchType(subpath); //Get the type of search specified by nesting formatting in the column key
                var firstObjectIndex = -1; //If searching through an array, need to ensure that values are only added to an object element, not an int or string.
                
                switch(searchType)
                {
                  //Search for a field with a matching name and value
                  case searchTypeField:
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
                  
                  case searchTypeRoot:
                  foundMatch = true;
                  element = objectValue;
                  break;
                  
                  case searchTypeSheet:
                  foundMatch = true;
                  element = useNestingArray ? sheetJsonArray : sheetJsonObject;
                  break;
                  
                  //Search for an array element at the index matching this row's index
                  case searchTypeRow:
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
                  case searchTypeIndex:
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
              
              if(isUndefined(element))
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
                  case jsonArraySubpath:
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
                  
                  case jsonObjectSubpath:
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
  
  callback(fileName, rawValue, (exportFolderType === "default" ? "" : exportFolder), ContentService.MimeType.JSON, visualize, replaceFile, exportMessage, exportMessageHeight);
}

//Exports a file using the last settings used.
//This should be called when attempting automation.
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

// Escape HTML special characters for showing text in a textarea
function escapeHtml(content)
{
  return content
    .replace(/&/g, '&amp;') //&
    .replace(/</g, '&lt;')  //<
    .replace(/>/g, '&gt;'); //>
}

//Export the given content as a file with the given properties.
function exportDocument(filename, content, exportFolder, type, visualize, replaceFile, exportMessage, exportMessageHeight)
{
  if(visualize == true)
  {
    var html = HtmlService.createHtmlOutput('<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><style>.display { width:555px; height:425px; }</style><textarea class="display">' + escapeHtml(content) + '</textarea><br>Note: Escaped characters may not display properly when visualized, but will be properly formatted in the exported data.<br><br>' + (exportMessage === "" ? '' : exportMessage + '<br><br>') + '<button class="action" onclick="google.script.run.reexportFile()">Export</button><button onclick="google.script.host.close()">Close</button>')
      .setWidth(600)
      .setHeight(525 + exportMessageHeight);
      
    SpreadsheetApp.getUi().showModelessDialog(html, 'Visualized Data: ' + filename);
  }
  else
  {
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
    
    var html = HtmlService.createHtmlOutput('<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><style>.display { width:355px; height:85px; text-align: center; overflow: auto; } </style>File exported successfully. You can view the file here:<div class="display"><br><br><a href="' + file.getUrl() + '" target="_blank">' + file.getName() + '</a></div>' + message + '<button onclick="google.script.host.close()">Close</button>')
        .setWidth(400)
        .setHeight(height);
    
    SpreadsheetApp.getUi().showModelessDialog(html, 'Export Complete!');
  }
}

//Show a modal with a compiling spinner.
function showCompilingMessage(message)
{
  var html = HtmlService.createTemplateFromFile('Spinner').evaluate()
      .setWidth(300)
      .setHeight(100);
  
  SpreadsheetApp.getUi().showModelessDialog(html, message);
}

  
function openSidebar()
{
  var html = HtmlService.createTemplateFromFile('Sidebar').evaluate()
    .setTitle('Export Sheet Data')
    .setWidth(300);

  SpreadsheetApp.getUi().showSidebar(html);
}


function openAboutModal()
{
  var html = HtmlService.createTemplateFromFile('Modal_About').evaluate()
    .setWidth(275)
    .setHeight(185);
  
  SpreadsheetApp.getUi().showModelessDialog(html, 'About ESD');
}


function openErrorModal(title, message, error)
{
  var htmlString = HtmlService.createTemplateFromFile('Modal_Error').getRawContent();
  
  htmlString = htmlString.replace('{5fd5c101-9583-456a-8c32-857c0fe3d1db}', message); //Set the message content
  htmlString = htmlString.replace('{34f48d68-d9b5-4c63-8a62-a25f5a412313}', error); //Set the error content
  
  var html = HtmlService.createHtmlOutput(htmlString)
    .setWidth(360)
    .setHeight(200);
      
  SpreadsheetApp.getUi().showModelessDialog(html, title);
}


function openUpdateWindow()
{
  var html = HtmlService.createHtmlOutput('<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><div><p>Export Sheet Data has been updated to v' + esdVersion + '</p><p>Release notes can be viewed on GitHub: <a href="https://github.com/Synthoid/ExportSheetData/blob/master/ReleaseNotes.pdf" target="blank">here</a></p><br><button onclick="google.script.host.close()">Close</button></div>')
      .setWidth(275)
      .setHeight(130);
      
  SpreadsheetApp.getUi().showModelessDialog(html, 'ESD Update Notes');
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

//https://developers.google.com/apps-script/guides/html/best-practices#code.gs
//Server side function to insert html snippets in other html files when generating html templates.
function include(filename)
{
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
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
  .addSeparator()
  .addItem("About (v" + esdVersion + ")", "openAboutModal")
  .addToUi();
};