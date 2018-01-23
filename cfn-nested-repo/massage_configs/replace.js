var fs = require('fs')
const path = require('path');

//Reads the 'describeJsonOutput.json' file, obtained from running the aws-cli cmds in createVpcStack.sh
function readIn(writeConfigFile, readFromFile, outputConfigFile, vpcid, privateSubnet1, privateSubnet2, publicSubnet1, publicSubnet2, s3bucketName, dbSubnetGroup, keypair){
  var file = fs.readFileSync(path.resolve(__dirname, readFromFile), {encoding: 'utf8'});
  var jsonContentArray = JSON.parse(file)[0];
  var _vpcid, _privateSubnet1, _privateSubnet2, _publicSubnet1, _publicSubnet2, _s3bucketName, _dbSubnetGroup;
      _vpcid=getConfigVal(jsonContentArray, vpcid);
      _privateSubnet1=getConfigVal(jsonContentArray, privateSubnet1);
      _privateSubnet2=getConfigVal(jsonContentArray, privateSubnet2);
      _publicSubnet1=getConfigVal(jsonContentArray, publicSubnet1);
      _publicSubnet2=getConfigVal(jsonContentArray, publicSubnet2);
      _s3bucketName=getConfigVal(jsonContentArray, s3bucketName);
      _dbSubnetGroup=getConfigVal(jsonContentArray, dbSubnetGroup);
      //console.log(_vpcid, _privateSubnet1, _privateSubnet2, _publicSubnet1, _publicSubnet2, _s3bucketName, _dbSubnetGroup);
      writeOut(writeConfigFile, outputConfigFile, _vpcid,_privateSubnet1,_privateSubnet2,_publicSubnet1,_publicSubnet2,_s3bucketName,_dbSubnetGroup, keypair);
}
//Updates the config-*.json files
function writeOut(readFromFile, writeToFile, vPCID, privateSubnet1, privateSubnet2, publicSubnet1, publicSubnet2, s3BucketName, dBSubnetGroup, keypair){
  var file = fs.readFileSync(readFromFile, {encoding: 'utf8'});
  var jsonContent = JSON.parse(file).Parameters;
  jsonContent.VPCID = vPCID;
  jsonContent.PrivateSubnet1 = privateSubnet1;
  jsonContent.PrivateSubnet2 = privateSubnet2;
  jsonContent.PublicSubnet1 = publicSubnet1;
  jsonContent.PublicSubnet2 = publicSubnet2;
  jsonContent.S3BucketName = s3BucketName;
  jsonContent.DBSubnetGroup = dBSubnetGroup;
  jsonContent.KeyPair = keypair;
  fs.writeFile(path.resolve(__dirname, writeToFile), JSON.stringify(jsonContent), (err) => {
      if (err) throw err;
  });
  console.log("jsonContent:", jsonContent, "\n-------------------------------------");
}

function getConfigVal(jsonArray, configKey, fn){
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
readIn('../config-test.json', 'describeJsonOutput.json', 'config-test-out.json', 'VPCID', 'PrivateSubnet1', 'PrivateSubnet2', 'PublicSubnet1', 'PublicSubnet2', 'S3BucketName', 'DBSubnetGroup', 'testKeyName');
readIn('../config-prod.json', 'describeJsonOutput.json', 'config-prod-out.json', 'VPCID', 'PrivateSubnet1', 'PrivateSubnet2', 'PublicSubnet1', 'PublicSubnet2', 'S3BucketName', 'DBSubnetGroup', 'testKeyName');
readIn('../config-uat.json', 'describeJsonOutput.json', 'config-uat-out.json', 'VPCID', 'PrivateSubnet1', 'PrivateSubnet2', 'PublicSubnet1', 'PublicSubnet2', 'S3BucketName', 'DBSubnetGroup', 'testKeyName');
