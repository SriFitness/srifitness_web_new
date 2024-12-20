import { createUser as createUserDB } from '@/features/admin/register/server/db/users'

type dataType = {
    firstName: string;
    secondName: string;
    email: string;
    phone: string;
    location: string;
    membership: string;
    password: string;
  }
  

export async function createUser(data : dataType) {
    return createUserDB(data);
}