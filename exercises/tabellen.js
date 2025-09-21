/**
 * Tabellen Exercise - HTML Table exercises
 */

const tabellenConfig = {
    exercises: [
        {
            id: 1,
            tab: "Basis Tabellen",
            initial: '<table>\n  <tr>\n    <td>___</td>\n    <td>Blue</td>\n  </tr>\n  <tr>\n    <td>Red</td>\n    <td>___</td>\n  </tr>\n</table>',
            solution: '<table>\n  <tr>\n    <td>Red</td>\n    <td>Blue</td>\n  </tr>\n  <tr>\n    <td>Red</td>\n    <td>Blue</td>\n  </tr>\n</table>',
            placeholder: 'Vul de ontbrekende kleuren in...'
        },
        {
            id: 2,
            tab: "Basis Tabellen",
            initial: '<table>\n  <tr>\n    <th>___</th>\n    <th>Blue</th>\n  </tr>\n  <tr>\n    <td>Red</td>\n    <td>___</td>\n  </tr>\n</table>',
            solution: '<table>\n  <tr>\n    <th>Red</th>\n    <th>Blue</th>\n  </tr>\n  <tr>\n    <td>Red</td>\n    <td>Blue</td>\n  </tr>\n</table>',
            placeholder: 'Vul de ontbrekende headers en cellen in...'
        },
        {
            id: 3,
            tab: "Advanced Tabellen",
            initial: '<table>\n  <tr>\n    <th>___</th>\n    <th>Blue</th>\n  </tr>\n  <tr>\n    <td>Red</td>\n    <td>___</td>\n  </tr>\n</table>',
            solution: '<table>\n  <tr>\n    <th>Red</th>\n    <th>Blue</th>\n  </tr>\n  <tr>\n    <td>Red</td>\n    <td>Blue</td>\n  </tr>\n</table>',
            placeholder: 'Vul de ontbrekende headers en cellen in...'
        }

    ],

    /**
     * Process HTML input - basic validation and parsing
     */
    inputProcessor: function(htmlInput) {
        // Clean up the input
        const cleaned = htmlInput.trim();
        
        // Basic HTML validation
        if (!cleaned.includes('<table>') || !cleaned.includes('</table>')) {
            return { valid: false, error: 'HTML moet een tabel bevatten' };
        }

        return { valid: true, html: cleaned };
    },

    /**
     * Update preview with HTML table
     */
    previewUpdater: function(processedResult, previewElement) {
        if (!processedResult || !processedResult.valid) {
            previewElement.innerHTML = `<p style="color: red;">${processedResult?.error || 'Geen geldige invoer'}</p>`;
            return;
        }

        // Create a safe preview
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = processedResult.html;
        
        // Find the table and clone it
        const table = tempDiv.querySelector('table');
        if (table) {
            previewElement.innerHTML = '';
            previewElement.appendChild(table.cloneNode(true));
        } else {
            previewElement.innerHTML = '<p style="color: red;">Geen geldige tabel gevonden</p>';
        }
    },

    /**
     * Update example display
     */
    exampleUpdater: function(exercise, exampleElement) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = exercise.solution;
        const table = tempDiv.querySelector('table');
        
        if (table) {
            exampleElement.innerHTML = '';
            exampleElement.appendChild(table.cloneNode(true));
        }
    },

    /**
     * Validate the answer
     */
    validator: function(processedResult, exercise) {
        if (!processedResult || !processedResult.valid) {
            return { isCorrect: false };
        }

        // Simple comparison - in real implementation you'd want more sophisticated checking
        const userHTML = processedResult.html.replace(/\s+/g, ' ').trim();
        const solutionHTML = exercise.solution.replace(/\s+/g, ' ').trim();

        if (userHTML === solutionHTML) {
            return { isCorrect: true, score: 1 };
        } else {
            // Check for case-insensitive match
            if (userHTML.toLowerCase() === solutionHTML.toLowerCase()) {
                return { isCorrect: true, score: 1, message: 'Correct, maar let op hoofdletters!' };
            }
            return { isCorrect: false };
        }
    },

    /**
     * Create HTML for a single exercise
     */
    createExerciseHTML: function(exercise, tabIndex, exerciseIndex) {
        const questionNumber = `${tabIndex + 1}.${exerciseIndex + 1}`;
        return `
            <div class="question-container">
                <div><h3>Vraag ${questionNumber}</h3></div>
                <div class="question-area">
                    <div class="input-area">
                        <h3>Jouw Code</h3>
                        <textarea id="htmlInput${exercise.id}" class="code-input" placeholder="${exercise.placeholder || 'Schrijf hier je HTML code...'}"></textarea>
                        <button class="reset-button" onclick="resetTextarea(${exercise.id})">Reset</button>
                    </div>
                    <div class="preview-area">
                        <h3>Preview</h3>
                        <div class="preview-content" id="htmlPreview${exercise.id}"></div>
                    </div>
                    <div class="example-area">
                        <h3>Voorbeeld</h3>
                        <div class="example-content" id="htmlExample${exercise.id}"></div>
                    </div>
                    <div class="feedback-area">
                        <h3>Feedback</h3>
                        <div class="feedback-content" id="feedback${exercise.id}"></div>
                    </div>
                </div>
            </div>
        `;
    }
};

