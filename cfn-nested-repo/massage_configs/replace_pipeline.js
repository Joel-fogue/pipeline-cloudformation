var fs = require('fs')
const path = require('path');

function readIn(writeConfigFile, readFromFile, outputConfigFile, uATTopic){
  var file = fs.readFileSync(path.resolve(__dirname, readFromFile), {encoding: 'utf8'});
  var jsonContentArray = JSON.parse(file)[0];
  _uATTopic=getConfigVal(jsonContentArray, uATTopic);
  writeOut(writeConfigFile, outputConfigFile, [{uATTopic, _uATTopic}, {artifactStoreS3Location, _artifactStoreS3Location}]);
}
//Writing the updated JSON object to a file
function writeOut(readFromFile, writeToFile, key, value){
  var file = fs.readFileSync(readFromFile, {encoding: 'utf8'});
  var jsonArrayContent = JSON.parse(file);
  var foundVal='', updatedJson='';
  for(var j=0; j<jsonArrayContent.length; j++){
    if(jsonArrayContent[j].ParameterKey==key){
      foundVal = jsonArrayContent[j].ParameterValue;//Used to check wrong keys or keys we can't find in the JSON obj
      jsonArrayContent[j].ParameterValue=value;
      updatedJson=JSON.stringify(jsonArrayContent);
      fs.writeFile(path.resolve(__dirname, writeToFile), updatedJson, (err) => {
          if (err) throw err;
      });
      break;
    }
  }//end loop
  if(foundVal==''){
    throw "Couldn't find value for key("+key+")";
  }
  console.log("Updated Json file content:\n", updatedJson, "\n-------------------------------------");
}

function getConfigVal(jsonArray, configKey){
  var tempVal='', found='';
  for(var i=0; i<jsonArray.length; i++){
    tempVal = lookUpKey(jsonArray[i], configKey);
    if(tempVal!=null && tempVal !=undefined && tempVal!=''){
      found = tempVal;
      break;
    }
  }//end lookUpKey
  if(found=='')
    throw "Could not find the passed in key ("+configKey+")";
  return found;
}

function lookUpKey(configObj, configKey){
  var found='';
    if(configObj.OutputKey && configObj.OutputKey.valueOf()==configKey){
      found=configObj.OutputValue.valueOf();
    }
    return found;
}
readIn('../../codepipeline-cfn-codebuild.json', 'describeJsonOutput.json', 'codepipeline-cfn-codebuild-out.json', 'UATTopic');
