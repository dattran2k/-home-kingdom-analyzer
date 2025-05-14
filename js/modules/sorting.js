// Sorting functions
import { state } from './state.js';
import { updateTable } from './tableRenderer.js';

export function sortByColumn(column) {
    // Turn off multi-sort mode when clicking a column
    state.multiSortMode = false;
    
    if (state.sortColumn === column) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        state.sortColumn = column;
        // Special formatting for power-related columns
        if (column.toLowerCase().includes('power') || 
            column.toLowerCase().includes('kill') || 
            column.toLowerCase().includes('dead') ||
            column.toLowerCase().includes('heal') ||
            column.toLowerCase().includes('victories') ||
            column.toLowerCase().includes('mana')) {
            state.sortDirection = 'desc';
        } else {
            state.sortDirection = 'asc';
        }
    }
    sortData();
    updateTable();
}

export function sortData() {
    state.filteredData.sort((a, b) => {
        let aVal = a[state.sortColumn];
        let bVal = b[state.sortColumn];
        
        // Handle N/A values
        if (aVal === 'N/A') aVal = -1;
        if (bVal === 'N/A') bVal = -1;
        
        // Handle empty or dash values
        if (aVal === '-' || aVal === '') aVal = 0;
        if (bVal === '-' || bVal === '') bVal = 0;
        
        // Convert to numbers if possible
        if (!isNaN(aVal) && !isNaN(bVal)) {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        }
        
        if (state.sortDirection === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    });
}

export function applyMultiSort() {
    state.filteredData.sort((a, b) => {
        // Sort by Home Server first
        let homeServerA = a['Home Server'] || 0;
        let homeServerB = b['Home Server'] || 0;
        if (homeServerA !== homeServerB) {
            return homeServerA - homeServerB;
        }
        
        // Then by Name
        let nameA = a['Name'].toLowerCase();
        let nameB = b['Name'].toLowerCase();
        if (nameA !== nameB) {
            return nameA.localeCompare(nameB);
        }
        
        // Then by Lord Id
        let idA = a['Lord Id'] || 0;
        let idB = b['Lord Id'] || 0;
        return idA - idB;
    });
    updateTable();
}

export function resetSort() {
    state.multiSortMode = true;
    state.sortColumn = 'Home Server';
    state.sortDirection = 'asc';
    applyMultiSort();
}
