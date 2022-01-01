const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const package = require('./package.json');

//Port and listening
const port = process.env.PORT || process.env.port || 3000;

const app = express();
const apiRoot = '/api'
//const router = express.router();

//Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: /http:\/\/localhost/ }));
app.options('*', cors());



//Routes
const router = express.Router();

//register routes
app.use(apiRoot, router);

router.get('/', (req, res) => {
    res.send(`${package.description} - v${package.version} test`);
});
router.get('/clinics', (req, res) => {
    //Take given parameter
            const clinicname = req.query.clinicname;
            const statename = req.query.statename;
            const open = req.query.open;
            const close = req.query.close;
            const times = {
                "from": open,
                "to": close};

    // Build DB not needed const location = test_db[given];

    const locationsClinicName = db["vet"].filter(x => x.clinicName === clinicname)

    const locationsName = db["dentist"].filter(x => x.name === clinicname)

    if (statename !== null && statename !== ''){
        //Converting statename if it is more than two letters
        if (statename.length === 2){
        var locationsStateCode = db ["vet"].filter(x => x.stateCode === statename);
    }
        else if (statename){
        var locationsStateCode = db ["vet"].filter(x => x.stateCode === changeState(statename, "abr"));
    }

    //converting statename is greater than 2 letters
        if (statename.length > 2){
        var locationsStateName = db ["dentist"].filter(x => x.stateName === statename);
    }
        else {
        var locationsStateName = db ["dentist"].filter(x => x.stateName === changeState(statename, "fname"));
    }
};

    const locationAvailabilty = db ["dentist"].filter(x => x.availability === times);

    const locationOpening = db["vet"].filter(x =>x.opening === times);

    //change state per db requirments



    /* trying to make sure there is a set time for both closing and opening respond if missing one.
    if ((!opening.length && closing.length > 0) || (opening.length > 0 && !closing.length)){
        return res
        .status(404)
        .json({error: 'Missing opening or closing time. Both must be provided'})
    }
    */
    //Combine states into one array
    const clinicStateFinal = locationsStateName.concat(locationsStateCode);

    //combine clinic titles/names into one array
    const clinicNameFinal = locationsName.concat(locationsClinicName);

    //combine times into one array
    const clinictimesfinal = locationAvailabilty.concat(locationOpening);

    //combine all individual results into one array
    const finalresult = clinicNameFinal.concat(clinicStateFinal, clinictimesfinal);

    //Filter out repeats
    const final = finalresult.filter((item,pos) => finalresult.indexOf(item) === pos);
    
    //Check data 
    if (!final || !final.length) {
        return res
            .status(404)
            .json({error: 'No valid location available. Please provide clinicname, statename, or avail parameters as opnen and close' })
    };

    return res.json(final);

});

//Response to make sure server is running. Helps with nodemon
app.listen(port, () => {
    console.log('server up!!!');
});

/*Test internal DB not in use at this time
const test_db = {
    "states": [
        { 
        "state" : "state",
        "test": "works"
},
{ 
        "state" : "state",
        "test": "works"
},
{
    "state": "not cali",
    "test" : "does not work"
}]};
*/

//Given DB or Prod
const db = {

    'vet': [
        {
            "clinicName": "Good Health Home",
            "stateCode": "FL",
            "opening": {
                "from": "15:00",
                "to": "20:00"
            }
        },
        {
            "clinicName": "National Veterinary Clinic",
            "stateCode": "CA",
            "opening": {
                "from": "15:00",
                "to": "22:30"
            }
        },
        {
            "clinicName": "German Pets Clinics",
            "stateCode": "KS",
            "opening": {
                "from": "08:00",
                "to": "20:00"
            }
        },
        {
            "clinicName": "City Vet Clinic",
            "stateCode": "NV",
            "opening": {
                "from": "10:00",
                "to": "22:00"
            }
        },
        {
            "clinicName": "Scratchpay Test Pet Medical Center",
            "stateCode": "CA",
            "opening": {
                "from": "00:00",
                "to": "24:00"
            }
        }
    ],

    'dentist': [
        {
            "name": "Good Health Home",
            "stateName": "Alaska",
            "availability": {
                "from": "10:00",
                "to": "19:30"
            }
        },
        {
            "name": "Mayo Clinic",
            "stateName": "Florida",
            "availability": {
                "from": "09:00",
                "to": "20:00"
            }
        },
        {
            "name": "Cleveland Clinic",
            "stateName": "New York",
            "availability": {
                "from": "11:00",
                "to": "22:00"
            }
        },
        {
            "name": "Hopkins Hospital Baltimore",
            "stateName": "Florida",
            "availability": {
                "from": "07:00",
                "to": "22:00"
            }
        },
        {
            "name": "Mount Sinai Hospital",
            "stateName": "California",
            "availability": {
                "from": "12:00",
                "to": "22:00"
            }
        },
        {
            "name": "Tufts Medical Center",
            "stateName": "Kansas",
            "availability": {
                "from": "10:00",
                "to": "23:00"
            }
        },
        {
            "name": "UAB Hospital",
            "stateName": "Alaska",
            "availability": {
                "from": "11:00",
                "to": "22:00"
            }
        },
        {
            "name": "Swedish Medical Center",
            "stateName": "Arizona",
            "availability": {
                "from": "07:00",
                "to": "20:00"
            }
        },
        {
            "name": "Scratchpay Test Pet Medical Center",
            "stateName": "California",
            "availability": {
                "from": "00:00",
                "to": "24:00"
            }
        },
        {
            "name": "Scratchpay Official practice",
            "stateName": "Tennessee",
            "availability": {
                "from": "00:00",
                "to": "24:00"
            }
        }
    ]
};

//Used to change states 
function changeState(input, to){
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to === "abr"){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }    
    } else if (to === "fname"){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }    
    }
    else return input;
};