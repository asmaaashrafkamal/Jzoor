import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'; // مهم لدوال toBeInTheDocument وغيرها
import GiftDetails from "../page/GiftDetails";
import { ProductContext } from "../context/ProductContext";

// بيانات وهمية (mock) لهدية للاختبار
const mockGift = {
  id: 1,
  name: "Gift 1",
  img: "/img1.jpg",
  new_price: 25,
};

// توفير السياق (Context) الافتراضي للعنصر GiftDetails
const renderWithContext = (contextValue) => {
  return render(
    <ProductContext.Provider value={contextValue}>
      <GiftDetails />
    </ProductContext.Provider>
  );
};

describe("GiftDetails component", () => {
  test("renders gift details correctly", () => {
    renderWithContext({
      selectedGift: mockGift,
      handleAddToCart: jest.fn(),
      handleAddToFavorite: jest.fn(),
      favorites: [],
    });

    expect(screen.getByText(/gift 1/i)).toBeInTheDocument();
    expect(screen.getByText(/\$25/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /gift 1/i })).toHaveAttribute("src", "/img1.jpg");
  });

  test("shows 'No Gift selected.' when no gift", () => {
    renderWithContext({
      selectedGift: null,
      handleAddToCart: jest.fn(),
      handleAddToFavorite: jest.fn(),
      favorites: [],
    });

    expect(screen.getByText(/no gift selected/i)).toBeInTheDocument();
  });

  test("calls handleAddToCart when Add To Cart button clicked", () => {
    const mockAddToCart = jest.fn();
    renderWithContext({
      selectedGift: mockGift,
      handleAddToCart: mockAddToCart,
      handleAddToFavorite: jest.fn(),
      favorites: [],
    });

    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addToCartBtn);

    expect(mockAddToCart).toHaveBeenCalled();
  });

  test("calls handleAddToFavorite when Add To Favorites button clicked", () => {
    const mockAddToFavorite = jest.fn();
    renderWithContext({
      selectedGift: mockGift,
      handleAddToCart: jest.fn(),
      handleAddToFavorite: mockAddToFavorite,
      favorites: [],
    });

    const addToFavoritesBtn = screen.getByRole("button", { name: /add to favorites/i });
    fireEvent.click(addToFavoritesBtn);

    expect(mockAddToFavorite).toHaveBeenCalled();
  });

  test("shows 'Favorited' if gift is in favorites", () => {
    renderWithContext({
      selectedGift: mockGift,
      handleAddToCart: jest.fn(),
      handleAddToFavorite: jest.fn(),
      favorites: [mockGift],
    });

    expect(screen.getByText(/favorited/i)).toBeInTheDocument();
  });
});
