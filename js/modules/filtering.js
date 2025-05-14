// Filtering functions
import { state } from './state.js';
import { POWER_THRESHOLD } from './constants.js';
import { applyMultiSort, sortData } from './sorting.js';
import { updateStats } from './statistics.js';
import { updateTable } from './tableRenderer.js';

export function applyFilters() {
    const kingdom = document.getElementById('kingdomFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const playerType = document.getElementById('playerTypeFilter').value;
    
    // Get selected columns
    const selectedColumns = [];
    document.querySelectorAll('#columnsFilter input[type="checkbox"]:checked').forEach(cb => {
        selectedColumns.push(cb.value);
    });
    
    state.currentColumns = selectedColumns;
    
    // Filter data
    state.filteredData = state.allData.filter(row => {
        // Filter out players with power less than 30M
        if (row['Power'] < POWER_THRESHOLD) return false;
        
        // If in compare mode, only show selected kingdoms
        if (state.compareMode && (state.team1Kingdoms.length > 0 || state.team2Kingdoms.length > 0)) {
            const allCompareKingdoms = [...state.team1Kingdoms, ...state.team2Kingdoms];
            if (!allCompareKingdoms.includes(row['Home Server'])) return false;
        } else {
            // Normal kingdom filter
            if (kingdom !== 'all' && row['Home Server'] != kingdom) return false;
        }
        
        // Name search
        if (searchTerm && !row['Name'].toLowerCase().includes(searchTerm)) return false;
        
        // Player type filter
        if (playerType !== 'all' && row['Player Type'].toLowerCase() !== playerType) return false;
        
        return true;
    });
    
    // Apply multi-level sorting by default
    if (state.multiSortMode) {
        applyMultiSort();
    } else if (state.sortColumn) {
        sortData();
    }
    
    // Update stats
    updateStats();
    
    // Update table
    updateTable();
}

export function initializeFilterHandlers() {
    // Search input handler
    document.getElementById('searchInput').addEventListener('input', () => {
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(applyFilters, 300);
    });
    
    // Apply filters when dropdowns change
    document.getElementById('kingdomFilter').addEventListener('change', applyFilters);
    document.getElementById('playerTypeFilter').addEventListener('change', applyFilters);
}
