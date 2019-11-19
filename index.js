exports.handler = async event => {

  const AWS = require('aws-sdk');
  const axios = require('axios');

  const serviceName = process.env.SERVICE_NAME;
  const url = process.env.url;

  console.log('serviceName: ', serviceName);
  console.log('url: ', url);

  const cloudWatch = new AWS.CloudWatch();

  const startTime = timeInMs();
  const resp = await axios.get(url);
  const endTime = timeInMs();

  console.log('resp.status: ', resp.status);

  const value = endTime - startTime;
  const metricName = resp.status == 200 ? 'Success' : 'Failure'

  await cloudWatch.putMetricData({
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