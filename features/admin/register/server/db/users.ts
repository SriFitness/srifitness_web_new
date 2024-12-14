import { functions } from '@/firebase/client';

import { httpsCallable } from 'firebase/functions';

type dataType = {
  first: string;
  second: string;
  email: string;
  phone: string;
  location: string;
  membership: string;
  password: string;
}

export const createUser = async (data: dataType) => {
  if(!functions){
    return
  }
  const createUserFn = httpsCallable(functions, 'createUser');
  
  try {
    const result = await createUserFn(data);
    console.log(result.data.message);
  } catch (error) {
    console.log(error);
  }
}


