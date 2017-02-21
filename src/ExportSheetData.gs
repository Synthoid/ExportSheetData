var indentValue = "  ";
var indentAmount = 0;

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

//Check if a column has columns with keys following it when exporting values for a JSON blob
function columnIsLast(values, index)
{
  index++;
  while(index < values.length)
  {
    if(values[index] != null && values[index] !== "") return false;
    index++;
  }
  
  return true;
}


function exportXml(visualize, singleSheet, childElements, replaceIllegal, includeFirstColumnXml, rootElement, nameReplacementChar, attributePrefix, childElementPrefix, innerTextPrefix, replace, newline, unwrap, ignoreEmpty, ignorePrefix, customSheets)
{
  showCompilingMessage('Compiling XML...');
  
  exportSpreadsheetXml(visualize, singleSheet, childElements, replaceIllegal, includeFirstColumnXml, rootElement, nameReplacementChar, attributePrefix, childElementPrefix, innerTextPrefix, replace, newline, unwrap, ignoreEmpty, ignorePrefix, customSheets);
}


function exportJson(visualize, singleSheet, contentsArray, exportCellObjectJson, cellArray, sheetArray, forceString, separatorChar, arrayPrefix, replace, newline, unwrap, ignoreEmpty, ignorePrefix, customSheets)
{
  showCompilingMessage('Compiling JSON...');
  
  exportSpreadsheetJson(visualize, singleSheet, contentsArray, exportCellObjectJson, cellArray, sheetArray, forceString, separatorChar, arrayPrefix, replace, newline, unwrap, ignoreEmpty, ignorePrefix, customSheets);
}


function exportSpreadsheetXml(visualize, singleSheet, useChildElements, replaceIllegal, includeFirstColumnXml, rootElement, nameReplacementChar, attributePrefix, childElementPrefix, innerTextPrefix, replaceFile, newline, unwrap, ignoreEmpty, ignorePrefix, customSheets)
{
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
  var rawValue = "<" + formatXmlName(rootElement, nameReplacementChar) + ">\n";
  
  indentAmount += 1;
                            
  for(var i=0; i < sheets.length; i++)
  {
    var range = sheets[i].getDataRange();
    var values = range.getValues();
    var rows = range.getNumRows();
    var columns = range.getNumColumns();
    
    var sheetData = "";
    
    if(!singleSheet)
    {
      if(rows > 2 || unwrap === false)
      {
        sheetData += getIndent() + "<" + formatXmlName(sheets[i].getName(), nameReplacementChar) + ">\n";
        indentAmount += 1;
      }
    }
    
    for(var j=1; j < rows; j++) //j = 1 because we don't need the keys to have a row
    {
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
      if(rows > 2 || unwrap === false)
      {
        indentAmount -= 1;
        sheetData += getIndent() + "</" + formatXmlName(sheets[i].getName(), nameReplacementChar) + ">\n";
      }
    }
    
    rawValue += sheetData;
  }
  
  indentAmount -= 1;
  
  rawValue += "</" + formatXmlName(rootElement, nameReplacementChar) + ">";
  
  exportDocument(fileName, rawValue, ContentService.MimeType.XML, visualize, replaceFile, exportMessage, exportMessageHeight);
}


