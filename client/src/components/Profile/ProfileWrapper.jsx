import React from "react";
import Avatar from './Avatar';
import ChangePassword from './ChangePassword';
import DataUser from './DataUser';
const ProfileWrapper = () => {
  return (
    <>
      <h2>Perfil</h2>
      <Avatar />

      <h2>Datos Personales</h2>
      <DataUser />

      <h2>Cambiar Contraseña</h2>
      <ChangePassword />
    </>
  );
};

export default ProfileWrapper;
