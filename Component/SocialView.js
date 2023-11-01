import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // 네비게이션 기능 사용
import FloatingWriteButton from './FloatingWriteButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons} from '@expo/vector-icons';

function SocialView() {
  const [hidden, setHidden] = useState(false);
  const [boardList, setBoardList] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null); // 선택한 게시글 저장
  const [searchText, setSearchText] = useState(''); // 검색어 상태
  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태
  const navigation = useNavigation(); // 네비게이션 객체 생성
  const isFocused = useIsFocused(); // 화면이 포커스되는지 여부를 확인
  

  const onSearchButtonPress = () => {
    // 검색 버튼을 누를 때 검색 화면으로 이동
    navigation.navigate('SearchScreen'); // 'SearchScreen'은 검색 화면의 이름입니다.
  };

  const refreshBoardData = () => {
    // 게시글 데이터를 새로고침하는 함수
    setRefreshing(true); // 새로고침 시작
    fetchBoardData()
      .then(() => setRefreshing(false)); // 새로고침 완료
  };


  useEffect(() => {
    if (isFocused) {
      // 화면이 포커스되면 게시글 데이터를 새로고침
      refreshBoardData();
    }
  }, [isFocused]);

  const fetchBoardData = async () => {
    try {
      const response = await fetch('http://192.168.219.103:8080/board/list');
      const boardData = await response.json();
      console.log(boardData);
      // alert(boardData[0].title);
      setBoardList(boardData);
    } catch (error) {
      console.error(error);
      alert('글불러오기실패');
    }
  }

  const onBoardPress = (board) => {
    // 게시글을 선택하면 해당 게시글의 내용을 보여줌
    setSelectedBoard(board);
    navigation.navigate('PostView', { 
      boardId: board.boardId, 
      title: board.title, 
      content: board.content, 
      writer: board.writer, 
      refreshData: refreshBoardData, // 삭제 후 새로고침 함수를 전달
    }); // 댓글 내용을 전달 });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text></Text>
        <Text style={styles.title}>Board</Text>
        <TouchableOpacity style={styles.userIcon} onPress={onSearchButtonPress}>
          <MaterialIcons name="search" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
          data={boardList}
          keyExtractor={(item) => item.boardId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.boardItem}
              onPress={() => onBoardPress(item)}
            >
              <Text style={styles.textContainer}>{item.title}</Text>
              <Text>{item.body}</Text>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshBoardData}
            />
          }
        />
      <FloatingWriteButton hidden={hidden} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBEBF9'
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top:40,
    paddingVertical: 10,
    paddingHorizontal: 10,
    zIndex: 1,
    marginBottom:30,
  },
  title: {
    fontSize: 40,
    fontStyle: 'italic',
    color: 'black',
    fontFamily: 'DMSerifText1',
    left: 11,    
  },
  boardItem: {
    marginTop: 2,
    marginBottom: 1,
    padding: 10,
    borderRadius: 2,
  },
  textContainer: {
    borderWidth: 1, // 테두리 두께
    borderColor: 'black', // 테두리 색상
    padding: 25, // 텍스트 주위의 패딩
    borderRadius: 5, // 테두리의 모서리 반경 (원형 테두리를 만들려면 원의 반지름으로 설정)
  },
  selectedBoard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  selectedBoardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedBoardBody: {
    fontSize: 16,
  },
  searchButton : {
    marginTop: 5,
    right: 10,
  }
});

export default SocialView;