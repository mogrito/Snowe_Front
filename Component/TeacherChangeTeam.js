import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';

//현재 소속을 useEffect를 통해 인풋박스에 불러오고 수정작업을 하고 변경하기 버튼을 누르면 'handleChangeMySelfInfo' 이벤트 발생

const TeacherChangeTeamScreen = ({ navigation }) => {
  const [myteam, setMyteam] = useState(''); //myteam는 현재 소속

//현재 소속을 불러오는 API
  useEffect(() => {
    fetch('서버의_API/currentShortInfo')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
            setMyteam(data.shortinfo);
        } else {
        
        }
      })
      .catch(error => {
        console.error('에러:', error);
      });
  }, []); 

  const onGoBack = () => {
    navigation.pop();
  };

  //변경된 소속을 다시 업데이트 하는 API
  const handleChangeMySelfInfo = () => {
    fetch('서버의_API/updateShortInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newShortInfo: myteam,  // 변경된 소속
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('변경된 소속이 성공적으로 변경되었습니다!');
        } else {
 
        }
      })
      .catch(error => {
        console.error('에러:', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TransparentCircleButton onPress={onGoBack} name="left" color="#424242" />
        <Text style={styles.title}>소속 설정</Text>
      </View>

      <View>
        <View style={styles.text}>
          <Text style={styles.inputLabel}>현재 내 소속</Text>
          <Text style={styles.rightText}>변경 할 소속을 작성해 주세요</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input3}
            placeholder="현재 내 소속"
            multiline={true}  
            returnKeyType="next" 
            value={myteam}
            onChangeText={text => setMyteam(text)}
          />

        </View>
        <TouchableOpacity style={styles.resetButton} onPress={handleChangeMySelfInfo}>
          <Text style={styles.resetText}>변경하기</Text>
        </TouchableOpacity>
      </View>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  resetButton: {
    height: 40,
    backgroundColor: 'skyblue',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  resetText: {
    color: 'black',
  },
  input3: {
    flex: 1,
    height: 80,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 1,
    textAlign: 'left', 
    paddingBottom:40, 
    paddingLeft:10,   
  },
  
  text: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightText: {
    fontSize: 12,
    color: 'gray',
    fontWeight: 'bold',
    marginTop:2,
  },
});

export default TeacherChangeTeamScreen;
