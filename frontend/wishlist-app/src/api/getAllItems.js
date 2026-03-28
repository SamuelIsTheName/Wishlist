import axios from 'axios';
export async function GetAllItems() {

  const token = sessionStorage.getItem("token");

  if (!token) throw new Error("No session found");

  const API = import.meta.env.VITE_GET_ALL_ITEMS_API;
  try {
    const response = await axios.get(API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;

  } catch (error) {
    throw new Error("Failed to fetch wishlist");
  }
}