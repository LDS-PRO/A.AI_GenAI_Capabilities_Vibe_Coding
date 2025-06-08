/* global tableau */

window.tableau.extensions.initializeAsync().then(() => {
  let worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  let worksheet = worksheets.find(ws => ws.name === "Heatmap");
  let unregisterHandler = worksheet.addEventListener(
    tableau.TableauEventType.MarkSelectionChanged,
    edit
  ); 

});



const edit = async (event, PC, Cluster) => {
  let data = await event.getMarksAsync();  
  data = data.data[1];

  const index = data.columns.find(col => col.fieldName === "Postcode").index;
  var subdata = data.data;  
 
  PC=[];

   subdata.forEach((row) => {
  if (row == subdata[0]) {
  PC+=row[index].value;
  } else {PC+=','+row[index].value}
     ;
    //printPostecodeValues(row);
    //row.A = 999;
    //printPostecodeValues(row);
    //row.save();
  });
  
  await updatePC(PC);
  
 
  

  
};

const updateRequest = async ( cluster, PC) => {
  cluster = jQuery("#clustervalueid").val();
  //const status = $("#status").val();
  //const comments = $("#comments").val();
  jQuery.post("/update/", { cluster, PC }, updated => {
    //tableau.extensions.ui.closeDialog(updated);
    alert("Congrats :)")
  }); 
  
  //let dataSources = await event.worksheet.getDataSourcesAsync();
  //console.log(dataSources[1]);
  //dataSources[1].refreshAsync();
  
  window.tableau.extensions.initializeAsync().then( async() => {
  let worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  let worksheet = worksheets.find(ws => ws.name === "Heatmap");
  let refreshDataSources = await worksheet.getDataSourcesAsync();
  refreshDataSources[1].refreshAsync();

});
  
};

const updatePC= (PC) => {
 
  jQuery.post("/update/", { PC }, updated => {
    //tableau.extensions.ui.closeDialog(updated);
    alert("Congrats :)")
  }); 
};
