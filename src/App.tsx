import React,{ useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import CHeader from "./components/CHeader/CHeader";
import LoginPage from "./pages/login/Login";
import { auth, firestore } from "./firebase";
import firebase from 'firebase';
import { Layout } from "antd";
import styles from "./App.module.css";
import Dashboard from "./pages/user/dashboard/Dashboard";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminLogin from "./pages/login/AdminLogin";
import CaloriesPerDay from "./pages/user/caloriesPerDay/CaloriesPerDay";
import SignUpPage from "./pages/login/Signup";
// import Reports from "./pages/admin/reports/Reports";
const { Content } = Layout;

function App() {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
    setUser(null);
      if (userAuth) {
       
        firestore
          .collection("admins")
          .doc(userAuth.uid)
          .get()
          .then((res) => {
            if (res.exists) setIsAdmin(true);
            setUser(userAuth);
          });
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
  }, []);

  // if (user === null) {
  //   return null;
  // }
  return (
    <Router>
      <Layout>
        <CHeader />
        <Content className={styles.content}>
          <Switch>
            {!auth.currentUser && (
              <>
                <Route exact path="/" component={LoginPage} />
                <Route exact path="/signup" component={SignUpPage} />
                <Route exact path="/admin-login" component={AdminLogin} />
              </>
            )}
            {user &&
              (isAdmin ? (
                <>
                <Route exact path="/" component={AdminDashboard} />
                {/* <Route exact path="/reports" component={Reports} /> */}
                </>
              ) : (
                <>
                  <Route exact path="/" component={Dashboard} />
                  <Route
                    exact
                    path="/calories-per-day"
                    component={CaloriesPerDay}
                  />
                </>
              ))}
            <Redirect path="*" to="/" />
          </Switch>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
