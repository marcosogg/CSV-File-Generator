// script.js
let config = {
  companyCode: 'GFIEUSD',
  templates: {
    purchasePoint: {
      fields: {
        Company: { type: 'static', value: 'GFIEUSD' },
        PurPoint: { type: 'input', source: '' },
        Name: { type: 'input', source: 'Supplier Name' },
        Country: { type: 'derived', source: 'function:extractCountry' },
        VendorNum: { type: 'input', source: 'Supplier ID' },
        VendorNumVendorID: { type: 'input', source: 'Supplier ID' },
        VendoPPLongEmail_c: { type: 'input', source: '' },
      },
    },
    part: {
      fields: {
        Company: { type: 'static', value: 'GFIEUSD' },
        PartNum: { type: 'input', source: 'Part' },
        SearchWord: { type: 'input', source: 'Part' },
        PartDescription: { type: 'input', source: 'Description' },
        ClassID: { type: 'derived', source: 'function:deriveClassID' },
        ProdCode: { type: 'derived', source: 'function:deriveProdCode' },
        UserChar1: { type: 'derived', source: 'function:extractCountry' },
        UserDecimal1: { type: 'static', value: '' },
        TrackSerialNum: { type: 'static', value: 'false' },
        SNBaseDataType: { type: 'static', value: '' },
        RefCategory: { type: 'derived', source: 'function:extractRefCategory' },
        CheckBox01: { type: 'static', value: 'false' },
        ShortChar01: { type: 'derived', source: 'function:extractShortChar01' },
        PartCategory_c: { type: 'static', value: '' },
        SNNumODigits: { type: 'static', value: '' },
      },
    },
    refCategory: {
      fields: {
        Company: { type: 'static', value: 'GFIEUSD' },
        RefCategory: { type: 'input', source: '' },
        Description: { type: 'input', source: '' },
      },
    },
    partPlant: {
      fields: {
        Company: { type: 'static', value: 'GFIEUSD' },
        Plant: { type: 'derived', source: 'function:extractPlant' },
        PartNum: { type: 'input', source: 'Part' },
        MinimumQty: { type: 'static', value: '0' },
        SafetyQty: { type: 'static', value: '0' },
        LeadTime: { type: 'static', value: '' },
        PurPoint: { type: 'input', source: 'Supplier ID' },
        MinMfgLotSize: { type: 'static', value: '0' },
        MfgLotMultiple: { type: 'static', value: '0' },
        MaxMfgLotSize: { type: 'static', value: '0' },
        DaysOfSupply: { type: 'static', value: '0' },
        BuyerID: { type: 'static', value: '' },
        Number01: { type: 'static', value: '0' },
        Number02: { type: 'static', value: '0' },
        VendorNum: { type: 'input', source: 'Supplier ID' },
      },
    },
    partWarehouse: {
      fields: {
        Company: { type: 'static', value: 'GFIEUSD' },
        PartNum: { type: 'input', source: 'Part' },
        WarehouseCode: { type: 'static', value: 'MAIN' },
        Plant: { type: 'derived', source: 'function:extractPlant' },
        PrimBinNum: { type: 'static', value: 'MAIN' },
      },
    },
    partBin: {
      fields: {
        Company: { type: 'static', value: 'GFIEUSD' },
        PartNum: { type: 'input', source: 'Part' },
        WarehouseCode: { type: 'static', value: 'MAIN' },
        BinNum: { type: 'static', value: 'MAIN' },
        Plant: { type: 'derived', source: 'function:extractPlant' },
      },
    },
    supplierPricelist: {
      fields: {
        Company: { type: 'static', value: 'GFIEUSD' },
        PartNum: { type: 'input', source: 'Part' },
        PUM: { type: 'static', value: 'EA' },
        EffectiveDate: { type: 'derived', source: 'function:getCurrentDate' },
        BaseUnitPrice: { type: 'input', source: 'Unit Price' },
        PrimaryVendor: { type: 'static', value: 'true' },
        VendorID: { type: 'input', source: 'Supplier ID' },
        AprvSupplier: { type: 'static', value: 'true' },
        DefaultPUM: { type: 'static', value: 'EA' },
        LeadTime: { type: 'static', value: '' },
      },
    },
  },
};

let generatedFiles = {};
let previewData = {};

// Initialize the application
function init() {
  addEventListeners();
  if (config.companyCode) {
    const companyCodeInput = document.getElementById('companyCode');
    if (companyCodeInput) {
      companyCodeInput.value = config.companyCode;
    }
  }

  // Initially disable preview tab until data is processed
  const previewTabBtn = document.querySelector('[data-tab="preview"]');
  if (previewTabBtn) {
    previewTabBtn.disabled = true;
    previewTabBtn.classList.add('disabled');
  }
}

