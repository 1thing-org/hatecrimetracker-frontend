import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo/logo.png";
import { Container } from "reactstrap";
import { IonToolbar, IonTitle } from "@ionic/react";
import Hamburger from "./hamburger";
import { useTranslation } from "react-i18next";

const Navbar = ({ setHamburgerOpen }) => {
  const { t } = useTranslation();

  return (
    <Container className="header">
      <IonToolbar color={"black"}>
        <IonTitle className="px-0" text="left">
          <div onClick={() => setHamburgerOpen(true)}>
            <Hamburger />
          </div>
          <p className="title">
            <img src={logo} alt="logo" className="logo" />
            {t("website.name")}
          </p>
        </IonTitle>
      </IonToolbar>
    </Container>
  );
};

export default Navbar;
