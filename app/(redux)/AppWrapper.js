import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { Stack } from "expo-router/stack";
import { loadUser } from "./authSlice";

function AppWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }}/>

      {/* control user */}
      <Stack.Screen name="auth/login" options={{ title: "Login", headerShown: false }} />
      <Stack.Screen name="auth/register" options={{ title: "Register", headerShown: false }} />      
      <Stack.Screen name="user/editProfile" options={{ title: "Edit profile", headerShown: true }} />      
      <Stack.Screen name="user/accountSettings" options={{ title: "Account", headerShown: true }} />      
      <Stack.Screen name="user/changeEmail" options={{ title: "Change Email", headerShown: true }} />      
      <Stack.Screen name="user/changePassword" options={{ title: "Change Password", headerShown: true }} />      
      <Stack.Screen name="user/changePhone" options={{ title: "Change Number", headerShown: true }} />  

      {/* report  */}
      <Stack.Screen name="report/index" options={{ title: "Back", headerShown: true }} />  
      <Stack.Screen name="history/index" options={{ title: "Back", headerShown: true }} />  


      {/* bottom tab */}
      <Stack.Screen name="(tabs)" options={{ title: "TabsHome", headerShown: false }} />           
      <Stack.Screen name="(transactions)" options={{ title: "Back", headerShown: true }} />           
    </Stack>
  );
}

export default AppWrapper;