import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';

////////////////SUB MENUS LATERALES//////////////////
//  AQUI: Se agregan todas las opciones del menu.  // 

export const SidebarData = [
  {
    title: 'Inicio',
    path: '/Home',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Usuarios',
    path: '/Usuario',
    icon: <FaIcons.FaCartPlus />,
    cName: 'nav-text'
  }
];