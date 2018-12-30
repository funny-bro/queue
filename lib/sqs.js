const { initSqs } = require('./aws')
const sqs = initSqs()
// Read more about : message attribute
// https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-attributes.html

const DEFAULT_DELAY_SECOND = 1

/**
 * @param {string} QueueUrl
 * @param {string} MessageBody
 * @param {object} attribute  {foo: {DataType, StringValue}}
 * @return {promise}
 */
const sendMessage = (QueueUrl, MessageBody = '', attribute = null) => {
  if (!QueueUrl) return Promise.reject(new Error('QueueUrl should not be null'))
  if (!MessageBody) { return Promise.reject(new Error('MessageBody should not be null')) }

  const DelaySeconds = DEFAULT_DELAY_SECOND

  return sqs.sendMessage({ DelaySeconds, MessageBody, QueueUrl }).promise()
}

/**
 * pulling one message from queue, for the message is VisibilityTimeout=0
 * @param {string} QueueUrl
 * @param {object} options  {WaitTimeSeconds, MaxNumberOfMessages}
 * @return {promise}
 */
const receiveMessage = (QueueUrl, options = {}) => {
  const { MaxNumberOfMessages = 1, WaitTimeSeconds = 0 } = options
  const params = {
    AttributeNames: ['SentTimestamp'],
    MessageAttributeNames: ['All'],
    QueueUrl,
    MaxNumberOfMessages, // between 1~10
    WaitTimeSeconds,
    VisibilityTimeout: 5
  }
  return sqs.receiveMessage(params).promise()
}

/**
 * pulling one message from queue, for the message is VisibilityTimeout=0
 * @param {string} QueueUrl
 * @param {object} options  {WaitTimeSeconds, MaxNumberOfMessages}
 * @return {promise}
 */
const deleteMessage = (QueueUrl, ReceiptHandle) => {
  return sqs.deleteMessage({ QueueUrl, ReceiptHandle }).promise()
}

const createQueue = (QueueName, options) =>
  sqs
    .createQueue({
      QueueName,
      ...options
    })
    .promise()

const deleteQueue = QueueUrl => sqs.deleteQueue({ QueueUrl }).promise()

const purgeQueue = QueueUrl => sqs.purgeQueue({ QueueUrl }).promise()

const changeMessageVisibility = (
  QueueUrl,
  ReceiptHandle,
  VisibilityTimeout = 5
) => {
  if (!QueueUrl) return Promise.reject(new Error('QueueUrl should not be null'))
  if (!ReceiptHandle) { return Promise.reject(new Error('ReceiptHandle should not be null')) }

  return sqs
    .changeMessageVisibility({ QueueUrl, ReceiptHandle, VisibilityTimeout })
    .promise()
}

const getQueueArn = QueueUrl =>
  sqs
    .getQueueAttributes({
      QueueUrl,
      AttributeNames: ['QueueArn']
    })
    .promise()

module.exports = {
  changeMessageVisibility,
  createQueue,
  deleteQueue,
  sendMessage,
  receiveMessage,
  purgeQueue,
  getQueueArn,
  deleteMessage
}
