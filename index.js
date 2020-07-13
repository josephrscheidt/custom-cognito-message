'use strict';
var fs = require('fs');
var emailService = require('./email_service');

exports.handler = (event, context, callback) => {
    var modifiedEvent = event;
    var emailAddress = event.request.userAttributes.email;
    var filePath = '';

    if(modifiedEvent.userPoolId === "us-east-1_4DD38tsMd" || modifiedEvent.userPoolId === "us-east-1_aGBWAn8G9") {
        // Identify why was this function invoked
        if(modifiedEvent.triggerSource === "CustomMessage_SignUp") {

            //Get user information from api
            emailService.getData(emailAddress, function(err, data) {
                if(err) throw err;// Eventually want to add better error handling that tells frontend
                                  // that something went wrong
                
                var role = data['role_id'];
                var userInfo = {};
                userInfo.name = data['name'];
                userInfo.clinic = data['clinic_name'];
                userInfo.password = data['password'];
                
                if (role == 1 || role == 2) {
                    filePath = (emailService.sandbox) ? './ClinicSandbox_Welcome.html':'./Clinician_Welcome.html';
                    //Call fs.readFile(clinician welcome email)
                    fs.readFile(filePath, 'utf8', (err, email) => {
                        if(err) return callback(err, null);
                        //in callback of fs.readFile invoke RegEx function
                        emailService.insertText(email, userInfo, (err, modifiedEmail) => {
                            if(err) return callback(err, null);
                           //use callback of RegEx to make final mods to event and callback to aws
                        modifiedEvent.response.emailSubject = "Welcome to Avior";
                        modifiedEvent.response.emailMessage = modifiedEmail;
                        console.log(modifiedEmail.emailMessage);
                        callback(null, modifiedEvent);
                        });
                    });
                }
                else if (role == 3) {
                    filePath = (emailService.sandbox) ? './PatientSandbox_Welcome.html':'./Patient_Welcome.html';
                    //Call fs.readFile(patient welcome email)
                    fs.readFile(filePath, 'utf8', (err, email) => {
                        if(err) return callback(err, null);
                        //in callback of fs.readFile invoke RegEx function
                        emailService.insertText(email, userInfo, (err, modifiedEmail) => {
                            if(err) return callback(err, null);
                           //use callback of RegEx to make final mods to event and callback to aws
                        modifiedEvent.response.emailSubject = "Welcome to " + userInfo.clinic;
                        modifiedEvent.response.emailMessage = modifiedEmail;
                        console.log(modifiedEmail.emailMessage);
                        callback(null, modifiedEvent);
                        });
                    });
                }
                else {
                    throw "This role is not supported.";
                }
            });
            
        }
            
        if(modifiedEvent.triggerSource === "CustomMessage_ForgotPassword") {
            //Get user information from api
            emailService.getData(emailAddress, function(err, data) {
                if(err) throw err;// Eventually want to add better error handling that tells frontend
                                  // that something went wrong
                
                var role = data['role_id'];
                var userInfo = {};
                userInfo.name = data['name'];
                userInfo.clinic = data['clinic_name'];
                userInfo.password = data['password'];
                
                if (role == 1 || role == 2) {
                    filePath = (emailService.sandbox) ? './ClinicSandbox_Reset.html':'./Clinician_ResetPassword.html';
                    //Call fs.readFile(clinician welcome email)
                    fs.readFile(filePath, 'utf8', (err, email) => {
                        if(err) return callback(err, null);
                        //in callback of fs.readFile invoke RegEx function
                        emailService.insertText(email, userInfo, (err, modifiedEmail) => {
                            if(err) return callback(err, null);
                           //use callback of RegEx to make final mods to event and callback to aws
                        modifiedEvent.response.emailSubject = "Reset Password";
                        modifiedEvent.response.emailMessage = modifiedEmail;
                        console.log(modifiedEmail.emailMessage);
                        callback(null, modifiedEvent);
                        });
                    });
                }
                else if (role == 3) {
                    filePath = (emailService.sandbox) ? './PatientSandbox_Reset.html':'./Patient_ResetPassword.html';
                    //Call fs.readFile(patient welcome email)
                    fs.readFile(filePath, 'utf8', (err, email) => {
                        if(err) return callback(err, null);
                        //in callback of fs.readFile invoke RegEx function
                        emailService.insertText(email, userInfo, (err, modifiedEmail) => {
                            if(err) return callback(err, null);
                           //use callback of RegEx to make final mods to event and callback to aws
                        modifiedEvent.response.emailSubject = "Reset Password";
                        modifiedEvent.response.emailMessage = modifiedEmail;
                        console.log(modifiedEmail.emailMessage);
                        callback(null, modifiedEvent);
                        });
                    });
                }
                else {
                    throw "This role is not supported.";
                }
            });
        }
    }

};