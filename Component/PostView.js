import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList,  Keyboard, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, Alert, Modal, NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TransparentCircleButton from './TransparentCircleButton';

const { StatusBarManager } = NativeModules

const URL = 'http://192.168.25.204:8080';


function PostView({ route }) {
  const { boardId, refreshData} = route.params;
  const navigation = useNavigation();
  const [comments, setComments] = useState([]);
  const [replyComments, setReplyComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const loginId = '정훈';
  // 모달 다이얼로그 관련 상태 변수
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedComment, setEditedComment] = useState('');
  // 댓글 아이디를 저장할 상태 변수
  const [commentId, setCommentId] = useState(null); 
  const [boardDetails, setBoardDetails] = useState([]);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  
  useEffect(() => {
  
    fetchBoardDetails(boardId); 
  }, [boardId]);

  useEffect(()=>{
    Platform.OS == 'ios' ? StatusBarManager.getHeight((statusBarFrameData) => {
        setStatusBarHeight(statusBarFrameData.height)
      }) : null
}, []);


  const fetchBoardDetails = async (boardId) => {
    try {
      const response = await fetch(`${URL}/board/view/${boardId}`); 
      const boardData = await response.json();
      console.log(boardData); // 게시글 정보 확인
      setBoardDetails(boardData);
    } catch (error) {
      console.error(error);
    }
  };

  // 게시글 id를 기반으로 댓글 데이터를 가져옴
  useEffect(() => {
    fetchComments(boardId); // 게시글 id를 전달하여 해당 게시글의 댓글을 가져오는 함수
  }, [boardId]);

// 함수 내에서 댓글 및 답글 분류 및 관리
const fetchComments = async (boardId) => {
  try {
    const response = await fetch(`${URL}/comment/list/${boardId}`);
    const commentData = await response.json();

    console.log(commentData);
    // 최상위 댓글과 답글을 분류
    const topLevelComments = commentData.filter(comment => comment.parentCommentId === 0);
    const replyComments = commentData.filter(comment => comment.parentCommentId !== 0);

    console.log(topLevelComments);
    console.log(replyComments);

    setComments(topLevelComments); // 최상위 댓글 상태 업데이트
    setReplyComments(replyComments); // 답글 상태 업데이트
  } catch (error) {
    console.error(error);
    alert('댓글 불러오기 실패');
  }
};

  const onGoBack = () => {
    navigation.pop();
  };

  const handleEditPress = () => {
    if (loginId === loginId) { // 작성자와 로그인 아이디 비교
      navigation.navigate('게시글 수정', {
        boardId,
        title,
        content,
        loginId,
      });
    } else {
      // 작성자와 로그인한 사용자의 아이디가 다른 경우 수정할 수 없음
      alert('게시글을 수정할 수 있는 권한이 없습니다.');
    }
  };

  const handleDeletePost = async () => {
    if (Platform.OS === 'web') {
      const userConfirmed = window.confirm('게시글을 삭제하시겠습니까?');
      if (userConfirmed) {
        // 게시글 삭제 로직
        try {
          const response = await fetch(`${URL}/board/del/${boardId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            // 게시글 삭제 요청이 성공한 경우 로컬 상태에서도 해당 게시글을 제거
            // 이를 위해 게시글 목록을 가져오는 API를 다시 호출하거나
            // 로컬 상태에서 해당 게시글을 제거하는 방법을 사용할 수 있습니다.
    
            // 게시글 삭제 후, 이전 화면으로 돌아가기
            alert('게시글 삭제 성공');
            navigation.pop();
          } else {
            console.error('게시글 삭제 실패:', response.status);
            alert('게시글 삭제 실패');
          }
        } catch (error) {
          console.error('게시글 삭제 중 오류 발생:', error);
          alert('게시글 삭제 중 오류 발생');
        }
      } 
    } else {
      Alert.alert(
        '삭제 확인',
        '게시글을 삭제하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '확인',
            onPress: async () => {
              try {
                const response = await fetch(`${URL}/board/del/${boardId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
  
                if (response.ok) {
                  // 게시글 삭제 요청이 성공한 경우 로컬 상태에서도 해당 게시글을 제거
  
                  // 게시글 삭제 후, 이전 화면으로 돌아가기
                  alert('게시글 삭제 성공');
                  navigation.pop();
                } else {
                  console.error('게시글 삭제 실패:', response.status);
                  alert('게시글 삭제 실패');
                }
              } catch (error) {
                console.error('게시글 삭제 중 오류 발생:', error);
                alert('게시글 삭제 중 오류 발생');
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const addComment = async (comment) => {
    try {
      // 새 댓글 데이터 생성
      const newComment = { content:commentText , boardId: boardId, loginId: loginId };
  
      // POST 요청 보내기
      const response = await fetch(`http://192.168.25.204:8080/board/view/${boardId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(newComment), 
      });
  
      if (response.ok) {
        // 서버에서 응답이 성공적으로 왔을 때
        // 새로운 댓글을 로컬 상태에 추가
        setComments([...comments, newComment]);
        setCommentText('');
  
        // 키보드 닫기
        Keyboard.dismiss();
  
      } else {
        // 서버에서 오류 응답을 받았을 때 처리
        console.error('댓글 추가 실패');
      }
    } catch (error) {
      console.error('댓글 추가 중 오류 발생', error);
    }
  };

  const handleEditComment = (commentId, initialContent) => {
    // 댓글 수정 모달 다이얼로그를 열고 초기 수정 내용을 설정
    setCommentId(commentId); // commentId를 설정
    setEditedComment(initialContent);
    setEditModalVisible(true);
  };

  const closeEditCommentModal = () => {
    // 댓글 수정 모달 다이얼로그를 닫음
    setEditModalVisible(false);
  };

  const saveEditedComment = () => {
    // 사용자가 수정을 완료하면 호출되는 함수
    editComment(commentId, editedComment);
    closeEditCommentModal();
  };
  
  const editComment = async (commentId, editedContent) => {
    try {
      const response = await fetch(`http://192.168.25.204:8080/comment/edit/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editedContent }),
      });
  
      if (response.ok) {
        // 서버에서 응답이 성공적으로 왔을 때, 댓글 업데이트
        setComments((prevComments) => {
          return prevComments.map((comment) => {
            if (comment.commentId === commentId) {
              return { ...comment, content: editedContent };
            }
            return comment;
          });
        });
      } else {
        console.error('댓글 수정 실패:', response.status);
        alert('댓글 수정 실패');
      }
    } catch (error) {
      console.error('댓글 수정 중 오류 발생', error);
      alert('댓글 수정 중 오류 발생')
    }
  };

  const handleDeleteComment = async (commentId, boardId) => {
    if (Platform.OS === 'web') {
      const userConfirmed = window.confirm('댓글을 삭제하시겠습니까?');
      if (userConfirmed) {
        // 댓글 삭제 로직
        await deleteComment(commentId, boardId); // async 함수로 변경하고 await 사용
        alert('댓글이 삭제되었습니다.');
      }
    } else {
      Alert.alert(
        '댓글 삭제 확인',
        '댓글을 삭제하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '확인',
            onPress: async () => {
              // 모바일 앱에서의 삭제 로직
              await deleteComment(commentId, boardId); // async 함수로 변경하고 await 사용
              alert('댓글이 삭제되었습니다.');
            },
          },
        ],
        { cancelable: false }
      );
    }
  };
    const deleteComment = async (commentId, boardId) => {
      try {
        const response = await fetch(`http://192.168.25.204:8080/comment/del/${commentId}/${boardId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ boardId, commentId }), 
        });
    
        if (response.ok) {
          // 댓글 삭제 요청이 성공한 경우 로컬 상태에서 해당 댓글을 제거
          setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
    
          // 댓글 삭제 후, 화면 갱신 또는 다른 작업 수행
        } else {
          console.error('댓글 삭제 실패:', response.status);
          alert('댓글 삭제 실패');
        }
      } catch (error) {
        console.error('댓글 삭제 중 오류 발생:', error);
        alert('댓글 삭제 중 오류 발생');
      }
    };

  const onReplyButtonPress = () => {
    // "답글" 버튼이 눌렸을 때 수행할 동작 추가
  };

return (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <View style={styles.headerButton}>
        <TransparentCircleButton
          onPress={onGoBack}
          name="left"
          color="#424242"
        />
      </View>
      <View>
        <Text style={styles.headerTitle}>{boardDetails.title}</Text>
      </View>
      <View style={styles.headerButton}>
        <TransparentCircleButton
          onPress={handleDeletePost}
          name="delete-forever"
          color="#ef5350"             
        />
        <TransparentCircleButton
          onPress={handleEditPress}
          name="edit"
          color="#424242"
        />
      </View>
    </View>
    <Text style={styles.contentText}>{boardDetails.content}</Text>     
    {/* <Text style={styles.writerText}>{writer}</Text> */}
    <View style={styles.borderLine}></View>
    <View style={styles.commentListContainer}>
    <FlatList
      data={comments}
      keyExtractor={(item, index) => `comment-${index}`}
      renderItem={({ item }) => (
        <View style={styles.commentContainer}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentAuthor}>{item.loginId}</Text>
            {item.loginId === loginId && (
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => handleEditComment(item.commentId, item.content)}>
                  <Text style={styles.actionButtonText}>수정</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteComment(item.commentId, item.boardId)}>
                  <Text style={styles.actionButtonText}>삭제</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.commentItem}>
            <Text style={styles.commentText}>{item.content}</Text>
            <View>
              <TouchableOpacity onPress={onReplyButtonPress}>
                <Text style={styles.replyButtonWithBorder}>답글</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    />
    </View>
    <KeyboardAvoidingView
      behavior={"padding"}
      style={{flex : 1}}
      keyboardVerticalOffset={statusBarHeight+44}
    >
      <TextInput
        placeholder="댓글을 입력하세요"
        onChangeText={(text) => setCommentText(text)}
        multiline
        value={commentText}
        style={styles.commentInput}
      />
      <TouchableOpacity
        style={styles.commentButton}
        onPress={() => {
          addComment(commentText);
        }}
      >
        <Text style={styles.commentButtonText}>댓글 남기기</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
    <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.editCommentTitle}>댓글 수정하기</Text>
          <TextInput
            multiline
            placeholder="Edit your comment"
            value={editedComment}
            onChangeText={(text) => setEditedComment(text)}
            style={styles.editCommentInput}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={saveEditedComment} style={[styles.editCommentButton, styles.saveButton]}>
            <Text style={styles.commentButtonText}>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeEditCommentModal} style={[styles.editCommentButton, styles.cancelButton]}>
              <Text style={styles.commentButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>  
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBEBF9'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#424242',
    left:20,
  },
  commentContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  contentText: {
    fontSize: 18,
    padding:10
  },
  writerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  borderLine: {
    borderTopWidth: 2,
    borderTopColor: '#000',
    marginTop: '20%',
    marginBottom: 16,
  },
  commentItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentText: {
    fontSize: 16,
  },
  commentView:{
    padding:10,
  },  
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  commentButton: {
    backgroundColor: '#009688',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  replyButtonWithBorder: {
    borderWidth: 1,
    borderRadius: 2,
    padding: 5,
  },
  commentAuthor: {
    fontSize: 12, 
    color: 'gray', 
    marginBottom: 7, 
  },
  commentListContainer:{
    padding:5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  editCommentInput: {
    width: 200,
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  editCommentButton: {
    backgroundColor: '#009688',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row', // 버튼을 가로로 나란히 배치
    justifyContent: 'space-between', // 버튼 사이의 간격을 최대로 설정
  },
  saveButton: {
    marginRight: 10, // "저장" 버튼의 오른쪽 여백
  },
  cancelButton: {
    marginLeft: 10, // "취소" 버튼의 왼쪽 여백
  },
  editCommentTitle: {
    fontSize: 20, // 글씨 크기를 조절
    fontWeight: 'bold', // 굵은 글씨로 설정
    marginBottom: 10, // 아래쪽 여백을 추가
  },
  actionButtons: {
    flexDirection: 'row', // "수정/삭제" 버튼을 가로로 나란히 배치
    alignItems: 'center',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // "댓글"과 "수정/삭제" 버튼을 가로로 나란히 배치
    alignItems: 'center',
    marginBottom: 8, // "댓글" 헤더와 내용 사이에 간격 추가
  },
  actionButtonText: {
    marginLeft: 10, // "수정/삭제" 버튼 사이의 간격 추가
  },
});

export default PostView;
