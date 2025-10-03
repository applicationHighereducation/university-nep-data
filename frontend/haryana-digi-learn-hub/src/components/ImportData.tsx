import React, { useState } from 'react';
import { Upload, File, Database, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Header } from './Header';

interface ExcelData {
  [key: string]: any;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  data: ExcelData[];
  sheets: string[];
}

const ImportData: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [apiMessage, setApiMessage] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Get all sheet names
      const sheetNames = workbook.SheetNames;
      
      // Convert first sheet to JSON (you can modify this to handle multiple sheets)
      const firstSheet = workbook.Sheets[sheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      const fileInfo: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        data: jsonData,
        sheets: sheetNames
      };

      setUploadedFile(fileInfo);
      setApiStatus('idle');
    } catch (error) {
      setUploadError('Error reading Excel file. Please check the file format.');
      console.error('Error processing file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleApiCall = async () => {
    if (!uploadedFile) {
      setApiMessage('No file uploaded');
      return;
    }

    setApiStatus('loading');
    setApiMessage('');

    try {
      // Replace this URL with your actual API endpoint
      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: uploadedFile.name,
          data: uploadedFile.data,
          sheets: uploadedFile.sheets
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setApiStatus('success');
        setApiMessage(`Data successfully sent to database! ${result.message || ''}`);
      } else {
        setApiStatus('error');
        setApiMessage(`API call failed: ${response.statusText}`);
      }
    } catch (error) {
      setApiStatus('error');
      setApiMessage('Error calling API. Please check your connection.');
      console.error('API call error:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString() + ' ' + 
           new Date(timestamp).toLocaleTimeString();
  };

  return (
    <>
    <Header />
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">Excel File Upload</h1>
        <p className="text-blue-100">Upload your Excel file and send data to database</p>
      </div>

      {/* File Upload Section */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center hover:border-blue-400 transition-colors">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <label htmlFor="excel-upload" className="cursor-pointer">
          <span className="text-lg font-medium text-gray-700 hover:text-blue-600">
            Choose Excel File
          </span>
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
        <p className="text-sm text-gray-500 mt-2">
          Supports .xlsx and .xls files
        </p>
      </div>

      {/* Upload Status */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">Processing Excel file...</span>
          </div>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <span className="text-red-800">{uploadError}</span>
          </div>
        </div>
      )}

      {/* Uploaded File Information */}
      {uploadedFile && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <File className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">Uploaded File Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">File Name</p>
                <p className="text-lg text-gray-900">{uploadedFile.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">File Size</p>
                <p className="text-lg text-gray-900">{formatFileSize(uploadedFile.size)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Modified</p>
                <p className="text-lg text-gray-900">{formatDate(uploadedFile.lastModified)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Sheets Found</p>
                <p className="text-lg text-gray-900">{uploadedFile.sheets.length}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Sheet Names</p>
              <div className="flex flex-wrap gap-2">
                {uploadedFile.sheets.map((sheet, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {sheet}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Data Preview</p>
              <p className="text-lg text-gray-900">
                {uploadedFile.data.length} rows of data ready for database
              </p>
              {uploadedFile.data.length > 0 && (
                <div className="mt-2 p-3 bg-gray-50 rounded border max-h-32 overflow-auto">
                  <p className="text-xs text-gray-600 font-mono">
                    Sample columns: {Object.keys(uploadedFile.data[0]).slice(0, 5).join(', ')}
                    {Object.keys(uploadedFile.data[0]).length > 5 ? '...' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* API Call Button */}
      {uploadedFile && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <button
            onClick={handleApiCall}
            disabled={apiStatus === 'loading'}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {apiStatus === 'loading' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Sending to Database...
              </>
            ) : (
              <>
                <Database className="h-5 w-5 mr-3" />
                Send Data to Database
              </>
            )}
          </button>

          {/* API Status Messages */}
          {apiMessage && (
            <div className={`mt-4 p-4 rounded-lg ${
              apiStatus === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {apiStatus === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                )}
                <span className={apiStatus === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {apiMessage}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default ImportData;