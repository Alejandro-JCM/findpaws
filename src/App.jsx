import MainComponent from './components/MainComponent';
import { AuthProvider } from './components/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <MainComponent />
    </AuthProvider>
  );
}

export default App