import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  AppState,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../services/api';
import { useAppContext } from '../AuthProvider/AuthProvider';

const ChatNow = ({ route, navigation }) => {
  const { buyerIdd, sellerId, productId, sellerName, productTitle, name,product_image,image_url } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const appState = useRef(AppState.currentState);
  const flatListRef = useRef(null);

  console.log('messagessssssssssss', image_url);

  // Fetch chat history from API
  const fetchChatHistory = async () => {
    try {
      const userId = await AsyncStorage.getItem('contactno');
      if (!userId) return;

      setUserId(userId);

      // Use all parameters including product_id (which matches your backend's product_code)
      const response = await api.getChatHistory(sellerId, buyerIdd, productId);
      console.log('Response:', response); // Debug log

      if (response.success) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    fetchChatHistory();

    const interval = setInterval(() => {
      fetchChatHistory(); // Fetch messages every 3 seconds
    }, 3000);

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        fetchChatHistory();
      }
      appState.current = nextAppState;
    });

    return () => {
      clearInterval(interval); // Clean up interval on unmount
      subscription.remove();
    };
  }, [sellerId, productId]);

  const sendMessage = async () => {
    if (!message.trim() || !buyerIdd) return;

    try {
      const messageData = {
        seller_id: sellerId,
        buyer_id: buyerIdd,
        product_id: productId,
        seller_name: sellerName,
        source: userId,
        message: message.trim()
      };
      console.log('', messageData);

      const response = await api.saveMessage(messageData);
      if (response.success) {
        setMessages([...messages, response.data]);
        setMessage('');

        // Scroll to bottom
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }) => {
    // Check if the current user is the sender of the message
    const isCurrentUser = item.source === userId;


    return (
      <View style={[
        styles.messageBubble,
        isCurrentUser ? styles.userMessage : styles.otherMessage
      ]}>
        <Text style={[
          styles.messageText,
          !isCurrentUser && styles.otherMessageText
        ]}>{item.message}</Text>
        <Text style={[
          styles.messageTime,
          !isCurrentUser && styles.otherMessageTime
        ]}>
          {new Date(item.created_datetime).toLocaleString([], {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{name ? name : sellerName}</Text>
          <Text style={styles.headerProduct}>{productTitle}</Text>
        </View>
      </View>

      {product_image ? (
        <Image
          source={{ uri: `https://api.ozaveria.com:3000/uploads/${product_image.split(',')[0]}` }}
          style={styles.avatar}
        />
      ) : (
        <Image
          source={{ uri: `https://api.ozaveria.com:3000/uploads/${image_url.split(',')[0]}` }}
          style={styles.avatar}
        />
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.messageList}
        inverted={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerInfo: {
    marginLeft: 16,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#026456',
  },
  headerProduct: {
    fontSize: 14,
    color: '#666',
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  userMessage: {
    backgroundColor: '#026456',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  otherMessageTime: {
    color: 'rgba(0,0,0,0.5)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: '#026456',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '30%',
    marginRight: 12,
},
});

export default ChatNow;