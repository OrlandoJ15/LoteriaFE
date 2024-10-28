import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Estilo de Menu Lateral
const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background: #252831;
    border-left: 4px solid green;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #252831;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;

  &:hover {
    background: green;
    cursor: pointer;
  }
`;
/////////
// Configuración de SubMenu Lateral
//  AQUI: Se configura la funcionaliad del submenu y todas opciones  ///

const SubMenu = ({ item }) => {
	const [subnav, setSubnav] = useState(false);
  
	const showSubnav = (e) => {
	  e.stopPropagation();  // Evita que se cierre el sidebar
	  setSubnav(!subnav);   // Alterna el estado de los submenús
	};
	
  
	return (
	  <>
		{/* El evento onClick solo afecta el submenú si es necesario */}
		<SidebarLink to={item.path} onClick={item.subNav ? showSubnav : undefined}>
		  <div>
			{item.icon}
			<SidebarLabel>{item.title}</SidebarLabel>
		  </div>
  
		  <div>
			{item.subNav && subnav
			  ? item.iconOpened
			  : item.subNav
			  ? item.iconClosed
			  : null}
		  </div>
		</SidebarLink>
  
		{/* Renderiza los submenús si están abiertos */}
		{subnav &&
		  item.subNav.map((subItem, index) => {
			return (
			  <DropdownLink to={subItem.path} key={index}>
				{subItem.icon}
				<SidebarLabel>{subItem.title}</SidebarLabel>
			  </DropdownLink>
			);
		  })}
	  </>
	);
  };
  

export default SubMenu;