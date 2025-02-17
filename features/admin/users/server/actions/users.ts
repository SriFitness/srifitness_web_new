    import { getUsers as getUsersFn } from '@/features/admin/users/server/db/users';

    export async function getUsers () {
        return getUsersFn();
    }