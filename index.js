const AWS = require('aws-sdk')
const axios = require('axios')

const serviceName = process.env.SERVICE_NAME
const url = process.env.url

const cloudWatch = new AWS.CloudWatch();

exports.handler = async event => {
  
  const startTime = timeInMs()
  const resp = await axios.get(url);
  const endTime = timeInMs();

  const value = endTime - startTime;
  const metricName = resp.status < 100 ? 'Success' : 'Failure'

  await cloudwatch.putMetricData({
    MetricData: [ // A list of data points to send
      {
        MetricName: metricName, // Name of a metric
        Dimensions: [ // A list of key-value pairs that can be used to filter metrics from CloudWatch
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: 'Count', // Unit of a metric
        Value: value // Value of a metric to store
      }
    ],
    Namespace: 'Udacity/Serveless' // An isolated group of metrics
  }).promise()

}

function timeInMs() {
  return new Date().getTime()
}