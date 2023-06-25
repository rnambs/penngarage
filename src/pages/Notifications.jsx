import React from 'react';
import PropTypes from 'prop-types';
import { Notification, NotificationsProvider, useNotifications } from '@mantine/core';

function NotificationItem({ message, type }) {
  const { removeNotification } = useNotifications();

  return (
    <Notification
      title={type}
      onClose={() => removeNotification(message)}
    >
      {message}
    </Notification>
  );
}

NotificationItem.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export function NotificationsWrapper({ children }) {
  return (
    <NotificationsProvider>
      {children}
    </NotificationsProvider>
  );
}

NotificationsWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export function useNotification() {
  const { notifications, addNotification, removeNotification } = useNotifications();

  const showNotification = (message, type) => {
    addNotification({
      component: () => <NotificationItem message={message} type={type} />,
      id: message,
    });
  };

  return { notifications, showNotification, removeNotification };
}
// notificationwrapper around all components in app.jsx
// can call in another component:
// 1. import usenotifications
// 2. set const {showNotification} = useNotification()
// 3. showNotification(message, type)
