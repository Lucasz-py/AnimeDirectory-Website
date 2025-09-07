/*
import LetterGlitch from './components/LetterGlitch';
import Card, { CardBody } from './components/Card';
import List from './components/List';

function App() {
  const list = ['goku', 'vegeta', 'bulma'];

  return (
    <>
      <Card>
        <CardBody title='Hola Mundo' text='Este es el texto' />
        <List data={list} />
      </Card>
      <LetterGlitch
        glitchSpeed={50}
        centerVignette={true}
        outerVignette={false}
        smooth={true}
      />
    </>
  );
}

export default App;
*/
/*import Lightning from './components/Lightning';

function App() {
  return (<div style={{ width: '100%', height: '600px', position: 'relative' }}>
    <Lightning
      hue={220}
      xOffset={0}
      speed={1}
      intensity={1}
      size={1}
    />
  </div>
  )
}

export default App
*/


import LiquidEtherBackground from './components/LiquidEtherBackground';

function App() {
  return (
    <div className="App">
      <LiquidEtherBackground
        colors={["#52227F", "#FF00CC", "#00FFCC"]}
        particleCount={60}
      />
    </div>
  );
}

export default App;

/*
import Card, { CardBody } from './components/Card'
import List from './components/List'


function App() {
  const list = ['goku', 'vegeta', 'bulma']
  return <Card>
    <CardBody title='Hola Mundo' text='Este es el texto' />
    <List data={list} />
  </Card>
}

export default App
*/
