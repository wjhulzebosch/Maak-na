/**
 * Boxjes Exercise - CSS Box Model exercises
 */

const boxjesConfig = {
    exercises: [
        {
            id: 1,
            title: "Eenvoudige box",
            description: "Maak een box van 100px breed en 50px hoog",
            initial: 'width: ; height: ;',
            solution: 'width: 100px; height: 50px;',
            placeholder: 'width: 100px; height: 50px;',
            maxScore: 5
        },
        {
            id: 2,
            title: "Box met border en padding",
            description: "Maak een box van 75px breed, 150px hoog, met 5px border en 10px padding",
            initial: 'width: ; height: ; border: ; padding: ;',
            solution: 'width: 75px; height: 150px; border: 5px; padding: 10px;',
            placeholder: 'width: 75px; height: 150px; border: 5px; padding: 10px;',
            maxScore: 8
        }
    ],

    /**
     * Parse CSS declarations from input
     */
    inputProcessor: function(cssInput) {
        const cssObj = {};
        const declarations = cssInput.split(';');
        
        declarations.forEach(decl => {
            const [prop, val] = decl.split(':').map(s => s && s.trim());
            if (prop && val) {
                cssObj[prop] = val;
            }
        });

        return cssObj;
    },

    /**
     * Update preview with CSS box model
     */
    previewUpdater: function(cssObj, previewElement) {
        if (!cssObj || typeof cssObj !== 'object') {
            previewElement.innerHTML = '<p style="color: #666;">Voer CSS in om preview te zien...</p>';
            return;
        }

        // Create the box model visualization
        const boxContainer = document.createElement('div');
        boxContainer.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        `;

        // Create the box with CSS properties
        const box = document.createElement('div');
        box.style.cssText = `
            background-color: #4CAF50;
            position: relative;
            ${this.buildCSSString(cssObj)}
        `;

        // Add box model layers if properties exist
        if (cssObj.border) {
            box.style.border = `${cssObj.border} solid #333`;
        }
        if (cssObj.padding) {
            box.style.padding = cssObj.padding;
        }
        if (cssObj.margin) {
            box.style.margin = cssObj.margin;
        }

        boxContainer.appendChild(box);
        previewElement.innerHTML = '';
        previewElement.appendChild(boxContainer);
    },

    /**
     * Build CSS string from object
     */
    buildCSSString: function(cssObj) {
        if (!cssObj || typeof cssObj !== 'object') {
            return '';
        }
        let cssString = '';
        Object.keys(cssObj).forEach(prop => {
            cssString += `${prop}: ${cssObj[prop]}; `;
        });
        return cssString;
    },

    /**
     * Update example display
     */
    exampleUpdater: function(exercise, exampleElement) {
        const boxContainer = document.createElement('div');
        boxContainer.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        `;

        const box = document.createElement('div');
        box.style.cssText = `
            background-color: #4CAF50;
            position: relative;
            ${this.buildCSSString(this.inputProcessor(exercise.solution))}
        `;

        // Add box model layers
        const cssObj = this.inputProcessor(exercise.solution);
        if (cssObj.border) {
            box.style.border = `${cssObj.border} solid #333`;
        }
        if (cssObj.padding) {
            box.style.padding = cssObj.padding;
        }
        if (cssObj.margin) {
            box.style.margin = cssObj.margin;
        }

        boxContainer.appendChild(box);
        exampleElement.innerHTML = '';
        exampleElement.appendChild(boxContainer);
    },

    /**
     * Validate the CSS answer
     */
    validator: function(cssObj, exercise) {
        const solutionObj = this.inputProcessor(exercise.solution);
        let score = 0;
        let totalProperties = Object.keys(solutionObj).length;

        // Check each property
        Object.keys(solutionObj).forEach(prop => {
            if (cssObj[prop] && cssObj[prop].trim() === solutionObj[prop].trim()) {
                score += 1;
            }
        });

        const isCorrect = score === totalProperties;
        const finalScore = isCorrect ? exercise.maxScore : Math.round((score / totalProperties) * exercise.maxScore);

        if (isCorrect) {
            return { isCorrect: true, score: finalScore };
        } else {
            return { 
                isCorrect: false, 
                message: `Correct: ${score}/${totalProperties} eigenschappen. Probeer opnieuw!`,
                score: finalScore
            };
        }
    }
};

// Initialize function
boxjesConfig.init = function() {
    const exerciseTitle = 'CSS Box Model';
    
    // Create tabs for the exercises
    const exerciseNames = this.exercises.map(ex => ex.title);
    const maxScores = this.exercises.map(ex => ex.maxScore);
    
    exerciseTabManager.createTabs(this.exercises.length, exerciseNames, maxScores);
    
    // Create content for each exercise tab
    this.exercises.forEach((exercise, index) => {
        const content = `
            <div class="excercise-explanation">
                <h2>${exerciseTitle} - ${exercise.title}</h2>
                <p>${exercise.description}</p>
            </div>
            <div class="tab-panel active">
                <div class="question-container">
                    <div class="input-area">
                        <h3>Jouw CSS</h3>
                        <textarea class="code-input" placeholder="${exercise.placeholder}"></textarea>
                        <button class="reset-button">Reset</button>
                    </div>
                    <div class="preview-area">
                        <h3>Preview</h3>
                        <div class="preview-content"></div>
                    </div>
                    <div class="example-area">
                        <h3>Voorbeeld</h3>
                        <div class="example-content"></div>
                    </div>
                    <div class="feedback-area">
                        <h3>Feedback</h3>
                        <div class="feedback-content"></div>
                    </div>
                </div>
            </div>
        `;
        
        exerciseTabManager.setTabContent(index, content);
    });
    
    // Initialize the exercise framework
    setTimeout(() => {
        exerciseFramework.initExercise(this);
    }, 100);
};

// Export for use
window.boxjesConfig = boxjesConfig;