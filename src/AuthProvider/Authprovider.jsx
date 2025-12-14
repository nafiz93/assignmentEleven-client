import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { useEffect, useState } from "react";

import { auth } from "../firebase/firebase.init";
import { AuthContext } from "../AuthContext/AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isloggedin, setLogin] = useState(false);

  // Google Sign In
  const signinWithGoogle = (provider) => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  // Sign Up
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login
  const signin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Reset Password
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // Update Profile
  const updateUserProfile = (name, photourl) => {
    if (!auth.currentUser) return;
    setLoading(true);

    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photourl,
    });
  };

  // Logout
  const logoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  // ✅ AUTH STATE LISTENER (Missing Part Added)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLogin(!!currentUser); // true if user exists
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Context Value Object
  const authInfo = {
    user,
    loading,
    isloggedin,
    signinWithGoogle,
    signin,
    registerUser,
    updateUserProfile,
    logoutUser,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
