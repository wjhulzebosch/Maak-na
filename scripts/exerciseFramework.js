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
    }

    /**
     * Initialize an exercise with custom configuration
     * @param {Object} config - Exercise configuration
     */
    initExercise(config) {
        this.exerciseConfig = config;
        this.setupElements();
        this.setupEventListeners();
        this.loadExercise();
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
     * Reset the current exercise
     */
    resetExercise() {
        if (!this.currentExercise) return;

        this.inputElement.value = this.currentExercise.initial || '';
        this.updatePreview();
        this.clearFeedback();
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
