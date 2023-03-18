import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import ChatPage from './page/ChatPage';
import LoginPage from './page/LoginPage';
import SpeechRecognitionDemo from './components/voiceIdentification/SpeechRecognition';
import './App.css';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/login" />} />
        <Route path="/login" component={LoginPage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/speech" component={SpeechRecognitionDemo} />
      </Switch>
    </Router>
  );
};

export default App;
