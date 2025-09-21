/**
 * Exercise Framework
 * Handles different types of exercises with custom input processing
 */

class ExerciseFramework {
    constructor() {
        this.currentExercise = null;
        this.exerciseConfig = null;
        this.inputElement = null;
        this.previewElement = null;
        this.exampleElement = null;
        this.feedbackElement = null;
        this.completedExercises = new Set();
    }

    /**
     * Initialize exercises from configuration
     * @param {Object} config - Exercise configuration
     */
    initExercise(config) {
        this.exerciseConfig = config;
        
        // Update main title with exercise title
        const mainTitle = document.getElementById('mainTitle');
        if (mainTitle && config.title) {
            // Calculate total number of exercises
            const totalExercises = config.exercises ? config.exercises.length : 0;
            mainTitle.innerHTML = config.title + ' <span id="totalScore">(0/' + totalExercises + ')</span>';
        }
        
        this.initializeAllExercises();
    }

    /**
     * Initialize all exercises in the configuration
     */
    initializeAllExercises() {
        if (!this.exerciseConfig || !this.exerciseConfig.exercises) return;

        // Group exercises by tab
        const tabGroups = {};
        this.exerciseConfig.exercises.forEach(exercise => {
            if (!tabGroups[exercise.tab]) {
                tabGroups[exercise.tab] = [];
            }
            tabGroups[exercise.tab].push(exercise);
        });

        // Always add "Uitleg" tab as last tab
        const tabKeys = [...Object.keys(tabGroups), 'uitleg'];
        const tabNames = [...Object.keys(tabGroups).map(tabKey => this.exerciseConfig.tabs[tabKey].name), '<span style="color: green;">?</span> Uitleg'];
        const exerciseCounts = [...Object.values(tabGroups).map(group => group.length), 0];
        
        exerciseTabManager.createTabs(tabNames.length, tabNames, exerciseCounts);

        // Create content for each tab
        tabKeys.forEach((tabKey, tabIndex) => {
            if (tabKey === 'uitleg') {
                // Load HTML content for Uitleg tab
                this.loadUitlegTabContent(tabIndex);
            } else {
                const exercisesInTab = tabGroups[tabKey];
                const tabInfo = this.exerciseConfig.tabs[tabKey];
                
                // Create HTML for all exercises in this tab
                const exercisesHTML = exercisesInTab.map((exercise, exerciseIndex) => 
                    this.createExerciseHTML(exercise, tabIndex, exerciseIndex)
                ).join('');
                
                const content = `
                    <div class="excercise-explanation">
                        <h2>${tabInfo.name}</h2>
                        <p>${tabInfo.instructions}</p>
                    </div>
                    <div class="tab-panel active">
                        ${exercisesHTML}
                    </div>
                `;
                
                exerciseTabManager.setTabContent(tabIndex, content);
            }
        });

        // Initialize each exercise
        setTimeout(() => {
            this.exerciseConfig.exercises.forEach(exercise => {
                this.initializeSingleExercise(exercise);
            });
        }, 100);
    }

    /**
     * Create HTML for a single exercise
     */
    createExerciseHTML(exercise, tabIndex, exerciseIndex) {
        const questionNumber = `${tabIndex + 1}.${exerciseIndex + 1}`;
        
        // Check if this exercise uses separate input fields
        if (exercise.inputType === 'fields') {
            return this.createFieldsHTML(exercise, questionNumber);
        } else {
            return this.createTextareaHTML(exercise, questionNumber);
        }
    }

