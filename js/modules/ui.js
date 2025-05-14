// UI initialization functions
import { IMPORTANT_COLUMNS } from './constants.js';
import { applyFilters } from './filtering.js';

export function initializeUIElements(allData) {
    // Initialize kingdom filter
    const kingdoms = [...new Set(allData.map(d => d['Home Server']))].sort((a, b) => a - b);
    const kingdomSelect = document.getElementById('kingdomFilter');
    kingdomSelect.innerHTML = '<option value="all">Tất cả Kingdom</option>';
    kingdoms.forEach(kingdom => {
        const option = document.createElement('option');
        option.value = kingdom;
        option.textContent = `Kingdom ${kingdom}`;
        kingdomSelect.appendChild(option);
    });
    
    // Initialize columns filter
    const allColumns = Object.keys(allData[0]);
    const columnsFilter = document.getElementById('columnsFilter');
    columnsFilter.innerHTML = '';
    
    // First add important columns in order
    IMPORTANT_COLUMNS.forEach(column => {
        if (allColumns.includes(column)) {
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';
            const columnId = column.replace(/[^a-zA-Z0-9]/g, '_');
            checkboxItem.innerHTML = `
                <input type="checkbox" id="col_${columnId}" value="${column}" checked>
                <label for="col_${columnId}">${column}</label>
            `;
            columnsFilter.appendChild(checkboxItem);
        }
    });
    
    // Then add remaining columns
    allColumns.forEach(column => {
        if (!IMPORTANT_COLUMNS.includes(column)) {
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';
            const columnId = column.replace(/[^a-zA-Z0-9]/g, '_');
            checkboxItem.innerHTML = `
                <input type="checkbox" id="col_${columnId}" value="${column}">
                <label for="col_${columnId}">${column}</label>
            `;
            columnsFilter.appendChild(checkboxItem);
        }
    });
}

export function selectAllColumns() {
    document.querySelectorAll('#columnsFilter input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
    });
}

export function selectImportantColumns() {
    // First deselect all
    document.querySelectorAll('#columnsFilter input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Then select only important columns
    IMPORTANT_COLUMNS.forEach(col => {
        const columnId = col.replace(/[^a-zA-Z0-9]/g, '_');
        const checkbox = document.querySelector(`#col_${columnId}`);
        if (checkbox) {
            checkbox.checked = true;
        }
    });
    
    // Update the display after changing selections
    applyFilters();
}
