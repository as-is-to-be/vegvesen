import { FileWriter , FileExists} from "./fileWriter.js";

/** Parses data object from 'trafficData' query and converts and write to csv file */
const TrafficDataCsv = (data) => {
    // console.log(JSON.stringify(data, null, 4));

    let headers = [];

    /** takes an object input and iterates thru it to get all the values */
    const getValues = (data) => {
        if(typeof data !== 'object'){
            return [data]
        }

        if (data === null){return ''}
        headers.push(Object.keys(data));
        return Object.values(data).flatMap(v => getValues(v))
      }
      
      const rowItems = getValues(data)
  
      // this will split the array of values into their respective arrays
      let numRows = 41; //define number of rows.
      let rows = [];
      for (let i = 0; i < rowItems.length; i += numRows) {
          rows.push(rowItems.slice(i, i + numRows));
      }

      // if file exists, replace header object with empty array for new rows
      const path = "trafficdata.csv"
      if (FileExists(path)){
        const csv = [[], ...rows].join('\r\n');
        FileWriter(path, csv,'ID ' +rowItems[0] + ' - Write row without header');
      }
      else {
        // Headers must be defined manually
        let manualHeaders = ['id','name','county','municipality', 'lat','lon','from', 'to', 'total', 'total-volume','Total-coverage', 'lengthRange-lowerBound', 'lengthRange-upperBound', '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22']
        // join header and body, and break into separate rows
        const csv = [manualHeaders, ...rows].join('\r\n');
        FileWriter(path, csv, 'ID ' +rowItems[0] + ' - write row with header');
      }
}

export {TrafficDataCsv}