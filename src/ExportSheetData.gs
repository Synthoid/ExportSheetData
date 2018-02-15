var esdVersion = 44;

//Popup message
var messageLineHeight = 10;

//Indenting
var indentValue = "  ";
var indentAmount = 0;

//Subpath types
var jsonArraySubpath = "Array"; //JSON Array
var jsonObjectSubpath = "Object"; //JSON Object
var xmlArraySubpath = "Array"; //XML element with child elements
var xmlAttributeSubpath = "Attibute"; //XML element attribute
var keySubpath = "Key"; //JSON field or XML element key

//Search types
var searchTypeField = "Field"; //Search for a specific field value (#FIELD_ID)
var searchTypeRoot = "Root"; //Set the target element to the root JSON object (#ROOT)
var searchTypeSheet = "Sheet"; //Set the target element to the sheet's root. (#SHEET)
var searchTypeRow = "Row"; //Search for the index matching a row's index (#ROW)
var searchTypeIndex = "Index"; //Search for a specific index (#1)
var searchTypeNone = "None"; //Not a valid search type

//Special prefixes to allow XML nested elements
//var arrayPref = "ARRAY_";
//var attributePref = "ATTRIBUTE_";

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
  var props = PropertiesService.getDocumentProperties();
  
  var prop = props.getProperty("settings");
  
  return prop;
}

//Saves the total export settings for ESD in the open document so the user doesn't need to reselect them next time ESD is opened.
function setExportProperties(newProperties)
{
  var properties = PropertiesService.getDocumentProperties();
  
  var prop = properties.getProperty("settings");
  
  properties.setProperty("settings", newProperties);
}

