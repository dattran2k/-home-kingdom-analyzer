// Table rendering functions
import { state } from './state.js';
import { sortByColumn } from './sorting.js';

export function updateTable() {
    // Update headers
    const headerRow = document.getElementById('tableHeader');
    headerRow.innerHTML = state.currentColumns.map(col => `
        <th onclick="window.sortByColumn('${col}')">
            ${col}
            <span class="sort-indicator">
                ${state.sortColumn === col ? (state.sortDirection === 'asc' ? '▲' : '▼') : ''}
            </span>
        </th>
    `).join('');
    
    // Update body
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    state.filteredData.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = row['Player Type'].toLowerCase();
        
        state.currentColumns.forEach(col => {
            const td = document.createElement('td');
            let value = row[col];
            
            // Format numeric values with thousands separator - more compact
            if (typeof value === 'number' && col !== 'Home Server' && col !== 'Lord Id') {
                if (col === 'Power' || col === 'Highest Power') {
                    // Format power values in millions
                    value = (value / 1000000).toFixed(1) + 'M';
                } else if (value > 1000000) {
                    value = (value / 1000000).toFixed(2) + 'M';
                } else if (value > 1000) {
                    value = (value / 1000).toFixed(0) + 'K';
                } else {
                    value = value.toLocaleString();
                }
            }
            
            // Special formatting for win rate
            if (col === 'Win Rate (%)' && value !== 'N/A') {
                td.style.fontWeight = 'bold';
                td.style.color = parseFloat(value) >= 50 ? '#2ecc71' : '#e74c3c';
            }
            
            // Special formatting for tank ratio
            if (col === 'Tank Ratio' && value !== 'N/A') {
                td.style.fontWeight = 'bold';
                if (value === 'Inf') {
                    td.style.color = '#27ae60';
                    td.textContent = '∞';
                } else {
                    const ratio = parseFloat(value);
                    td.style.color = ratio < 1.3 ? '#e74c3c' : '#27ae60';
                }
            }
            
            // Special formatting for player type
            if (col === 'Player Type') {
                td.style.fontWeight = 'bold';
                if (value === 'Tank') {
                    td.style.color = '#e74c3c';
                } else if (value === 'DPS') {
                    td.style.color = '#2ecc71';
                } else {
                    td.style.color = '#95a5a6';
                }
            }
            
            // Special formatting for kingdom - make it more compact
            if (col === 'Home Server') {
                td.style.fontWeight = 'bold';
                td.style.color = '#3498db';
                td.style.textAlign = 'center';
            }
            
            // Special formatting for power columns
            if (col === 'Power' || col === 'Highest Power') {
                td.style.color = '#f39c12';
            }
            
            if (!td.textContent) {
                td.textContent = value || '-';
            }
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
}

// Export sortByColumn to window for onclick handlers
window.sortByColumn = sortByColumn;
