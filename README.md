# pipeline-lambda

Utilities for lambdas that execute in the context of a CodePipeline


## Usage

These functions are mostly boilerplate for lambda functions that execute as a step in AWS CodePipeline.


```js
const AWS = require('aws-sdk');
const {putJobFailure, putJobSuccess} = require('@teamgantt/pipeline-lambda');

// A function that cleans up some temporary test stack
const deleteStack = (cfn, stackName) => {
  const params = {
    StackName: stackName
  };
  return cfn.deleteStack(params).promise();
}

exports.handler = async (event, context) => {
  // Get the job from the event given to lambda
  const job = event['CodePipeline.job'];

  // Get data passed to the job
  const { id: jobId, data: { actionConfiguration: { configuration: { UserParameters: stackName } } } } = job;

  // Create the clients you need for whatever jam your lambda is doing
  const pipeline = new AWS.CodePipeline();
  const cfn = new AWS.CloudFormation();

  try {
    await deleteStack(cfn, stackName);
    // If your work succeeds, call putJobSuccess like so to mark the pipeline job as good
    // this will cause your pipeline to transition to the next step in the pipeline :)
    await putJobSuccess(pipeline, {context, jobId, message: `Deleted stack ${stackName}`});
  } catch (e) {
    // Mark the job as a failure, causing your pipeline to stop dead in it's tracks with failure
    await putJobFailure(pipeline, {context, jobId, message: `Failed to delete stack ${stackName}`});
  }
};

```
