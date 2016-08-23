var indentValue = "  ";
var indentAmount = 0;

function getIndent()
{
  var indent = "";
  
  for(var i=0; i < indentAmount; i++)
  {
    indent += indentValue;
  }
  
  return indent;
}


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


function getActiveSheetName()
{
  var spreadsheet = SpreadsheetApp.getActive();
  
  return spreadsheet.getActiveSheet().getName();
}


function getCellContentArray(cell)
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
    else if(content.charAt(i) == ',')
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
    
    if(content[content.length - 1] == ',') endIndex = content.length - 1;
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


function exportXml(visualize, singleSheet, childElements, replaceIllegal, rootElement, attributePrefix, childElementPrefix, replace, newline, customSheets)
{
  showCompilingMessage('Compiling XML...');
  
  exportSpreadsheetXml(visualize, singleSheet, childElements, replaceIllegal, rootElement, attributePrefix, childElementPrefix, replace, newline, customSheets);
}


function exportJson(visualize, singleSheet, unwrap, contentsArray, exportCellObjectJson, cellArray, sheetArray, forceString, replace, newline, customSheets)
{
  showCompilingMessage('Compiling JSON...');
  
  exportSpreadsheetJson(visualize, singleSheet, unwrap, contentsArray, exportCellObjectJson, cellArray, sheetArray, forceString, replace, newline, customSheets);
}


function exportSpreadsheetXml(visualize, singleSheet, useChildElements, replaceIllegal, rootElement, attributePrefix, childElementPrefix, replaceFile, newline, customSheets)
{
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  var fileName = spreadsheet.getName() + ".xml";
  
  if(customSheets != null)
  {
    var exportSheets = sheets;
    sheets = new Array();
    
    for(var i=0; i < exportSheets.length; i++)
    {
      if(customSheets[exportSheets[i].getName()] == 'true')
      {
        if(spreadsheet.getSheetByName(exportSheets[i].getName()) != null)
        {
          sheets.push(spreadsheet.getSheetByName(exportSheets[i].getName()));
        }
      }
    }
  }
  
  var sheetValues = [[]];
  var rawValue = "<" + rootElement + ">\n";
  
  indentAmount += 1;
                            
  for(var i=0; i < sheets.length; i++)
  {
    var range = sheets[i].getDataRange();
    var values = range.getValues();
    var rows = range.getNumRows();
    var columns = range.getNumColumns();
    
    var sheetData = getIndent() + "<" + formatXmlString(sheets[i].getName()) + ">\n";
    
    indentAmount += 1;
    
    for(var j=1; j < rows; j++) //j = 1 because we don't need the keys to have a row
    {
      var attributeKeys = [];
      var childElementKeys = [];
      var attributes = [];
      var childElements = [];
      
      //Separate columns into those that export as child elements or attributes
      for(var k=0; k < columns; k++)
      {
        if((useChildElements && (attributePrefix === "" || !keyHasPrefix(values[0][k], attributePrefix))) || (childElementPrefix !== "" && keyHasPrefix(values[0][k], childElementPrefix)))
        {
          childElementKeys.push(values[0][k]);
          childElements.push(values[j][k]);
        }
        else
        {
          attributeKeys.push(values[0][k]);
          attributes.push(values[j][k]);
        }
      }
      
      //Build the actual row string
      var row = getIndent() + "<" + formatXmlString(values[j][0]) + " ";
      
      for(var k=0; k < attributes.length; k++)
      {
        if(replaceIllegal) row += formatXmlString(attributeKeys[k]) + "=" + '"' + formatXmlString(attributes[k]) + '"' + " ";
        else row += attributeKeys[k] + "=" + '"' + attributes[k] + '"' + " ";
      }
      
      if(childElements.length === 0) row += "/>";
      else row += ">\n";
      
      for(var k=0; k < childElements.length; k++)
      {
        indentAmount += 1;
        
        row += getIndent() + "<" + formatXmlString(childElementKeys[k]) + ">";
          
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
          
        row += "</" + formatXmlString(childElementKeys[k]) + ">\n";
        
        indentAmount -= 1;
      }
      
      if(childElements.length > 0) row += getIndent() + "</" + formatXmlString(values[j][0]) + ">\n";
      
      sheetValues[i[j-1]] = row;
      sheetData += row;
    }
    
    indentAmount -= 1;
    
    sheetData += getIndent() + "</" + sheets[i].getName() + ">\n";
    rawValue += sheetData;
  }
  
  indentAmount -= 1;
  
  rawValue += "</" + rootElement + ">";
  
  exportDocument(fileName, rawValue, ContentService.MimeType.XML, visualize, replaceFile);
}


