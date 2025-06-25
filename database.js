const { GoogleSpreadsheet } = require("google-spreadsheet");

const creds = require("./client_secret.json");
const doc = new GoogleSpreadsheet(
  "1oYKPt12EBl12qYhkPwI2Idn-HGrlXrpQ8B0NlBwOOdE"
);

/**
 * Updates cluster values for specified postcodes in Google Sheets
 * @param {Object} clusterData - Object containing cluster value { cluster: "value" }
 * @param {string} postcodes - Comma-separated string of postcodes (e.g., "SP1,SP2,SP3")
 * @returns {Promise<Object>} Result object with success status and updated count
 */
module.exports.accessSpreadsheet2 = async (clusterData, postcodes) => {
  try {
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });

    await doc.loadInfo();
    console.log(`Connected to spreadsheet: ${doc.title}`);

    const sheet = doc.sheetsByIndex[0];
    console.log(`Working with sheet: ${sheet.title}`);

    const rows = await sheet.getRows();
    console.log(`Total rows in sheet: ${rows.length}`);

    if (!postcodes || postcodes.trim() === '') {
      console.warn('No postcodes provided for update');
      return { 
        success: false, 
        message: 'No postcodes provided',
        updatedCount: 0 
      };
    }

    const postcodeArray = postcodes
      .split(',')
      .map(pc => pc.trim())
      .filter(pc => pc !== '');

    console.log(`Postcodes to update: ${postcodeArray.join(', ')}`);

    const newClusterValue = clusterData.cluster;
    
    if (!newClusterValue || newClusterValue.toString().trim() === '') {
      console.error('Invalid cluster value provided');
      return { 
        success: false, 
        message: 'Invalid cluster value',
        updatedCount: 0 
      };
    }

    const rowsToUpdate = rows.filter(row => 
      postcodeArray.includes(row.postcode)
    );

    console.log(`Found ${rowsToUpdate.length} rows to update`);

    let updatedCount = 0;
    for (const row of rowsToUpdate) {
      try {
        console.log(`Updating postcode ${row.postcode}: ${row.adjcluster} → ${newClusterValue}`);
        
        row.adjcluster = newClusterValue;
        
        await row.save();
        
        updatedCount++;
      } catch (rowError) {
        console.error(`Failed to update row for postcode ${row.postcode}:`, rowError);
      }
    }

    console.log(`Successfully updated ${updatedCount} out of ${rowsToUpdate.length} rows`);

    return {
      success: true,
      message: `Updated ${updatedCount} postcodes`,
      updatedCount: updatedCount,
      totalMatched: rowsToUpdate.length
    };

  } catch (error) {
    console.error('Error in accessSpreadsheet2:', error);
    return {
      success: false,
      message: error.message || 'Unknown error occurred',
      updatedCount: 0
    };
  }
};

