/**
 * Exercise Tab Framework
 * A dynamic system for creating and managing exercise tabs
 */

class ExerciseTabManager {
    constructor() {
        this.tabs = [];
        this.activeTabIndex = 0;
        this.totalScore = 0;
        this.maxScore = 0;
        this.init();
    }

    /**
     * Initialize the tab manager
     */
    init() {
        this.tabContainer = document.querySelector('.tab-container');
        this.tabButtons = document.querySelector('.tab-buttons');
        this.tabContent = document.querySelector('.tab-content');
        this.scoreElement = document.getElementById('totalScore');
        
        if (!this.tabContainer || !this.tabButtons || !this.tabContent) {
            console.error('Required tab elements not found in DOM');
            return;
        }

        // Clear existing tabs
        this.clearExistingTabs();
    }

    /**
     * Clear existing tabs from the DOM
     */
    clearExistingTabs() {
        this.tabButtons.innerHTML = '';
        this.tabContent.innerHTML = '';
        this.tabs = [];
        this.activeTabIndex = 0;
    }

    /**
     * Create a specified number of tabs
     * @param {number} numberOfTabs - Number of tabs to create
     * @param {Array} tabNames - Optional array of custom tab names
     * @param {Array} maxScores - Optional array of max scores per tab
     */
    createTabs(numberOfTabs, tabNames = null, maxScores = null) {
        if (numberOfTabs < 1) {
            console.error('Number of tabs must be at least 1');
            return;
        }

        this.clearExistingTabs();
        this.maxScore = 0;

        for (let i = 0; i < numberOfTabs; i++) {
            const tabNumber = i + 1;
            const tabName = tabNames && tabNames[i] ? tabNames[i] : `Oefening ${tabNumber}`;
            const tabMaxScore = maxScores && maxScores[i] ? maxScores[i] : 0;
            
            this.maxScore += tabMaxScore;

            // Create tab button
            const tabButton = this.createTabButton(tabNumber, tabName);
            this.tabButtons.appendChild(tabButton);

            // Create tab panel
            const tabPanel = this.createTabPanel(tabNumber);
            this.tabContent.appendChild(tabPanel);

            // Store tab data
            this.tabs.push({
                number: tabNumber,
                name: tabName,
                maxScore: tabMaxScore,
                currentScore: 0,
                completed: false,
                button: tabButton,
                panel: tabPanel
            });
        }

        // Set first tab as active
        this.setActiveTab(0);
        this.updateScoreDisplay();
    }

    /**
     * Create a tab button element
     * @param {number} tabNumber - Tab number
     * @param {string} tabName - Tab name
     * @returns {HTMLElement} Tab button element
     */
    createTabButton(tabNumber, tabName) {
        const button = document.createElement('button');
        button.className = 'tab-button';
        button.id = `tab${tabNumber}`;
        button.setAttribute('data-tab', tabNumber);
        
        // Create the button content with score display
        const buttonContent = document.createElement('span');
        buttonContent.className = 'tab-button-content';
        buttonContent.textContent = tabName;
        
        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'tab-score';
        scoreSpan.textContent = `(0/${this.tabs[tabNumber - 1]?.maxScore || 0})`;
        
        button.appendChild(buttonContent);
        button.appendChild(scoreSpan);
        
        button.addEventListener('click', () => {
            this.setActiveTab(tabNumber - 1);
        });

        return button;
    }

    /**
     * Create a tab panel element
     * @param {number} tabNumber - Tab number
     * @returns {HTMLElement} Tab panel element
     */
    createTabPanel(tabNumber) {
        const panel = document.createElement('div');
        panel.id = `assignments${tabNumber}`;
        panel.className = 'tab-panel';
        return panel;
    }

    /**
     * Set the active tab
     * @param {number} tabIndex - Index of the tab to activate
     */
    setActiveTab(tabIndex) {
        if (tabIndex < 0 || tabIndex >= this.tabs.length) {
            console.error('Invalid tab index');
            return;
        }

        // Remove active class from all tabs
        this.tabs.forEach(tab => {
            tab.button.classList.remove('active');
            tab.panel.classList.remove('active');
        });

        // Add active class to selected tab
        this.tabs[tabIndex].button.classList.add('active');
        this.tabs[tabIndex].panel.classList.add('active');
        this.activeTabIndex = tabIndex;
    }

    /**
     * Get the currently active tab
     * @returns {Object} Active tab object
     */
    getActiveTab() {
        return this.tabs[this.activeTabIndex];
    }

    /**
     * Set content for a specific tab
     * @param {number} tabIndex - Index of the tab
     * @param {string|HTMLElement} content - Content to set
     */
    setTabContent(tabIndex, content) {
        if (tabIndex < 0 || tabIndex >= this.tabs.length) {
            console.error('Invalid tab index');
            return;
        }

        const panel = this.tabs[tabIndex].panel;
        
        if (typeof content === 'string') {
            panel.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            panel.innerHTML = '';
            panel.appendChild(content);
        } else {
            console.error('Content must be a string or HTMLElement');
        }
    }

    /**
     * Set content for the currently active tab
     * @param {string|HTMLElement} content - Content to set
     */
    setActiveTabContent(content) {
        this.setTabContent(this.activeTabIndex, content);
    }

