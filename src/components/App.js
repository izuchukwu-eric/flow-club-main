import { firebaseApp } from '../utils/firebase';
import './App.css';
import Call from './Call'

function App() {

  return (
    <div className="App">
      <Call firebaseApp={firebaseApp} />
    </div>
  );
}

export default App;
