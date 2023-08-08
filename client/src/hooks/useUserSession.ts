import { useState, useEffect } from 'react';
import { UserInfo } from '@/Components/Interfaces';

export const useUserSession = () => {
  const [userData, setUserData] = useState<UserInfo | null>(null);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('user_info');
    if (userInfo) {
      const userCache = JSON.parse(userInfo);
      setUserData(userCache.queries[0]?.state.data.data.data);
    }
  }, []);

  return { userData, setUserData };
}
