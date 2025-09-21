/**
 * Nested Divs – Practice creating nested structures
 */

const example_nestedDivsConfig = {
    title: 'Nested Divs',
    tabs: {
      basics: {
        name: 'Basics',
        instructions: 'Maak een <div class="container"> met drie child-divs. De eerste en tweede child hebben elk twee nested divs.'
      }
    },
    exercises: [
      {
        id: 1,
        type: 'html',
        tab: 'basics',
        initial:
  `<div class="container">
    <div class="section a">
      <div class="item">___</div>
      <div class="item">___</div>
    </div>
    <div class="section b">
      <div class="item">___</div>
      <div class="item">___</div>
    </div>
    <div class="section c">___</div>
  </div>`,
        solution:
  `<div class="container">
    <div class="section a">
      <div class="item">A1</div>
      <div class="item">A2</div>
    </div>
    <div class="section b">
      <div class="item">B1</div>
      <div class="item">B2</div>
    </div>
    <div class="section c">C</div>
  </div>`,
        placeholder: 'Vul de ontbrekende teksten of elementen in...'
      },
      {
        id: 2,
        type: 'html',
        tab: 'basics',
        initial:
  `___ class="container">
    ___ class="section a">
      ___ class="item">A1</div>
      <div class="item">A2</div>
    </div>
    <div class="section b">
      <div class="item">B1</div>
      ___ class="item">B2</div>
    </div>
    <div class="section c">C</div>
  </div>`,
        solution:
  `<div class="container">
    <div class="section a">
      <div class="item">A1</div>
      <div class="item">A2</div>
    </div>
    <div class="section b">
      <div class="item">B1</div>
      <div class="item">B2</div>
    </div>
    <div class="section c">C</div>
  </div>`,
        placeholder: 'Vul de ontbrekende tags (<div ...>) in...'
      },
      {
        id: 3,
        type: 'css',
        tab: 'basics',
        html:
  `<div class="container">
    <div class="section a">
      <div class="item">A1</div>
      <div class="item">A2</div>
    </div>
    <div class="section b">
      <div class="item">B1</div>
      <div class="item">B2</div>
    </div>
    <div class="section c">C</div>
  </div>`,
        initial:
  `.container { display: ___; gap: 8px; }
  .section { padding: 8px; border: 1px solid #ccc; }
  .section .item { background: ___; margin: 4px 0; padding: 4px; }`,
        solution:
  `.container { display: block; gap: 8px; }
  .section { padding: 8px; border: 1px solid #ccc; }
  .section .item { background: #f0f0f0; margin: 4px 0; padding: 4px; }`,
        placeholder: 'Vul de ontbrekende CSS-waarden in...'
      }
    ]
  };
  
  // Initialize (required)
  example_nestedDivsConfig.init = function () {
    setTimeout(() => {
      exerciseFramework.initExercise(this);
    }, 100);
  };
  
  // Export (required)
  window.example_nestedDivsConfig = example_nestedDivsConfig;
  