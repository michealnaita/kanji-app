import { Admin } from './../../utils/types';
import { useMutation } from 'react-query';
import { db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

function getAdminData(): Promise<Admin> {
  return new Promise((resolve, reject) => {
    const adminRef = doc(db, 'system', 'admin');
    getDoc(adminRef)
      .then((doc) => {
        if (doc.exists()) {
          resolve(doc.data() as Admin);
          return;
        }
        reject({ message: "document doesn't not exist" });
      })
      .catch((e) => {
        console.log(e);
        reject({ message: e.message });
      });
  });
}

export default function useGetAdminDataMutation() {
  return useMutation<Admin, { message: string }>(getAdminData);
}
