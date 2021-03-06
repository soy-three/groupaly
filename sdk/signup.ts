import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import axios from "axios";
import { IUser } from "../interface/IUser";

let firebaseConfig;
let app;
let db;

export const init = (key: string) => {
  const unHashed = Buffer.from(key, "base64").toString("binary");
  firebaseConfig = JSON.parse(unHashed);
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
};

export const signUpWithGoogle = async (): Promise<IUser> => {
  const gProvider = new GoogleAuthProvider();
  const auth = getAuth();
  let popup = await signInWithPopup(auth, gProvider);
  let createResp = await axios.post<IUser>(
    `http://localhost:3001/users/create`,
    {},
    {
      headers: {
        userName: popup.user.displayName!,
        userID: popup.user.uid!,
      },
    }
  );
  return createResp.data;
};

export const signUpWithFacebook = async (): Promise<string> => {
  const fProvider = new FacebookAuthProvider();
  const auth = getAuth();
  let popup = await signInWithPopup(auth, fProvider);
  return popup.user.uid;
};
