import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles, colors } from '../utils/styles';

const MessageBubble = ({ text, isMe, timestamp, senderName }: any) => (
  <View
    style={[
      styles.bubble,
      isMe
        ? { alignSelf: 'flex-end', backgroundColor: colors.success }
        : { alignSelf: 'flex-start', backgroundColor: '#E5E5EA' },
    ]}
  >
    {!isMe && senderName && <Text style={styles.senderName}>{senderName}</Text>}
    <Text
      style={{
        color: isMe ? '#fff' : colors.text,
        fontSize: 16,
        lineHeight: 20,
      }}
    >
      {text}
    </Text>
    <Text
      style={{
        fontSize: 10,
        color: isMe ? '#fff' : colors.textSecondary,
        alignSelf: 'flex-end',
        marginTop: 4,
      }}
    >
      {timestamp
        ?.toDate?.()
        ?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  bubble: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 18,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 4,
  },
});

export default MessageBubble;
