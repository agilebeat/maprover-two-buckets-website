#Client Web app for s3 bucket

The client web application is deployed to s3 bucket which serves
as a static website. You have to configure the bucket first. Please 
follow aws tutorial desciribing how to configure s3 bucket to serve
a a static website.

However before you deploy the client webapp you have to configure two 
endpoints. 

## Steps to install the application

1. Open index.html file
2. Navigate to line 23

```
    <script>
        const RAIL_S3_BUCKET_LAYER = 'https://md-rail-maprover.s3.amazonaws.com/{z}/{x}/{y}.png'
        const RAIL_LAMBDA_CLASSIFY = 'https://bgpquq5d0c.execute-api.us-east-1.amazonaws.com/railroad/infer'
    </script>
```

3. Change value for the RAIL_S3_BUCKET_LAYER to your bucket where the lambda function will dump all "rail" tiles
4. Change value for the RAIL_LAMBDA_CLASSIFY to point webapp to the infer service (the service able to check if tail 
   has rail or not)
5. Deploy the application to s3 bucket by copying all files. The index.html file has to be 
   on top level of s3 bucket (no folders are involved in the path)



#Useful links:

| Description                                                 | URL                                                                             |
|-------------------------------------------------------------|---------------------------------------------------------------------------------|
| IntelliJ for JS - HowTo                                     | https://www.jetbrains.com/help/idea/javascript-specific-guidelines.html         |
| Understanding the JavaScript Prototype Chain & Inheritance  |  https://community.risingstack.com/javascript-prototype-chain-inheritance/      |
| All about this keyword                                      | https://codeburst.io/all-about-this-and-new-keywords-in-javascript-38039f71780c |
| JavaScript Base64URL                                        | https://jsfiddle.net/magikMaker/7bjaT/                                          |
| Base64Url - spec                                            | https://tools.ietf.org/html/rfc4648#section-5                                   |


##GOTCHA

1. Base64Url python version does not drops 'equals' carachters at the end. JavaScript has to match it.
