const {
  createQueue,
  getQueueArn,
  deleteQueue,
  sendMessage,
  receiveMessage,
  deleteMessage
} = require('../../lib/sqs.js')

const timeStamp = () => new Date().getTime()
const sleep = (second = 3) =>
  new Promise(resolve => setTimeout(() => resolve(), second * 1000))

let e2eQueueUrl = ''
let e2eDeadUrl = ''

describe('lib/sqs.js', async () => {
  beforeAll(async () => {
    const ts = timeStamp()
    const deadQueueName = `e2e-dead-${ts}`
    const e2eQueueName = `e2e-test-${ts}`

    const { QueueUrl: _e2eDeadUrl } = await createQueue(deadQueueName)
    const deadArnResponse = await getQueueArn(_e2eDeadUrl)
    const deadArn = deadArnResponse.Attributes.QueueArn

    const { QueueUrl: _e2eQueueUrl } = await createQueue(e2eQueueName, {
      Attributes: {
        RedrivePolicy: JSON.stringify({
          deadLetterTargetArn: deadArn,
          maxReceiveCount: 3
        })
      }
    })

    e2eDeadUrl = _e2eDeadUrl
    e2eQueueUrl = _e2eQueueUrl

    await sleep(3) // aws takes time to init
  }, 10000)

  afterAll(async () => {
    await deleteQueue(e2eDeadUrl)
    await deleteQueue(e2eQueueUrl)
  })

  describe.only('should complete a message : send-recieve-delete', async () => {
    let createdReceiptHandle = ''
    const messageBody = `msg-${timeStamp()}`

    it(' send message', async () => {
      await sendMessage(e2eQueueUrl, messageBody)
      await sleep(3)
    })

    it(' recieve message', async () => {
      const recieveResponse = await receiveMessage(e2eQueueUrl)
      const { Body, ReceiptHandle } = recieveResponse.Messages[0]
      expect(Body).toBe(messageBody)
      createdReceiptHandle = ReceiptHandle
    })

    it(' delete message', async () => {
      await deleteMessage(e2eQueueUrl, createdReceiptHandle)

      const recieveResponse = await receiveMessage(e2eQueueUrl)
      expect(recieveResponse.Messages).toBeUndefined()
    })
  })

  describe('should move message to dead-queue when  retry 3 times', async () => {
    const messageBody = `msg-${timeStamp()}`

    it(' send message', async () => {
      await sendMessage(e2eQueueUrl, messageBody)
      await sleep(3)
    })

    it(
      ' recieve message for 3 times, and message is not found in 4th ',
      async () => {
        const recieveResponse1 = await receiveMessage(e2eQueueUrl)
        const { Body: Body1 } = recieveResponse1.Messages[0]
        expect(Body1).toBe(messageBody)
        await sleep(5)

        const recieveResponse2 = await receiveMessage(e2eQueueUrl)
        const { Body: Body2 } = recieveResponse2.Messages[0]
        expect(Body2).toBe(messageBody)
        await sleep(5)

        const recieveResponse3 = await receiveMessage(e2eQueueUrl)
        const { Body: Body3 } = recieveResponse3.Messages[0]
        expect(Body3).toBe(messageBody)
        await sleep(5)

        const recieveResponse4 = await receiveMessage(e2eQueueUrl)
        expect(recieveResponse4.Messages).toBeUndefined()
      },
      20000
    )

    it('Message is moved to dead-queue', async () => {
      const deadResponse = await receiveMessage(e2eDeadUrl)
      const { Body } = deadResponse.Messages[0]
      expect(Body).toBe(messageBody)
    })
  })
})
