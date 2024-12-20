import Cookies from "js-cookie";

type UserDetailsType = {
    firstName: string,
    secondName: string,
    email: string,
    id: string,
    location: string,
    phone: string,
    membership: string
}

export const getUsers = async () : Promise<UserDetailsType[]> => {
    try {
        const response = await fetch('/api/user-details', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${Cookies.get("firebaseIdToken")}`
            }
        });

        if (response.ok) {
            const data : UserDetailsType[] = await response.json(); // Await the JSON response
            console.log(data); // Access the 'message' property
            return data;
        } else {
            console.log("Something went wrong");
            return [];
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};
