import 'server-only';

import { firestore } from '@/firebase/server'; // Ensure this is your Firestore Admin SDK instance

export async function getUserDetails(userId: string) {
  if(!firestore)
    throw new Error('Firestore is not available')

  const userDocRef = firestore.collection('user-details').doc(userId);

  const userDocSnap = await userDocRef.get();

  if (!userDocSnap.exists) {
    throw new Error('User not found');
  }

  // References to subcollections
  const medicalInquiriesRef = userDocRef.collection('medical-inquiries');
  const personalDetailsRef = userDocRef.collection('personal-details');

  // Fetch documents from subcollections in parallel
  const [medicalInquiriesDoc, personalDetailsDoc] = await Promise.all([
    medicalInquiriesRef.doc('zYRoxqzVZmL6EFkzaUTm').get(),
    personalDetailsRef.doc('info').get(),
  ]);
  console.log("data");
  console.log(medicalInquiriesDoc.data());
  console.log(personalDetailsDoc.data());

  return {
    medicalInquiries: medicalInquiriesDoc.exists ? medicalInquiriesDoc.data() : null,
    personalDetails: personalDetailsDoc.exists ? personalDetailsDoc.data() : null,
  };
}
