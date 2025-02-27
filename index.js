/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { AppContextProvider } from './src/AuthProvider/AuthProvider'; // Import your context provider
import { name as appName } from './app.json';

const RootApp = () => (
  <AppContextProvider>
    <App />
  </AppContextProvider>
);

AppRegistry.registerComponent(appName, () => RootApp);
