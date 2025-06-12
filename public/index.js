/* global tableau, jQuery */

// Global variables
let selectedPostcodes = "";
let isUpdating = false; // Prevent double-clicks
let heatmapWorksheet = null; // Cache worksheet reference

// Initialize Tableau Extension when the page loads
window.tableau.extensions.initializeAsync().then(() => {
  // Get all worksheets from the current dashboard
  const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
  
  // Find and cache the Heatmap worksheet
  heatmapWorksheet = worksheets.find(ws => ws.name === "Heatmap");
  
  // Register event listener for when user selects marks on the worksheet
  if (heatmapWorksheet) {
    heatmapWorksheet.addEventListener(
      tableau.TableauEventType.MarkSelectionChanged,
      handleMarkSelection
    );
  } else {
    console.error("Heatmap worksheet not found!");
  }
});

// Handle mark selection changes on the Heatmap worksheet
const handleMarkSelection = async (event) => {
  try {
    // Retrieve the selected marks data asynchronously from Tableau
    const marksData = await event.getMarksAsync();
    
    // Ensure we have valid data
    if (!marksData || !marksData.data || !marksData.data[1]) {
      console.warn("No valid marks data received");
      selectedPostcodes = ""; // Clear selection
      return;
    }
    
    // Extract the actual data table (second element contains the data)
    const dataTable = marksData.data[1];
    
    // Find the column index for the "Postcode" field
    const postcodeColumn = dataTable.columns.find(col => col.fieldName === "Postcode");
    if (!postcodeColumn) {
      console.warn("Postcode column not found");
      return;
    }
    
    // Get all rows of selected data
    const selectedRows = dataTable.data;
    
    // Build array of unique postcodes then join with comma
    const postcodes = [...new Set(selectedRows.map(row => row[postcodeColumn.index].value))];
    
    // Store in global variable for later use
    selectedPostcodes = postcodes.join(',');
    
    // Update UI to show selection status (optional)
    console.log(`Selected ${postcodes.length} unique postcodes: ${selectedPostcodes}`);
    
  } catch (error) {
    console.error("Error handling mark selection:", error);
    selectedPostcodes = ""; // Clear on error
  }
};

// Update cluster value for selected postcodes (called by button click)
const updateRequest = async (cluster, PC) => {
  // Prevent double-clicks
  if (isUpdating) {
    console.log("Update already in progress...");
    return;
  }
  
  // Get the cluster value from the input field
  const clusterValue = jQuery("#clustervalueid").val().trim();
  
  // Validate cluster input
  if (!clusterValue) {
    alert("Please enter a cluster value");
    return;
  }
  
  // Use globally stored postcodes if available, otherwise use passed PC
  const postcodesToUpdate = selectedPostcodes || PC;
  
  // Check if we have postcodes to update
  if (!postcodesToUpdate || postcodesToUpdate.length === 0) {
    alert("Please select postcodes on the map first");
    return;
  }
  
  // Set updating flag and disable button
  isUpdating = true;
  const updateButton = jQuery('button[onclick*="updateRequest"]');
  updateButton.prop('disabled', true).text('Updating...');
  
  try {
    // Send POST request to update both cluster and postcodes
    await jQuery.post("/update/", { 
      cluster: clusterValue, 
      PC: postcodesToUpdate 
    });
    
    // Clear the input field
    jQuery("#clustervalueid").val("");
    
    // Clear selected postcodes
    selectedPostcodes = "";
    
    // Refresh the Tableau data source at index 1
    if (heatmapWorksheet) {
      const dataSources = await heatmapWorksheet.getDataSourcesAsync();
      
      if (dataSources && dataSources.length > 1) {
        await dataSources[1].refreshAsync();
        console.log("Data source refreshed successfully");
      }
    }
    
    // Show success message
    alert(`Successfully updated ${postcodesToUpdate.split(',').length} postcodes to cluster ${clusterValue}`);
    
  } catch (error) {
    console.error("Update failed:", error);
    alert("Update failed. Please check your connection and try again.");
  } finally {
    // Reset updating flag and button
    isUpdating = false;
    updateButton.prop('disabled', false).text('Update');
  }
};

// Make updateRequest available globally for the onclick handler
window.updateRequest = updateRequest;