    /**
     * Create HTML for textarea-based exercises
     */
    createTextareaHTML(exercise, questionNumber) {
        return `
            <div class="question-container">
                <div><h3>Vraag ${questionNumber}</h3></div>
                <div class="question-area">
                    <div class="input-area">
                        <h3>Jouw Code</h3>
                        <textarea id="htmlInput${exercise.id}" class="code-input" placeholder="${exercise.placeholder || 'Schrijf hier je code...'}"></textarea>
                        <button class="reset-button" onclick="exerciseFramework.resetExercise(${exercise.id})">Reset</button>
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

    /**
     * Create HTML for separate input fields (CSS box model)
     */
    createFieldsHTML(exercise, questionNumber) {
        const fields = exercise.fields || ['width', 'height', 'margin', 'padding', 'border'];
        const fieldLabels = exercise.fieldLabels || {};

        const fieldsHTML = fields.map(field => `
            <label data-label="${fieldLabels[field] || field + ':'}">
                <input type="text" id="${field}${exercise.id}" class="field-input" placeholder="bijv. 100px">
            </label>
        `).join('');

        return `
            <div class="question-container">
                <div><h3>Vraag ${questionNumber}</h3></div>
                <div class="question-area">
                    <div class="input-area">
                        <h3>Jouw CSS Eigenschappen</h3>
                        <div class="fields-container">
                            ${fieldsHTML}
                        </div>
                        <input type="hidden" id="htmlInput${exercise.id}">
                        <button class="reset-button" onclick="exerciseFramework.resetExercise(${exercise.id})">Reset</button>
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

    /**
     * Load HTML content for Uitleg tab
     */
    loadUitlegTabContent(tabIndex) {
        // Get exercise type from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const exerciseType = urlParams.get('exercise');
        const htmlFileName = `exercises/${exerciseType}.html`;
        
        fetch(htmlFileName)
            .then(response => response.text())
            .then(html => {
                const content = `
                    <div class="excercise-explanation">
                        <h2>Uitleg</h2>
                    </div>
                    <div class="tab-panel active">
                        <div class="html-content">
                            ${html}
                        </div>
                    </div>
                `;
                exerciseTabManager.setTabContent(tabIndex, content);
            })
            .catch(error => {
                const content = `
                    <div class="excercise-explanation">
                        <h2>${this.exerciseConfig.title || 'Oefeningen'} - Uitleg</h2>
                    </div>
                    <div class="tab-panel active">
                        <p>Geen uitleg beschikbaar</p>
                    </div>
                `;
                exerciseTabManager.setTabContent(tabIndex, content);
            });
    }

    /**
     * Initialize a single exercise
     */
    initializeSingleExercise(exercise) {
        // Set example content based on exercise type
        const exampleDiv = document.getElementById(`htmlExample${exercise.id}`);
        if (exampleDiv) {
            if (exercise.type === 'html') {
                // Render HTML solution
                this.renderHTMLContent(exercise.solution, exampleDiv);
            } else if (exercise.type === 'css') {
                // Check if exercise config has custom example updater
                if (this.exerciseConfig.customExampleUpdater) {
                    const handled = this.exerciseConfig.customExampleUpdater(exercise, exampleDiv, exercise.solution);
                    if (!handled) {
                        // Fall back to default CSS rendering
                        this.renderCSSExample(exercise.html, exercise.solution, exampleDiv);
                    }
                } else {
                    // Use default CSS rendering
                    this.renderCSSExample(exercise.html, exercise.solution, exampleDiv);
                }
            } else {
                // Default: just set as text
                exampleDiv.innerHTML = exercise.solution;
            }
        }
        
        // Initialize input based on input type
        if (exercise.inputType === 'fields') {
            this.initializeFieldsInput(exercise);
        } else {
            this.initializeTextareaInput(exercise);
        }
    }

    /**
     * Initialize textarea input
     */
    initializeTextareaInput(exercise) {
        const textarea = document.getElementById(`htmlInput${exercise.id}`);
        if (textarea) {
            textarea.value = exercise.initial || '';
            
            // Add event listener for input changes
            textarea.addEventListener('input', () => {
                this.handleExerciseInput(exercise);
            });
            
            // Initial update
            this.handleExerciseInput(exercise);
        }
    }

    /**
     * Initialize separate input fields
     */
    initializeFieldsInput(exercise) {
        const fields = exercise.fields || ['width', 'height', 'margin', 'padding', 'border'];
        const hiddenInput = document.getElementById(`htmlInput${exercise.id}`);
        
        // Set initial values from exercise.initial
        if (exercise.initial && typeof exercise.initial === 'object') {
            fields.forEach(field => {
                const fieldElement = document.getElementById(`${field}${exercise.id}`);
                if (fieldElement && exercise.initial[field]) {
                    fieldElement.value = exercise.initial[field];
                }
            });
        }
        
        // Function to update hidden input with combined CSS
        const updateHiddenInput = () => {
            let css = '';
            fields.forEach(field => {
                const fieldElement = document.getElementById(`${field}${exercise.id}`);
                if (fieldElement && fieldElement.value.trim()) {
                    css += `${field}: ${fieldElement.value.trim()}; `;
                }
            });
            if (hiddenInput) {
                // Wrap in a selector for proper CSS rendering
                const wrappedCSS = css.trim() ? `.test-box { ${css.trim()} }` : '';
                hiddenInput.value = wrappedCSS;
            }
            this.handleExerciseInput(exercise);
        };
        
        // Add event listeners to all fields
        fields.forEach(field => {
            const fieldElement = document.getElementById(`${field}${exercise.id}`);
            if (fieldElement) {
                fieldElement.addEventListener('input', updateHiddenInput);
            }
        });
        
        // Initial update
        updateHiddenInput();
    }

    /**
     * Render HTML content safely
     */
    renderHTMLContent(htmlContent, targetElement) {
        // Create a temporary container to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        // Find the table and clone it
        const table = tempDiv.querySelector('table');
        if (table) {
            targetElement.innerHTML = '';
            targetElement.appendChild(table.cloneNode(true));
        } else {
            targetElement.innerHTML = htmlContent;
        }
    }

    /**
     * Render CSS example (HTML with CSS applied)
     */
    renderCSSExample(htmlContent, cssContent, targetElement) {
        // Create a unique ID for this example to avoid CSS conflicts
        const exampleId = `example-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create a container for the HTML
        const container = document.createElement('div');
        container.id = exampleId;
        container.innerHTML = htmlContent;
        
        // Create scoped CSS by prefixing all selectors with the example ID
        const scopedCSS = this.scopeCSS(cssContent, `#${exampleId}`);
        
        // Create a style element with the scoped CSS
        const style = document.createElement('style');
        style.textContent = scopedCSS;
        
        // Clear target and add style + content
        targetElement.innerHTML = '';
        targetElement.appendChild(style);
        targetElement.appendChild(container);
    }

    /**
     * Render CSS preview (HTML with user CSS applied)
     */
    renderCSSPreview(htmlContent, cssContent, targetElement) {
        // Create a unique ID for this preview to avoid CSS conflicts
        const previewId = `preview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create a container for the HTML
        const container = document.createElement('div');
        container.id = previewId;
        container.innerHTML = htmlContent;
        
        // Create scoped CSS by prefixing all selectors with the preview ID
        const scopedCSS = this.scopeCSS(cssContent, `#${previewId}`);
        
        // Create a style element with the scoped CSS
        const style = document.createElement('style');
        style.textContent = scopedCSS;
        
        // Clear target and add style + content
        targetElement.innerHTML = '';
        targetElement.appendChild(style);
        targetElement.appendChild(container);
    }

    /**
     * Scope CSS to a specific selector to avoid conflicts
     */
    scopeCSS(css, scopeSelector) {
        // Simple CSS scoping - prefix all selectors with the scope
        return css.replace(/([^{}]+){/g, (match, selector) => {
            const trimmedSelector = selector.trim();
            if (trimmedSelector.startsWith('@')) {
                // Don't scope at-rules like @media
                return match;
            }
            return `${scopeSelector} ${trimmedSelector} {`;
        });
    }

    /**
     * Handle input for a specific exercise
     */
    handleExerciseInput(exercise) {
        const textarea = document.getElementById(`htmlInput${exercise.id}`);
        const previewDiv = document.getElementById(`htmlPreview${exercise.id}`);
        const feedbackDiv = document.getElementById(`feedback${exercise.id}`);
        
        if (!textarea || !previewDiv || !feedbackDiv) return;

        const input = textarea.value;
        
        // Update preview based on exercise type
        if (exercise.type === 'html') {
            this.renderHTMLContent(input, previewDiv);
        } else if (exercise.type === 'css') {
            // Check if exercise config has custom preview updater
            if (this.exerciseConfig.customPreviewUpdater) {
                const handled = this.exerciseConfig.customPreviewUpdater(exercise, previewDiv, input);
                if (!handled) {
                    // Fall back to default CSS rendering
                    this.renderCSSPreview(exercise.html, input, previewDiv);
                }
            } else {
                // Use default CSS rendering
                this.renderCSSPreview(exercise.html, input, previewDiv);
            }
        } else {
            previewDiv.innerHTML = input;
        }
        
        // Check if exercise has custom input processor
        let processedResult;
        if (this.exerciseConfig.customInputProcessor) {
            processedResult = this.exerciseConfig.customInputProcessor(input);
        } else {
            // Default input processing
            processedResult = this.defaultInputProcessor(input, exercise);
        }
        
        // Check if exercise has custom validator
        let validationResult;
        if (this.exerciseConfig.customValidator) {
            validationResult = this.exerciseConfig.customValidator(processedResult, exercise);
        } else {
            // Default validation
            validationResult = this.defaultValidator(processedResult, exercise);
        }
        
        // Update feedback and scoring
        this.updateExerciseFeedback(exercise, validationResult);
    }

    /**
     * Default input processor
     */
    defaultInputProcessor(input, exercise) {
        const cleaned = input.trim();
        
        // Handle different exercise types
        if (exercise.type === 'html') {
            return this.processHTMLInput(cleaned);
        } else if (exercise.type === 'css') {
            return this.processCSSInput(cleaned);
        }
        
        // Default processing
        return { valid: true, content: cleaned };
    }

    /**
     * Process HTML input
     */
    processHTMLInput(input) {
        // Basic HTML validation - check for valid HTML structure
        if (!input.includes('<') || !input.includes('>')) {
            return { valid: false, error: 'HTML moet geldige tags bevatten' };
        }

        // Check for basic HTML structure (opening and closing tags)
        const openTags = (input.match(/</g) || []).length;
        const closeTags = (input.match(/>/g) || []).length;
        
        if (openTags === 0 || closeTags === 0) {
            return { valid: false, error: 'HTML moet geldige opening en closing tags bevatten' };
        }

        return { valid: true, content: input };
    }

    /**
     * Process CSS input
     */
    processCSSInput(input) {
        // Basic CSS validation
        if (!input.trim()) {
            return { valid: false, error: 'CSS mag niet leeg zijn' };
        }

        // Check for basic CSS syntax (contains selectors and properties)
        if (!input.includes('{') || !input.includes('}')) {
            return { valid: false, error: 'CSS moet geldige selectors en properties bevatten' };
        }

        return { valid: true, content: input };
    }

    /**
     * Default validator
     */
    defaultValidator(processedResult, exercise) {
        if (!processedResult || !processedResult.valid) {
            return { isCorrect: false };
        }

        // Normalize both inputs (remove all whitespace)
        const normalizedInput = processedResult.content.replace(/\s/g, '');
        const normalizedSolution = exercise.solution.replace(/\s/g, '');

        if (normalizedInput === normalizedSolution) {
            return { isCorrect: true, score: 1 };
        }

        // Check if correct when ignoring case
        const normalizedInputLower = normalizedInput.toLowerCase();
        const normalizedSolutionLower = normalizedSolution.toLowerCase();
        if (normalizedInputLower === normalizedSolutionLower) {
            return { isCorrect: true, score: 1, message: 'Correct! Let op hoofd- en kleine letters.' };
        }

        return { isCorrect: false };
    }

    /**
     * Update exercise feedback and scoring
     */
    updateExerciseFeedback(exercise, validationResult) {
        const feedbackDiv = document.getElementById(`feedback${exercise.id}`);
        if (!feedbackDiv) return;

        if (validationResult.isCorrect) {
            feedbackDiv.innerHTML = '<span class="party-check">&#10003;</span>';
            if (validationResult.message) {
                feedbackDiv.innerHTML += `<p style="color: #28a745; margin-top: 10px;">${validationResult.message}</p>`;
            }
            this.markExerciseCompleted(exercise);
        } else {
            feedbackDiv.innerHTML = '';
            this.markExerciseIncomplete(exercise);
        }
    }

    /**
     * Mark exercise as completed and update tab score
     */
    markExerciseCompleted(exercise) {
        if (!this.completedExercises.has(exercise.id)) {
            this.completedExercises.add(exercise.id);
            this.updateTabScore(exercise);
        }
    }

    /**
     * Mark exercise as incomplete and update tab score
     */
    markExerciseIncomplete(exercise) {
        if (this.completedExercises.has(exercise.id)) {
            this.completedExercises.delete(exercise.id);
            this.updateTabScore(exercise);
        }
    }

    /**
     * Update tab score based on completed exercises
     */
    updateTabScore(exercise) {
        // Find which tab this exercise belongs to
        const tabGroups = {};
        this.exerciseConfig.exercises.forEach(ex => {
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
            const completedInTab = exercisesInTab.filter(ex => this.completedExercises.has(ex.id)).length;
            exerciseTabManager.updateTabScore(tabIndex, completedInTab);
        }
        
        // Update main title score
        this.updateMainTitleScore();
    }
    
    /**
     * Update the main title score display
     */
    updateMainTitleScore() {
        const mainTitle = document.getElementById('mainTitle');
        const scoreElement = document.getElementById('totalScore');
        if (mainTitle && scoreElement && this.exerciseConfig) {
            const totalExercises = this.exerciseConfig.exercises ? this.exerciseConfig.exercises.length : 0;
            const completedExercises = this.completedExercises.size;
            scoreElement.textContent = `(${completedExercises}/${totalExercises})`;
        }
    }

    /**
     * Reset a specific exercise
     */
    resetFieldsExercise(exerciseId, exercise) {
        const fields = exercise.fields || ['width', 'height', 'margin', 'padding', 'border'];
        fields.forEach(field => {
            const fieldElement = document.getElementById(`${field}${exerciseId}`);
            if (fieldElement) {
                if (exercise.initial && typeof exercise.initial === 'object') {
                    fieldElement.value = exercise.initial[field] || '';
                } else {
                    fieldElement.value = '';
                }
                // Trigger input event to update preview
                fieldElement.dispatchEvent(new Event('input'));
            } else {
            }
        });
    }

    resetTextareaExercise(exerciseId, exercise) {
        const textarea = document.getElementById(`htmlInput${exerciseId}`);
        if (textarea) {
            textarea.value = exercise.initial || '';
        }
    }

    /**
     * Setup DOM elements
     */
    setupElements() {
        this.inputElement = document.querySelector('.code-input');
        this.previewElement = document.querySelector('.preview-content');
        this.exampleElement = document.querySelector('.example-content');
        this.feedbackElement = document.querySelector('.feedback-content');
        
        if (!this.inputElement || !this.previewElement || !this.exampleElement || !this.feedbackElement) {
            console.error('Required exercise elements not found');
            return;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Input change listener
        this.inputElement.addEventListener('input', () => {
            this.handleInputChange();
        });

        // Reset button listener
        const resetButton = document.querySelector('.reset-button');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetExercise();
            });
        }
    }

    /**
     * Load the current exercise
     */
    loadExercise() {
        if (!this.exerciseConfig || !this.exerciseConfig.exercises) return;

        this.currentExercise = this.exerciseConfig.exercises[0]; // Start with first exercise
        this.displayExercise();
    }

    /**
     * Display the current exercise
     */
    displayExercise() {
        if (!this.currentExercise) return;

        // Set input value
        this.inputElement.value = this.currentExercise.initial || '';
        this.inputElement.placeholder = this.currentExercise.placeholder || '';

        // Update preview with initial value
        this.handleInputChange();

        // Update example
        this.updateExample();

        // Clear feedback
        this.clearFeedback();
    }

    /**
     * Handle input changes
     */
    handleInputChange() {
        const inputValue = this.inputElement.value;
        
        if (this.exerciseConfig.inputProcessor) {
            const processedResult = this.exerciseConfig.inputProcessor(inputValue);
            this.updatePreview(processedResult);
            this.checkAnswer();
        } else {
            this.updatePreview(inputValue);
            this.checkAnswer();
        }
    }

    /**
     * Update the preview area
     * @param {*} processedResult - Processed input result
     */
    updatePreview(processedResult = null) {
        if (!this.previewElement) return;

        if (this.exerciseConfig.previewUpdater) {
            this.exerciseConfig.previewUpdater(processedResult, this.previewElement);
        } else {
            // Default: just display the raw input
            this.previewElement.innerHTML = this.inputElement.value;
        }
    }

    /**
     * Update the example area
     */
    updateExample() {
        if (!this.exampleElement || !this.currentExercise) return;

        if (this.exerciseConfig.exampleUpdater) {
            this.exerciseConfig.exampleUpdater(this.currentExercise, this.exampleElement);
        } else {
            // Default: display solution
            this.exampleElement.innerHTML = this.currentExercise.solution || '';
        }
    }

    /**
     * Check if the current answer is correct
     */
    checkAnswer() {
        if (!this.currentExercise || !this.exerciseConfig.validator) return false;

        const inputValue = this.inputElement.value;
        const processedResult = this.exerciseConfig.inputProcessor ? 
            this.exerciseConfig.inputProcessor(inputValue) : inputValue;

        const result = this.exerciseConfig.validator(processedResult, this.currentExercise);
        
        if (result.isCorrect) {
            this.showSuccess(result.message);
            return result.score || 1;
        } else {
            this.clearFeedback();
            return 0;
        }
    }

    /**
     * Show success feedback
     */
    showSuccess(customMessage) {
        if (!this.feedbackElement) return;

        const message = customMessage || 'Correct! Goed gedaan!';
        this.feedbackElement.innerHTML = `
            <div class="party-check">✓</div>
            <p style="color: #28a745; font-weight: bold; margin-top: 10px;">${message}</p>
        `;
        
        // Mark current tab as completed and update score
        const currentTabIndex = exerciseTabManager.activeTabIndex;
        const currentTab = exerciseTabManager.tabs[currentTabIndex];
        if (currentTab) {
            currentTab.button.classList.add('completed');
            // Update the tab score to 1
            exerciseTabManager.updateTabScore(currentTabIndex, 1);
        }
    }

    /**
     * Show error feedback
     */
    showError(message) {
        if (!this.feedbackElement) return;

        this.feedbackElement.innerHTML = `
            <p style="color: #f44336; font-weight: bold;">${message}</p>
        `;
    }

    /**
     * Clear feedback
     */
    clearFeedback() {
        if (!this.feedbackElement) return;
        this.feedbackElement.innerHTML = '';
    }

    /**
     * Reset a specific exercise by ID
     */
    resetExercise(exerciseId) {
        const exercise = this.exerciseConfig?.exercises?.find(ex => ex.id === exerciseId);
        if (!exercise) return;

        // Call appropriate reset function based on input type
        if (exercise.inputType === 'fields') {
            this.resetFieldsExercise(exerciseId, exercise);
        } else {
            this.resetTextareaExercise(exerciseId, exercise);
        }

        // Clear feedback
        const feedbackDiv = document.getElementById(`feedback${exerciseId}`);
        if (feedbackDiv) {
            feedbackDiv.innerHTML = '';
        }

        // Mark exercise as incomplete
        this.markExerciseIncomplete(exercise);

        // Trigger input handling to update preview
        this.handleExerciseInput(exercise);
    }

    /**
     * Move to next exercise
     */
    nextExercise() {
        if (!this.exerciseConfig || !this.exerciseConfig.exercises) return;

        const currentIndex = this.exerciseConfig.exercises.indexOf(this.currentExercise);
        if (currentIndex < this.exerciseConfig.exercises.length - 1) {
            this.currentExercise = this.exerciseConfig.exercises[currentIndex + 1];
            this.displayExercise();
        }
    }

    /**
     * Move to previous exercise
     */
    previousExercise() {
        if (!this.exerciseConfig || !this.exerciseConfig.exercises) return;

        const currentIndex = this.exerciseConfig.exercises.indexOf(this.currentExercise);
        if (currentIndex > 0) {
            this.currentExercise = this.exerciseConfig.exercises[currentIndex - 1];
            this.displayExercise();
        }
    }

    /**
     * Get current exercise info
     */
    getCurrentExercise() {
        return this.currentExercise;
    }
}

// Global instance
window.exerciseFramework = new ExerciseFramework();
