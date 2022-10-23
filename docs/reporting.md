Reporting
=========

# Introduction

Collecting some crutical information from the app it is very valuable to check some application performance and to get user statics. We call this procedure: reporting. Through this process we would register some events occurred in the program and we would save it in a text file or logging them in console.

# The reports

To get a list of the events that would produce reports we have got a list ot them at the file reports.js. This is a way of centralize some of the events that would produce reports. But there could be reports generated in other parts of the code.

Module reports.mjs is used by the request manager: respond.mjs and it lists the request actions that would produce a report and which information is reported.

# The reporting process

For the reporting process we would need a module for performing the event registering

Reporting process is implemented at reporting.mjs

# Future of reporting

Maybe we could implement it with observer pattern so there would be ways to centralize or at least track the elements reporting process.