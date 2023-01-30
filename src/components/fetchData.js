import { trafficRegPoints, trafficRegPointsQuery, queryCounty, queryMunicipality, trafficVolumeByLength } from "./queries.js";
// because early node version in Docker dev environment, i must install node-fetch and import fetch. Just uncomment to use with later node version.
import fetch from "node-fetch";
import { SearchResultCsv } from "./searchResultCsv.js";
import filterTrafficPoints from "./filterTrafficPoints.js";
import {fromDateDefault, toDateDefault} from "./getDefaultDates.js"
import { TrafficVolumeByLengthCsv } from "./trafficVolumeByLengthCsv.js";


const fromDate = process.argv[4] || fromDateDefault;
const toDate = process.argv[5] || toDateDefault;

const FetchData = (cmdInput) => {
  let querySwitch = null;

  // selects graphQL options based on cmd input
  switch (cmdInput[2]) {
    // list county reg.points
    case '-c':
      // querySwitch = queryCounty;
      querySwitch = trafficRegPoints;
      break;

      case '-clist':
      querySwitch = queryCounty;
      break;

    // list municipality reg.points
    case '-m':
      querySwitch = trafficRegPoints;
      break;

    case '-mlist':
      querySwitch = queryMunicipality;
      break;
      
    // search reg.points by name or number
    case '-s':
      querySwitch = `{trafficRegistrationPoints(searchQuery: {query: "${cmdInput[3]}"})` + trafficRegPointsQuery;
      break;

    // select specific reg.point
    case '-id':
      querySwitch = trafficVolumeByLength(cmdInput[3], fromDate, toDate);
      break;

    // list all reg.points
    case '-all':
      querySwitch = trafficRegPoints;
      break;

    // stops further execution of program
    default: 
      console.log("Check your input. You typed:", cmdInput[2], cmdInput[3]);
      return;
  }


  const httpOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "cors",
    body: JSON.stringify({
      query: querySwitch,
    }),
  };

  
  const fetchApi = async () => {
    try {
      const res= await fetch("https://www.vegvesen.no/trafikkdata/api/", httpOptions)
      let data = await res.json()
      

      // Send fetch return to the various parsers
      switch (cmdInput[2]){
        case '-s':
          SearchResultCsv(data);
          break;
          
        case '-clist':
          // console.log(JSON.stringify(data, null, 4))
          console.log(data.data.areas.counties.map(county => county));
          break;

        case '-mlist':
          console.log(data.data.areas.municipalities.map(municipality => municipality));
          break;

        case '-id':
          TrafficVolumeByLengthCsv(data);
          break;

        default:
          filterTrafficPoints(cmdInput[2], cmdInput[3], data);
          break; 
      }

    }
    catch  (err){console.log(err);}

  };

  fetchApi();
  
};

export {FetchData, fromDate, toDate}