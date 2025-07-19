import React, { useState, createContext, useEffect } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [Sellerproducts, setSellerProducts] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [journals, setJournals] = useState([]);
  const [pots, setPots] = useState([]);
  const [storage, setStorage] = useState([]);
  const [care, setCare] = useState([]);
  const [Accessories, setAccessories] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedGift, setSelectedGift] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  // تحميل البيانات من JSON باستخدام fetch
  useEffect(() => {
    fetch('data.json')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data); // عرض أول 8 منتجات فقط
      })
      .catch((err) => {
        console.error('حدث خطأ أثناء تحميل المنتجات:', err);
      });
  }, []);
  useEffect(() => {
    fetch('SellerProduct.json')
      .then((res) => res.json())
      .then((data) => {
        setSellerProducts(data); // عرض أول 8 منتجات فقط
      })
      .catch((err) => {
        console.error('حدث خطأ أثناء تحميل المنتجات:', err);
      });
  }, []);

  useEffect(() => {
    fetch('gift.json')
      .then((res) => res.json())
      .then((data) => {
        setGifts(data); // عرض أول 8 منتجات فقط
      })
      .catch((err) => {
        console.error('حدث خطأ أثناء تحميل المنتجات:', err);
      });
  }, []);

  useEffect(() => {
    fetch('journals.json')
      .then((res) => res.json())
      .then((data) => {
        setJournals(data); //ض أول
      })
      .catch((err) => {
        console.error('حدث خطأ:', err);
      });
  }, []);
  useEffect(() => {
    fetch('Care.json')
      .then((res) => res.json())
      .then((data) => {
        setCare(data); //ض أول
      })
      .catch((err) => {
        console.error('حدث خطأ:', err);
      });
  }, []);


  useEffect(() => {
    fetch('Pots.json')
      .then((res) => res.json())
      .then((data) => {
        setPots(data); //ض أول
      })
      .catch((err) => {
        console.error('حدث خطأ:', err);
      });
  }, []);

  useEffect(() => {
    fetch('Accessories.json')
      .then((res) => res.json())
      .then((data) => {
        setAccessories(data); //ض أول
      })
      .catch((err) => {
        console.error('حدث خطأ:', err);
      });
  }, []);


  useEffect(() => {
    fetch('Storage.json')
      .then((res) => res.json())
      .then((data) => {
        setStorage(data); //ض أول
      })
      .catch((err) => {
        console.error('حدث خطأ:', err);
      });
  }, []);

  // تحقق مما إذا كان المنتج موجود بالمفضلة
const isFavorite = (id) => {
  return favorites.some((item) => item.id === id);
};

// حذف من المفضلة
const handleRemoveFromFavorite = (id) => {
  setFavorites((prevFavorites) =>
    prevFavorites.filter((item) => item.id !== id)
  );
};


  // إضافة للسلة
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // إضافة للمفضلة
  const handleAddToFavorite = (product) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.find((item) => item.id === product.id);
      if (!exists) {
        return [...prevFavorites, product];
      }
      return prevFavorites;
    });
  };

  // إزالة من السلة
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // زيادة الكمية
  const handleIncrement = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // إنقاص الكمية (لا تقل عن 1)
  const handleDecrement = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        Sellerproducts,
        setProducts,
        gifts,
        setGifts,
        cart,
        setCart,
        selectedProduct,
        setSelectedProduct,
        selectedGift,
        setSelectedGift,
        favorites,
        setFavorites,
        handleAddToCart,
        handleAddToFavorite,
        removeFromCart,
        handleIncrement,
        handleDecrement,
        handleRemoveFromFavorite,
        isFavorite,
        journals,
        setSelectedJournal,
        selectedJournal,
        pots,
        Accessories,
        storage,
        care
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
