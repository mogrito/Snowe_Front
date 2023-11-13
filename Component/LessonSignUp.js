import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Font from 'expo-font';
import TransparentCircleButton from './TransparentCircleButton';
import { TextInputMask } from 'react-native-masked-text' 
import { Calendar } from 'react-native-calendars';
import backgroundImage from '../Images/dr1.png'; 
import { FontAwesome5 } from '@expo/vector-icons';
import { max } from 'date-fns';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokenFromLocal } from './TokenUtils';

const LessonSignUpScreen = () => {

  const [lessonname, setLessonname] = useState('');
  const [startday, setStartday] = useState('');
  const [endday, setEndday] = useState('');
  const [level, setLevel] = useState('');
  const [age, setAge] = useState('');
  const [startlessontime, setStartLessontime] = useState('');
  const [endlessontime, setEndLessontime] = useState('');
  const [ampm,setAmPm] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  const [maxReserveCount, setMaxReserveCount] = useState('');
  const [isSki, setIsSki] = useState(false);
  const [isBoard, setIsBoard] = useState(false);
  const [lessonClass, setLessonClass] = useState('');
  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [lessonIntroduce, setLessonIntroduce] = useState('');
  const navigation = useNavigation();
  
  const URL = 'http://192.168.25.204:8080';
  
  const onGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    async function loadCustomFont() {
      await Font.loadAsync({
        DMSerifText1: require('../assets/fonts/DMSerifText1.ttf'),
      });
      setFontLoaded(true);
    }

    loadCustomFont();
  }, []);

  const handleRegister = async () => {
    const token = await getTokenFromLocal();
    const authorizationHeader = `Bearer ${token}`;

    if (!lessonname) {
      alert('강습명을 입력해 주세요.');
      return;
    }
  
    if (!startday || !endday) {
      alert('시작일과 종료일을 선택해주세요.');
      return;
    }
  
    if (!level) {
      alert('강습 난이도를 선택해 주세요.');
      return;
    }
  
    if (!age) {
      alert('강습 연령대를 선택해 주세요.');
      return;
    }
  
    if (!startlessontime || !endlessontime || !ampm) {
      alert('강습 시간이 올바르게 입력되지 않았습니다. 확인해주세요.');
      return;
    }
  
    if (!maxReserveCount) {
      alert('강습 최대 인원이 입력되지 않았습니다. 입력해주세요.');
      return;
    }
  
    if (!lessonClass) {
      alert('강습 분류를 선택해주세요.');
      return;
    }
  
    if (!lessonIntroduce) {
      alert('강습 소개를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${URL}/lesson/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorizationHeader,
        },
        body: JSON.stringify({
          lessonTitle: lessonname,
          lessonDate: startday,
          lessonDateEnd: endday,
          lessonLevel:level,
          lessonStart: startlessontime,
          lessonEnd: endlessontime, 
          lessonDiv:ampm,
          maxReserveCount:parseInt(maxReserveCount),
          lessonClass:lessonClass,
          lessonAge:age,
          lessonIntroduce:lessonIntroduce
        }),
      });

      if (response.ok) {
        // 등록 성공
        alert('강습 등록이 완료되었습니다.');
        navigation.navigate('MainView');
      } else {
        // 등록 실패
        alert('강습 등록이 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('강습 정보를 입력해주세요');
    }
  };
  const handleSkiPress = () => {
    setLessonClass('스키');
    setIsSki(true);
    setIsBoard(false);
  };

  const handleBoardPress = () => {
    setLessonClass('보드');
    setIsBoard(true);
    setIsSki(false);
  };


  const onDayPress = (day) => {
    if (!startday || (startday && endday)) {
      // 시작일이 비어 있거나 이미 시작일과 종료일이 선택되어 있을 때
      setStartday(day.dateString);
      setEndday('');
    } else if (day.dateString >= startday) {
      // 종료일이 시작일 이후이거나 같은 경우
      setEndday(day.dateString);
      setCalendarModalVisible(false); // 선택 후 모달 닫기
    } else {
      // 선택한 날짜가 시작일보다 이전이면 시작일을 변경
      setStartday(day.dateString);
      setEndday('');
    }
  };

  const openCalendarModal = () => {
    setCalendarModalVisible(true);
  };

  const closeCalendarModal = () => {
    setCalendarModalVisible(false);
  };

  

  return (
    <View style={styles.rootContainer}>
      <Image source={backgroundImage} style={styles.backgroundImage} />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
      >
        <View style={styles.topBar}>
          <TransparentCircleButton onPress={onGoBack} name="left" color="#424242" />
        </View>
        {/* 배경 이미지 설정 */}
        <Text style={fontLoaded ? styles.title : {}}>강습 등록</Text>
        <View style={styles.subjectContainer}>
            <TouchableOpacity
              style={isSki ? styles.skiButtonSelected : styles.selectedButton}
              onPress={handleSkiPress}
            >
              <FontAwesome5 name="skiing" size={20} color={isSki ? 'white' : 'gray'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={isBoard ? styles.boardButtonSelected : styles.selectedButton}
              onPress={handleBoardPress}
            >
              <FontAwesome5 name="snowboarding" size={20} color={isBoard ? 'white' : 'gray'} />
            </TouchableOpacity>
          </View>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer1}>
            <TouchableOpacity
              style={age === '상관없음' ? styles.selectedAgeButton : styles.ageButton}
              onPress={() => setAge('상관없음')}
            >
              <Text style={styles. levelButtonText}>상관없음</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={age === '청소년' ? styles.selectedAgeButton : styles.ageButton}
              onPress={() => setAge('청소년')}
            >
              <Text style={styles. levelButtonText}>청소년</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={age === '성인' ? styles.selectedAgeButton : styles.ageButton}
              onPress={() => setAge('성인')}
            >
              <Text style={styles. levelButtonText}>성인</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer2}>
            <TextInput
              style={styles.input3} 
              placeholder="강습 인원 수"
              value={maxReserveCount}
              onChangeText={(text) => setMaxReserveCount(text)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputContainer1_1}>
            <TouchableOpacity
              style={level === '초급' ? styles.selectedLevelButton : styles.levelButton}
              onPress={() => setLevel('초급')}
            >
              <Text style={styles. levelButtonText}>초급</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={level === '중급' ? styles.selectedLevelButton : styles.levelButton}
              onPress={() => setLevel('중급')}
            >
              <Text style={styles. levelButtonText}>중급</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={level === '고급' ? styles.selectedLevelButton : styles.levelButton}
              onPress={() => setLevel('고급')}
            >
              <Text style={styles. levelButtonText}>고급</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer1_2}>
            <TextInput
              style={styles.input2}
              placeholder="강습명"
              value={lessonname}
              onChangeText={(text) => setLessonname(text)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input4}
            placeholder="강습 소개"
            value={lessonIntroduce}
            onChangeText={(text) => setLessonIntroduce(text)}
            multiline={true}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.dateContainer}>
            <TouchableOpacity style={styles.dateinput} onPress={openCalendarModal}>
              <Text>
                {startday
                  ? `시작일: ${startday}`
                  : '시작일과 종료일 선택'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.mulfont1}>~</Text>
            <TouchableOpacity style={styles.dateinput} onPress={openCalendarModal}>
              <Text>
                {endday
                  ? `종료일: ${endday}`
                  : '시작일과 종료일 선택'}
              </Text>
            </TouchableOpacity>
          </View>
          <Modal visible={isCalendarModalVisible} animationType="slide">
            <Calendar
              markedDates={{
                [startday]: { selected: true, startingDay: true, color: 'skyblue' },
                [endday]: { selected: true, endingDay: true, color: 'skyblue' },
              }}
              onDayPress={onDayPress}
              style={{marginTop:50}}
            />
            <TouchableOpacity onPress={closeCalendarModal}>
              <Text style={{ color: 'blue', textAlign: 'center', marginVertical: 10 }}>
                달력 닫기
              </Text>
            </TouchableOpacity>
          </Modal>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputContainer2_1}>
            <TouchableOpacity
              style={ampm === '오전' ? styles.selectedDivButton : styles.divButton}
              onPress={() => setAmPm('오전')}
            >
              <Text style={styles.levelButtonText}>오전</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ampm === '오후' ? styles.selectedDivButton : styles.divButton}
              onPress={() => setAmPm('오후')}
            >
              <Text style={styles.levelButtonText}>오후</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ampm === '야간' ? styles.selectedDivButton : styles.divButton}
              onPress={() => setAmPm('야간')}
            >
              <Text style={styles.levelButtonText}>야간</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer2_2}>
            <TextInputMask
              style={styles.inputlesson}
              type={'datetime'}
              placeholder="시작 시간"
              value={startlessontime}
              options={{
                format: 'HH:MM'
              }}
              onChangeText={(text) => setStartLessontime(text)}
            />
            <Text style={styles.mulfont1}>~</Text>
            <TextInputMask
              style={styles.inputlesson}
              type={'datetime'}
              placeholder="종료 시간"
              value={endlessontime}
              options={{
                format: 'HH:MM'
              }}
              onChangeText={(text) => setEndLessontime(text)}
            />
          </View> 


        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>등록하기</Text>
        </TouchableOpacity>

      </KeyboardAwareScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer:{
    flex: 1, 
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:370,
    padding: 40,
    paddingTop:200,
    ...Platform.select({
      web: {
        alignSelf:'center'
      },
    }),
    // marginLeft:10,
    // marginRight:10
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '103%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft:13,
    color: 'black', 
    fontFamily: 'DMSerifText1',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
  },
  registerButton: {
    width: '100%',
    height: 40,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  input1: {
    width: '75%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  selectedButton: {
    width: 40, 
    height: 40,
    marginBottom: 16,
    marginLeft: 15,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelButton: {
    width: '30%', 
    height: 40,
    marginBottom: 16,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderWidth: 1,
    marginRight:6,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divButton: {
    width: '28%', 
    height: 40,
    marginBottom: 16,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight:7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedLevelButton: {
    width: '30%', 
    height: 40,
    marginBottom: 16,
    marginRight:6,
    backgroundColor: 'skyblue',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDivButton: {
    width: '30%',
    height: 40,
    marginBottom: 16,
    marginRight:10,
    backgroundColor: 'skyblue',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  levelButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },

  input2: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  input3: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  input4: {
    width: '100%',
    height: 90,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },

  dateinput: {
    width: '43.7%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    padding:9
  },
  inputContainer1_1: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  inputContainer1_2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  inputContainer2_1: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
  },
  inputContainer2_2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
  },
  subjectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'38%',
  },
  iconContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
  },
  iconContainer2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'25%',
  },    
  mulfont:{
    fontSize:30,
    marginBottom:15,
    marginLeft:8,
  },
  mulfont1:{
    fontSize:30,
    marginBottom:15,
    marginLeft:12,
    marginRight:12,
  },
  topBar: {
    width:'100%'
  },
  inputlesson:{
    width: '39%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 

  },
  skiButtonSelected: {
    width: 40,
    height: 40,
    marginBottom: 16,
    marginLeft: 15,
    backgroundColor: 'skyblue',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardButtonSelected: {
    width: 40,
    height: 40,
    marginBottom: 16,
    marginLeft: 15,
    backgroundColor: 'green', // 원하는 색상으로 변경
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageButton: {
    width: '31%',
    height: 40,
    marginBottom: 16,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    marginRight: 6,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedAgeButton: {
    width: '31%',
    height: 40,
    marginBottom: 16,
    backgroundColor: 'skyblue',
    borderColor: 'gray',
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer:{
    flexDirection:'row',
    width:'100%'
  }

});

export default LessonSignUpScreen;


