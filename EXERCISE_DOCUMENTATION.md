# Exercise File Documentation

This document explains how to create exercise files for the Maak-na-oefeningen framework.

## Basic Exercise Structure

Every exercise file should follow this basic structure:

```javascript
/**
 * Your Exercise Name - Brief description
 */

const yourConfig = {
    title: 'Exercise Title',
    tabs: {
        // Tab definitions
    },
    exercises: [
        // Exercise definitions
    ]
};

// Initialize function (required)
yourConfig.init = function() {
    setTimeout(() => {
        exerciseFramework.initExercise(this);
    }, 100);
};

// Export for use (required)
window.yourConfig = yourConfig;
```

## Configuration Options

### Top-Level Configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | The main title of your exercise set |
| `tabs` | object | Yes | Defines the tabs/sections for organizing exercises |
| `exercises` | array | Yes | Array of individual exercises |

### Tab Configuration

```javascript
tabs: {
    "tabId": {
        name: "Display Name",
        instructions: "Instructions shown to users"
    }
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Display name for the tab |
| `instructions` | string | Yes | Instructions shown to users in this tab |

## Exercise Types

### 1. Basic CSS Exercises (Textarea Input)

For simple CSS exercises where users type complete CSS:

```javascript
{
    id: 1,
    type: "css",
    tab: "basis",
    html: '<div class="box1">box1 moet rood worden</div>',
    initial: '.box1 {\n  background-color: ___;\n}',
    solution: '.box1 {\n  background-color: red;\n}',
    placeholder: 'Vul de ontbrekende kleuren in...'
}
```

**Properties:**
- `id`: Unique identifier (number)
- `type`: "css" for CSS exercises
- `tab`: Which tab this exercise belongs to
- `html`: HTML structure for the exercise
- `initial`: Starting CSS with placeholders (use `___` for blanks)
- `solution`: Complete correct CSS
- `placeholder`: Help text shown in the textarea

### 2. Basic HTML Exercises (Textarea Input)

For HTML exercises where users complete HTML code:

```javascript
{
    id: 1,
    type: "html",
    tab: "basis",
    initial: '<table>\n  <tr>\n    <td>___</td>\n  </tr>\n</table>',
    solution: '<table>\n  <tr>\n    <td>Red</td>\n  </tr>\n</table>',
    placeholder: 'Vul de ontbrekende cellen in...'
}
```

**Properties:**
- `id`: Unique identifier (number)
- `type`: "html" for HTML exercises
- `tab`: Which tab this exercise belongs to
- `initial`: Starting HTML with placeholders (use `___` for blanks)
- `solution`: Complete correct HTML
- `placeholder`: Help text shown in the textarea

### 3. Field-Based CSS Exercises

For exercises with separate input fields for individual CSS properties:

```javascript
{
    id: 1,
    type: "css",
    inputType: "fields",
    tab: "basis",
    title: "Exercise Title",
    fields: ['width', 'height', 'padding', 'margin'],
    fieldLabels: {
        width: 'Breedte:',
        height: 'Hoogte:',
        padding: 'Padding:',
        margin: 'Margin:'
    },
    initial: { width: '150px', height: '50px' },
    solution: 'width: 50px; height: 25px; padding: 5px; margin: 10px;'
}
```

**Additional Properties:**
- `inputType`: "fields" to enable separate input fields
- `title`: Display title for the exercise
- `fields`: Array of CSS property names to create inputs for
- `fieldLabels`: Object mapping property names to display labels
- `initial`: Object with initial values for fields
- `solution`: CSS string with all properties

## Advanced: Custom Logic

For complex exercises that need custom rendering, validation, or input processing, you can add custom functions to your configuration object.

### Custom Input Processor

Override how user input is processed before validation:

```javascript
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
}
```

**Return Format:**
```javascript
{
    valid: boolean,    // Whether the input is valid
    content: string,   // Processed content to use
    error?: string     // Error message if invalid
}
```

### Custom Preview Updater

Override how the preview area is rendered:

```javascript
customPreviewUpdater: function(exercise, previewElement, userInput) {
    // Parse the user's CSS input
    const cssObj = this.parseCSSDeclarations(userInput);
    
    // Create custom HTML structure
    const container = document.createElement('div');
    container.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 200px;
        background-color: #f0f0f0;
    `;
    
    // Add your custom elements here
    const box = document.createElement('div');
    box.style.cssText = `
        width: ${cssObj.width || '50px'};
        height: ${cssObj.height || '50px'};
        background-color: ${cssObj['background-color'] || 'blue'};
    `;
    
    container.appendChild(box);
    previewElement.innerHTML = '';
    previewElement.appendChild(container);
    
    return true; // Return true to indicate you handled the rendering
}
```

**Parameters:**
- `exercise`: The exercise configuration object
- `previewElement`: DOM element where preview should be rendered
- `userInput`: Raw user input string

**Return:** `true` if you handled the rendering, `false` to use default rendering

### Custom Example Updater

Override how the example/solution area is rendered:

```javascript
customExampleUpdater: function(exercise, exampleElement, solution) {
    // Parse the solution CSS
    const solutionObj = this.parseCSSDeclarations(solution);
    
    // Create the same structure as preview but with solution values
    const container = document.createElement('div');
    // ... same logic as customPreviewUpdater but using solution values
    
    return true; // Return true to indicate you handled the rendering
}
```

**Parameters:**
- `exercise`: The exercise configuration object
- `exampleElement`: DOM element where example should be rendered
- `solution`: The solution string from the exercise

### Custom Validator

Override how answers are validated:

```javascript
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
    const solutionKeys = Object.keys(solutionObj).filter(k => solutionObj[key] !== '');
    
    if (inputKeys.length !== solutionKeys.length) {
        return { isCorrect: false };
    }
    
    const allMatch = inputKeys.every(key => 
        solutionObj[key] && inputObj[key] === solutionObj[key]
    );
    
    return { 
        isCorrect: allMatch, 
        score: allMatch ? 1 : 0 
    };
}
```

**Parameters:**
- `processedResult`: Result from input processor (or default processing)
- `exercise`: The exercise configuration object

**Return Format:**
```javascript
{
    isCorrect: boolean,  // Whether the answer is correct
    score?: number       // Optional score (0-1)
}
```

### Helper Functions

You can also add helper functions to your configuration:

```javascript
parseCSSDeclarations: function(cssInput) {
    const cssObj = {};
    
    if (!cssInput) {
        return cssObj;
    }
    
    // Extract CSS properties from wrapped format
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
}
```

## Framework Integration

The framework automatically detects and uses your custom functions:

1. **If `customInputProcessor` exists**: Uses it instead of default input processing
2. **If `customPreviewUpdater` exists**: Uses it instead of default preview rendering
3. **If `customExampleUpdater` exists**: Uses it instead of default example rendering
4. **If `customValidator` exists**: Uses it instead of default validation

## Best Practices

1. **Keep it simple**: Start with basic exercises before adding custom logic
2. **Use consistent naming**: Follow the existing patterns in the codebase
3. **Handle edge cases**: Always check for undefined/null values in custom functions
4. **Return proper formats**: Ensure your custom functions return the expected data structures
5. **Test thoroughly**: Verify that your custom logic works with both field and textarea inputs
6. **Document your logic**: Add comments explaining complex custom functions

## ⚠️ CRITICAL WARNING: NO COMMENTS IN EXERCISE CONTENT

**NEVER add comments to `initial`, `solution`, `html`, or any other exercise content fields!**

❌ **WRONG - This will break validation:**
```javascript
{
    initial: '<!-- This is a helpful hint -->\n<div class="container">\n  <div class="item">___</div>\n</div>',
    solution: '<!-- The correct answer -->\n<div class="container">\n  <div class="item">A1</div>\n</div>'
}
```

✅ **CORRECT - Clean content only:**
```javascript
{
    initial: '<div class="container">\n  <div class="item">___</div>\n</div>',
    solution: '<div class="container">\n  <div class="item">A1</div>\n</div>'
}
```

**Why this matters:**
- The validation system compares user input with the solution using exact string matching
- Comments in the solution will cause validation to fail even with correct answers
- Comments in the initial content will confuse users and break the exercise flow
- The framework expects clean, executable code without any explanatory comments

**If you need to provide hints or explanations:**
- Use the `placeholder` field for helpful text
- Add instructions in the tab's `instructions` field
- Use the exercise `title` for brief descriptions
- Add comments in the JavaScript code structure (outside the exercise content)
- Consider simplifying the exercise: These types of exercises should practice one technique. If your exercises need more explanation than you can give with the tab-instructions, you're likely trying to exercise too much.

## Example: Complete Custom Exercise

Here's a complete example of an exercise with custom logic:

```javascript
const customConfig = {
    title: 'Custom Box Model',
    tabs: {
        "basis": {
            name: "Box Model",
            instructions: "Learn CSS box model with custom visualization"
        }
    },
    exercises: [
        {
            id: 1,
            type: 'css',
            inputType: 'fields',
            tab: 'basis',
            title: "Box Model Exercise",
            fields: ['width', 'height', 'padding', 'margin', 'border'],
            fieldLabels: {
                width: 'Width:',
                height: 'Height:',
                padding: 'Padding:',
                margin: 'Margin:',
                border: 'Border:'
            },
            initial: { width: '100px', height: '50px' },
            solution: 'width: 50px; height: 25px; padding: 5px; margin: 10px; border: 10px;'
        }
    ],

    // Custom input processor
    customInputProcessor: function(cssInput) {
        if (!cssInput || !cssInput.trim()) {
            return { valid: false, error: 'CSS cannot be empty' };
        }
        
        if (cssInput.includes('{') && cssInput.includes('}')) {
            return { valid: true, content: cssInput };
        }
        
        const wrappedCSS = `.box { ${cssInput.trim()} }`;
        return { valid: true, content: wrappedCSS };
    },

    // Custom preview updater
    customPreviewUpdater: function(exercise, previewElement, userInput) {
        const cssObj = this.parseCSSDeclarations(userInput);
        
        // Create custom box model visualization
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 200px;
            background-color: #f0f0f0;
        `;
        
        // Your custom rendering logic here
        // ...
        
        previewElement.innerHTML = '';
        previewElement.appendChild(container);
        return true;
    },

    // Custom example updater
    customExampleUpdater: function(exercise, exampleElement, solution) {
        // Similar to customPreviewUpdater but using solution values
        // ...
        return true;
    },

    // Custom validator
    customValidator: function(processedResult, exercise) {
        if (!processedResult || !processedResult.content) {
            return { isCorrect: false };
        }
        
        const inputObj = this.parseCSSDeclarations(processedResult.content);
        const solutionObj = this.parseCSSDeclarations(exercise.solution);
        
        // Your custom validation logic here
        // ...
        
        return { isCorrect: true, score: 1 };
    },

    // Helper function
    parseCSSDeclarations: function(cssInput) {
        // Your CSS parsing logic here
        // ...
        return cssObj;
    }
};

// Initialize function
customConfig.init = function() {
    setTimeout(() => {
        exerciseFramework.initExercise(this);
    }, 100);
};

// Export for use
window.customConfig = customConfig;
```

This documentation covers all the patterns and options available for creating exercise files in the Maak-na-oefeningen framework.
