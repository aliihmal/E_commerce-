import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import SalesPage from './pages/SalesPage';
import AboutPage from './pages/AboutPage';
import AddCollectionPage from './pages/AddCollection';
import LoginPage from './pages/LogInPage';
import RegisterPage from './pages/SignUp';
import DeleteProductPage from './pages/deleteProduct';
import AdminRoute from './routes/AdminRoutes';
import CreateProductPage from './pages/productCreation';
import DeleteCollectionPage from './pages/DeleteCollection';
import SetProductOnSalePage from './pages/AddSale';
import RemoveFromSalePage from './pages/RemoveSale';
import AdminOrdersPage from './pages/OrderPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/:id" element={<CollectionDetailPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<HomePage />} />
              <Route path="/logIn" element={<LoginPage/>}/>
              <Route path="SignUp" element={<RegisterPage/>}/>

              


              <Route element={<AdminRoute />}>


                <Route path="/Orders" element={<AdminOrdersPage/>}/>
                <Route path="/AddSale" element={<SetProductOnSalePage/>}/>
                <Route path='creatprod' element={<CreateProductPage/>}/>
                <Route path="/collectionCreation" element={<AddCollectionPage />} />
                <Route path="/RemoveSale" element={<RemoveFromSalePage />} />
                      
                <Route path="/deleteCol" element={<DeleteCollectionPage/>}/>
                      <Route
                          path="/Deleteprod"
                          element={<DeleteProductPage />}
                      />
                </Route>
            </Route>
          </Routes>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
