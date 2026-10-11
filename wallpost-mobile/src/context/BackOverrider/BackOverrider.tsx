import { useRef, useEffect } from "react";
import { useHistoryWithDepth } from "../../hooks/useHistoryWithDepth";
import { App as MobileApp } from "@capacitor/app";
import { BackOverrideContext } from "./BackOverrideContext";
import { Outlet } from "react-router-dom";

export const BackOverrider = () => {
  const backButtonOverride = useRef<() => void | null>(null);
  const history = useHistoryWithDepth();
  const currentDepthRef = useRef(history.currentDepth);

  

  function registerOverride(overrideFunction: () => void){
    backButtonOverride.current = overrideFunction;
  }

  function clearOverride(){
    backButtonOverride.current = null;
  }

  useEffect(() => {
    const backButtonListener = MobileApp.addListener('backButton', () => {
      if(backButtonOverride.current){
        backButtonOverride.current();
        clearOverride();
      }else{
        if((currentDepthRef.current === 1 && localStorage.getItem("user")) || currentDepthRef.current === 0){
          MobileApp.exitApp();
        } else {
          history.goBack();
        }
      }
    })

    return () => {
      backButtonListener.then(x => {x.remove()});
    }
  },[])




  return (
    <BackOverrideContext.Provider value={{registerOverride, clearOverride}}>
      <Outlet/>
    </BackOverrideContext.Provider>
  )
}