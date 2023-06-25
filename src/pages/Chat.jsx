import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Col, Container, Grid,
} from '@mantine/core';
import ChatRoom from './ChatPage';
import { getChatRecipients } from '../api/messages';

function ChatPage(props) {
  const { userId } = props;

  const params = useParams();
  const receiverId = params.receiverId ? params.receiverId : undefined;

  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    const getChatters = async () => {
      const response = await getChatRecipients(userId);

      if (response.status === 200) {
        setRecipients(response.data);
      }
    };

    const executeUseEffect = async () => {
      await getChatters();
    };

    executeUseEffect();
  }, []);

  return (
    <Container>
      <Grid gutter="md" style={{ marginTop: '20px' }}>
        <Col span={12} sm={3}>
          <h2>
            Chats
          </h2>
          {recipients.length > 0
            ? recipients.map((rec) => (
              <div>
                <Link to={`/messages/${rec.id}`}>
                  {`${rec.firstName} ${rec.lastName}`}
                </Link>
              </div>
            ))
            : ''}
        </Col>
        <Col span={12} sm={9}>
          {
            receiverId ? (
              <ChatRoom userId={userId} receiverId={receiverId} />
            ) : ''
          }
        </Col>
      </Grid>
    </Container>
  );
}

export default ChatPage;

ChatPage.propTypes = {
  userId: PropTypes.string.isRequired,
};
