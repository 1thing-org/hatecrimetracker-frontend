import React from "react";
import "./Footer.css";
import { AiOutlineHome, AiFillSetting } from "react-icons/ai";
import { BiNews, BiBarChart } from "react-icons/bi";
import { Container, Label } from "reactstrap";
import { IonToolbar, IonTitle, IonGrid, IonCol, IonRow } from "@ionic/react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Container className="bottom-navbar">
      <IonToolbar color="black">
        <IonTitle>
          <IonGrid>
            <IonRow>
              <IonCol className="bottom-nav-col">
                <AiOutlineHome />
              </IonCol>
              <IonCol className="bottom-nav-col">
                <BiNews />
              </IonCol>
              <IonCol className="bottom-nav-col">
                <BiBarChart />
              </IonCol>
              <IonCol className="bottom-nav-col">
                <AiFillSetting />
              </IonCol>
            </IonRow>
            <IonRow style={{ fontSize: "10px" }}>
              <IonCol className="bottom-nav-col">Home</IonCol>
              <IonCol className="bottom-nav-col">News</IonCol>
              <IonCol className="bottom-nav-col">Data</IonCol>
              <IonCol className="bottom-nav-col">Settings</IonCol>
            </IonRow>
          </IonGrid>
        </IonTitle>
      </IonToolbar>
    </Container>
  );
};

export default Footer;
