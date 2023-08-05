import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import Swal from "sweetalert2";
import { User } from './Interfaces';

const QRScan = () => {
  const [data, setData] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem('user_info')) {
      const userCache = JSON.parse(sessionStorage.getItem('user_info') || '');
      setIsLoggedIn(userCache !== null);
      setUserInfo(userCache.queries[0]?.state.data.user);
    }
    }, []);

  console.log(userInfo)

  const handleScan = (scanData: any) => {
    console.log(`loaded data`, scanData);
    if (scanData) {
      console.log(`loaded >>>`, scanData);
      setData(scanData.data);
  
      Swal.fire('QR Code Data', `Data: ${userInfo?.wallet.address}`, 'info');
    }
  };
  
  const handleError = (err: any) => {
    console.error(err);
  };
  
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center gap-4">
      <QrReader
        facingMode='environment'
        delay={1000}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "500px", borderRadius: '20px' }}/>
    </div>
  );
};

export default QRScan;
