import { RouterProvider } from 'react-router-dom'
import './App.scss'
import { appRoutes } from './routes'
import { setupIonicReact } from '@ionic/react';
import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SafeArea } from '@aashu-dubey/capacitor-statusbar-safe-area';


setupIonicReact({
  hardwareBackButton: false
});

function App() {

  useEffect(() => {
    const initApp = async () => {
      await Promise.all([
        StatusBar.setOverlaysWebView({ overlay: true }),
        StatusBar.setStyle({ style: Style.Dark }),
      ]);
    }
    initApp();
  },[])

  useEffect(() => {
    const checkStatusBarHeight = async () => {
      try {
        const statusBarHeight = (await SafeArea.getStatusBarHeight()).height;
        const navigationBarHeight = (await SafeArea.getSafeAreaInsets()).bottom;
        document.body.style.setProperty('--status-bar-height',`${statusBarHeight ?? 0}px`);
        document.body.style.setProperty('--navigation-bar-height',`${navigationBarHeight ?? 0}px`);
      } catch (safeAreaError) {
        console.warn("Safe guard error:", safeAreaError);
      }
    }
    checkStatusBarHeight();
  },[]);

  return (
    <div className='app'>
      <RouterProvider router={appRoutes}/>
    </div>
  )
}

export default App
