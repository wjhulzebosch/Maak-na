/**
 * Simple CSS Exercise - CSS Background Color exercises
 */

const simplecssConfig = {
    title: 'CSS Achtergrond Kleuren',
    tabs: {
        "basis": {
            name: "Basis Kleuren",
            instructions: "In deze tab leer je de basis van CSS achtergrond kleuren. Geef de divs de juiste achtergrond kleuren."
        },
        "advanced": {
            name: "Geavanceerde Kleuren", 
            instructions: "Hier leer je over meer complexe CSS kleur combinaties en het toepassen van kleuren op verschillende elementen."
        }
    },
    exercises: [
        {
            id: 1,
            type: "css",
            tab: "basis",
            html: '<div class="box1">box1 moet rood worden</div>\n<div class="box2">box2 moet blauw worden</div>',
            initial: '.box1 {\n  background-color: ___;\n}\n\n.box2 {\n  background-color: ___;\n}',
            solution: '.box1 {\n  background-color: red;\n}\n\n.box2 {\n  background-color: blue;\n}',
            placeholder: 'Vul de ontbrekende kleuren in...'
        },
        {
            id: 2,
            type: "css",
            tab: "basis",
            html: '<div class="container">\n  <div class="item1">item1 moet groen worden</div>\n  <div class="item2">item2 moet geel worden</div>\n</div>',
            initial: '.item1 {\n  background-color: ___;\n}\n\n.item2 {\n  background-color: ___;\n}',
            solution: '.item1 {\n  background-color: green;\n}\n\n.item2 {\n  background-color: yellow;\n}',
            placeholder: 'Vul de ontbrekende kleuren in...'
        },
        {
            id: 3,
            type: "css",
            tab: "advanced",
            html: '<div class="header">Header (#333)</div>\n<div class="content">Content (#f0f0f0)</div>\n<div class="sidebar">Sidebar (#e0e0e0)</div>\n<div class="footer">Footer (#666)</div>',
            initial: '.header {\n  background-color: ___;\n}\n\n.content {\n  background-color: ___;\n}\n\n.sidebar {\n  background-color: ___;\n}\n\n.footer {\n  background-color: ___;\n}',
            solution: '.header {\n  background-color: #333;\n}\n\n.content {\n  background-color: #f0f0f0;\n}\n\n.sidebar {\n  background-color: #e0e0e0;\n}\n\n.footer {\n  background-color: #666;\n}',
            placeholder: 'Vul de ontbrekende kleuren in (gebruik hex codes voor de laatste)...'
        }
    ]
};

// Initialize function
simplecssConfig.init = function() {
    // Initialize the exercise framework with this configuration
    setTimeout(() => {
        exerciseFramework.initExercise(this);
    }, 100);
};

// Export for use
window.simplecssConfig = simplecssConfig;
