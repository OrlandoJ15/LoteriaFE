var a=Object.defineProperty;var n=(s,r,e)=>r in s?a(s,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[r]=e;var o=(s,r,e)=>n(s,typeof r!="symbol"?r+"":r,e);import{r as i,K as c,j as t}from"./index-C9xMqd9z.js";const l="https://loteriawebapimvp.azurewebsites.net/Usuario/Logout";class x extends i.Component{constructor(){super(...arguments);o(this,"cerrarSesion",async()=>{try{const e=await c.post(l,{},{withCredentials:!0});alert("Hasta Luego"),console.log(e)}catch(e){alert("Eror al cerrar sesion, Error: ",e)}})}render(){return t.jsx("div",{children:t.jsx("button",{color:"primary",onClick:this.cerrarSesion,children:"Cerrar Sesión"})})}}export{x as default};