// Initialize function
tabellenConfig.init = function() {
    const exerciseTitle = 'HTML Tabellen';
    
    // Group exercises by tab
    const tabGroups = {};
    this.exercises.forEach(exercise => {
        if (!tabGroups[exercise.tab]) {
            tabGroups[exercise.tab] = [];
        }
        tabGroups[exercise.tab].push(exercise);
    });
    
    // Create tabs based on tab groups
    const tabNames = Object.keys(tabGroups);
    const tabCounts = Object.values(tabGroups).map(group => group.length);
    
    console.log('Tab groups:', tabGroups);
    console.log('Tab names:', tabNames);
    console.log('Tab counts:', tabCounts);
    
    exerciseTabManager.createTabs(tabNames.length, tabNames, tabCounts);
    
    // Create content for each tab
    Object.keys(tabGroups).forEach((tabName, tabIndex) => {
        const exercisesInTab = tabGroups[tabName];
        
        // Create HTML for all exercises in this tab
        const exercisesHTML = exercisesInTab.map((exercise, exerciseIndex) => 
            this.createExerciseHTML(exercise, tabIndex, exerciseIndex)
        ).join('');
        
        const content = `
            <div class="excercise-explanation">
                <h2>${exerciseTitle} - ${tabName}</h2>
                <p>Deze tab bevat ${exercisesInTab.length} oefening(en).</p>
            </div>
            <div class="tab-panel active">
                ${exercisesHTML}
            </div>
        `;
        
        exerciseTabManager.setTabContent(tabIndex, content);
    });
    
    // Initialize each exercise individually
    setTimeout(() => {
        this.exercises.forEach(exercise => {
            // Set example table
            const exampleDiv = document.getElementById(`htmlExample${exercise.id}`);
            if (exampleDiv) {
                exampleDiv.innerHTML = exercise.solution;
            }
            
            // Set initial template
            const textarea = document.getElementById(`htmlInput${exercise.id}`);
            if (textarea) {
                textarea.value = exercise.initial || '';
                
                // Live preview and feedback
                function updatePreviewAndFeedback() {
                    const input = textarea.value;
                    const previewDiv = document.getElementById(`htmlPreview${exercise.id}`);
                    
                    if (previewDiv) {
                        previewDiv.innerHTML = input;
                    }
                    
                    // Check if HTML matches solution (ignore all whitespace)
                    const normalizedInput = input.replace(/\s/g, '');
                    const normalizedSolution = exercise.solution.replace(/\s/g, '');
                    
                    const feedbackDiv = document.getElementById(`feedback${exercise.id}`);
                    if (feedbackDiv) {
                        if (normalizedInput === normalizedSolution) {
                            feedbackDiv.innerHTML = '<span class="party-check">&#10003;</span>';
                            // Mark this exercise as completed and update tab score
                            updateTabScoreForExercise(exercise);
                        } else {
                            // Check if correct when ignoring case
                            const normalizedInputLower = normalizedInput.toLowerCase();
                            const normalizedSolutionLower = normalizedSolution.toLowerCase();
                            if (normalizedInputLower === normalizedSolutionLower) {
                                feedbackDiv.innerHTML = 'Let op hoofd- en kleine letters';
                                // Mark this exercise as completed and update tab score
                                updateTabScoreForExercise(exercise);
                            } else {
                                feedbackDiv.innerHTML = '';
                                // Mark this exercise as not completed
                                markExerciseAsIncomplete(exercise);
                            }
                        }
                    }
                }
                
                textarea.addEventListener('input', updatePreviewAndFeedback);
                updatePreviewAndFeedback();
            }
        });
    }, 100);
};

