// File handling functions
import { parseCSV } from './csvParser.js';

export function initializeFileHandlers() {
    // Radio button event listeners
    document.getElementById('repoFile').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('repoFileDiv').style.display = 'block';
            document.getElementById('localFileDiv').style.display = 'none';
        }
    });
    
    document.getElementById('localFile').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('repoFileDiv').style.display = 'none';
            document.getElementById('localFileDiv').style.display = 'block';
        }
    });

    // File input handler
    document.getElementById('fileInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('fileName').textContent = `File: ${file.name}`;
            const reader = new FileReader();
            reader.onload = function(event) {
                parseCSV(event.target.result);
            };
            reader.readAsText(file);
        }
    });
}

export async function loadRepoFile() {
    const fileName = document.getElementById('repoFileSelect').value;
    document.getElementById('fileName').textContent = `Loading file: ${fileName}...`;
    
    // Encode filename to handle spaces
    const encodedFileName = encodeURIComponent(fileName);
    
    try {
        // Try different approaches to load the file
        let response = await fetch(encodedFileName);
        if (!response.ok) {
            response = await fetch(fileName);
        }
        if (!response.ok) {
            response = await fetch('./' + fileName);
        }
        if (!response.ok) {
            response = await fetch('./' + encodedFileName);
        }
        
        if (response.ok) {
            const data = await response.text();
            document.getElementById('fileName').textContent = `File loaded: ${fileName}`;
            parseCSV(data);
        } else {
            throw new Error('Failed to load file from all attempted paths');
        }
    } catch (error) {
        console.error('Error loading file:', error);
        document.getElementById('fileName').textContent = `Error: Cannot load file. Please choose file from computer instead.`;
        
        // Automatically switch to local file option
        document.getElementById('localFile').checked = true;
        document.getElementById('repoFileDiv').style.display = 'none';
        document.getElementById('localFileDiv').style.display = 'block';
    }
}
