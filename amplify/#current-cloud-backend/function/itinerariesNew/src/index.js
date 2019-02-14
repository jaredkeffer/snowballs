const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app);

var https = require('https');
var jose = require('node-jose');

var region = 'us-east-1';
var userpool_id = 'us-east-1_iI3HJL7Nh';
var app_client_id = '2ik3gcqiuqbpr1o6n0c5li3d35';
var keys_url = 'https://cognito-idp.' + region + '.amazonaws.com/' + userpool_id + '/.well-known/jwks.json';

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  var token = event.token;
  var sections = token.split('.');
  // get the kid from the headers prior to verification
  var header = jose.util.base64url.decode(sections[0]);
  header = JSON.parse(header);
  var kid = header.kid;
  // download the public keys
  https.get(keys_url, function(response) {
    if (response.statusCode == 200) {
      response.on('data', function(body) {
        var keys = JSON.parse(body)['keys'];
        // search for the kid in the downloaded public keys
        var key_index = -1;
        for (var i = 0; i < keys.length; i++) {
          if (kid == keys[i].kid) {
            key_index = i;
            break;
          }
        }
        if (key_index == -1) {
          console.log('Public key not found in jwks.json');
        }
        // construct the public key
        jose.JWK.asKey(keys[key_index]).
        then(function(result) {
          // verify the signature
          jose.JWS.createVerify(result).
          verify(token).
          then(function(result) {
            // now we can use the claims
            var claims = JSON.parse(result.payload);
            // additionally we can verify the token expiration
            console.log(claims);
          }).
          catch(function(error) {
            console.error('Signature verification failed', error);
          });
        });
      });
    }
  });


  awsServerlessExpress.proxy(server, event, context);
};