// Track completed exercises
const completedExercises = new Set();

// Update tab score when exercise is completed
function updateTabScoreForExercise(exercise) {
    if (!completedExercises.has(exercise.id)) {
        completedExercises.add(exercise.id);
        
        // Find which tab this exercise belongs to
        const tabGroups = {};
        tabellenConfig.exercises.forEach(ex => {
            if (!tabGroups[ex.tab]) {
                tabGroups[ex.tab] = [];
            }
            tabGroups[ex.tab].push(ex);
        });
        
        // Find the tab index for this exercise
        const tabNames = Object.keys(tabGroups);
        let tabIndex = -1;
        for (let i = 0; i < tabNames.length; i++) {
            if (tabGroups[tabNames[i]].some(ex => ex.id === exercise.id)) {
                tabIndex = i;
                break;
            }
        }
        
        if (tabIndex >= 0 && exerciseTabManager) {
            // Count completed exercises in this tab
            const exercisesInTab = tabGroups[tabNames[tabIndex]];
            const completedInTab = exercisesInTab.filter(ex => completedExercises.has(ex.id)).length;
            
            // Update the tab score
            exerciseTabManager.updateTabScore(tabIndex, completedInTab);
        }
    }
}

// Mark exercise as incomplete
function markExerciseAsIncomplete(exercise) {
    if (completedExercises.has(exercise.id)) {
        completedExercises.delete(exercise.id);
        
        // Find which tab this exercise belongs to and update score
        const tabGroups = {};
        tabellenConfig.exercises.forEach(ex => {
            if (!tabGroups[ex.tab]) {
                tabGroups[ex.tab] = [];
            }
            tabGroups[ex.tab].push(ex);
        });
        
        const tabNames = Object.keys(tabGroups);
        let tabIndex = -1;
        for (let i = 0; i < tabNames.length; i++) {
            if (tabGroups[tabNames[i]].some(ex => ex.id === exercise.id)) {
                tabIndex = i;
                break;
            }
        }
        
        if (tabIndex >= 0 && exerciseTabManager) {
            const exercisesInTab = tabGroups[tabNames[tabIndex]];
            const completedInTab = exercisesInTab.filter(ex => completedExercises.has(ex.id)).length;
            exerciseTabManager.updateTabScore(tabIndex, completedInTab);
        }
    }
}

// Reset function for individual exercises
function resetTextarea(assignmentId) {
    const exercise = tabellenConfig.exercises.find(a => a.id === assignmentId);
    if (!exercise) return;
    
    const textarea = document.getElementById(`htmlInput${assignmentId}`);
    if (!textarea) return;
    
    textarea.value = exercise.initial || '';
    
    // Mark as incomplete when reset
    markExerciseAsIncomplete(exercise);
    
    // Trigger the input event to update preview and feedback
    textarea.dispatchEvent(new Event('input'));
}

// Export for use
window.tabellenConfig = tabellenConfig;
window.resetTextarea = resetTextarea;