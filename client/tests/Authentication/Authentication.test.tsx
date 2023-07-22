import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../../src/pages/LoginPage";
import React from "react";
import { backendContext } from "../../src/App";
import TopBar from "../../src/components/TopBar";
import ProfilePage from "../../src/pages/ProfilePage";

describe("LoginPage", () => {
  it("renders title, form, and return button", () => {
    const { getByText } = render(
      <backendContext.Provider
        value={{
          userSession: null,
        }}
      >
        <LoginPage />
      </backendContext.Provider>,
      { wrapper: MemoryRouter }
    );
    const returnButton = getByText("return to home page", { exact: false });
    const title = getByText("login to rezcycle", { exact: false });
    const signIn = screen.getByRole("button", { name: "Sign in" });
    expect(returnButton).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(signIn).toBeInTheDocument();
  });

  it("renders Google & Discord OAuth provider options", () => {
    const { getByText } = render(
      <backendContext.Provider
        value={{
          userSession: null,
        }}
      >
        <LoginPage />
      </backendContext.Provider>,
      { wrapper: MemoryRouter }
    );
    const googleSignIn = getByText("google", { exact: false });
    const discordSignIn = getByText("discord", { exact: false });
    expect(googleSignIn).toBeInTheDocument();
    expect(discordSignIn).toBeInTheDocument();
  });

  // Routing tests incomplete
  //   it("navigates to the home page upon clicking on the return button", async () => {
  //     user.setup();
  //     render(
  //       <MemoryRouter>
  //         <backendContext.Provider
  //           value={{
  //             userSession: null,
  //           }}
  //         >
  //           <LoginPage />
  //         </backendContext.Provider>
  //       </MemoryRouter>
  //     );
  //     const returnButton = screen.getByText("return to home page", {
  //       exact: false,
  //     });
  //     expect(returnButton).toBeInTheDocument();
  //     await user.click(returnButton);
  //     const returnButton2 = screen.queryByText("return to home page", {
  //       exact: false,
  //     });
  //     const queryForm = screen.queryByTestId("query-form");
  //     expect(queryForm).toBeInTheDocument();
  //   });
});

describe("TopBar", () => {
  it("renders the 'LOG IN' button when user is logged out", () => {
    const { getByText } = render(
      <backendContext.Provider
        value={{
          userSession: null,
        }}
      >
        <TopBar sideBarState={[true, () => {}]} />
      </backendContext.Provider>,
      { wrapper: MemoryRouter }
    );
    const loginButton = getByText("log in", { exact: false });
    expect(loginButton).toBeInTheDocument();
  });
  it("renders the 'LOG OUT' button when user is logged in", () => {
    const { getByText } = render(
      <backendContext.Provider
        value={{
          userSession: 1, // Mock value to represent a non null session
        }}
      >
        <TopBar sideBarState={[true, () => {}]} />
      </backendContext.Provider>,
      { wrapper: MemoryRouter }
    );
    const logoutButton = getByText("log out", { exact: false });
    expect(logoutButton).toBeInTheDocument();
  });
});

describe("ProfilePage", () => {
  it("renders when user is logged in", () => {
    const { getByTestId } = render(
      <backendContext.Provider
        value={{
          userSession: 1, // Mock value to represent a non null session
          sideBarState: [true, () => {}],
        }}
      >
        <ProfilePage />
      </backendContext.Provider>,
      { wrapper: MemoryRouter }
    );
    const profilePage = getByTestId("profile-page");
    expect(profilePage).toBeInTheDocument();
  });
  it("informs the user to login to view page if logged out", () => {
    const { getByText } = render(
      <backendContext.Provider
        value={{
          userSession: null,
          sideBarState: [true, () => {}],
        }}
      >
        <ProfilePage />
      </backendContext.Provider>,
      { wrapper: MemoryRouter }
    );
    const loginBanner = getByText("please log in to view profile page", {
      exact: false,
    });
    expect(loginBanner).toBeInTheDocument();
  });
});
