import axios from 'axios';
export async function login(email, password) {
  const API = import.meta.env.VITE_LOGIN_API;

  try {
    const response = await axios.post(API, {
      email,
      password,
    });

    const data = response.data;

    sessionStorage.setItem("token", data.access_token);

    return data;

  } catch (error) {
    throw new Error("Invalid credentials");
  }
}

export function logout(){
  sessionStorage.removeItem("token");
}