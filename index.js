/**
 * Options passed to job success/failure handlers
 * @typedef {Object} JobStatusOptions
 * @property {String} message - The message sent to context.succeed or context.fail
 * @property {String} jobId - The unique identifier of the CodePipeline job being marked as success/failure
 * @property {Object} context - The context object given to every lambda handler
 */

/**
 * Mark a CodePipeline job as a success
 * 
 * @param {AWS.CodePipeline} pipeline 
 * @param {JobStatusOptions} options 
 */
const putJobSuccess = (pipeline, options) => {
  const {message, jobId, context} = options;
  const params = {
    jobId,
  };
  return pipeline.putJobSuccessResult(params, (err, data) => {
    if (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log('job failed to mark');
      context.fail(err);
    } else {
      console.log('job marked successfully');
      context.succeed(message);
    }
  }).promise();
}

/**
 * Mark a CodePipeline job as a failure
 * 
 * @param {AWS.CodePipeline} pipeline 
 * @param {JobStatusOptions} options e
 */
const putJobFailure = (pipeline, options) => {
  const {message, jobId, context} = options;
  const params = {
    jobId,
    failureDetails: {
      message: JSON.stringify(message),
      type: 'JobFailed',
      externalExecutionId: context.invokeid
    }
  };
  return pipeline.putJobFailureResult(params, (err, data) => {
    context.fail(message);
  }).promise();
}

module.exports = {
  putJobFailure,
  putJobSuccess
};
