import React, { PureComponent } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container, Header, SideMenu } from "simple-side-menu";

import MENU_ITEMS from "./menuList";

class Menu extends PureComponent {
  state = {
    isOpen: true,
  };

  toggleMenu = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };

  render() {
    return (
      <Router>
        <Container>
          <SideMenu
            isOpen={this.state.isOpen}
            header={<Header logo="../public/logo.png" title="MENU_TITLE" />}
            items={MENU_ITEMS}
          />
          <div className="main">
            <button onClick={this.toggleMenu}>Toggle Me</button>
            <Route exact path="/" component={Dashboard} />
            <Route path="/group/new" component={AddGroup} />
            <Route path="/group/person/new" component={AddPerson} />
            <Route
              path="/notifications/active"
              component={NotificationsActive}
            />
            <Route path="/notifications/off" component={NotificationsOff} />
            <Route path="/settings/profile" component={Profile} />
            <Route path="/settings/apps" component={Application} />
            <Route path="/sign-out" component={LogOut} />
          </div>
        </Container>
      </Router>
    );
  }
}

const RoutePath = ({ path }) => <h4>{path}</h4>;

const Dashboard = () => <RoutePath path="/dashboard" />;
const AddGroup = () => <RoutePath path="/group/new" />;
const AddPerson = () => <RoutePath path="/group/person/new" />;
const NotificationsActive = () => <RoutePath path="/notifications/active" />;
const NotificationsOff = () => <RoutePath path="/notifications/off" />;
const Profile = () => <RoutePath path="/settings/profile" />;
const Application = () => <RoutePath path="/settings/apps" />;
const LogOut = () => <RoutePath path="/sign-out" />;

export default Menu;
