// App.js
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import PrivateRoute from "./components/auth/privateRoute";
import Customers from "./page/customers";
import Companies from "./page/companies";
import Login from "./page/auth/login";
import Home from "./page/home";
import NotFound from "./page/notFound";
import Layout from "./layout";
import Dashboard from "./page/dashboard";
import CustomerForm from "./page/customers/form";
import CompanyForm from "./page/companies/form";
import CompanyView from "./page/companies/view";
import CustomerView from "./page/customers/view";

function App() {
  return (
    <Layout>
      <div className="flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="*" element={<NotFound/>}/>
            <Route path="/auth/login" element={<Login/>}/>

            <Route element={<PrivateRoute/>}>
              <Route path="/dashboard" element={<Dashboard/>}/>

              <Route path="/customers/*" element={<Customers/>}/>
              <Route path="/customer/form" element={<CustomerForm />} />
              <Route path="/customer/form/:id" element={<CustomerForm />} />
              <Route path="/customer/view/:id" element={<CustomerView />} />


              <Route path="/companies/*" element={<Companies/>}/>
              <Route path="/company/form" element={<CompanyForm />} />
              <Route path="/company/form/:id" element={<CompanyForm />} />
              <Route path="/company/view/:id" element={<CompanyView />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Layout>
  );
}

export default App;
