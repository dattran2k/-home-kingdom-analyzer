// Statistics functions
import { state } from './state.js';

export function updateStats() {
    const stats = {
        total: state.filteredData.length,
        totalKillsT1: state.filteredData.reduce((sum, d) => sum + d['Killcount T1'], 0),
        totalKillsT4: state.filteredData.reduce((sum, d) => sum + d['Killcount T4'], 0),
        totalKillsT5: state.filteredData.reduce((sum, d) => sum + d['Killcount T5'], 0),
        totalT4T5: state.filteredData.reduce((sum, d) => sum + d['T4 +T5'], 0),
        totalDead: state.filteredData.reduce((sum, d) => sum + d['Units Dead'], 0),
        totalHealed: state.filteredData.reduce((sum, d) => sum + d['Units Healed'], 0),
        tanks: state.filteredData.filter(d => d['Player Type'] === 'Tank').length,
        dps: state.filteredData.filter(d => d['Player Type'] === 'DPS').length,
        avgWinRate: state.filteredData
            .filter(d => d['Win Rate (%)'] !== 'N/A')
            .reduce((sum, d, _, arr) => sum + parseFloat(d['Win Rate (%)']) / arr.length, 0)
            .toFixed(2)
    };
    
    const statsContainer = document.getElementById('statsContainer');
    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.total.toLocaleString()}</div>
            <div class="stat-label">Total Players</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.totalKillsT1.toLocaleString()}</div>
            <div class="stat-label">Total Kills T1</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.totalKillsT4.toLocaleString()}</div>
            <div class="stat-label">Total Kills T4</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.totalKillsT5.toLocaleString()}</div>
            <div class="stat-label">Total Kills T5</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.totalT4T5.toLocaleString()}</div>
            <div class="stat-label">Total T4+T5</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.totalDead.toLocaleString()}</div>
            <div class="stat-label">Total Units Dead</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.totalHealed.toLocaleString()}</div>
            <div class="stat-label">Total Units Healed</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.tanks.toLocaleString()}</div>
            <div class="stat-label">Tanks</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.dps.toLocaleString()}</div>
            <div class="stat-label">DPS</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.avgWinRate}%</div>
            <div class="stat-label">Average Win Rate</div>
        </div>
    `;
}

export function calculateStats(data) {
    const totalPower = data.reduce((sum, d) => sum + d['Power'], 0);
    const avgPower = data.length > 0 ? totalPower / data.length : 0;
    const topPlayers = [...data].sort((a, b) => b['Power'] - a['Power']).slice(0, 10);
    
    return {
        total: data.length,
        totalPower: totalPower,
        avgPower: avgPower,
        totalKillsT1: data.reduce((sum, d) => sum + d['Killcount T1'], 0),
        totalKillsT4: data.reduce((sum, d) => sum + d['Killcount T4'], 0),
        totalKillsT5: data.reduce((sum, d) => sum + d['Killcount T5'], 0),
        totalT4T5: data.reduce((sum, d) => sum + d['T4 +T5'], 0),
        totalDead: data.reduce((sum, d) => sum + d['Units Dead'], 0),
        totalHealed: data.reduce((sum, d) => sum + d['Units Healed'], 0),
        totalManaSpent: data.reduce((sum, d) => sum + d['Mana Spent'], 0),
        tanks: data.filter(d => d['Player Type'] === 'Tank').length,
        dps: data.filter(d => d['Player Type'] === 'DPS').length,
        avgWinRate: data
            .filter(d => d['Win Rate (%)'] !== 'N/A')
            .reduce((sum, d, _, arr) => sum + parseFloat(d['Win Rate (%)']) / arr.length, 0),
        topPlayers: topPlayers
    };
}
