import React, { useEffect, useState,} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,ScrollView, Dimensions } from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';
import { checkTokenAndNavigate } from './TokenUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getInfo } from './TokenUtils';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';


const faceImage = 
  { 김희찬: require('../Images/face.jpg') ,
    홍주성: require('../Images/face1.jpg'), 
    장원빈: require('../Images/face2.jpg') ,
    김정훈: require('../Images/face3.jpg') ,
  };

const TeacherMyPageScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [user, setUser] = useState({
    name: '',
    email: '',
    image: require('../Images/face.jpg'),
  });

  useEffect(() => {
    checkTokenAndNavigate(navigation);

    async function fetchData() {
      try {
        const result = await getInfo();
        setData(result);
      } catch (error) {
        console.error('데이터 가져오기 중 오류 발생:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setUser({
        name: data.name,
        email: data.email,
       
      });
    }
  }, [data]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('Tokens');
    navigation.pop();
  };

  const onGoBack = () => {
    navigation.pop();
  };

  const DeleteUserPage = () => {
    navigation.navigate('DeleteUser');
  };

  const ChangeNickNamePage = () => {
    navigation.navigate('ChangeNickName');
  };

  const ChangePwPage = () => {
    navigation.navigate('ChangePw');
  };

  const NoticePage = () => {
    navigation.navigate('NoticeInfo');
  };

  const ChangeMySelfPage = () => {
    navigation.navigate('TeacherChangeMySelf')
  }
  const ChangeCarrerPage = () => {
    navigation.navigate('TeacherChangeCarrer')
  }
  const ChangeBriefPage = () => {
    navigation.navigate('TeacherChangeBrief')
  }
  const ChangeTeamPage = () => {
    navigation.navigate('TeacherChangeTeam')
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TransparentCircleButton onPress={onGoBack} name="left" color="#424242" />
        <Text style={styles.title}>내 정보</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
        <Image style={styles.profileImage} source={faceImage[user.name]} />
          <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.accountContainer}>
          <Text style={styles.accountheader}>계정</Text>
          <View style={styles.account}>
          <TouchableOpacity onPress={ChangeNickNamePage}>
            <Text style={styles.accountName}>닉네임 변경</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ChangePwPage}>
            <Text style={styles.accountPw}>비밀번호 변경</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ChangeMySelfPage}>
            <Text style={styles.accountPw}>한줄소개 변경</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ChangeCarrerPage}>
            <Text style={styles.accountPw}>경력 변경</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ChangeBriefPage}>
            <Text style={styles.accountPw}>약력 변경</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ChangeTeamPage}>
            <Text style={styles.accountPw}>소속 변경</Text>
          </TouchableOpacity>
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionheader}>이용 안내</Text>
          <View style={styles.appverContainer}>
            <Text style={styles.appver}>앱 버전</Text>
            <Text style={styles.appvertext}>1.0.0(2023110412)</Text>
          </View>
          <Text style={styles.ask}>문의하기</Text>
          <TouchableOpacity onPress={NoticePage}>
          <Text style={styles.infor}>공지사항</Text>
          </TouchableOpacity>
          <Text style={styles.license}>오픈소스 라이선스</Text>
        </View>

        <View style={styles.otherContainer}>
          <Text style={styles.otherheader}>기타</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logout}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={DeleteUserPage}>

            <Text style={styles.quit}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBEBF9',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  profileContainer: {
    
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    height: 100,
    borderRadius: 10,
    backgroundColor: 'white',

  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginLeft: 20,
  },
  userInfoContainer: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 20,
    marginRight:30,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  accountContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  account: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    marginBottom: 25,
  },
  accountPw: {
    fontSize: 16,
    marginBottom: 25,
  },
  accountheader: {
    fontSize: 18,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  questionContainer: {
    flexDirection: 'column',
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  appver: {
    fontSize: 16,
    marginBottom: 25,
  },
  ask: {
    fontSize: 16,
    marginBottom: 25,
  },
  infor: {
    fontSize: 16,
    marginBottom: 25,
  },
  license: {
    fontSize: 16,
    marginBottom: 25,
  },
  questionheader: {
    fontSize: 18,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  otherContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logout: {
    fontSize: 16,
    marginBottom: 25,
  },
  quit: {
    fontSize: 16,
    marginBottom: 25,
  },
  otherheader: {
    fontSize: 18,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  appverContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex:1,
  },
  appvertext: {
    color: 'gray',
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
});

export default TeacherMyPageScreen;