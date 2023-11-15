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

const MyPageScreen = () => {
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
        image: require('../Images/face.jpg'),
      });
    }
  }, [data]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('Tokens');
      await AsyncStorage.removeItem('role');
      navigation.pop();
    } catch (error) {
      console.error('AsyncStorage에서 아이템을 제거하는 중 오류 발생:', error);
    }
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

  const handleAccountDeletion = async () => {
    Alert.alert(
      '회원탈퇴',
      '회원탈퇴를 진행하시겠습니까?',
      [
        {
          text: '아니요',
          onPress: () => {
            // 아무 작업도 수행하지 않음
          },
          style: 'cancel',
        },
        {
          text: '예',
          onPress: async () => {
            try {
              const response = await fetch('API', {
                method: 'DELETE',
                headers: {
                  'Authorization': 'Bearer ' + 'YOUR_AUTH_TOKEN',
                  'Content-Type': 'application/json',
                },
              });

              // 삭제 후의 작업 수행
            } catch (error) {
              console.error('회원탈퇴 중 오류 발생:', error);
            }
          },
        },
      ],
    );
  };
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

export default MyPageScreen;