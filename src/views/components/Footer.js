import { Link } from "react-router-dom";
import "./Footer.css";
import { AiOutlineHome, AiFillSetting } from "react-icons/ai";
import { BiNews, BiBarChart } from "react-icons/bi";
import { Container } from "reactstrap";
import { IonToolbar, IonTitle, IonGrid, IonCol, IonRow } from "@ionic/react";

const Footer = () => {
  return (
    <Container className="bottom-navbar">
      <IonToolbar color="black">
        <IonTitle>
          <IonGrid>
            <IonRow>
              <IonCol className="bottom-nav-col">
                <Link to="/">
                  <AiOutlineHome />
                </Link>
              </IonCol>
              <IonCol className="bottom-nav-col">
                <Link to="/about">
                  <BiNews />
                </Link>
              </IonCol>
              <IonCol className="bottom-nav-col">
                <Link to="/dataexplorer">
                  <BiBarChart />
                </Link>
              </IonCol>
              <IonCol className="bottom-nav-col">
                <Link to="/settings">
                  <AiFillSetting />
                </Link>
              </IonCol>
            </IonRow>
            <IonRow style={{ fontSize: "10px" }}>
              <IonCol className="bottom-nav-col">
                <Link to="/">Home</Link>
              </IonCol>
              <IonCol className="bottom-nav-col">
                <Link to="/about">News</Link>
              </IonCol>
              <IonCol className="bottom-nav-col">
                <Link to="/dataexplorer">Data Explorer</Link>
              </IonCol>
              <IonCol className="bottom-nav-col">
                <Link to="/setting">Settings</Link>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonTitle>
      </IonToolbar>
    </Container>
  );
};

export default Footer;
