var fs = require('fs')
const path = require('path');

function readIn(writeConfigFile, readFromFile, outputConfigFile, paramsArray){
  var file = fs.readFileSync(path.resolve(__dirname, readFromFile), {encoding: 'utf8'});
  var valuesArray=[];
  var jsonContentArray = JSON.parse(file)[0];

  _uATTopic=getConfigVal(jsonContentArray, paramsArray[0]);
  _artifactStoreS3Location=getConfigVal(jsonContentArray, paramsArray[1]);
  _prodTopic=getConfigVal(jsonContentArray, paramsArray[2]);
  valuesArray[0]=[paramsArray[0], _uATTopic];
  valuesArray[1]=[paramsArray[1], _artifactStoreS3Location];
  valuesArray[2]=[paramsArray[2], _prodTopic];

  /*for(var k=0; k<paramsArray.length; k++){
    console.log('the parameter is: ', paramsArray[k]);
    if(paramsArray[k]=="UATTopic"){
      _uATTopic=getConfigVal(jsonContentArray, paramsArray[k]);
      valuesArray[k]=["paramsArray[k]", "joel"];
    }else if(paramsArray[k]=="ArtifactStoreS3Location"){
      _artifactStoreS3Location=getConfigVal(jsonContentArray, paramsArray[k]);
      valuesArray[k]=[paramsArray[k], _artifactStoreS3Location];
    }else if(paramsArray[k]=="ProdTopic"){
      _prodTopic=getConfigVal(jsonContentArray, paramsArray[k]);
      valuesArray[k]=[paramsArray[k], _prodTopic];
    }*//*else{
      throw "Couldn't find key passed in ("+paramsArray[k]+")";
    }*/
  //}//end loop*/
  writeOut(writeConfigFile, outputConfigFile, valuesArray);
}
//Writing the updated JSON object to a file
function writeOut(readFromFile, writeToFile, _valuesArray){
  var file = fs.readFileSync(readFromFile, {encoding: 'utf8'});
  var jsonArrayContent = JSON.parse(file);
  var foundVal='', updatedJson='';
  var keyVal='';
  for(var n=0; n<_valuesArray.length; n++){
    keyVal = _valuesArray[n];
    for(var j=0; j<jsonArrayContent.length; j++){
      if(jsonArrayContent[j].ParameterKey==keyVal[0]){
        foundVal = jsonArrayContent[j].ParameterValue;//Used to check wrong keys or keys we can't find in the JSON obj
        jsonArrayContent[j].ParameterValue=keyVal[1];
        /*fs.writeFile(path.resolve(__dirname, writeToFile), updatedJson, (err) => {
            if (err) throw err;
        });*/
        break;
      }
    }//end loop
  }//end loop
  updatedJson=JSON.stringify(jsonArrayContent);
  fs.writeFile(path.resolve(__dirname, writeToFile), updatedJson, (err) => {
      if (err) throw err;
  });
  console.log("Updated Json file content:\n", updatedJson, "\n-------------------------------------");
}

function getConfigVal(jsonArray, configKey){
  if(configKey=='ArtifactStoreS3Location') configKey='S3BucketName';
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
readIn('../../codepipeline-cfn-codebuild.json', 'describeJsonOutput.json', 'codepipeline-cfn-codebuild-out.json', ["UATTopic","ArtifactStoreS3Location", "ProdTopic"]);
