1# CSV Generator

This is a web-based CSV generator application that processes an input CSV file and generates multiple output CSV files based on predefined templates.

## How to Run the App

1. Ensure you have all the files in the `csv-generator` directory:
   - index.html
   - style.css
   - script.js
   - config.json

2. Open the `index.html` file in a modern web browser (e.g., Chrome, Firefox, Safari, or Edge).

## Using the App

1. Click the "Select CSV File" button to choose your input CSV file.
2. Click the "Process CSV File" button to parse and process the data.
3. Once processing is complete, click the "Preview Data" button to review and edit the generated data.
4. Click the "Generate CSV Files" button to create individual CSV files for each template.
5. Download individual CSV files using the provided links, or click "Download All as ZIP" to get all files in a single ZIP archive.

## Features

- Processes input CSV files
- Generates multiple output CSV files based on predefined templates
- Allows preview and editing of generated data before final CSV creation
- Supports downloading individual CSV files or all files as a ZIP archive

## Dependencies

This application uses the following external libraries:

- PapaParse (v5.3.0) for CSV parsing
- JSZip (v3.7.1) for creating ZIP files

These libraries are loaded via CDN in the index.html file, so an internet connection is required for the app to function properly.

## Configuration

The app uses a configuration object in the `script.js` file to define templates and field mappings. Modify this configuration to adjust the output CSV structure and content as needed.
# CSV-File-Generator
