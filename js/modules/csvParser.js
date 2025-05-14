// CSV parsing functions
import { IMPORTANT_COLUMNS, POWER_THRESHOLD, TANK_DPS_RATIO } from './constants.js';
import { initializeUIElements } from './ui.js';
import { state } from './state.js';
import { applyFilters } from './filtering.js';

export function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    state.allData = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = parseCSVLine(lines[i]);
            const row = {};
            headers.forEach((header, index) => {
                let val = values[index] ? values[index].trim() : '';
                // Remove quotes
                if (val.startsWith('"') && val.endsWith('"')) {
                    val = val.slice(1, -1);
                }
                row[header] = val;
            });
            
            // Parse numeric values
            row['Killcount T1'] = parseInt(row['Killcount T1']) || 0;
            row['Killcount T2'] = parseInt(row['Killcount T2']) || 0;
            row['Killcount T3'] = parseInt(row['Killcount T3']) || 0;
            row['Killcount T4'] = parseInt(row['Killcount T4']) || 0;
            row['Killcount T5'] = parseInt(row['Killcount T5']) || 0;
            row['T4 +T5'] = row['T4 +T5'] ? parseInt(row['T4 +T5']) : (row['Killcount T4'] + row['Killcount T5']);
            row['Units Dead'] = row['Units Dead'] === '-' ? 0 : parseInt(row['Units Dead']) || 0;
            row['Units Killed'] = row['Units Killed'] === '-' ? 0 : parseInt(row['Units Killed']) || 0;
            row['Victories'] = parseFloat(row['Victories']) || 0;
            row['Defeats'] = parseFloat(row['Defeats']) || 0;
            row['Power'] = parseInt(row['Power']) || 0;
            row['Highest Power'] = parseInt(row['Highest Power']) || row['Power'] || 0;
            row['Home Server'] = parseInt(row['Home Server']) || 0;
            row['Lord Id'] = parseInt(row['Lord Id']) || 0;
            row['Units Healed'] = parseFloat(row['Units Healed']) || 0;
            row['Mana Spent'] = parseInt(row['Mana Spent']) || 0;
            
            // Calculate win rate
            const totalBattles = row['Victories'] + row['Defeats'];
            row['Win Rate (%)'] = totalBattles > 0 ? 
                (row['Victories'] / totalBattles * 100).toFixed(2) : 'N/A';
            
            // Calculate tank ratio (victories/defeats)
            row['Tank Ratio'] = row['Defeats'] > 0 ? 
                (row['Victories'] / row['Defeats']).toFixed(2) : 
                (row['Victories'] > 0 ? 'Inf' : 'N/A');
            
            // Determine player type based on victories/defeats ratio
            if (row['Tank Ratio'] === 'N/A') {
                row['Player Type'] = 'Unknown';
            } else if (row['Tank Ratio'] === 'Inf' || parseFloat(row['Tank Ratio']) >= TANK_DPS_RATIO) {
                row['Player Type'] = 'DPS';
            } else {
                row['Player Type'] = 'Tank';
            }
            
            state.allData.push(row);
        }
    }
    
    // Initialize UI elements
    initializeUIElements(state.allData);
    
    // Update current columns - use important columns in order
    const allColumns = Object.keys(state.allData[0]);
    state.currentColumns = IMPORTANT_COLUMNS.filter(col => allColumns.includes(col));
    
    // Show main content
    document.getElementById('mainContent').style.display = 'block';
    
    // Initial display with default sort
    applyFilters();
    
    // Apply default sort order - Highest Power descending
    state.sortColumn = 'Highest Power';
    state.sortDirection = 'desc';
    state.multiSortMode = false;
    
    // Use dynamic imports to avoid circular dependency
    Promise.all([
        import('./sorting.js'),
        import('./tableRenderer.js')
    ]).then(([sortingModule, tableModule]) => {
        sortingModule.sortData();
        tableModule.updateTable();
    });
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}
