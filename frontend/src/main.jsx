import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.jsx'
import {store} from './redux/store.js'
import {Provider} from "react-redux";
import {Route, RouterProvider,createRoutesFromElements} from 'react-router'
import {createBrowserRouter} from 'react-router-dom'
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import PrivateRoute from './pages/Auth/PrivateRoute.jsx';
import Profile from './pages/User/Profile.jsx';
import AdminRoute from './pages/Admin/adminRoute.jsx';
import GetAllUsers from './pages/Admin/getAllusers.jsx';
import CategoryList from './pages/Admin/categoryList.jsx'
import ProductList from './pages/Admin/createProduct.jsx'
import AllProducts from './pages/Admin/allProducts.jsx'
import AdminProductUpdate from './pages/Admin/updateProduct.jsx'
import MainPageHome from './Home.jsx'
import Favorites from './pages/Products/Favroite.jsx'
import ProductDetails from './pages/Products/ProductDetails.jsx'
import Cart from './pages/User/cart.jsx'
import Shop from './pages/User/shop.jsx'
import Checkout from './pages/Orders/CheckoutPage.jsx'
import PlaceOrder from './pages/Orders/placeOrder.jsx'
import OrderList from './pages/Admin/AllOrders.jsx'
import OrderDetail from './pages/Orders/singleOrderDetail.jsx'
import UserOrder from './pages/Orders/userOrder.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
 const router = createBrowserRouter(
  createRoutesFromElements(
    <>
 <Route path="/" element={<App />} >
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route index={true} element={<MainPageHome/>} />
    <Route path="/favorite" element={<Favorites/>} />
    <Route path="/product/:id" element={<ProductDetails/>} />
    <Route path="/cart" element={<Cart/>} />
    <Route path="/shop" element={<Shop/>} />
    <Route path="/orders/myorders/:id" element={<UserOrder/>} />
      {/* rgistered users access */}
    <Route path="" element={<PrivateRoute />}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/shipping" element={<Checkout/>} />
      <Route path="/placeorder" element={<PlaceOrder/>} />
      <Route path="/order/:id" element={<OrderDetail/>} />
      </Route>
      {/* admin access */}
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/userlist" element={<GetAllUsers />} />
        <Route path="/admin/categorylist" element={<CategoryList />} />
        <Route path="/admin/productlist" element={<ProductList />} />
        <Route path="/admin/allproductslist" element={<AllProducts />} />
        <Route path="/admin/product/update/:id" element={<AdminProductUpdate/>} />
         <Route path="/admin/orderlist" element={<OrderList/>} />
         <Route path="/admin/dashboard" element={<AdminDashboard/>} />
      </Route>
  </Route>    
  </>
  )
)
createRoot(document.getElementById('root')).render(
<Provider store={store}>
  <RouterProvider router={router} />  
    </Provider>
  )
