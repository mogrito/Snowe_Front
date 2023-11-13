
import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialCommunityIcons, FontAwesome, Foundation } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getTokenFromLocal } from './TokenUtils';
import { checkTokenAndNavigate } from './TokenUtils';

export function CustomDrawerContent({ navigation }) {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('role');
        const storedName = await AsyncStorage.getItem('name');
        setUserRole(storedRole || 'Guest');
        setUserName(storedName || null);
        console.log('AsyncStorage에서 저장된 역할:', storedRole);
      } catch (error) {
        console.error('AsyncStorage에서 역할을 가져오는 중 오류 발생:', error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const token = await getTokenFromLocal();
        console.log(token);
        const response = await fetch('http://192.168.25.204:8080/member/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          AsyncStorage.setItem('role', data.role);
          AsyncStorage.setItem('name', data.name);
          fetchData(); // AsyncStorage에서 역할을 업데이트한 후 역할을 가져오기
        } else {
          throw new Error('사용자 역할을 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error(error);
        AsyncStorage.setItem('role', 'Guest');
        AsyncStorage.setItem('name', null);
        fetchData(); // AsyncStorage에서 역할을 업데이트한 후 역할을 가져오기
      }
    };

    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchUserRole();
    });

    // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
    return () => {
      unsubscribeFocus();
    };
  }, [navigation]);

  return (
    <DrawerContentScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 19 }}>
        <Image
          source={require('../Images/UserIcon.jpg')}
          style={{ width: 72, height: 72, borderRadius: 36 }}
        />
        {userRole === 'Guest' || !userName ? (
          <TouchableOpacity onPress={() => checkTokenAndNavigate(navigation)}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
              로그인하기
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
            {userName} 님
          </Text>
        )}
      </View>
      <DrawerItem
        label={userRole === 'TEACHER' ? '강사 마이페이지' : (userRole === 'Guest' || userRole === null) ? '마이페이지' : '마이페이지'}
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        )}
        onPress={() => {
          console.log(userRole);
          if (userRole === 'TEACHER') {
            navigation.navigate('TeacherMyPage');
          } else if (userRole === 'USER') {
            navigation.navigate('MyPage');
          } else if (userRole === 'Guest' || userRole === null) {
            navigation.navigate('Login');
          }
        }}
      />
      <DrawerItem
        label="스키장 리스트"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="ski" color={color} size={size} />
        )}
        onPress={() => navigation.navigate('SkiResortList')}
      />
      <DrawerItem
        label="예약 목록"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="account-clock" color={color} size={size} />
        )}
        onPress={() => navigation.navigate('ReservationList')}
      />
      <DrawerItem
        label="강사자격 신청 및 등록"
        icon={({ color, size }) => (
          <FontAwesome name="id-card-o" color={color} size={size} />
        )}
        onPress={() => navigation.navigate('TeacherVerify')}
      />
    </DrawerContentScrollView>
  );
}