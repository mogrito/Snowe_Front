
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './Component/Login';
import MainScreen from './Component/MainView';
import FirstScreen from './Component/FirstView';
import RegisterScreen from './Component/Register';
import ForgotIdScreen from './Component/ForgetId';
import ForgotPasswordScreen from './Component/ForgetPassword';
import WriteScreen from './Component/WriteScreen';
import PostView from './Component/PostView';
import { CustomDrawerContent } from './Component/Drawer';
import SocialView from './Component/SocialView';
import TeacherReserveScreen from './Component/TeacherReserve';
import { LogContextProvider } from './context/LogContext';
import EditScreen from './Component/EditScreen';
import SearchScreen from './Component/SearchScreen';
import SkiResortListScreen from './Component/SkiResortList';
import ReservationListScreen from './Component/ReservationList';
import ChangeNickNameScreen from './Component/ChangeNickName';
import ChangePwScreen from './Component/ChangePw';
import MyPageScreen from './Component/MyPage';
import DeleteUserScreen from './Component/DeleteUser';
import NoticeScreen from './Component/SocialView'
import TeacherInfoScreen from './Component/TeacherInfo';
import TeacherVerifyScreen from './Component/TeacherVerify';
import LessonSignUpScreen from './Component/LessonSignUp';
import TeacherMyPageScreen from './Component/TeacherMyPage';
import TeacherChangeBreifScreen from './Component/TeacherChangeBrief';
import TeacherChangeCarrerScreen from './Component/TeacherChangeCarrer';
import TeacherChangeMySelfScreen from './Component/TeacherChangeMySelf';
import TeacherChangeTeamScreen from './Component/TeacherChangeTeam';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Tab = createMaterialBottomTabNavigator();
const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();


export default function App() {
  const [showFirstScreen, setShowFirstScreen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowFirstScreen(false);
    }, 2000);
  }, []);

  return (
    <NavigationContainer>
      <LogContextProvider>
        <RootStack.Navigator>
          {showFirstScreen ? (
            <RootStack.Screen
              name="FirstView"
              component={FirstScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <RootStack.Screen
              name="Drawer"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />
          )}

          <RootStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}


          />
          <RootStack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="ForgetId"
            component={ForgotIdScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="ForgetPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Write"
            component={WriteScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="게시판으로 가기"
            component={SocialView}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="PostView"
            component={PostView}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="게시글 수정"
            component={EditScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="SkiResortList"
            component={SkiResortListScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="ReservationList"
            component={ReservationListScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="MyPage"
            component={MyPageScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="ChangePw"
            component={ChangePwScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="ChangeNickName"
            component={ChangeNickNameScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="DeleteUser"
            component={DeleteUserScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="NoticeInfo"
            component={NoticeScreen}
            options={{ headerShown: false }}

          />
          <RootStack.Screen
            name="TeacherVerify"
            component={TeacherVerifyScreen}
            options={{ headerShown: false }}

          />
          <RootStack.Screen
            name="LessonSignUp"
            component={LessonSignUpScreen}
            options={{ headerShown: false }}

          />
          <RootStack.Screen
            name="TeacherMyPage"
            component={TeacherMyPageScreen}
            options={{ headerShown: false }}

          />
          <RootStack.Screen
            name="TeacherChangeBrief"
            component={TeacherChangeBreifScreen}
            options={{ headerShown: false }}

          />
          <RootStack.Screen
            name="TeacherChangeCarrer"
            component={TeacherChangeCarrerScreen}
            options={{ headerShown: false }}

          />
          <RootStack.Screen
            name="TeacherChangeMySelf"
            component={TeacherChangeMySelfScreen}
            options={{ headerShown: false }}

          />
          <RootStack.Screen
            name="TeacherChangeTeam"
            component={TeacherChangeTeamScreen}
            options={{ headerShown: false }}

          />
        </RootStack.Navigator>
      </LogContextProvider>
    </NavigationContainer>
  );
}



function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="SkiResortList" component={SkiResortListScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}


function TabNavigator({ navigation }) {
  const [userRole, setUserRole] = useState(null);

  const fetchData = async () => {
    try {
      const storedRole = await AsyncStorage.getItem('role');
      setUserRole(storedRole || 'Guest');
      console.log('AsyncStorage에서 저장된 역할:', storedRole);
    } catch (error) {
      console.error('AsyncStorage에서 역할을 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    const pollInterval = setInterval(fetchData, 10);

    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return () => {
      clearInterval(pollInterval);
  
      unsubscribe();
    };
  }, [navigation]);

  return (
    <Tab.Navigator
      activeColor="#000000"
      inactiveColor="#000000"
      barStyle={{ backgroundColor: '#EFFBFB', height: 80 }}
      tabBarOptions={{
        showLabel: true,
        labelStyle: { fontSize: 12 },
        activeTintColor: '#ffffff',
        inactiveTintColor: '#b0bec5',
      }}
    >
      <Tab.Screen
        name="MainView"
        component={MainScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home"
              color={color}
              size={26}
            />
          ),
        }}
      />

      {/* TEACHER 역할에 따라서 강습 예약 또는 내 강습 등록으로 변경 */}
      {userRole === 'TEACHER' ? (
        <Tab.Screen
          name="LessonSignUp"
          component={LessonSignUpScreen}
          options={{
            tabBarLabel: '내 강습 등록',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="calendar-plus"
                color={color}
                size={26}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="TeacherReserve"
          component={TeacherReserveScreen}
          options={{
            tabBarLabel: '강습 예약',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="calendar-clock"
                color={color}
                size={26}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="SocialView"
        component={SocialView}
        options={{
          tabBarLabel: '자유게시판',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        name="TeacherInfo"
        component={TeacherInfoScreen}
        options={{
          tabBarLabel: '강사 정보',
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              name="chalkboard-teacher"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}