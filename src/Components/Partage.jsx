import React from "react";
import { useState } from "react";



function Partage() {
    function handleclik() {
if(pseudo.trim()===""){ 
    setErr("veiller entrer une valeur dans l'input")

}else {
    setpseudo("")
}

}
    const [pseudo, setpseudo]=useState("");
    const [err, setErr]= useState("");
  return (
    <div className='my-32'>
    <form action="#" onSubmit={(e)=>e.preventDefault()}>
   <p className='text-center text-orange-400 font-bold uppercase underline underline-offset-4'>Notre composant de surveillance de l'input</p>
   <input className='my-5 rounded-xl bg-gray-400 w-full p-2 m-2 '
    type="text"
    placeholder="Entrer votre pseudo..."
    value={pseudo}
    onChange={(e)=>setpseudo(e.target.value)}
  
   />
   {err && <p className="text-red-800 my-5">{err}</p>}
   <button type="submit" className=" text-green-500 bg-slate-100 w-20 rounded-sm font-bold " onClick={handleclik}>Envoyer</button>
   </form>
    </div>
  )
}

export default Partage