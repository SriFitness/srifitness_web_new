import Cookies from "js-cookie"; 

type dataType = {
  firstName: string;
  secondName: string;
  email: string;
  phone: string;
  location: string;
  membership: string;
  password: string;
}

export const createUser = async (data: dataType) => {
  try {
    // Get the base URL dynamically based on environment
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin  // This will use the current domain in production
      : '';
    
    const response = await fetch(`${baseUrl}/api/users/create-user`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get("firebaseIdToken")}`, 
      },
      body: JSON.stringify(data),
    });
    if(response.ok){
      return {
        success: true,
        message: `${data.email} was created successfully.`,
      };
    }
    return {
      success: false,
      message: `An error occurred while creating the user. Check whether the user has been already created!`,
    };
    
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      message: 'An error occurred while creating the user. Check whether the user has been already created!',
    };
  }
};

