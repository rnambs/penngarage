import React, { useState, useRef, useEffect } from 'react';
import {
  Alert, Button, Textarea, Avatar, Text,
} from '@mantine/core';
import PropTypes from 'prop-types';
import { IconSend, IconBellRinging } from '@tabler/icons-react';
import { Notifications, showNotification } from '@mantine/notifications';
import { createNewMessage, getUserReceiverMessages } from '../api/messages';
import { fetchUserInfo } from '../api/users';

let i = 0; // this is to fix a lint error to map index to keys

function ChatRoom({ userId, receiverId }) {
  const [receiverName, setReceiverName] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [messages, setMessages] = useState([]); // setting messages
  const [messageStatus, setMessageStatus] = useState(0); // 0 for success, 1 for failure
  const messageContainerRef = useRef(null);
  const [showSentMessageAlert, setShowSentMessageAlert] = useState(false); // new state

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await fetchUserInfo(receiverId);

      if (response.firstName) {
        setReceiverName({ firstName: response.firstName, lastName: response.lastName });
      }
    };

    const getMessages = async () => {
      const response = await getUserReceiverMessages(userId, receiverId);

      if (response.status === 200) {
        setMessages(response.data);
      }
    };

    const executeInit = async () => {
      await getUserInfo();
      await getMessages();
    };

    executeInit();
  }, [receiverId]);

  const handleInputChange = (event) => {
    const { value } = event.target;
    if (value.trim() !== inputValue.trim()) {
      setShowEmptyMessage(!value.trim());
    }
    setInputValue(value);
  };

  // Removed the duplicate destructuring assignment here

  const onClickMessage = async () => {
    const response = await createNewMessage(userId, receiverId, inputValue);
    if (response.status === 201) {
      setMessageStatus(0);
      setMessages([...messages, { userId, receiverId, userMessage: inputValue }]);
    } else {
      setMessageStatus(1);
    }
  };

  const handleCloseAlert = () => {
    setShowEmptyMessage(false);
  };

  const handleCloseSuccessAlert = () => {
    setShowSentMessageAlert(false);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) {
      setMessageStatus(1);
      setShowEmptyMessage(true);
      return;
    }
    setInputValue('');
    onClickMessage();
    setShowSentMessageAlert(messageStatus === 0);
    if (messageStatus === 0) {
      setMessageStatus(0);
      setShowSentMessageAlert(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }

    if (messages.length > 0) {
      const filteredMessages = messages.filter((msg) => msg.userId !== userId);

      if (filteredMessages.length > 0) {
        showNotification({
          role: 'notification',
          title: 'New Message',
          message: filteredMessages[filteredMessages.length - 1].userMessage,
          color: 'blue',
          icon: <IconBellRinging />,
        });
      }
    }
  }, [messages]);

  return (
    <div>
      <Notifications position="top" zIndex={1000} />
      <div>
        <Text
          color="#5C5F66"
          sx={{ fontFamily: 'sans-serif', color: '#212529' }}
          ta="center"
          fz={50}
          fw={700}
        >
          {`${receiverName.firstName} ${receiverName.lastName}`}
        </Text>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            maxHeight: '400px',
            minHeight: '400px',
            overflow: 'auto',
            maxWidth: '900px',
            margin: 'auto',
            padding: '0 16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
          ref={messageContainerRef}
        >
          {messages.map((message) => {
            i += 1;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent:
                    message.userId === userId ? 'flex-end' : 'flex-start',
                  marginBottom: '8px',
                  maxWidth: '60%',
                  alignSelf: message.userId === userId ? 'flex-end' : 'flex-start',
                }}
              >
                {message.userId !== userId && (
                  <Avatar
                    color="teal"
                    style={{ marginRight: '8px', marginBottom: '16px' }}
                  >
                    {`${receiverName.firstName.charAt(0)}${receiverName.lastName.charAt(0)}`}
                  </Avatar>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: message.userId === userId ? 'flex-end' : 'flex-start' }}>
                  <Text
                    color={message.userId === userId ? 'cyan' : 'teal'}
                    style={{
                      display: 'inline-block',
                      maxWidth: '100%',
                      textAlign: 'left',
                      marginBottom: '4px',
                      marginTop: '12px',
                      fw: '500',
                    }}
                  >
                    {message.userMessage}
                  </Text>
                </div>
                {message.userId === userId && (
                  <Avatar color="cyan" style={{ marginLeft: '8px', marginTop: '12px' }}>Me</Avatar>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            style={{
              flex: '1',
              marginRight: '8px',
              maxWidth: '700px',
              marginTop: '8px',
            }}
          />
          {showEmptyMessage && (
            <div
              style={{
                position: 'absolute',
                top: '420px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <Alert
                role="alert"
                title="Oops!"
                color="red"
                withCloseButton
                onClose={handleCloseAlert}
                closeButtonLabel="Close alert"
                style={{ textAlign: 'center', zIndex: 999 }}
                data-testid="empty-message-alert"
              >
                You cannot send an empty message!
              </Alert>
            </div>
          )}
          {showSentMessageAlert && (
            <div style={{
              position: 'absolute',
              top: '420px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 999,
            }}
            >
              <Alert
                role="alert"
                title="Message Sent!"
                color="green"
                withCloseButton
                onClose={handleCloseSuccessAlert}
                closeButtonLabel="Close alert"
                style={{ textAlign: 'center' }}
                data-testid="sent-message-alert"
              />
            </div>
          )}
          <Button leftIcon={<IconSend />} variant="light" color="dark" onClick={handleSendMessage} style={{ marginTop: '24px' }}>Send</Button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;

ChatRoom.propTypes = {
  userId: PropTypes.string.isRequired,
  receiverId: PropTypes.string.isRequired,
};
