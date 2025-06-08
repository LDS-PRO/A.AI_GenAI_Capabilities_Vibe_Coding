const { GoogleSpreadsheet } = require("google-spreadsheet");
//const {JSON} = require('json');
//const { promisify } = require("util");

const creds = require("./client_secret.json");
const doc = new GoogleSpreadsheet(
  "1oYKPt12EBl12qYhkPwI2Idn-HGrlXrpQ8B0NlBwOOdE"
);

function printPostecodeValues(Data) {
  console.log(`Name: ${Data.adjcluster}`);
  console.log("---------------");
}





////////////////////////////////////////////////////////////////////////////////////////////////////////////


var posteCode = [];

module.exports.accessSpreadsheet2 = async (cluster,PC) => {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo();
  //console.log(doc.title);

  const sheet = doc.sheetsByIndex[0];
  //console.log(sheet.title);
  //console.log(sheet.rowCount);

  const rows = await sheet.getRows({
    //limit: 2
    //orderby: `A`
  });

  //const filteredRows = rows.filter(function(row){
  // return row.A.includes(['5','4']) //'5'

  //if (row.A == ['5','4']) {
  //return row;
  //}
  //});
  //function ifNone(i,ii) {if (typeof i ==='undefined') {return ii} else {return i}}
  
  var postCodePlaceholder = 'SP1,SP2' 
  var tableauPostcode = PC||postCodePlaceholder
  
  //console.log(tableauPostcode)
  
  var tableauPostodefinal = tableauPostcode.split(',')
  


  //console.log(tableauPostcode[0])
  
  

  for (var elements of tableauPostodefinal) {
    //posteCode +=elements;      
    if (elements == tableauPostodefinal[0]) {  posteCode+=elements;  } else {posteCode+=','+elements}     
    ;}
  
  posteCode = posteCode.replace('SP1,SP2','')
  
  posteCode = posteCode.split(',')

  
  //console.log(PC);
  
  //console.log(posteCode);
  
  var finalCluster = cluster.cluster;
  
  
  
    //console.log(tableauPostodefinal)

  var filteredRows = rows.filter((item) => posteCode.includes(item.postcode));

  //const cells = await sheet.loadCells('A4:B6');

  //console.log(filteredRows);

  filteredRows.forEach((row) => {
    printPostecodeValues(row);
    row.adjcluster = finalCluster;
    row.save();
    printPostecodeValues(row);
    //printPostecodeValues(row);
    //printPostecodeValues(row);
  //if (typeof finalCluster == 'undefined') {
  //console.log(finalCluster) ;
  //} else {row.save();};
    
    //
  });
  
  //return rows
  
  
  
  
  
  
  
  if (typeof finalCluster !='undefined') { posteCode=[]} ;
  
  //console.log(posteCode);
  

  
  
  //console.log(finalCluster);
  
  //console.log(posteCode);


};

module.exports.accessSpreadsheet2();

