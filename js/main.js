// Main application entry point
import { initializeFileHandlers, loadRepoFile } from './modules/fileHandler.js';
import { initializeFilterHandlers, applyFilters } from './modules/filtering.js';
import { resetSort } from './modules/sorting.js';
import { 
    toggleCompareMode, 
    applyCompare, 
    showDataView, 
    showCompareView, 
    executeCompare, 
    clearCompareSelection 
} from './modules/comparison.js';
import { selectAllColumns, selectImportantColumns } from './modules/ui.js';

// Initialize the application
function initializeApp() {
    // Initialize file handlers
    initializeFileHandlers();
    
    // Initialize filter handlers
    initializeFilterHandlers();
    
    // Auto-load default file when page loads
    loadRepoFile();
    
    // Expose functions to window for HTML event handlers
    window.applyFilters = applyFilters;
    window.selectAllColumns = selectAllColumns;
    window.selectImportantColumns = selectImportantColumns;
    window.resetSort = resetSort;
    window.toggleCompareMode = toggleCompareMode;
    window.applyCompare = applyCompare;
    window.showDataView = showDataView;
    window.showCompareView = showCompareView;
    window.executeCompare = executeCompare;
    window.clearCompareSelection = clearCompareSelection;
    window.loadRepoFile = loadRepoFile;
    
    // Add missing functions that HTML is calling
    window.clearCompare = clearCompareSelection;
    window.setDefaultCompare = () => {
        if (window.toggleCompareMode) {
            // Ensure compare mode is active and set defaults
            if (!document.getElementById('compareSection').style.display || 
                document.getElementById('compareSection').style.display === 'none') {
                toggleCompareMode();
            }
        }
    };
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', initializeApp);
