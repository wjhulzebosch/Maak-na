/**
 * Tabellen Exercise - HTML Table exercises
 */

const tabellenConfig = {
    title: 'HTML Tabellen',
    tabs: {
        "basis": {
            name: "Basis Tabellen",
            instructions: "In deze tab leer je de basis van HTML tabellen. Vul de ontbrekende cellen in met de juiste kleuren."
        },
        "advanced": {
            name: "Advanced Tabellen", 
            instructions: "Hier leer je over tabel headers en meer complexe tabel structuren. Let op het verschil tussen &lt;td&gt; en &lt;th&gt; elementen."
        }
    },
    exercises: [
        {
            id: 1,
            type: "html",
            tab: "basis",
            initial: '<table>\n  <tr>\n    <td>___</td>\n    <td>Blue</td>\n  </tr>\n  <tr>\n    <td>Red</td>\n    <td>___</td>\n  </tr>\n</table>',
            solution: '<table>\n  <tr>\n    <td>Red</td>\n    <td>Blue</td>\n  </tr>\n  <tr>\n    <td>Red</td>\n    <td>Blue</td>\n  </tr>\n</table>',
            placeholder: 'Vul de ontbrekende kleuren in...'
        },
        {
            id: 2,
            type: "html",
            tab: "basis",
            initial: '<table>\n  <tr>\n    <th>___</th>\n    <th>Blue</th>\n  </tr>\n  <tr>\n    <td>Red</td>\n    <td>___</td>\n  </tr>\n</table>',
            solution: '<table>\n  <tr>\n    <th>Red</th>\n    <th>Blue</th>\n  </tr>\n  <tr>\n    <td>Red</td>\n    <td>Blue</td>\n  </tr>\n</table>',
            placeholder: 'Vul de ontbrekende headers en cellen in...'
        },
        {
            id: 3,
            type: "html",
            tab: "advanced",
            initial: '<table>\n  <tr>\n    <th>___</th>\n    <th>Blue</th>\n  </tr>\n  <tr>\n    <td>Red</td>\n    <td>___</td>\n  </tr>\n</table>',
            solution: '<table>\n  <tr>\n    <th>Red</th>\n    <th>Blue</th>\n  </tr>\n  <tr>\n    <td>Red</td>\n    <td>Blue</td>\n  </tr>\n</table>',
            placeholder: 'Vul de ontbrekende headers en cellen in...'
        }
    ]
};

// Initialize function
tabellenConfig.init = function() {
    // Initialize the exercise framework with this configuration
    setTimeout(() => {
        exerciseFramework.initExercise(this);
    }, 100);
};

// Export for use
window.tabellenConfig = tabellenConfig;