//Gets the settings used in the last export.
function getPrevExportProperties()
{
  var props = PropertiesService.getDocumentProperties();
  
  var prop = props.getProperty("prev");
  
  return prop;
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
  
  for(var i=0; i < array.length; i++)
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
  
  for(var i=0; i < indentAmount; i++)
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
  
  for(var i=0; i < sheets.length; i++)
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


function getCellContentArray(cell, separatorChar)
{
  var content = cell;
  var cellArray = new Array();
  var commaIndicies = new Array();
  var openQuoteIndicies = new Array();
  var closeQuoteIndicies = new Array();
  
  //Set the indicies for quotes and commas
  for(var i=0; i < content.length; i++)
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
  for(var i=0; i < closeQuoteIndicies.length; i++)
  {
    for(var j=commaIndicies.length-1; j >= 0; j--)
    {
      if(commaIndicies[j] > openQuoteIndicies[i] && commaIndicies[j] < closeQuoteIndicies[i])
      {
        commaIndicies.splice(j, 1);
      }
    }
  }
        
  //populate the array
  var startIndex = 0;
  for(var i=0; i < commaIndicies.length; i++)
  {
    var arrayString = content.slice(startIndex, commaIndicies[i]);
    if(arrayString != "") cellArray.push(arrayString.replace('"', ' ').replace('"', ' ').trim()); //Get rid of the wrapping quotes
    startIndex = commaIndicies[i] + 1; // +1 so the next string doesn't start with a comma
  }
  
  if(commaIndicies.length > 0)
  {
    var endIndex;
    
    if(content[content.length - 1] == separatorChar) endIndex = content.length - 1;
    else endIndex = content.length;
    
    var lastString = content.slice(startIndex, endIndex); //Push the string from the last comma to the end of the content string
    cellArray.push(lastString.replace('"', ' ').replace('"', ' ').trim()); //Get rid of wrapping quotes
  }
  
  if(commaIndicies.length == 0) // If there are no commas to make the array, return the whole content
  {
    cellArray.push(content);
  }
  
  //Convert values to their correct type (float, bool, etc)
  for(var i=0; i < cellArray.length; i++)
  {
    if(!isNaN(parseFloat(cellArray[i])))
    {
      var isNumber = true;
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
  
  xmlName = xmlName.replace(/[^a-zA-Z0-9\-\_]/gm, replacement); //Replace non-alphanumeric, dash, underscore, or period chars with an underscore
  
  if(xmlName.search(/[a-zA-Z\_]/g) > 0)
  {
    xmlName = "_" + xmlName; //XML element names must start with a letter or underscore, so add an underscore to the front
  }
  
  return xmlName;
}

//Encodes illegal XML characters into a format readable to XML
function formatXmlString(value)
{
  if(!isNaN(value)) return value;
  
  var xmlString = "";
  
  for(var i=0; i < value.length; i++)
  {
    switch(value[i])
    {
      case '&':
        xmlString += '&amp;';
        break;
        
      case '<':
        xmlString += '&lt;';
        break;
        
      case '>':
        xmlString += '&gt;';
        break;
        
      case '"':
        xmlString += '&quot;';
        break;
        
      case "'":
        xmlString += '&apos;';
        break;
        
      default:
        xmlString += value[i];
        break;
    }
  }
  
  return xmlString;
}


function formatJsonString(value, asObject)
{
  if(value.length > 1)
  {
    //Get rid of wrapping quotes (")
    if(value[0] == '"' && value[value.length-1] == '"')
    {
      var endValue = value.length - 1;
      
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


function keyHasPrefix(key, prefix)
{
  if(prefix.length > key.length || prefix.length === 0) return false;
  
  var newKey = "";
  
  for(var i=0; i < prefix.length; i++)
  {
    newKey += key[i];
  }
  
  return newKey === prefix;
}

//Returns true if a key starts with any of the specified prefixes.
function keyHasPrefixes(key, prefixes)
{
  for(var i=0; i < prefixes.length; i++)
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
  for(var i=1; i < arguments.length; i++)
  {
    values.push(false);
    prefixArgs.push(arguments[i]);
  }
  
  //Loop through and set if each prefix is used.
  while(keyHasPrefixes(key, prefixArgs))
  {
    for(var i=1; i < arguments.length; i++)
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
    
    for(var i=prefix.length; i < key.length; i++)
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
  for(var i=1; i < arguments.length; i++)
  {
    prefixArgs.push(arguments[i]);
  }
  
  //Loop through and set if each prefix is used.
  while(keyHasPrefixes(key, prefixArgs))
  {
    for(var i=1; i < arguments.length; i++)
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
  
  for(var i=0; i < path.length; i++)
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
  
    for(var i=0; i < key.length; i++)
    {
      if(pathType === "") pathType = key[i];
      
      subPath += key[i];
      
      if((pathType === '[' && key[i] === ']') || (pathType === '{' && key[i] === '}'))
      {
        path.push(subPath);
        
        //Inject implied values when needed and able
        if(pathType === '[' && i < key.length-1 && key[i+1] !== '{')
        {
          var pathInjectString = getKeyPathString(path, path.length);
          
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
      var keyPath = trimKeySubpath(path[path.length-1]);
      
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

//gets the type of a subpath in a JSON export nested element key.
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


function exportXml(formatSettings)
{
  showCompilingMessage('Compiling XML...');
  exportSpreadsheetXml(formatSettings);
  
  var tempSettings = JSON.parse(formatSettings);
  
  tempSettings["visualize"] = false;
  
  formatSettings = JSON.stringify(tempSettings);
  
  setPrevExportProperties(formatSettings);
}


function exportJson(formatSettings)
{
  showCompilingMessage('Compiling JSON...');
  exportSpreadsheetJson(formatSettings);
  
  var tempSettings = JSON.parse(formatSettings);
  
  tempSettings["visualize"] = false;
  
  formatSettings = JSON.stringify(tempSettings);
  
  setPrevExportProperties(formatSettings);
}

//TODO: Declaration version doesn't seem to export currently
function exportSpreadsheetXml(formatSettings)
{
  //Settings
  var settings = JSON.parse(formatSettings);
  
  //File settings
  var visualize = settings["visualize"];
  var singleSheet = settings["singleSheet"];
  var replaceFile = settings["replaceExistingFiles"];
  var newline = settings["newlineElements"];
  var unwrap = settings["unwrapSingleRows"];
  var collapse = settings["collapseSingleRows"];
  var ignoreEmpty = settings["ignoreEmptyCells"];
  var nestedElements = settings["nestedElements"];
  var ignorePrefix = settings["ignorePrefix"];
  var unwrapPrefix = settings["unwrapPrefix"];
  var collapsePrefix = settings["collapsePrefix"];
  var customSheets = settings["targetSheets"];
  
  //XML settings
  var useChildElements = settings["exportChildElements"];
  var replaceIllegal = settings["formatContent"];
  var includeFirstColumnXml = settings["includeFirstColumn"];
  var rootElement = settings["rootElement"];
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
  
  var fileName = spreadsheet.getName() + (singleSheet ? (" - " + sheets[0].getName()) : "") + ".xml";
  var sheetValues = [[]];
  var rawValue = "";
  
  if(declarationVersion !== "")
  {
    rawValue = '<?xml version="' + declarationVersion + '"';
    
    if(declarationEncoding !== "") rawValue += ' encoding="' + declarationEncoding + '"';
    if(declarationStandalone !== "") rawValue += ' standalone="' + declarationStandalone + '"';
    
    rawValue += '?>\n';
  }
  
  rawValue += "<" + formatXmlName(rootElement, nameReplacementChar) + ">\n";
  
  indentAmount += 1;
                            
  for(var i=0; i < sheets.length; i++)
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
    
    var sheetData = "";
    
    //Get the prefixes used by this sheet
    var activePrefixes = getPrefixes(sheetName, unwrapPrefix, collapsePrefix);
    sheetName = stripPrefixes(sheetName, unwrapPrefix, collapsePrefix);
    
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
    
    if(!singleSheet)
    {
      if(rows > 2 || unwrapSheet === false)
      {
        sheetData += getIndent() + "<" + formatXmlName(sheetName, nameReplacementChar) + ">\n";
        indentAmount += 1;
      }
    }
    
    for(var j=1; j < rows; j++) //j = 1 because we don't need the keys to have a row
    {
      if(keyHasPrefix(values[j][0], ignorePrefix)) continue; //Skip rows with the ignore prefix
    
      var attributeKeys = [];
      var childElementKeys = [];
      var innerTextKeys = [];
      var attributes = [];
      var childElements = [];
      var innerTextElements = [];
      
      //Separate columns into those that export as child elements or attributes
      var startIndex = includeFirstColumnXml ? 0 : 1; //Exclude the first column by default since it is used as the name of the row element
      
      for(var k=startIndex; k < columns; k++)
      {
        if(values[0][k] === "" || values[0][k] == null) continue; //Skip columns with empty keys
        if(ignoreEmpty && values[j][k] === "") continue; //Skip empty cells if desired
        if(keyHasPrefix(values[0][k], ignorePrefix)) continue; //Skip columns with the ignore prefix
        
        //Make a note if an element name gets formatted so users know they do not have proper formatting
        if(exportMessage === "" && values[0][k] !== formatXmlName(values[0][k], nameReplacementChar))
        {
          exportMessage = "Some keys were not properly formatted for XML and have been auto-formatted.";
          exportMessageHeight = 25;
        }
        
        if((useChildElements && (attributePrefix === "" || !keyHasPrefix(values[0][k], attributePrefix)) && (innerTextPrefix === "" || !keyHasPrefix(values[0][k], innerTextPrefix))) || 
          (childElementPrefix !== "" && keyHasPrefix(values[0][k], childElementPrefix)))
        {
          childElementKeys.push(stripPrefix(values[0][k], childElementPrefix));
          childElements.push(values[j][k]);
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
      
      //Build the actual row string
      var row = getIndent() + "<" + formatXmlName(values[j][0], nameReplacementChar);
      
      if(attributes.length > 0) row += " ";
      
      for(var k=0; k < attributes.length; k++)
      {
        if(replaceIllegal) row += formatXmlName(attributeKeys[k], nameReplacementChar) + "=" + '"' + formatXmlString(attributes[k]) + '"';
        else row += formatXmlName(attributeKeys[k], nameReplacementChar) + "=" + '"' + attributes[k] + '"';
        
        if(k < attributes.length - 1) row += " ";
      }
      
      if(childElements.length === 0 && innerTextElements.length === 0) row += "/>\n";
      else
      {
        row += ">";
        
        if(childElements.length > 0 || newline) row += "\n";
      }
      
      for(var k=0; k < childElements.length; k++)
      {
        indentAmount += 1;
        
        row += getIndent() + "<" + formatXmlName(childElementKeys[k], nameReplacementChar) + ">";
          
        if(newline)
        {
          indentAmount += 1;
          row += "\n" + getIndent();
        }
          
        if(replaceIllegal) row += formatXmlString(childElements[k]);
        else row += childElements[k];
          
        if(newline)
        {
          indentAmount -= 1;
          row += "\n" + getIndent();
        }
          
        row += "</" + formatXmlName(childElementKeys[k], nameReplacementChar) + ">\n";
        
        indentAmount -= 1;
      }
      
      for(var k=0; k < innerTextElements.length; k++)
      {
        indentAmount += 1;
        
        if(newline || childElements.length > 0 && k === 0) row += getIndent();
        
        if(replaceIllegal) row += formatXmlString(innerTextElements[k]);
        else row += innerTextElements[k];
        
        if(newline || childElements.length > 0 && k >= innerTextElements.length - 1) row += "\n";
        
        indentAmount -= 1;
      }
      
      if(childElements.length > 0 || innerTextElements.length > 0)
      {
        if(newline || childElements.length > 0) row += getIndent();
        row += "</" + formatXmlName(values[j][0], nameReplacementChar) + ">\n";
      }
      
      sheetValues[i[j-1]] = row;
      sheetData += row;
    }
    
    if(!singleSheet)
    {
      if(rows > 2 || unwrapSheet === false)
      {
        indentAmount -= 1;
        sheetData += getIndent() + "</" + formatXmlName(sheetName, nameReplacementChar) + ">\n";
      }
    }
    
    rawValue += sheetData;
  }
  
  indentAmount -= 1;
  
  rawValue += "</" + formatXmlName(rootElement, nameReplacementChar) + ">";
  
  exportDocument(fileName, rawValue, ContentService.MimeType.XML, visualize, replaceFile, exportMessage, exportMessageHeight);
}


function exportSpreadsheetJson(formatSettings)
{
  //Settings
  var settings = JSON.parse(formatSettings);
  
  //File settings
  var visualize = settings["visualize"];
  var singleSheet = settings["singleSheet"];
  var replaceFile = settings["replaceExistingFiles"];
  var newline = settings["newlineElements"];
  var unwrap = settings["unwrapSingleRows"];
  var collapse = settings["collapseSingleRows"] && !unwrap;
  var ignoreEmpty = settings["ignoreEmptyCells"];
  var ignorePrefix = settings["ignorePrefix"];
  var unwrapPrefix = settings["unwrapPrefix"];
  var collapsePrefix = settings["collapsePrefix"];
  var customSheets = settings["targetSheets"];
  
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
  
  for(var i=0; i < sheets.length; i++)
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
    
    if(unwrap && rows > 2) unwrapSheet = false;
    
    for(var j=1; j < rows; j++) //j = 1 because we don't need the keys to have a row
    {
      if(keyHasPrefix(values[j][0], ignorePrefix)) continue; //Skip rows with the ignore prefix
    
      var rowArray = [];
      var rowObject = {};
      var rowIndexNames = []; //Used to keep associations with row indexes correct
      var rowIndexValues = [];
      
      if(!sheetIsValueArray)
      {
        for(var k=0; k < columns; k++)
        {
          var keyPrefix = "";
          
          if(values[0][k] === "" || values[0][k] == null) continue; //Skip columns with empty keys
          if(ignoreEmpty && values[j][k] === "") continue; //Skip empty cells if desired (can help cut down on clutter)
          
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
          
          var content = values[j][k];
          
          //We want to export this cell as a json object, so attempt to parse it to an object format, and make it empty if that fails
          if(exportCellObjectJson && typeof(content) === 'string' && content[0] === '{' && content[content.length-1] === '}')
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
          //We want to export cell arrays, or this column should be exported as an array, so convert the target cell's value to an array of values.
          if(exportArray && (getCellContentArray(content, separatorChar).length > 1) || (arrayPrefix != "" && keyHasPrefix(key, arrayPrefix)))
          {
            content = getCellContentArray(content, separatorChar);
            
            //Force values in the array to be strings if desired
            if(forceString)
            {
              for(var l=0; l < content.length; l++)
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
            //content = isObject(content) ? JSON.stringify(content) : content.toString();
            
            if(isObject(content))
            {
              for(field in content)
              {
                content[field] = content[field].toString();
              }
            }
            else
            {
              content = content.toString();
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
            
            //var element = useNestingArray ? sheetJsonArray : sheetJsonObject; 
            
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
            
            element[key] = content;
          }
          else
          {
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
            for(var l=0; l < content.length; l++)
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
              for(field in rowObject)
              {
                sheetJsonObject[field] = rowObject[field];
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
        objectValue[sheetName] = sheetJsonObject;
      }
      else if(singleSheet)
      {
        objectValue = sheetJsonObject;
      }
      else
      {
        objectValue[sheetName] = sheetJsonObject;
      }
    }
  }
  
  if(contentsArray)
  {
    var arrayValue = [];
    
    for(field in objectValue)
    {
      arrayValue.push(objectValue[field]);
    }
    
    rawValue = JSON.stringify(arrayValue, null, 2); //'\t'
  }
  else
  {
    rawValue = JSON.stringify(objectValue, null, 2);
  }
  
  if(nestedFormattingError)
  {
    exportMessage += nestedFormattingErrorMessage;
  }
  
  exportDocument(fileName, rawValue, ContentService.MimeType.JSON, visualize, replaceFile, exportMessage, exportMessageHeight);
}


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


function exportDocument(filename, content, type, visualize, replaceFile, exportMessage, exportMessageHeight)
{
  if(visualize == true)
  {
    var html = HtmlService.createHtmlOutput('<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><style>.display { width:555px; height:425px; }</style><textarea class="display">' + content + '</textarea><br>Note: Escaped characters may not display properly when visualized, but will be properly formatted in the exported data.<br><br>' + (exportMessage === "" ? '' : exportMessage + '<br><br>') + '<button class="action" onclick="google.script.run.reexportFile()">Export</button><button onclick="google.script.host.close()">Close</button>')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setWidth(600)
      .setHeight(525 + exportMessageHeight);
    SpreadsheetApp.getUi()
    .showModelessDialog(html, 'Visualized Data: ' + filename);
  }
  else
  {
    //Creates the document and moves it into the same folder as the original file
    //If the user does not have permission to write in the specified location, the file will be created in the base folder in "My Drive"
    var user = Session.getEffectiveUser();
    var file = DriveApp.createFile(filename, content);
    var rootFolder = DriveApp.getRootFolder();
    var currentFileId = SpreadsheetApp.getActive().getId();
    var currentFiles = DriveApp.getFilesByName(SpreadsheetApp.getActive().getName());
    var currentFile;
    
    var fileCounts = DriveApp.getFilesByName(file.getName());
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
    var parentFolder = getFileParentFolder(currentFile);
    var trueParentFolder = parentFolder; //Store the true parent folder for use in modal dialogues
    
    if(parentFolder != null) permission = parentFolder.getAccess(user);
    
    //If the parent folder for the file is null, use the root folder for Drive
    if(parentFolder == null) parentFolder = rootFolder;
    
    if(replaceFile)
    {
      if(parentFolder != rootFolder && (permission == DriveApp.Permission.OWNER || permission == DriveApp.Permission.EDIT))
      {
        rootFolder.removeFile(file); //Remove the file from the root Drive folder
        parentFolder.addFile(file); //Add the file to the target parent folder
      }
      
      currentFiles = parentFolder.getFiles();
      
      while(currentFiles.hasNext())
      {
        currentFile = currentFiles.next();
        
        if(currentFile.getName() == file.getName() && currentFile.getId() != file.getId())
        {
          currentFile.setTrashed(true); //Trash other files with the exported file's name
        }
      }
    }
    else
    {
      if(parentFolder != rootFolder && (permission == DriveApp.Permission.OWNER || permission == DriveApp.Permission.EDIT))
      {
        rootFolder.removeFile(file);
        parentFolder.addFile(file);
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
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setWidth(400)
        .setHeight(height);
    
    SpreadsheetApp.getUi().showModelessDialog(html, 'Export Complete!');
  }
}


function showCompilingMessage(message)
{
  var html = HtmlService.createHtmlOutputFromFile('Spinner')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setWidth(300)
      .setHeight(100);
  
  SpreadsheetApp.getUi()
      .showModelessDialog(html, message);
}

  
function openSidebar()
{
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Export Sheet Data')
      .setWidth(300);
  SpreadsheetApp.getUi()
      .showSidebar(html);
}


function openReleaseNotes()
{
  var html = HtmlService.createHtmlOutput('<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><div><p>Current version: v' + esdVersion + '</p><p>Release notes can be viewed on GitHub: <a href="https://github.com/Synthoid/ExportSheetData/blob/master/ReleaseNotes.pdf" target="blank">here</a></p><br><button onclick="google.script.host.close()">Close</button></div>')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setWidth(275)
      .setHeight(130);
    SpreadsheetApp.getUi()
    .showModelessDialog(html, 'ESD Release Notes');
}


function openDocumentation()
{
  var html = HtmlService.createHtmlOutput('<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><div><p>Documentation for Export Sheet Data can be viewed on GitHub: <a href="https://github.com/Synthoid/ExportSheetData/blob/master/docs/index.md" target="blank">here</a></p><br><button onclick="google.script.host.close()">Close</button></div>')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setWidth(275)
      .setHeight(130);
    SpreadsheetApp.getUi()
    .showModelessDialog(html, 'ESD Documentation');
}


function openNestedElementDocumentation()
{
  var html = HtmlService.createHtmlOutput('<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><div><p>Nested Elements documentation can be viewed on GitHub: <a href="https://github.com/Synthoid/ExportSheetData/wiki/Nested-Elements" target="blank">here</a></p><br><button onclick="google.script.host.close()">Close</button></div>')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setWidth(275)
      .setHeight(130);
    SpreadsheetApp.getUi()
    .showModelessDialog(html, 'Nested Elements');
}


function openUpdateWindow()
{
  var html = HtmlService.createHtmlOutput('<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><div><p>Export Sheet Data has been updated to v' + esdVersion + '</p><p>Release notes can be viewed on GitHub: <a href="https://github.com/Synthoid/ExportSheetData/blob/master/ReleaseNotes.pdf" target="blank">here</a></p><br><button onclick="google.script.host.close()">Close</button></div>')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setWidth(275)
      .setHeight(130);
    SpreadsheetApp.getUi()
    .showModelessDialog(html, 'ESD Update Notes');
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
  .addItem("Release Notes (v" + esdVersion + ")", "openReleaseNotes")
  .addItem("Documentation", "openDocumentation")
  .addItem("Nested Elements", "openNestedElementDocumentation")
  .addToUi();
};