/**
 *  @jest-environment jsdom
 */

import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import RegPage from "../pages/RegPage";
import { BrowserRouter } from "react-router-dom";

describe("ui tests for RegPage component", () => {
  test("renders LoginPage", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    const buttonElement = screen.getByText(/Check ID/);
    expect(buttonElement).toBeInTheDocument();
  });

  test("add text to ID box", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    let idElement = screen.getByPlaceholderText(/enter id here/);
    await act(async () => {
      await userEvent.type(idElement, "mary");
    });
    expect(idElement.value).toBe("mary");
  });

  test("add text to password box", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    let idElement = screen.getByPlaceholderText(/enter pw here/);
    await act(async () => {
      await userEvent.type(idElement, "hi");
    });
    expect(idElement.value).toBe("hi");
  });

  test("add text to password again box", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    let idElement = screen.getByPlaceholderText(/enter pw again here/);
    await act(async () => {
      await userEvent.type(idElement, "hi");
    });
    expect(idElement.value).toBe("hi");
  });

  test("add text to first name box", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    let idElement = screen.getByPlaceholderText(/enter first name here/);
    await act(async () => {
      await userEvent.type(idElement, "hi");
    });
    expect(idElement.value).toBe("hi");
  });

  test("add text to last name box", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    let idElement = screen.getByPlaceholderText(/enter last name here/);
    await act(async () => {
      await userEvent.type(idElement, "hi");
    });
    expect(idElement.value).toBe("hi");
  });

  test("add text to email box", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    let idElement = screen.getByPlaceholderText(/enter email here/);
    await act(async () => {
      await userEvent.type(idElement, "hi");
    });
    expect(idElement.value).toBe("hi");
  });

  test("add text to security question", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    let idElement = screen.getByPlaceholderText(/enter question here/);
    await act(async () => {
      await userEvent.type(idElement, "hi");
    });
    expect(idElement.value).toBe("hi");
  });

  test("add text to security answer", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    let idElement = screen.getByPlaceholderText(/enter answer here/);
    await act(async () => {
      await userEvent.type(idElement, "hi");
    });
    expect(idElement.value).toBe("hi");
  });

  test("Existing ID checkID button displays error message", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    let idElement = screen.getByPlaceholderText(/enter id here/);
    await act(async () => {
      await userEvent.type(idElement, "mary");
    });
    await act(async () => {
      await userEvent.click(screen.getByText(/Check ID/));
    });
    await waitFor(() => {
      const textElement = screen.queryByText(/id already exists/);
      expect(textElement).toBeInTheDocument();
    });
  });

  test("Existing ID checkID button displays error message", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    let idElement = screen.getByPlaceholderText(/enter id here/);
    await act(async () => {
      await userEvent.type(idElement, "mary");
    });
    await act(async () => {
      await userEvent.click(screen.getByText(/Check ID/));
    });
    await waitFor(() => {
      const textElement = screen.queryByText(/id already exists/);
      expect(textElement).toBeInTheDocument();
    });
  });

  test("Too short id checkID button displays error message", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    let idElement = screen.getByPlaceholderText(/enter id here/);
    await act(async () => {
      await userEvent.type(idElement, "i");
    });
    await act(async () => {
      await userEvent.click(screen.getByText(/Check ID/));
    });
    await waitFor(() => {
      const textElement = screen.queryByText(/id should be of length 3~12 letters/);
      expect(textElement).toBeInTheDocument();
    });
  });

  test("ID with symbols checkID button displays error message", async () => {
    render(
      <BrowserRouter>
        <RegPage />
      </BrowserRouter>
    );
    let idElement = screen.getByPlaceholderText(/enter id here/);
    await act(async () => {
      await userEvent.type(idElement, "....");
    });
    await act(async () => {
      await userEvent.click(screen.getByText(/Check ID/));
    });
    await waitFor(() => {
      const textElement = screen.queryByText(/id should only have lowercase letters and numbers/);
      expect(textElement).toBeInTheDocument();
    });
  });
});