function exportSpreadsheetJson(visualize, singleSheet, unwrapSingleRow, contentsArray, exportCellObjectJson, exportArray, sheetArray, forceString, replaceFile, newline, customSheets)
{
  var spreadsheet = SpreadsheetApp.getActive();
  var sheets = spreadsheet.getSheets();
  var fileName = spreadsheet.getName() + ".json";
  
  if(customSheets != null)
  {
    var exportSheets = sheets;
    sheets = new Array();
    
    for(var i=0; i < exportSheets.length; i++)
    {
      if(customSheets[exportSheets[i].getName()] == 'true')
      {
        if(spreadsheet.getSheetByName(exportSheets[i].getName()) != null)
        {
          sheets.push(spreadsheet.getSheetByName(exportSheets[i].getName()));
        }
      }
    }
  }
  
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
      
      if(sheetArray && (!(rows <= 2 && unwrapSingleRow == true) || rows > 2 || unwrapSingleRow == false))
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
      if(rows > 2 || unwrapSingleRow == false) //Only wrap the json for this row if there is more than one row (not counting the keys row)
      {
        //TODO: Need to have spacing formatting when single sheet and content
        if(!sheetArray && !(singleSheet && contentsArray))
        {
          row += getIndent() + '"' + values[j][0] + '"' + " : "; //This uses the first, non-key row, column so the contained objects are less likely to share a key value.
          
          if(newline) row += "\n";
        }
        
        if(newline || (singleSheet && contentsArray)) row += getIndent() + "{\n";
        else row += "{\n";
        
        indentAmount += 1;
      }
      
      for(var k=0; k < columns; k++)
      {
        if(exportArray && getCellContentArray(values[j][k]).length > 1)
        {
          var content = values[j][k];
          var cellArray = getCellContentArray(content);
          
          if(!(singleSheet && contentsArray))
          {
            row += getIndent() + formatJsonString(values[0][k], false) + " : ";
          
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
              row += formatJsonString(values[0][k], false) + " : ";
            }
            
            row += formatJsonString(values[j][k].toString(), exportCellObjectJson);
          }
          else
          {
            row += getIndent();
            
            if(!(singleSheet && contentsArray))
            {
              row += formatJsonString(values[0][k], false) + " : ";
            }
            
            row += formatJsonString(values[j][k], exportCellObjectJson);
          }
        }
        
        if(k < columns - 1)
        {
          row += ",";
        }
        
        row += "\n";
      }
      
      if(rows > 2 || unwrapSingleRow == false)
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
      
      if(sheetArray && (!(rows <= 2 && unwrapSingleRow == true) || rows > 2 || unwrapSingleRow == false))
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
  
  exportDocument(fileName, rawValue, ContentService.MimeType.JSON, visualize, replaceFile);
}


function exportDocument(filename, content, type, visualize, replaceFile)
{
  if(visualize == true)
  {
    var html = HtmlService.createHtmlOutput('<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><style>.display { width:555px; height:425px; }</style><textarea class="display">' + content + '</textarea><br>Note: Escaped characters may not display properly when visualized, but will be properly formatted in the exported data.<br><br><button onclick="google.script.host.close()">Close</button>')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setWidth(600)
      .setHeight(525);
    SpreadsheetApp.getUi()
      .showModelessDialog(html, 'Visualized Data - ' + filename);
  }
  else
  {
    //Creates the document and moves it into the same folder as the original file
    var file = DriveApp.createFile(filename, content);
    var currentFileId = SpreadsheetApp.getActive().getId();
    var currentFiles = DriveApp.getFilesByName(SpreadsheetApp.getActive().getName());
    var currentFile;
    
    while(currentFiles.hasNext())
    {
      currentFile = currentFiles.next();
      
      if(currentFile.getId() == currentFileId) break;
    }
    
    var folders = currentFile.getParents();
    var parentFolder;
    while(folders.hasNext())
    {
      parentFolder = folders.next();
    }
    
    if(parentFolder != null)
    {
      var newFile;
      
      if(replaceFile)
      {
        newFile = file.makeCopy(file.getName(), parentFolder);
        file.setTrashed(true);
        
        currentFiles = parentFolder.getFiles();
        
        while(currentFiles.hasNext())
        {
          currentFile = currentFiles.next();
          
          if(currentFile.getName() == newFile.getName() && currentFile.getId() != newFile.getId())
          {
            currentFile.setTrashed(true);
          }
        }
      }
      else
      {
        newFile = file.makeCopy(file.getName(), parentFolder);
        file.setTrashed(true);
      }
      
      var html = HtmlService.createHtmlOutput('<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><style>.display { width:355px; height:85px; text-align: center; overflow: auto; } </style>File exported successfully. You can view the file here:<div class="display"><br><br><a href="' + newFile.getUrl() + '" target="_blank">' + newFile.getName() + '</a></div><button onclick="google.script.host.close()">Close</button>')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setWidth(400)
        .setHeight(150);
      SpreadsheetApp.getUi()
        .showModelessDialog(html, 'Export Complete!');
    }
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