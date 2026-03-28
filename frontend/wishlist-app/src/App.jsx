import BookLogin from "./components/BookLogin/BookLogin";
import { useState } from "react";

export default function App(){
  const [user, setUser] = useState(null);
  const [authed, setAuthed] = useState(false);

  if (!authed) return <BookLogin onLogin={setUser} />;


  
}