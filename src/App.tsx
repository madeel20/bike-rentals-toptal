import React, { createContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import CHeader from "./components/CHeader/CHeader";
import LoginPage from "./pages/auth/Login";
import { auth, firestore } from "./firebase";
import firebase from "firebase";
import { Layout, Spin } from "antd";
import styles from "./App.module.css";
import Dashboard from "./pages/user/dashboard/Dashboard";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import SignUpPage from "./pages/auth/Signup";
import MyReservations from "./pages/user/MyReservations/MyReservations";
const { Content } = Layout;

export const UserContext = createContext<{
  isAdmin: boolean;
  user: firebase.User | null | boolean;
}>({
  isAdmin: false,
  user: null,
});

function App() {
  const [user, setUser] = useState<firebase.User | null | boolean>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      setUser(null);
      if (userAuth) {
        firestore
          .collection("Managers")
          .doc(userAuth.uid)
          .get()
          .then((res) => {
            if (res.exists) setIsAdmin(true);
            setUser(userAuth);
          });
      } else {
        setUser(false);
        setIsAdmin(false);
      }
    });
  }, []);

  if (user === null) {
    return (
      <div className="d-flex w-100 min-vh-100 align-items-center justify-content-center">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <Router>
      <UserContext.Provider value={{ user, isAdmin }}>
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
                (isAdmin ? (
                  <>
                    <Route exact path="/" component={AdminDashboard} />
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
