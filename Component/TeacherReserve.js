import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Image, Dimensions, Button, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import TransparentCircleButton from './TransparentCircleButton';
import { getTokenFromLocal } from './TokenUtils';


const windowWidth = Dimensions.get('window').width;

const TeacherReserveScreen = () => {
  const isFocused = useIsFocused();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [teacherData, setTeacherData] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  const navigation = useNavigation();



  // 예약 신청을 서버에 업데이트하는 함수
  const reserveLesson = async () => {
    if (selectedTeacher) {
      try {
        // 서버로 예약 데이터 전송
        const response = await fetch('API 적어주시공', {
          method: 'POST',
          headers: {
            // 토큰값
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teacherId: selectedTeacher.id,
            date: selectedDate,
            //필요한 DB컬럼 추가해용  
          }),
        });

        if (response.ok) {
          // 서버에서 응답이 성공적으로 오면 로컬 상태 업데이트
          const updatedTeacherData = teacherData.map((teacher) =>
            teacher.id === selectedTeacher.id
              ? { ...teacher, count: teacher.count + 1 }
              : teacher
          );
          setTeacherData(updatedTeacherData);
          setModalVisible(false); // 모달 닫기
        } else {
          // 서버 응답이 실패하면 에러 처리
          console.error('예약 실패');
          Alert.alert('예약 실패', '서버 오류로 예약을 완료할 수 없습니다.');
        }
      } catch (error) {
        console.error('예약 실패: ', error);
        Alert.alert('예약 실패', '오류로 인해 예약을 완료할 수 없습니다.');
      }
    }
  };

  const handleDateSelect = async (date) => {
    setSelectedDate(date.dateString);
    const token = await getTokenFromLocal();
      const authorizationHeader = `Bearer ${token}`;
    try {
      const response = await fetch(`http://localhost:8080/lesson?lessonDate=${date.dateString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorizationHeader,
        },
      });
      const data = await response.json();
      console.log(data);
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
      setModalVisible(true);
    }
  };

  const handleModalCancelPress = () => {
    setModalVisible(false); // 모달을 닫습니다.
  };

  
  const onGoBack = () => {
    navigation.goBack();
  };



  return (
    <View style={styles.container}>
      <View style={styles.teacherWrapper}>
        <View style={styles.topBar}>
          <TransparentCircleButton onPress={onGoBack} name="left" color="#424242"/>
          <Text style={styles.title}>강사 예약</Text>
        </View>
        <Calendar
          style={styles.calender}
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'skyblue' }, // Highlight the selected date
          }}
          monthFormat={'yyyy년 MM월'}
        
        />
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
                  <Image source={{ uri: item.image }} style={styles.teacherImage} />
                  <View>
                    <Text style={styles.teacherName}>{item.name}</Text>
                    <Text style={styles.eduTime}>{item.div}</Text>
                  </View>
                  <Text style={styles.teacherCount}>{`(${item.reserveCount} / ${item.maxReserveCount})`}</Text>
                  <Text style={styles.teacherSubject}>{`${item.lessonClass}${item.lessonLevel}반`}</Text>
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
          <Image source={{ uri: selectedTeacher?.image }} style={styles.teacherModalImage} />
          <Text style={styles.teacherModalName}>{`${selectedTeacher?.name} 강사님`}</Text>
          <Text style={styles.selectedDate}>{`강습 제목: ${selectedTeacher?.title}`}</Text>
          <Text style={styles.selectedDate}>{`강습 시작일: ${selectedDate}`}</Text>
          <Text style={styles.selectedTime}>{`강습 시작시간: ${selectedTeacher?.edudate}`}</Text>
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
    marginRight:30,
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
  teacherName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  teacherSubject: {
    fontSize: 20,
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
  },
  teacherImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
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
    width: 200,
    height: 200,
    borderRadius: 200,
    marginTop: 10,
    marginBottom: 20, 
  },
  teacherModalName: {
    fontSize: 30,
    marginBottom: 40, 
    fontWeight: 'bold',
  },
  selectedDate: {
    marginBottom: 10, 
    fontSize: 20
  },
  selectedTime: {
    marginBottom: 20,
    fontSize: 20 
  },
  reservationTitle: {
    position: 'absolute',
    top: 30, 
    left: 10, 
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10,
  },
  cancelButton: {
    width: '30%',
    height: 40,
    left:10,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, 

  },
  checkReserveButton: {
    width: '30%',
    height: 40,
    right:10,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, 
  },
  buttonText: {
    fontWeight:'bold'
  },
});

export default TeacherReserveScreen;



