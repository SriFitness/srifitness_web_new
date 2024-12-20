import * as admin from "firebase-admin";
import { onCall, CallableRequest } from "firebase-functions/v2/https";
import { createUser, CreateUserData } from "./user/createUser";
import { getUser, GetUserData } from "./user/getUser";
import { updateUserRole, UpdateUserRoleData } from "./user/updateUserRole";
import { deleteUser, DeleteUserData } from "./user/deleteUser";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const createUserFunction = onCall((request: CallableRequest<CreateUserData>) =>
  createUser(request.data, request.auth)
);

export const getUserFunction = onCall((request: CallableRequest<GetUserData>) =>
  getUser(request.data, request.auth)
);

export const updateUserRoleFunction = onCall((request: CallableRequest<UpdateUserRoleData>) =>
  updateUserRole(request.data, request.auth)
);

export const deleteUserFunction = onCall((request: CallableRequest<DeleteUserData>) =>
  deleteUser(request.data, request.auth)
);

