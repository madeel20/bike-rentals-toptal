import React, { createContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import CHeader from "./components/CHeader/CHeader";
import LoginPage from "./pages/auth/Login";
import { auth } from "./firebase";
import firebase from "firebase";
import { Layout, Spin } from "antd";
import styles from "./App.module.css";
import Dashboard from "./pages/user/dashboard/Dashboard";
import ManagerDashboard from "./pages/manager/Dashboard";
import SignUpPage from "./pages/auth/Signup";
import MyReservations from "./pages/user/myReservations/MyReservations";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";

const { Content } = Layout;

export const UserContext = createContext<{
  isManager: boolean;
  user: firebase.User | null | boolean;
}>({
  isManager: false,
  user: null,
});

function App() {
  const [user, setUser] = useState<firebase.User | null | boolean>(null);
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      setUser(null);
      if (userAuth) {
        checkRole();
        setUser(userAuth);
      } else {
        setUser(false);
        setIsManager(false);
      }
    });
  }, []);

  const checkRole = () => {
    auth?.currentUser
      ?.getIdTokenResult()
      .then((idTokenResult) => {
        // Confirm the user is a manager.
        if (!!idTokenResult.claims?.isManager) {
          auth?.currentUser?.getIdToken().then((res) => {
            axios.defaults.headers.common["Authorization"] = res;
          });
          // Show manager UI.
          setIsManager(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (user === null) {
    return (
      <div className="d-flex w-100 min-vh-100 align-items-center justify-content-center">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <Router>
      <UserContext.Provider value={{ user, isManager }}>
        <Layout>
          <CHeader />
          <Content className={styles.content}>
            <Switch>
              {!auth.currentUser && (
                <>
                  <Route exact path="/" component={LoginPage} />
                  <Route exact path="/signup" component={SignUpPage} />
                </>
              )}
              {user &&
                (isManager ? (
                  <>
                    <Route exact path="/" component={ManagerDashboard} />
                  </>
                ) : (
                  <>
                    <Route exact path="/" component={Dashboard} />
                    <Route
                      exact
                      path="/my-reservations"
                      component={MyReservations}
                    />
                  </>
                ))}
              <Redirect path="*" to="/" />
            </Switch>
          </Content>
        </Layout>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
