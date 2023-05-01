import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useMutation } from 'react-query';
import { formatErrorMessage } from '../../utils/errors';
import { auth, db } from '../../utils/firebase';
import { RegisterData, User } from '../../utils/types';

function handleRegister({
  password,
  firstname,
  lastname,
  email,
  phone,
}: RegisterData): Promise<boolean> {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const userData: User = {
          firstname,
          lastname,
          email,
          phone: parseInt(phone),
          households: [],
          current_amount: 0,
          notifications: [],
          transactions: [],
          services: [],
          balance: 0,
          roles: ['user'],
        };
        setDoc(docRef, userData)
          .then((r) => resolve(true))
          .catch((e) => reject(new Error(formatErrorMessage(e.code))));
      }
    });
    createUserWithEmailAndPassword(auth, email, password).catch((e) =>
      reject(new Error(formatErrorMessage(e.code)))
    );
  });
}
export default function useRegisterMutation() {
  return useMutation(handleRegister);
}
