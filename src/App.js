import React from 'react';

import Header from './components/Header/Header';
import Chart from './components/Chart/Chart';
import Datatable from './components/Datatable/Datatable';
import Footer from './components/Footer/Footer';
import barData from "./data/bar-chart-data.json";
import lineBarData from "./data/line-bar-chart-data.json";

function App() {
  return (
    <div>
      <Header />
      <Chart barData={barData} lineBarData={lineBarData}/>
      <Datatable barData={barData}/>
      <Footer />
    </div>
  );
}

export default App;
