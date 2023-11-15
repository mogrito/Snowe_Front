import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Image, Dimensions, Button, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import TransparentCircleButton from './TransparentCircleButton';
import { getTokenFromLocal } from './TokenUtils';
import { checkTokenAndNavigate } from './TokenUtils';

const windowWidth = Dimensions.get('window').width;

const faceImage = 
  { 김희찬: require('../Images/face.jpg') ,
    홍주성: require('../Images/face1.jpg'), 
    장원빈: require('../Images/face2.jpg') ,
    김정훈: require('../Images/face3.jpg') ,
  };

const TeacherReserveScreen = () => {
  const isFocused = useIsFocused();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  



  // 예약 신청을 서버에 업데이트하는 함수
  const reserveLesson = async () => {
    const token = await getTokenFromLocal();
    const authorizationHeader = `Bearer ${token}`;
    if (selectedTeacher) {
      try {
        // 서버로 예약 데이터 전송
        const response = await fetch('http://192.168.25.204:8080/reservation/reserve', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authorizationHeader,
          },
          body: JSON.stringify({
            teacherId: selectedTeacher.loginId,
            lessonId: selectedTeacher.lessonId,
          }),
        });

        if (response.ok) {
          // Reset the state to refresh the screen
          resetTeacherList();

          // Display success alert
          Alert.alert(
            '신청 완료',
            '신청이 완료되었습니다!',
            [
              {
                text: '확인',
              },
            ]
          );

          // Close the modal
          setModalVisible(false);
        } else {
          // 서버 응답이 실패하면 에러 처리
          console.error('예약 실패');
          alert('예약 실패', '서버 오류로 예약을 완료할 수 없습니다.');
        }
      } catch (error) {
        console.error('예약 실패: ', error);
        alert('예약 실패', '오류로 인해 예약을 완료할 수 없습니다.');
      }
    }
  };


  const handleDateSelect = async (date) => {
    setSelectedDate(date.dateString);
    const token = await getTokenFromLocal();
    const authorizationHeader = `Bearer ${token}`;

    try {
      const response = await fetch(`http://192.168.25.204:8080/member/list?lessonDate=${date.dateString}`, {
        method: 'GET', // GET 요청으로 변경
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorizationHeader,
        },
      });
      const data = await response.json();
      setFilteredTeachers(data);

    } catch (error) {
      console.error('선생님 데이터 가져오기 오류:', error);
    }
  };



  const resetTeacherList = () => {
    setFilteredTeachers([]);
    setSelectedTeacher(null);
    setSelectedDate(null);
  };

  useEffect(() => {
    checkTokenAndNavigate(navigation);
    
    if (isFocused) {
      resetTeacherList();
    }
  }, [isFocused]);

  // const sortedTeacherData = filteredTeachers.slice().sort((a, b) => {
  //   const timeA = parseInt(a.edudate.replace(':', ''));
  //   const timeB = parseInt(b.edudate.replace(':', ''));
  //   return timeA - timeB;
  // });

  const lastTeacherItemStyle = {
    teacherItem: {
      marginBottom: 0,
    },
  };

  const handleTeacherPress = (teacher) => {

    if (teacher.count >= 50) {
      Alert.alert(
        '수강인원이 꽉찼습니다',
        '더 이상 신청이 불가능합니다.',
        [
          {
            text: '확인',
          },
        ]
      );
    } else {
      setSelectedTeacher(teacher);
      console.log('teacher : ', teacher);
      setModalVisible(true);
    }
  };

  const handleModalCancelPress = () => {
    setModalVisible(false); // 모달을 닫습니다.
  };


  const onGoBack = () => {
    navigation.goBack();
  };
  console.log('이거야 :', filteredTeachers);

  const goToTeacherInfo = () => {
    navigation.navigate('TeacherInfo');
    setModalVisible(false);
  };



  return (
    <View style={styles.container}>
      <View style={styles.teacherWrapper}>
        <View style={styles.topBar}>
          <TransparentCircleButton onPress={onGoBack} name="left" color="#424242" />
          <Text style={styles.title}>강사 예약</Text>
        </View>
        <Calendar
          style={styles.calender}
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'skyblue' }, // Highlight the selected date
          }}
          minDate={new Date().toISOString().split('T')[0]} // 현재 날짜의 ISO 문자열로 변환
          monthFormat={'yyyy년 MM월'}

        />
        <View style={styles.sampleTeacherItem}>
          <View style={styles.teacherInfo}>
            <View style={styles.teacherImageView}>
              <Text>사진</Text>
            </View>
            <View style={styles.nameDivView}>
              <Text style={styles.teacherName}>이름</Text>
              <Text style={styles.eduTime}>강습시간</Text>
            </View>
            <View style={styles.lessonInfoView}>
              <Text style={{ fontWeight: 'bold', fontSize: 17 }}>강습명</Text>
              <Text style={{ fontSize: 10 }}>(현재 강습인원수 / 최대 강습인원수)</Text>
            </View>
            <View style={styles.lessonLevelView}>
              <Text>종목/수준</Text>
            </View>
          </View>
        </View>

        {selectedDate && (
          <FlatList
            data={filteredTeachers}
            keyExtractor={(item) => item?.id?.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.teacherItem,
                  index === filteredTeachers.length - 1 ? lastTeacherItemStyle.teacherItem : null,
                ]}
                onPress={() => handleTeacherPress(item)}
              >
                <View style={styles.teacherInfo}>
                  <View style={styles.teacherImageView}>
                  <Image style={styles.teacherImage} source={faceImage[item.name]} />
                  </View>
                  <View style={styles.nameDivView}>
                    <Text style={styles.teacherName}>{item.name}</Text>
                    <Text style={styles.eduTime}>{item.div}</Text>
                  </View>
                  <View style={styles.lessonInfoView}>
                    <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{`${item.lessonTitle}`}</Text>
                    <Text>{`(${item.reserveCount} / ${item.maxReserveCount})`}</Text>
                  </View>
                  <View style={styles.lessonLevelView}>
                    <Text style={styles.teacherSubject}>{`${item.lessonClass}/${item.lessonLevel}`}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            style={styles.teacherList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <Modal animationType="slide" visible={modalVisible} presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <Text style={styles.reservationTitle}>예약 확인</Text>
          <View style={styles.centerView}>
          <Image style={styles.teacherModalImage} source={faceImage[selectedTeacher?.name]} />
            <Text style={styles.teacherModalName}>{`${selectedTeacher?.name} 강사님`}</Text>
            <TouchableOpacity
              style={styles.teacherDetail}
              onPress={goToTeacherInfo}
            >
              <Text>강사 정보 보기</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.lessonDataContainer}>
            <View style={styles.lessonDataView}>
              <View style={styles.lessonData3}><Text style={styles.lessonDataText1}>{`강습명`}</Text></View>
              <View style={styles.lessonData4}><Text style={styles.lessonDataText2}>{` :  ${selectedTeacher?.lessonTitle}`}</Text></View>
            </View>

            <View style={styles.lessonDataView}>
              <View style={styles.lessonData3}><Text style={styles.lessonDataText1}>{`강습 시작일`}</Text></View>
              <View style={styles.lessonData4}><Text style={styles.lessonDataText2}>{` :  ${selectedTeacher?.lessonDate}`}</Text></View>
            </View>

            <View style={styles.lessonDataView}>
              <View style={styles.lessonData3}><Text style={styles.lessonDataText1}>{`강습 종료일`}</Text></View>
              <View style={styles.lessonData4}><Text style={styles.lessonDataText2}>{` :  ${selectedTeacher?.lessonDateEnd}`}</Text></View>
            </View>

            <View style={styles.lessonDataView}>
              <View style={styles.lessonData3}><Text style={styles.lessonDataText1}>{`강습 시작시간`}</Text></View>
              <View style={styles.lessonData4}><Text style={styles.lessonDataText2}>{` :  ${selectedTeacher?.lessonStart}`}</Text></View>
            </View>

            <View style={styles.lessonDataView}>
              <View style={styles.lessonData3}><Text style={styles.lessonDataText1}>{`강습 종료시간`}</Text></View>
              <View style={styles.lessonData4}><Text style={styles.lessonDataText2}>{` :  ${selectedTeacher?.lessonEnd}`}</Text></View>
            </View>

            <View style={styles.lessonDataView}>
              <View style={styles.lessonData3}><Text style={styles.lessonDataText1}>{`강습 소개`}</Text></View>
              <View style={styles.lessonData4}><Text style={styles.lessonDataText2}>{` :  ${selectedTeacher?.lessonIntroduce}`}</Text></View>
            </View>

            <View style={styles.lessonDataView}>
              <View style={styles.lessonData3}><Text style={styles.lessonDataText1}>{`강습 인원`}</Text></View>
              <View style={styles.lessonData4}><Text style={styles.lessonDataText2}>{` :  ${selectedTeacher?.lessonStart}`}</Text></View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.checkReserveButton} onPress={reserveLesson}>
              <Text style={styles.buttonText}>신청</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleModalCancelPress}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};






