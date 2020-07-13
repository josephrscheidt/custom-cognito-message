'use strict';
// var http = require('http');
var axios = require('axios');
// Initialize an axios instance targeted to the api
var instance = axios.create({
    baseURL: 'https://api.avioranalytics.net/',
    timeout: 1000,
});

var sandboxinstance = axios.create({
    baseURL: 'https://sandboxapi.avioranalytics.net/',
    timeout: 1000,
    //   headers: {'X-Custom-Header': 'foobar'}
});
exports.sandbox = false;
// getData takes two inputs, an email and a callback function
exports.getData = (emailAddress, callback) => {
    // Make post and return the response or error
    instance.post('email/', {
        email: emailAddress
    })
    .then(function (response) {

        // Function returns the output through the callback function in the standared
        // (err, res) format
        callback(null, response.data.userdata);
    })
    .catch(function (error) {
        exports.sandbox = true;
        sandboxinstance.post('email/', {
            email: emailAddress
        })
        .then(function (response) {
            callback(null, response.data.userdata);
        })
        .catch(function (error) {
            return callback(error, null);
        });
    });
};
exports.insertText = (email, userInfo, callback) => {
    var modifiedEmail = email;
    //Stefan write your RegEx function here
    let regexName = /\*\*NAME\*\*/gi;
    let regexClinic = /\*\*CLINIC\*\*/gi;
    let regexPassword = /\*\*PASSWORD\*\*/gi;
    modifiedEmail = modifiedEmail.replace(regexName, userInfo['name']);
    modifiedEmail = modifiedEmail.replace(regexClinic, userInfo['clinic']);
    modifiedEmail = modifiedEmail.replace(regexPassword, userInfo['password']);
    //Function should return with the following
    callback(null, modifiedEmail);
};