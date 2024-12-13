import { firestore } from 'firebase-admin'
import { initializeApp } from 'firebase-admin/app'
import { auth, config, } from 'firebase-functions'
import { User } from 'firebase/auth'

initializeApp(config().firebase);

export const onUserCreate = auth.user().onCreate(async (user: User) => {

    console.log(user);

    // if(user.email && user.email === "admin@gmail.com")

    // await firestore().doc(`users/${user.id}`).create({
    //     isAdmin: false,
    // })
})