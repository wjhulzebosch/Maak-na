/**
 * Boxjes Exercise - CSS Box Model exercises
 */

const example_boxModelConfig = {
    title: 'CSS Box Model',
    tabs: {
        "basis": {
            name: "Basis Box Model",
            instructions: "<p>Leer de basis van het CSS box model met width, height, margin, padding en border.</p><p>In de eerste oefeningen hoef je alleen de waardes op te geven (bijv. 50px).</p><p>In de oefeningen daarna moet je correcte css code invullen (bijv. width: 50px;).</p>"
        }
    },
    exercises: [
        {
            id: 1,
            type: 'css',
            inputType: 'fields',
            tab: 'basis',
            title: "Voorbeeld 1",
            html: '<div class="test-box">Box</div>',
            fields: ['width', 'height', 'padding', 'margin', 'border'],
            fieldLabels: {
                width: 'Breedte:',
                height: 'Hoogte:',
                padding: 'Padding:',
                border: 'Border:',
                margin: 'Margin:',

            },
            initial: { width: '150px', height: '50px' },
            solution: 'width: 50px; height: 25px; padding: 5px; margin: 10px; border: 10px;',
        },
        {
            id: 2,
            type: 'css',
            html: '<div class="box">Box</div>',
            inputType: 'textarea',
            tab: 'basis',
            title: "Voorbeeld 1",
            solution: 'width: 50px; height: 25px; padding: 5px; margin: 10px; border: 10px;',
        },
    ],

    /**
     * Custom input processor for box model exercises
     */
    customInputProcessor: function(cssInput) {
        // Handle raw CSS properties (without selectors)
        if (!cssInput || !cssInput.trim()) {
            return { valid: false, error: 'CSS mag niet leeg zijn' };
        }
        
        // If it's already wrapped in a selector, return as-is
        if (cssInput.includes('{') && cssInput.includes('}')) {
            return { valid: true, content: cssInput };
        }
        
        // If it's raw CSS properties, wrap them in a selector
        const wrappedCSS = `.box { ${cssInput.trim()} }`;
        return { valid: true, content: wrappedCSS };
    },

    /**
     * Custom preview updater for box model visualization
     */
    customPreviewUpdater: function(exercise, previewElement, userInput) {
        // Get current field values directly
        const fields = exercise.fields || ['width', 'height', 'margin', 'padding', 'border'];
        const cssObj = {};
        
        fields.forEach(field => {
            const fieldElement = document.getElementById(`${field}${exercise.id}`);
            if (fieldElement && fieldElement.value.trim()) {
                cssObj[field] = fieldElement.value.trim();
            }
        });
            
            // Create the 4-layer box model structure
            const boxContainer = document.createElement('div');
            boxContainer.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 200px;
                background-color: #f0f0f0;
                border: 1px solid #ccc;
            `;

            // Create margin box (outermost)
            const marginBox = document.createElement('div');
            marginBox.style.cssText = `
                background-color: #F9CC9D;
                padding: ${cssObj.margin || '0'};
                display: inline-block;
            `;

            // Create border box
            const borderBox = document.createElement('div');
            borderBox.style.cssText = `
                background-color: #FDDD9B;
                padding: ${cssObj.border || '0'};
            `;

            // Create padding box
            const paddingBox = document.createElement('div');
            paddingBox.style.cssText = `
                background-color: #C3D08B;
                padding: ${cssObj.padding || '0'};
            `;

            // Create content box (innermost)
            const contentBox = document.createElement('div');
            contentBox.style.cssText = `
                background-color: #8CB6C0;
                width: ${cssObj.width || '50px'};
                height: ${cssObj.height || '50px'};
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
            `;
            contentBox.textContent = 'Content';

            // Nest the boxes
            paddingBox.appendChild(contentBox);
            borderBox.appendChild(paddingBox);
            marginBox.appendChild(borderBox);
            boxContainer.appendChild(marginBox);

            previewElement.innerHTML = '';
            previewElement.appendChild(boxContainer);
            
            return true; // "I handled this"
    },

    /**
     * Custom example updater for box model visualization
     */
    customExampleUpdater: function(exercise, exampleElement, solution) {
            // Parse the solution CSS
            const solutionObj = this.parseCSSDeclarations(solution);
            
            // Create the same 4-layer box model structure with solution
            const boxContainer = document.createElement('div');
            boxContainer.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 200px;
                background-color: #f0f0f0;
                border: 1px solid #ccc;
            `;

            // Create margin box (outermost)
            const marginBox = document.createElement('div');
            marginBox.style.cssText = `
                background-color: #F9CC9D;
                padding: ${solutionObj.margin || '0'};
                display: inline-block;
            `;

            // Create border box
            const borderBox = document.createElement('div');
            borderBox.style.cssText = `
                background-color: #FDDD9B;
                padding: ${solutionObj.border || '0'};
            `;

            // Create padding box
            const paddingBox = document.createElement('div');
            paddingBox.style.cssText = `
                background-color: #C3D08B;
                padding: ${solutionObj.padding || '0'};
            `;

            // Create content box (innermost)
            const contentBox = document.createElement('div');
            contentBox.style.cssText = `
                background-color: #8CB6C0;
                width: ${solutionObj.width || '50px'};
                height: ${solutionObj.height || '50px'};
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
            `;
            contentBox.textContent = 'Content';

            // Nest the boxes
            paddingBox.appendChild(contentBox);
            borderBox.appendChild(paddingBox);
            marginBox.appendChild(borderBox);
            boxContainer.appendChild(marginBox);

            exampleElement.innerHTML = '';
            exampleElement.appendChild(boxContainer);
            
            return true; // "I handled this"
    },

    /**
     * Parse CSS declarations from input
     */
    parseCSSDeclarations: function(cssInput) {
        const cssObj = {};
        
        // Handle undefined or null input
        if (!cssInput) {
            return cssObj;
        }
        
        // Extract CSS properties from wrapped format like ".test-box { width: 200px; height: 100px; }"
        let cssContent = cssInput;
        if (cssInput.includes('{') && cssInput.includes('}')) {
            const match = cssInput.match(/\{([^}]+)\}/);
            if (match) {
                cssContent = match[1];
            }
        }
        
        const declarations = cssContent.split(';');
        
        declarations.forEach(decl => {
            const [prop, val] = decl.split(':').map(s => s && s.trim());
            if (prop && val) {
                cssObj[prop] = val;
            }
        });

        return cssObj;
    },

    /**
     * Custom validator for box model exercises
     */
    customValidator: function(processedResult, exercise) {
            
            // Handle undefined processedResult
            if (!processedResult || !processedResult.content) {
                return { isCorrect: false };
            }
            
            // Parse both input and solution CSS
            const inputObj = this.parseCSSDeclarations(processedResult.content);
            const solutionObj = this.parseCSSDeclarations(exercise.solution);
            
            
            // Check if all properties match (order-independent)
            const inputKeys = Object.keys(inputObj).filter(k => inputObj[k] !== '');
            const solutionKeys = Object.keys(solutionObj).filter(k => solutionObj[k] !== '');
            
            if (inputKeys.length !== solutionKeys.length) {
                return { isCorrect: false };
            }
            
            const allMatch = inputKeys.every(key => 
                solutionObj[key] && inputObj[key] === solutionObj[key]
            );
            
            if (allMatch) {
                return { isCorrect: true, score: 1 };
            } else {
                return { isCorrect: false };
        }
    }
};

// Initialize function
example_boxModelConfig.init = function() {
    // Initialize the exercise framework with this configuration
    setTimeout(() => {
        exerciseFramework.initExercise(this);
    }, 100);
};

// Export for use
window.example_boxModelConfig = example_boxModelConfig;