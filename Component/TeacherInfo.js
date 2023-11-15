import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, } from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';
import { useNavigation } from '@react-navigation/native';
import { getTokenFromLocal } from './TokenUtils';
import axios from 'axios';
//brief = 약력 carrer = 경력 team = 소속 

const levelColors = {
  Lv1: 'lightgreen',
  Lv2: 'lightblue',
  Lv3: 'lightpink',
};

const eachsubject = {
  스키: require('../Images/ski.png'),
  보드: require('../Images/skiboard.png'),
};

const imagedata = [
  { id: '1', image: require('../Images/skigosu.jpg') },
  { id: '2', image: require('../Images/snow.jpg') },
  { id: '3', image: require('../Images/snowee.jpg') },
]

const teacherImageData = [
  { name: '장원빈', image: require('../Images/face.jpg') },
  { name: '고아성', image: require('../Images/face1.jpg') },
  { name: '홍주성', image: require('../Images/face2.jpg') },
]

const TeacherInfoScreen = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  // const [teacherId, setTeacherId] = useState(null);
  const [reviewData, setReviewData] = useState([]);
  const navigation = useNavigation();
  

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://192.168.25.202:8080/member/getTeacherList?ridingClass=${selectedCategory}`);
        if (!response.ok) {
          throw Error('서버에서 데이터를 가져오지 못했습니다.');
        }
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error('데이터 가져오기 중 오류 발생:', error);
      }
    }
    fetchData();
  }, [selectedCategory]);

  async function onShowDetails(item) {
    const teacherId = item.loginId;
    const token = await getTokenFromLocal();
    const authorizationHeader = `Bearer ${token}`;

    try {
      const response = await axios.get(`http://192.168.25.202:8080/review/getReview?teacherId=${teacherId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorizationHeader,
        },
      });
      const result = response.data;

      const reviews = result.map(item => ({
        review: item.review,
        studentId: item.studentId, 
        reviewDate: item.reviewDate,  
        lessonTitle: item.lessonTitle   
      }));

      // 새로운 배열을 reviewData에 넣어줍니다.
      setReviewData(reviews);
      console.log(result);
    } catch (error) {
      console.error('데이터 가져오기 중 오류 발생:', error);
    }
    setSelectedTeacher(item);

    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTeacher(null);
  };

  const onGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topBar}>
          <TransparentCircleButton onPress={onGoBack} name="left" color="#424242" />
          <Text style={styles.title}>강사 정보</Text>
        </View>
      </View>
      <View style={styles.categori}>
        <TouchableOpacity style={styles.all} onPress={() => setSelectedCategory('All')}>
          <Text style={styles.cancelButtonText}>전체</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ski} onPress={() => setSelectedCategory('Ski')}>
          <Text style={styles.cancelButtonText}>스키</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.board} onPress={() => setSelectedCategory('Board')}>
          <Text style={styles.cancelButtonText}>보드</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={teachers}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.teacherContent}>
              <Image source={item.image} style={styles.teacherImage} />
              <View style={styles.textContainer}>
                <View style={styles.headerimage}>
                  <Text style={styles.itemText}>{item.name}</Text>
                  <View style={[styles.badge1, { backgroundColor: levelColors[item.classLevel] }]}>
                    <Text style={styles.skilevel}>{item.classLevel}</Text>
                  </View>
                </View>
                <Text style={styles.subjectText}>"{item.introduce}"</Text>
              </View>
              <Image source={eachsubject[item.classification]} style={styles.subjectImage} />
              <TouchableOpacity style={styles.cancelButton} onPress={() => onShowDetails(item)}>
                <Text style={styles.cancelButtonText}>상세보기</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        {selectedTeacher && (
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
              <TransparentCircleButton onPress={closeModal} name="left" color="#424242" />
            </TouchableOpacity>
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalinfoimage}>
                {/* Teacher's basic information */}
                <Image source={selectedTeacher.image} style={styles.modalTeacherImage} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 40 }}>
                  <Text style={styles.modalItemText}>{selectedTeacher.name}</Text>
                  <View style={[styles.badge1, { backgroundColor: levelColors[selectedTeacher.classLevel] }]}>
                    <Text style={styles.skilevel}>{selectedTeacher.classLevel}</Text>
                  </View>
                </View>
                <Text style={styles.modalSubjectText}>" {selectedTeacher.introduce} "</Text>
              </View>

              {/* FlatList for images */}
              <FlatList
                data={imagedata}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.swiperSlide}>
                    <Image source={item.image} style={styles.swiperImage} />
                  </View>
                )}
              />
              <View style={{marginBottom:150}}>
                <Text style={styles.histories}>약력</Text>
                <View style={styles.history}>
                  <Text>- {selectedTeacher.history}</Text>
                </View>
                <Text style={styles.carrers}>경력</Text>
                <View style={styles.history}>
                  <Text>- {selectedTeacher.career}</Text>
                </View>
                <Text style={styles.teams}>소속</Text>
                <View style={styles.history}>
                  <Text>- {selectedTeacher.team}</Text>
                </View>
                <Text style={styles.teams}>이 강사님의 후기</Text>
                <FlatList
                  data={reviewData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.review}>
                      
                      <View style={{flexDirection:'row', width:'100%', padding:5}}>
                        <View style={{width:'20%'}}>
                          <Text>{` - 작성자 ID `}</Text>
                        </View>
                        <View style={{width:'5%'}}>
                          <Text>{` : `}</Text>
                        </View>
                        <View style={{width:'75%'}}>
                          <Text>{` ${item.studentId}`}</Text>
                        </View>
                      </View>
                      
                      <View style={{flexDirection:'row', width:'100%', padding:5}}>
                        <View style={{width:'20%'}}>
                          <Text>{` - 작성 날짜 `}</Text>
                        </View>
                        <View style={{width:'5%'}}>
                          <Text>{` : `}</Text>
                        </View>
                        <View style={{width:'75%'}}>
                          <Text>{` ${item.reviewDate}`}</Text>
                        </View>
                      </View>

                      <View style={{flexDirection:'row', width:'100%', padding:5}}>
                        <View style={{width:'20%'}}>
                          <Text>{` - 강습명 `}</Text>
                        </View>
                        <View style={{width:'5%'}}>
                          <Text>{` : `}</Text>
                        </View>
                        <View style={{width:'75%'}}>
                          <Text>{` ${item.lessonTitle}`}</Text>
                        </View>
                      </View>
                      
                      <View style={{flexDirection:'row', width:'100%', padding:5}}>
                        <View style={{width:'20%'}}>
                          <Text>{` - 후기 내용 `}</Text>
                        </View>
                        <View style={{width:'5%'}}>
                          <Text>{` : `}</Text>
                        </View>
                        <View style={{width:'75%'}}>
                          <Text>{` ${item.review}`}</Text>
                        </View>
                      </View>
                    </View>
                    
                  )}
                />
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  teacherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  teacherImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 3
  },
  subjectText: {
    fontSize: 16,
    marginTop: 3,
  },
  cancelButton: {
    width: '20%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  all: {
    width: '12%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  ski: {
    width: '12%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  board: {
    width: '12%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  cancelButtonText: {
    textAlign: 'center',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 30,
  },
  skilevel: {
    fontSize: 12,
    color: 'black',
  },
  categori: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  badge: {
    borderRadius: 4,
    width: 'auto',
    marginRight: 15,

  },
  subjectImage: {
    width: 30,
    height: 40,
    marginRight: 25,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  modalTeacherImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 60,

  },
  modalItemText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalSubjectText: {
    fontSize: 18,
    marginTop: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    zIndex: 1,
    marginTop: 40,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalinfoimage: {
    alignItems: 'center',

  },
  levels: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    paddingBottom: 20
  },
  histories: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  carrers: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  teams: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
  history: {
    marginTop: 10,
    width:'100%',
  },
  review: {
    marginTop: 10,
    width:'100%',
    borderBottomWidth:0.6, 
    borderColor:'#bbb'
  },
  carrer: {
    marginTop: 10,
  },
  team: {
    marginTop: 10,
  },
  Imageforteacher: {
    marginTop: 20,
    width: 190,
    height: 190,
  },
  swiperSlide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  swiperImage: {
    width: 396,
    height: 200,
    marginTop: 20,
    borderRadius: 8,
  },
  headerimage: {
    flexDirection: 'row'
  },
  badge1: {
    borderRadius: 4,
    marginLeft: 5,
    marginTop: -1,
    padding: 3,
    marginRight: 10,
    height: 25,
    flexDirection: 'row',
    alignItems: 'center'
  },
});

export default TeacherInfoScreen;