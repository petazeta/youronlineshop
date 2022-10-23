Error Handling
==============

# Introduction

# Sending errors from server to client

There is an error protocol understood for client for when an error is sent from server. Server errors follow this form: "{error: true, message: Error Message}", where Error Message is some text that describes the error.