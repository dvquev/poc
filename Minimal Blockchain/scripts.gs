//Scripts to hash, validate blocks and backup immutable data.
//Add validateBlock() to last modified trigger.
//Add copyInfo() to timer trigger
//To customize bear in mind fixed rows and columns.

function MD5 (input) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, input);
  var output = "";
  for (i = 0; i < digest.length; i++) {
    var h = digest[i];
    if (h < 0) { h += 256; }
    if (h.toString(16).length == 1) { output += '0';}
    output += h.toString(16);
  }
  return output;
}

function SHA256 (input) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
  var output = "";
  for (i = 0; i < digest.length; i++) {
    var h = digest[i];
    if (h < 0) { h += 256; }
    if (h.toString(16).length == 1) { output += '0';}
    output += h.toString(16);
  }
  return output;
}

//Validateblock should run every time sheet is modified
function validateBlock() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var copySheet = ss.getSheetByName("Blocks");
  var pasteSheet = ss.getSheetByName("Immutable ledger");
  var dataSheet =ss.getSheetByName("Data");

  // get source range
  var source = copySheet.getRange(copySheet.getLastRow() - 13,1,copySheet.getLastRow(),3);
  var sourceInmutable = pasteSheet.getRange(pasteSheet.getLastRow() - 13,1,copySheet.getLastRow(),3);
  var sourceData = copySheet.getRange(copySheet.getLastRow() - 10,1,1,3);

  if 
  (source.getCell(14,2).getValue().toString().slice(0,1) == '0' &&
   source.getCell(11,2).getValue() === sourceInmutable.getCell(14,2).getValue()){
    // get destination range
    var destination = pasteSheet.getRange(pasteSheet.getLastRow()+1,1);
    var destinationData = dataSheet.getRange(dataSheet.getLastRow()+1,1);
    // copy values to destination range
    source.copyTo(destination);
    sourceData.copyTo(destinationData,{contentsOnly:true});
  }
}

//Copy immutable protected ledger to blocks sheet, clean all wrong data.
function copyInfo() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var copySheet = ss.getSheetByName("Immutable ledger");
  var pasteSheet = ss.getSheetByName("Blocks");

  // get source range
  var source = copySheet.getRange(1,1,copySheet.getLastRow(),3);
  // get destination range
  var destination = pasteSheet.getRange(1,1);
  
  pasteSheet.clear();
  pasteSheet.clearConditionalFormatRules();
  // copy values to destination range
  source.copyTo(destination);
}
