import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="min-h-screen bg-background overflow-x-hidden">
          <Header onSignOut={signOut!} user={user} />
          <main className="container mx-auto px-4 py-8">
            <Dashboard />
          </main>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
