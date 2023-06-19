# WiSpy Scan Processor

This application is an attempt to make processing scan data from wardriving a bit easier. It integrates with the foo firmware for the [WiSpy hackerbox](https://hackerboxes.com/products/hackerbox-0089-wispy). 

## Quick Start

 - Install node 19 (Using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) is recommented)
 - Clone this repo - `git clone git@github.com:ZackMattor/wispy-scan-processor.git`
 - Install packages `npm install`
 - Copy `.env.sample to .env` and populate values (See the Environment Variables section below)
 - Start the process `npm start`

## Lifecycle

 - Tries to load the homepage of the WiSpy web interface. If it can't load it it just waits for 30 seconds and loops.
 - If it can load the homepage it gets a list of files to process and goes through the following for each files.
   - Uploads to wiggle if the WIGGLE_API_KEY is set
   - Copies to your archive location if the ARCHIVE_LOCATION is set
   - Deletes the file off of the WiSpy
 - Once it gets through all of the files it waits for 90s which will allow the WiSpy to boot up all the way.

## Environment Variables

### WISPY_ENDPOINT

The endpoint to connect to your WiSpy web interface when it connects to your network.

Ex. `http://192.168.1.123`

### ARCHIVE_LOCATION

A local file path where to store a copy of the raw CSV scans. The filename with the origional filename prefixed by a datetime.

Ex. `/Users/bob/Documents/wispi_scans`

### WIGGLE_API_KEY

Your "encoded" Wiggle API credentials. You can get these from your [Wiggle Account Page](https://wigle.net/account). Grab the one labeled "Encoded for use" for this variable.

### WIGGLE_DONATE_SCAN_DATA

Grants commercial use of the file contents to wiggle - set to 'on' to allow.

Ex. `on`


