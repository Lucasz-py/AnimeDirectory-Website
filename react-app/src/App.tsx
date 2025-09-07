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

/*import Card, { CardBody } from './components/Card'
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
