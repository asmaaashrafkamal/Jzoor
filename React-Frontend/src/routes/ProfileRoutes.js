import { Routes, Route } from 'react-router-dom';
import MyProfile from '../page/MyProfile';
import Orders from '../page/Orders';
import Notifications from '../page/Notifications';
import MyVouchers from '../page/MyVouchers';
// import PowerBox from '../page/PowerBox';
import MyAccount from '../page/MyAccount';

const ProfileRoutes = () => (
  <Routes>
    <Route path="/profile" element={<MyProfile />}>
  <Route index element={<MyAccount />} />
  <Route path="orders" element={<Orders />} />
  <Route path="notifications" element={<Notifications />} />
  <Route path="my-vouchers" element={<MyVouchers />} />
</Route>
  </Routes>
);

export default ProfileRoutes;
