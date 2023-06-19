import 'dotenv/config'
import { getCsvFiles, getCsvFile, deleteFile } from './wispy_client.js';
import { wiggleUploadFile } from './wiggle_client.js';
import { sleep } from './utils.js';
import fs from 'fs';

const WISPY_ENDPOINT = process.env.WISPY_ENDPOINT;
const ARCHIVE_LOCATION = process.env.ARCHIVE_LOCATION;
const WIGGLE_API_KEY = process.env.WIGGLE_API_KEY;

if(!WISPY_ENDPOINT) {
  console.error('!! Please specify the WISPY_ENDPOINT environment variable !!')
  process.exit(1)
}

if(!ARCHIVE_LOCATION && !WIGGLE_API_KEY) {
  console.error('!! Please specify the WISPY_ENDPOINT and/or the WIGGLE_API_KEY environment variables !!')
  process.exit(1)
}

(async function() {
  console.log(`Scanning for WiSpy device every 30s at ${WISPY_ENDPOINT}`)

  for(;;) {
    console.log()

    try {
      let files;

      try {
        files = await getCsvFiles(WISPY_ENDPOINT);
      } catch (e) {
        console.log('No WiSpy detected waiting 30s...');
        await sleep(30000);
        continue;
      }

      console.log(`WiSpy found with ${files.length} scan files to process`)
      for(const file of files) {
        console.log('Processing file', file)

        const scanData = await getCsvFile(WISPY_ENDPOINT, file);
        console.log(' > Downloaded file successfully. File Size: ', scanData.length);

        if(WIGGLE_API_KEY) {
          console.log(' > Uploading file to wiggle');
          await wiggleUploadFile(WIGGLE_API_KEY, scanData, file)
        }

        if(ARCHIVE_LOCATION) {
          // Copy to archive location
          console.log(' > Saving file to archive location');
          fs.writeFileSync(`${ARCHIVE_LOCATION}/${file}`, scanData);
        }

        // Delete file
        console.log(' > Deleting file off WiSpy');
        await deleteFile(WISPY_ENDPOINT, file)
      }

      // Wait long enough for the WiSpy to boot up normally...
      console.log('Finished processing scans data. Going to wait long enough for the WiSpy to boot normally.')
      await sleep(70000);
    } catch(e) {
      console.error('Something went wrong trying to pull the scan data...', e);

      // Wait long enough for the WiSpy to boot up normally...
      await sleep(70000);
    }
  }
})()
