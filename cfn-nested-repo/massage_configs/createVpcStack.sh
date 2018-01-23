#!/bin/bash

stack_name="NestedCFnBaseStack"
temp_json_file="describeJsonOutput.json"
#Create the Stack
#aws cloudformation create-stack --stack-name $stack_name --template-body file://$PWD/vpc-stack.yml \
#--region us-east-1 --parameters file://$PWD/vpc-params.json &&
#Wait for the stack to be created
aws cloudformation wait stack-create-complete \
    --stack-name $stack_name &&
#Grab the output info of the created stack
#Update Cloudformation parameters configuration files
#config-test.json, config-prod.json, config-uat.json
aws cloudformation describe-stacks \
    --stack-name $stack_name --query 'Stacks[*].Outputs[*]' > $temp_json_file
    #| jq  ".Stacks[].Outputs[]

#node replace.js &&
node replace_pipeline.js