// Add event listeners
function addEventListeners() {
  const generateBtn = document.getElementById('generateBtn');
  const downloadAllBtn = document.getElementById('downloadAllBtn');
  const companyCodeInput = document.getElementById('companyCode');
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('inputCsv');
  const tabButtons = document.querySelectorAll('.tab-button');
  const addManualDataBtn = document.getElementById('addManualDataBtn');

  if (generateBtn) generateBtn.addEventListener('click', generateCSVFiles);
  if (downloadAllBtn)
    downloadAllBtn.addEventListener('click', downloadAllAsZip);
  if (companyCodeInput)
    companyCodeInput.addEventListener('change', updateCompanyCode);

  if (dropZone) {
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleFileDrop);
    dropZone.addEventListener('click', () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
  }

  tabButtons.forEach((button) => {
    button.addEventListener('click', switchTab);
  });

  if (addManualDataBtn)
    addManualDataBtn.addEventListener('click', handleManualData);
}

// Handle drag over event
function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = 'copy';
}

// Handle file drop event
function handleFileDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    const fileInput = document.getElementById('inputCsv');
    fileInput.files = files;
    processCSV();
  }
}

// Handle file select event
function handleFileSelect(event) {
  processCSV();
}

// Switch between tabs
function switchTab(event) {
  const targetTab = event.currentTarget.getAttribute('data-tab');

  // If switching to preview tab, show the preview
  if (targetTab === 'preview') {
    showPreview();
    return;
  }

  document.querySelectorAll('.tab-content').forEach((content) => {
    content.classList.remove('active');
  });
  document.querySelectorAll('.tab-button').forEach((button) => {
    button.classList.remove('active');
  });
  document.getElementById(targetTab).classList.add('active');
  event.currentTarget.classList.add('active');
}

// Update company code
function updateCompanyCode(event) {
  config.companyCode = event.target.value;
  // Update all static Company fields in the config
  for (let template in config.templates) {
    if (config.templates[template].fields.Company) {
      config.templates[template].fields.Company.value = config.companyCode;
    }
  }
}

// Main processing function
function processCSV() {
  const fileInput = document.getElementById('inputCsv');
  const file = fileInput.files[0];

  if (!file) {
    showMessage('Please select a CSV file.');
    return;
  }

  console.log('File selected:', file.name, 'Size:', file.size, 'bytes');

  const reader = new FileReader();
  reader.onload = function (e) {
    const csvContent = e.target.result;
    console.log('CSV content:', csvContent);

    Papa.parse(csvContent, {
      complete: function (results) {
        console.log('Papa Parse results:', results);
        if (results.errors.length > 0) {
          showMessage('Error parsing CSV: ' + results.errors[0].message);
          console.error('Papa Parse errors:', results.errors);
          return;
        }
        if (
          results.data.length === 0 ||
          Object.keys(results.data[0]).length === 0
        ) {
          showMessage(
            'Error: CSV file appears to be empty or improperly formatted.'
          );
          return;
        }
        processTemplates(results.data);
        showMessage('File processed successfully.');
      },
      header: true,
      encoding: 'UTF-8',
      skipEmptyLines: true,
    });
  };

  reader.onerror = function (e) {
    console.error('FileReader error:', e);
    showMessage('Error reading the CSV file. Please try again.');
  };

  reader.readAsText(file, 'UTF-8');
}

// Template Processors
function processTemplates(data) {
  const templates = Object.keys(config.templates).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  updateProgress(0);

  data.forEach((item, index) => {
    if (!validateRow(item)) {
      showMessage(`Invalid data in row ${index + 2}. Skipping.`);
      return;
    }

    for (const [templateName, templateConfig] of Object.entries(
      config.templates
    )) {
      templates[templateName].push(
        processTemplate(templateName, templateConfig.fields, item)
      );
    }

    updateProgress(((index + 1) / data.length) * 100);
  });

  previewData = templates;
  // Enable preview tab button after processing
  const previewTabBtn = document.querySelector('[data-tab="preview"]');
  if (previewTabBtn) {
    previewTabBtn.disabled = false;
    previewTabBtn.classList.remove('disabled');
  }
  showMessage(
    'Data processed. Click "Preview" to review and edit the files and fields.'
  );
}

function processTemplate(templateName, fields, item) {
  const result = {};

  for (const [fieldName, fieldConfig] of Object.entries(fields)) {
    switch (fieldConfig.type) {
      case 'static':
        result[fieldName] = fieldConfig.value;
        break;
      case 'input':
        result[fieldName] = item[fieldConfig.source] || '';
        break;
      case 'derived':
        if (fieldConfig.source.startsWith('function:')) {
          const functionName = fieldConfig.source.split(':')[1];
          result[fieldName] = window[functionName](item);
        }
        break;
    }
  }

  return result;
}

