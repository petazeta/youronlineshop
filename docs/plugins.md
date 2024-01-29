Plugins
=======

Introduction
============

Plugins used to be application features that could be installed, uninstalled, turned on and turned off. We can make a feature that would fit in this definition by the following process.

We can make extra applications with some layout files plus some server contexts files using the same technique that we would use to create several application instances (see: [multisite](multisite.md)). This applications can be launched inpendently but in our case we want to be able to launch these applications from the main application. So we need to make a characteristic at the main application that can detect the plugin applications and launch them.

Plugins launcher
================

For the launcher to be able to detect plugins we would keep the plugins in a folder known by the main application, and this application can check the folder for plugins, launch them and keep track of them to be able to turn them off.