function exportSpreadsheetJson(visualize, singleSheet, contentsArray, exportCellObjectJson, exportArray, sheetArray, forceString, separatorChar, arrayPrefix, replaceFile, newline, unwrap, ignoreEmpty, ignorePrefix, customSheets)
{
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  
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
  
  var fileName = spreadsheet.getName() + (singleSheet ? (" - " + sheets[0].getName()) : "") + ".json";
  var sheetValues = [[]];
  var rawValue = "";
  
  if(contentsArray) rawValue = "[\n";
  else rawValue = "{\n";
  
  indentAmount += 1;
  
  for(var i=0; i < sheets.length; i++)
  {
    var range = sheets[i].getDataRange();
    var values = range.getValues();
    var rows = range.getNumRows();
    var columns = range.getNumColumns();
    
    var row = "";
    
    if(!singleSheet || sheetArray)
    {
      row = getIndent();
      
      if(!contentsArray) row += '"' + sheets[i].getName() + '"' + " : ";
      
      if(!contentsArray && newline) row += "\n" + getIndent();
      
      if(sheetArray && (!(rows <= 2 && unwrap == true) || rows > 2 || unwrap == false))
      {
        row += "[\n";
      }
      else
      {
        row += "{\n";
      }
      
      indentAmount += 1;
    }
    
    for(var j=1; j < rows; j++) //j = 1 because we don't need the keys to have a row
    {
      if(rows > 2 || unwrap === false) //Only wrap the json for this row if there is more than one row (not counting the keys row)
      {
        //TODO: Need to have spacing formatting when single sheet and content
        if(!sheetArray && !(singleSheet && contentsArray))
        {
          row += getIndent() + '"' + values[j][0] + '"' + " : "; //This uses the first, non-key row, column so the contained objects are less likely to share a key value.
          
          if(newline) row += "\n";
        }
        
        if(newline || (singleSheet && contentsArray) || sheetArray) row += getIndent() + "{\n";
        else row += "{\n";
        
        indentAmount += 1;
      }
      
      for(var k=0; k < columns; k++)
      {
        if(values[0][k] === "" || values[0][k] == null) continue; //Skip columns with empty keys
        if(ignoreEmpty && values[j][k] === "") continue; //Skip empty cells if desired
        if(keyHasPrefix(values[0][k], ignorePrefix)) continue; //Skip columns with the ignore prefix
        
        if(exportArray && (getCellContentArray(values[j][k], separatorChar).length > 1) || (arrayPrefix != "" && keyHasPrefix(values[0][k], arrayPrefix)))
        {
          var content = values[j][k];
          var cellArray = getCellContentArray(content, separatorChar);
          
          if(!(singleSheet && contentsArray))
          {
            row += getIndent();
            
            if(arrayPrefix != "") row += formatJsonString(stripPrefix(values[0][k].toString(), arrayPrefix), false);
            else row += formatJsonString(values[0][k].toString(), false);
            
            row += " : ";
          
            if(newline) row += "\n" + getIndent();
          }
          
          row += "[\n";
          
          indentAmount += 1;
          
          for(var l=0; l < cellArray.length; l++)
          {
            if(cellArray[l] != "")
            {
              if(forceString)
              {
                row += getIndent() + formatJsonString(cellArray[l].toString(), exportCellObjectJson);
              }
              else
              {
                //Check if string is a float, int, NaN, bool, 
                var cellValue = cellArray[l];
                var formattedValue = "";
                
                if(cellValue.toLowerCase() == 'true' || cellValue.toLowerCase() == 'false') //Bools
                {
                  formattedValue = formatJsonString(cellValue, exportCellObjectJson);
                }
                else if(!isNaN(Number(cellValue)) || cellValue == 'NaN') //Numbers
                {
                  formattedValue = formatJsonString(Number(cellValue), exportCellObjectJson);
                }
                else //If nothing else, Strings
                {
                  formattedValue = formatJsonString(cellValue, exportCellObjectJson);
                }
                
                row += getIndent() + formattedValue;
              }
              
              if(l == cellArray.length - 1 || (l == cellArray.length - 2 && cellArray[cellArray.length-1] == ""))
              {
                row += '\n';
              }
              else row += ',\n';
            }
          }
          
          indentAmount -= 1;
          
          row += getIndent() + ']';
        }
        else
        {
          if(forceString)
          {
            row += getIndent();
            
            if(!(singleSheet && contentsArray))
            {
              row += formatJsonString(values[0][k].toString(), false) + " : ";
            }
            
            row += formatJsonString(values[j][k].toString(), exportCellObjectJson);
          }
          else
          {
            row += getIndent();
            
            if(!(singleSheet && contentsArray))
            {
              row += formatJsonString(values[0][k].toString(), false) + " : ";
            }
            
            row += formatJsonString(values[j][k], exportCellObjectJson);
          }
        }
        
        if(k < columns - 1)
        {
          if(k + 1 < columns && !columnIsLast(values[0], k))
          {
            row += ",";
          }
        }
        
        row += "\n";
      }
      
      if(rows > 2 || unwrap == false)
      {
        indentAmount -= 1;
        
        if(j < rows - 1)
        {
          row += getIndent() + "},\n";
        }
        else 
        {
          row += getIndent() + "}\n";
        }
      }
      
      sheetValues[i[j-1]] = row;
    }
    
    if(!singleSheet || sheetArray)
    {
      indentAmount -= 1;
      row += getIndent();
      
      if(sheetArray && (!(rows <= 2 && unwrap == true) || rows > 2 || unwrap == false))
      {
        row += "]";
      }
      else
      {
        row += "}";
      }
    }
    
    if(i < sheets.length - 1)
    {
      row += ",";
    }
    
    if(!singleSheet) row += "\n";
    rawValue += row;
  }
  
  indentAmount -= 1;
  
  if(contentsArray) rawValue += "]";
  else rawValue += "}";
  
  exportDocument(fileName, rawValue, ContentService.MimeType.JSON, visualize, replaceFile, "", 0);
}


function exportDocument(filename, content, type, visualize, replaceFile, exportMessage, exportMessageHeight)
{
  if(visualize == true)
  {
    var html = HtmlService.createHtmlOutput('<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><style>.display { width:555px; height:425px; }</style><textarea class="display">' + content + '</textarea><br>Note: Escaped characters may not display properly when visualized, but will be properly formatted in the exported data.<br><br>' + (exportMessage === "" ? '' : exportMessage + '<br><br>') + '<button onclick="google.script.host.close()">Close</button>')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setWidth(600)
      .setHeight(525 + exportMessageHeight);
    SpreadsheetApp.getUi()
      .showModelessDialog(html, 'Visualized Data - ' + filename);
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


function onInstall(e)
{
  onOpen(e);
}


function onOpen(e)
{
  var ui = SpreadsheetApp.getUi();
  ui.createAddonMenu()
  .addItem("Open Sidebar", "openSidebar")
  .addToUi();
};