const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBEBF9',
  },
  teacherWrapper: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 30,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  teacherItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
  },
  sampleTeacherItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 15
  },
  teacherName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  teacherSubject: {
    fontSize: 18,
    color: 'black',
  },
  teacherList: {
    marginTop: 20,
  },
  timeButtonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  timeButton: {
    backgroundColor: 'skyblue',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
  },
  timeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  teacherImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  teacherCount: {
    left: 200,
  },
  eduTime: {
    right: 0,
    marginTop: 5,
  },
  calender: {
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },

  teacherModalImage: {
    width: 170,
    height: 170,
    borderRadius: 200,
    marginTop: 10,
    marginBottom: 20,
  },
  teacherModalName: {
    fontSize: 30,
    marginBottom:10,
    fontWeight: 'bold',
  },
  lessonDataContainer:{
    flex:1,
    flexDirection: 'column', 
    justifyContent: 'center' 
  },
  lessonDataView:{
    width:'100%', 
    flexDirection:'row',
    justifyContent: 'center', 
    padding:10,
    paddingBottom:18
  },
  lessonData3:{
    width:'30%', 
    paddingLeft:10
  },
  lessonData4:{
    width:'70%', 
  },
  lessonDataText1:{
    fontSize:18, 
    textAlign:'left', 
  },
  lessonDataText2:{
    fontSize:18, 
    textAlign:'left', 

  },
  reservationTitle: {
    position: 'absolute',
    top: 30,
    left: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width:'100%',
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    marginBottom:70,
  },
  cancelButton: {
    width: '30%',
    height: 40,
    left: 10,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  checkReserveButton: {
    width: '30%',
    height: 40,
    right: 10,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontWeight: 'bold'
  },
  teacherImageView:{
    width:'15%',
    alignItems:'center',
    paddingRight:22
  },
  nameDivView: {
    width: '15%',
  },
  lessonInfoView: {
    width: '50%',
    alignItems: 'center'
  },
  lessonLevelView: {
    width: '20%',
    alignItems: 'center'
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:55,
  },
  teacherDetail:{
    backgroundColor:'yellow'
  }
});

export default TeacherReserveScreen;


