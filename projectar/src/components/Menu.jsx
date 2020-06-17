import React, { PureComponent, useReducer } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container, Header, SideMenu } from "simple-side-menu";
import Switch from "react-switch";

import MENU_ITEMS from "./menuList";

import "../style.css";

class Menu extends PureComponent {
  state = {
    isOpen: true,
    isExpandable: false,
  };

  toggleMenuSelection = (isExpandable) => {
    this.setState({ isExpandable });
  };

  toggleMenu = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };

  render() {
    const { isExpandable, isOpen } = this.state;
    return (
      <Router>
        <Container>
          <SideMenu
            isOpen={isOpen}
            header={
              <Header
                logo="https://atlas-content-cdn.pixelsquid.com/stock-images/low-poly-bubble-letter-p-language-ZR1yom3-600.jpg"
                title="Projectar"
              />
            }
            items={MENU_ITEMS}
            isExpandable={isExpandable}
          />
          <div className="main">
            <nav className="nav-bar">
              <div className="nav-bar__left">
                {!isExpandable && (
                  <div className="btn-menu" onClick={this.toggleMenu}>
                    <i className="material-icons btn-menu__icon">menu</i>
                  </div>
                )}
                <h1 className="title">Welcome {this.props.user.name}</h1>
              </div>
              <label className="nav-bar__right" htmlFor="normal-switch">
                <span className="label">IS EXPANDABLE</span>
                <Switch
                  onChange={this.toggleMenuSelection}
                  checked={isExpandable}
                  id="normal-switch"
                />
              </label>
            </nav>
            <Route exact path="/simple-side-menu/" component={Dashboard} />
            <Route path="/simple-side-menu/group/new" component={AddGroup} />
            <Route
              path="/simple-side-menu/group/person/new"
              component={AddPerson}
            />
            <Route
              path="/simple-side-menu/notifications/active"
              component={NotificationsActive}
            />
            <Route
              path="/simple-side-menu/notifications/off"
              component={NotificationsOff}
            />
            <Route
              path="/simple-side-menu/settings/profile"
              component={Profile}
            />
            <Route
              path="/simple-side-menu/settings/apps"
              component={Application}
            />
            <Route path="/simple-side-menu/sign-out" component={LogOut} />
          </div>
        </Container>
      </Router>
    );
  }
}

export default Menu;

const RoutePath = ({ path }) => <h4 className="path">{path}</h4>;

const Dashboard = () => <RoutePath path="/dashboard" />;
const AddGroup = () => <RoutePath path="/group/new" />;
const AddPerson = () => <RoutePath path="/group/person/new" />;
const NotificationsActive = () => <RoutePath path="/notifications/active" />;
const NotificationsOff = () => <RoutePath path="/notifications/off" />;
const Profile = () => <RoutePath path="/settings/profile" />;
const Application = () => <RoutePath path="/settings/apps" />;
const LogOut = () => <RoutePath path="/sign-out" />;
