const core = require('@actions/core')
// this package allows us to interact with githubs APi's
// const github = require('@actions/github');
const exec = require('@actions/exec')

function run() {
  // When a workflow triggers our custom action and passes it some inputs, we can get access to those inputs with the github actions JS API.
  const bucket = core.getInput('bucket', { required: true })
  const bucketRegion = core.getInput('bucket-region', { required: true })
  const distFolder = core.getInput('dist-folder', { required: true })

  const s3Uri = `s3://${bucket}`
  // exec allows you to specify commands to execute in the shell of your runner (VM)
  // we use the aws Cli which is already pre-installed on githubs Ubuntu runners
  // the AWS command is basically telling AWS which local folder to sync with a remote S3 bucket
  // NOTE: the aws cli will automatically check for and use environment varaibles that the node instance was run with (defined via the env key in our workflow)
  exec.exec(`aws s3 sync ${distFolder} ${s3Uri} --region ${bucketRegion}`)

  // output the url of our website
  const websiteUrl = `http://${bucket}.s3-website-${bucketRegion}.amazonaws.com`
  core.setOutput('website-url', websiteUrl) // echo "website-url=..." >> $GITHUB_OUTPUT
}

// NOTE: we dont have to wrap our code in a function and manually invoke it but its a convention
run()