    /**
     * Update the score for a specific tab
     * @param {number} tabIndex - Index of the tab
     * @param {number} score - New score for this tab
     */
    updateTabScore(tabIndex, score) {
        if (tabIndex < 0 || tabIndex >= this.tabs.length) {
            console.error('Invalid tab index');
            return;
        }

        const tab = this.tabs[tabIndex];
        tab.currentScore = Math.max(0, Math.min(score, tab.maxScore)); // Clamp between 0 and maxScore
        
        // Update the score display on the button
        const scoreSpan = tab.button.querySelector('.tab-score');
        if (scoreSpan) {
            scoreSpan.textContent = `(${tab.currentScore}/${tab.maxScore})`;
        }
        
        // Mark as completed if score equals max score
        if (tab.currentScore === tab.maxScore && tab.maxScore > 0) {
            tab.completed = true;
            tab.button.classList.add('completed');
        } else {
            tab.completed = false;
            tab.button.classList.remove('completed');
        }
        
        this.updateScoreDisplay();
    }

    /**
     * Mark a tab as completed
     * @param {number} tabIndex - Index of the tab to mark as completed
     * @param {number} score - Score achieved for this tab
     */
    markTabCompleted(tabIndex, score = null) {
        if (tabIndex < 0 || tabIndex >= this.tabs.length) {
            console.error('Invalid tab index');
            return;
        }

        const tab = this.tabs[tabIndex];
        const finalScore = score !== null ? score : tab.maxScore;
        
        this.updateTabScore(tabIndex, finalScore);
    }

    /**
     * Update the total score display
     */
    updateScoreDisplay() {
        this.totalScore = this.tabs.reduce((sum, tab) => sum + tab.currentScore, 0);
        
        if (this.scoreElement) {
            this.scoreElement.textContent = `(${this.totalScore}/${this.maxScore})`;
        }
    }

    /**
     * Get tab information
     * @param {number} tabIndex - Index of the tab
     * @returns {Object} Tab information object
     */
    getTabInfo(tabIndex) {
        if (tabIndex < 0 || tabIndex >= this.tabs.length) {
            console.error('Invalid tab index');
            return null;
        }
        return { ...this.tabs[tabIndex] };
    }

    /**
     * Get all tabs information
     * @returns {Array} Array of all tab information
     */
    getAllTabsInfo() {
        return this.tabs.map(tab => ({ ...tab }));
    }

    /**
     * Reset all tabs (remove completed status and scores)
     */
    resetAllTabs() {
        this.tabs.forEach(tab => {
            tab.completed = false;
            tab.currentScore = 0;
            tab.button.classList.remove('completed');
            
            // Reset the score display on the button
            const scoreSpan = tab.button.querySelector('.tab-score');
            if (scoreSpan) {
                scoreSpan.textContent = `(0/${tab.maxScore})`;
            }
        });
        this.updateScoreDisplay();
    }

    /**
     * Reset a specific tab
     * @param {number} tabIndex - Index of the tab to reset
     */
    resetTab(tabIndex) {
        if (tabIndex < 0 || tabIndex >= this.tabs.length) {
            console.error('Invalid tab index');
            return;
        }

        const tab = this.tabs[tabIndex];
        tab.completed = false;
        tab.currentScore = 0;
        tab.button.classList.remove('completed');
        
        // Reset the score display on the button
        const scoreSpan = tab.button.querySelector('.tab-score');
        if (scoreSpan) {
            scoreSpan.textContent = `(0/${tab.maxScore})`;
        }
        
        this.updateScoreDisplay();
    }
}

// Global instance
let exerciseTabManager;

/**
 * Example function to demonstrate the tab framework
 * Comment out the call to this function to disable the example
 */
function loadExampleTabs() {
    // Example usage - create 5 tabs with custom names and max scores
    exerciseTabManager.createTabs(5, 
        ['HTML Basics', 'CSS Styling', 'JavaScript Logic', 'Advanced Features', 'Final Project'], 
        [10, 15, 20, 25, 30]
    );
    
    // Add some sample content to demonstrate
    exerciseTabManager.setTabContent(0, '<h2>Oefening 1: HTML Basics</h2><p>Maak een eenvoudige HTML tabel...</p>');
    exerciseTabManager.setTabContent(1, '<h2>Oefening 2: CSS Styling</h2><p>Style de tabel met CSS...</p>');
    exerciseTabManager.setTabContent(2, '<h2>Oefening 3: JavaScript Logic</h2><p>Voeg interactiviteit toe...</p>');
    exerciseTabManager.setTabContent(3, '<h2>Oefening 4: Advanced Features</h2><p>Implementeer geavanceerde functies...</p>');
    exerciseTabManager.setTabContent(4, '<h2>Oefening 5: Final Project</h2><p>Combineer alles in een eindproject...</p>');
    
    // Example of how other scripts can update scores:
    // exerciseTabManager.updateTabScore(0, 8); // Update tab 1 to 8/10
    // exerciseTabManager.updateTabScore(1, 15); // Complete tab 2 (15/15)
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // exerciseTabManager = new ExerciseTabManager();
    
    // Load example tabs - comment out this line to disable the example
    // loadExampleTabs();
});

// Export for use in other scripts
window.exerciseTabManager = exerciseTabManager;
