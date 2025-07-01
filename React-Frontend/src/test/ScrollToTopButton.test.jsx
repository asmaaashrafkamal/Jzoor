import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'; // ضروري لدوال toBeInTheDocument
import ScrollToTopButton from "../components/ScrollToTopButton";

jest.mock("react-scroll", () => ({
  animateScroll: {
    scrollToTop: jest.fn(),
  },
}));

describe("ScrollToTopButton component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render button initially", () => {
    render(<ScrollToTopButton />);
    const button = screen.queryByRole("button", { name: /scroll to top/i });
    expect(button).not.toBeInTheDocument();
  });

  test("shows button when window is scrolled more than 300", async () => {
    render(<ScrollToTopButton />);

    // غلاف الحدث ب act
    await act(async () => {
      Object.defineProperty(window, "scrollY", { value: 350, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    // انتظر ظهور الزر
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /scroll to top/i })).toBeInTheDocument();
    });
  });

  test("calls scrollToTop when button is clicked", async () => {
    const { animateScroll } = require("react-scroll");
    render(<ScrollToTopButton />);

    await act(async () => {
      Object.defineProperty(window, "scrollY", { value: 350, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    const button = await screen.findByRole("button", { name: /scroll to top/i });
    fireEvent.click(button);

    expect(animateScroll.scrollToTop).toHaveBeenCalledWith({ smooth: true, duration: 500 });
  });
});
