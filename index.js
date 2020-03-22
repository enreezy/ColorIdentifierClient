import 'react-native-gesture-handler';
import * as React from 'react';
import { registerRootComponent } from 'expo';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import App from './App';
import Header from './component/Header';
import CameraView from './views/CameraView';
import theme from './theme';

const Stack = createStackNavigator();

function Main() {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
       <Stack.Navigator initialRouteName="App">
          <Stack.Screen 
            name="App" 
            component={App} 
            options={{
              title:"Gallery",
              headerShown: false,
            }}
          />
          <Stack.Screen 
          name="ImageCapture" 
          component={CameraView} 
          options={{
            title: "Capture Image",
            headerShown:false
          }}
          />
        </Stack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default registerRootComponent(Main);

