import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as GiIcons from 'react-icons/gi';
import * as MdIcons from "react-icons/md";
import * as PiIcons from "react-icons/pi";
import * as HiIcons from "react-icons/hi";






////////////////SUB MENUS LATERALES//////////////////
//  AQUI: Se agregan todas las opciones del menu.  // 

export const SidebarData = [
  {
    title: 'Inicio',
    path: '/Principal',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Usuarios',
    path: '/Usuario',
    icon: <FaIcons.FaUser />,
    cName: 'nav-text'
  },
  {
    title: 'Tipo de Sorteos General',
    path: '/TipoSorteoGeneral',
    icon: <FaIcons.FaTicketAlt />,
    cName: 'nav-text'
  },
  {
    title: 'Tipo de Sorteos',
    path: '/TipoSorteo',
    icon: <FaIcons.FaTicketAlt />,
    cName: 'nav-text'
  },
  {
    title: 'Sorteo',
    path: '/Sorteo',
    icon: <GiIcons.GiPerspectiveDiceSixFacesRandom />,
    cName: 'nav-text'
  },
  {
    title: 'Reportes',
    icon: <HiIcons.HiOutlineDocumentReport />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    cName: 'nav-text',
    subNav:[
          {
            title: 'Kardex',
            path: '/Kardex',
            icon: <PiIcons.PiSecurityCameraFill />,
            cName: 'nav-text'
          },
        ]
  },
  {
    title: 'Cerrar Sesion',
    path: '/Logout',
    icon: <RiIcons.RiLogoutCircleLine />,
    cName: 'nav-text'
  }
];