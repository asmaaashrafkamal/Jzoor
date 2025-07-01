import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductSection from "../components/ProductSection";
import { ProductContext } from "../context/ProductContext";
import { BrowserRouter } from "react-router-dom";  // استيراد BrowserRouter

// بيانات وهمية للمنتجات
const mockProducts = [
  {
    id: 1,
    name: "Product 1",
    img: "/img1.jpg",
    prev_price: 30,
    new_price: 25,
  },
  {
    id: 2,
    name: "Product 2",
    img: "/img2.jpg",
    prev_price: 50,
    new_price: 45,
  },
];

// دالة مساعدة للتغليف بالسياق والراوتر
const renderWithContext = () => {
  return render(
    <BrowserRouter>
      <ProductContext.Provider
        value={{
          products: mockProducts,
          handleAddToCart: jest.fn(),
          handleAddToFavorite: jest.fn(),
          handleRemoveFromFavorite: jest.fn(),
          isFavorite: () => false,
          setSelectedProduct: jest.fn(),
        }}
      >
        <ProductSection />
      </ProductContext.Provider>
    </BrowserRouter>
  );
};

describe("ProductSection", () => {
  test("يضيف المنتج إلى السلة عند الضغط على زر Add To Cart", () => {
    const handleAddToCartMock = jest.fn();

    render(
      <BrowserRouter>
        <ProductContext.Provider
          value={{
            products: mockProducts,
            handleAddToCart: handleAddToCartMock,
            handleAddToFavorite: jest.fn(),
            handleRemoveFromFavorite: jest.fn(),
            isFavorite: () => false,
            setSelectedProduct: jest.fn(),
          }}
        >
          <ProductSection />
        </ProductContext.Provider>
      </BrowserRouter>
    );

    const addToCartButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButtons[0]);
    expect(handleAddToCartMock).toHaveBeenCalledTimes(1);
    expect(handleAddToCartMock).toHaveBeenCalledWith(mockProducts[0]);
  });
});