// Preview function with editable fields
function showPreview() {
  if (!previewData || Object.keys(previewData).length === 0) {
    showMessage('No data to preview. Please upload a CSV file first.');
    return;
  }

  const previewContainer = document.getElementById('previewContent');
  if (!previewContainer) return;

  previewContainer.innerHTML = '';

  // Switch to preview tab and update active states
  document.querySelectorAll('.tab-content').forEach((content) => {
    content.classList.remove('active');
  });
  document.querySelectorAll('.tab-button').forEach((button) => {
    button.classList.remove('active');
  });
  document.getElementById('preview').classList.add('active');
  document.querySelector('[data-tab="preview"]').classList.add('active');

  // Debug log
  console.log('Preview Data:', previewData);

  for (const [templateName, data] of Object.entries(previewData)) {
    const templatePreview = document.createElement('div');
    templatePreview.className = 'template-preview';
    templatePreview.innerHTML = `<h3>${templateName}</h3>`;

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create header row
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach((key) => {
      const th = document.createElement('th');
      th.textContent = key;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create data rows
    data.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      Object.entries(row).forEach(([key, value]) => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = value;

        // Add classes based on field type
        if (config.templates[templateName].fields[key].type === 'static') {
          input.classList.add('static-field');
          input.readOnly = true;
        } else {
          input.classList.add('input-field');
        }

        input.addEventListener('change', (e) =>
          updatePreviewData(templateName, rowIndex, key, e.target.value)
        );
        td.appendChild(input);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    templatePreview.appendChild(tableWrapper);
    previewContainer.appendChild(templatePreview);
  }

  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.style.display = 'block';
  }
  previewContainer.style.display = 'block';
}

// Function to update previewData when a field is edited
function updatePreviewData(templateName, rowIndex, key, value) {
  previewData[templateName][rowIndex][key] = value;
}

// Utility Functions
function validateRow(item) {
  return item['Part'] && item['Supplier ID'] && item['Description'];
}

function extractCountry(item) {
  const parts = item['Part'].split('-');
  return parts[2] || '';
}

function extractPlant(item) {
  const parts = item['Part'].split('-');
  return parts[1] || '';
}

function extractRefCategory(item) {
  return item['Part'].split('-')[0];
}

function generateRefCategoryDescription(item) {
  return `${extractRefCategory(item)} Category`;
}

function deriveClassID(item) {
  return item['Part'].startsWith('E') ? 'VTGC' : '';
}

function deriveProdCode(item) {
  return item['Part'].startsWith('E') ? 'VIRTUAL' : '';
}

function extractShortChar01(item) {
  return item['Part'].split('-')[0];
}

function getCurrentDate() {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, '0')}/${String(
    today.getMonth() + 1
  ).padStart(2, '0')}/${today.getFullYear()}`;
}

// CSV Generation and Download
function generateCSVFiles() {
  const filesContainer = document.querySelector('.files-list');
  const generatedFilesSection = document.getElementById('generatedFiles');
  if (!filesContainer || !generatedFilesSection) return;

  filesContainer.innerHTML = '';
  generatedFilesSection.style.display = 'block';

  const fileNameMapping = {
    purchasePoint: '001_PurchasePoint.csv',
    part: '02_Part.csv',
    refCategory: '01_RefCategory.csv',
    partPlant: '03_PartPlant.csv',
    partWarehouse: '04_PartWarehouse.csv',
    partBin: '05_PartBin.csv',
    supplierPricelist: '06_SupplierPricelist.csv',
  };

  for (const [templateName, data] of Object.entries(previewData)) {
    const csvContent = Papa.unparse(data);
    const filename = fileNameMapping[templateName] || `${templateName}.csv`;
    generatedFiles[filename] = csvContent;

    const fileItem = createFileItem(csvContent, filename);
    filesContainer.appendChild(fileItem);
  }

  const downloadAllBtn = document.getElementById('downloadAllBtn');
  if (downloadAllBtn) {
    downloadAllBtn.style.display = 'block';
  }
}

function createFileItem(content, filename) {
  const fileItem = document.createElement('div');
  fileItem.className = 'file-item';

  const fileName = document.createElement('span');
  fileName.className = 'file-name';
  fileName.textContent = filename;

  const downloadButton = document.createElement('button');
  downloadButton.className = 'download-button';
  downloadButton.innerHTML = '<i class="fas fa-download"></i> Download';
  downloadButton.onclick = () => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  fileItem.appendChild(fileName);
  fileItem.appendChild(downloadButton);

  return fileItem;
}

function downloadAllAsZip() {
  const zip = new JSZip();

  for (const [filename, content] of Object.entries(generatedFiles)) {
    zip.file(filename, content);
  }

  zip.generateAsync({ type: 'blob' }).then(function (content) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'generated_csv_files.zip';
    link.click();
  });
}

// Helper Functions
function showMessage(msg) {
  const messagesElement = document.getElementById('messages');
  if (messagesElement) {
    messagesElement.innerText = msg;
  }
}

function updateProgress(percentage) {
  const progressBar = document.getElementById('progress');
  if (progressBar) {
    progressBar.innerHTML = `<span class="progress-bar-fill" style="width: ${percentage}%;"></span>`;
  }
}

// New function to handle manual data input
function handleManualData() {
  const form = document.getElementById('manualInputForm');
  const formData = new FormData(form);
  const manualData = {};
  formData.forEach((value, key) => {
    manualData[key] = value;
  });

  if (Object.keys(manualData).length === 0) {
    showMessage('Please fill in the form.');
    return;
  }

  if (!validateRow(manualData)) {
    showMessage('Invalid data in form. Please check the fields.');
    return;
  }

  processTemplates([manualData]);
  showMessage('Manual data added successfully.');
  form.reset();
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
