// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { globalStyles, colors } from '../utils/styles';

// const MessageBubble = ({
//   text,
//   isMe,
//   timestamp,
//   senderName,
//   edited = false,
// }: any) => {
//   const timeText =
//     timestamp
//       ?.toDate?.()
//       ?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';

//   return (
//     <>
//       <View
//         style={[
//           styles.bubble,
//           isMe
//             ? { alignSelf: 'flex-end', backgroundColor: '#6968a3ff' }
//             : { alignSelf: 'flex-start', backgroundColor: '#E5E5EA' },
//         ]}
//       >
//         {!isMe && senderName && (
//           <Text style={styles.senderName}>{senderName}</Text>
//         )}
//         <Text
//           style={{
//             color: isMe ? '#fff' : colors.text,
//             fontSize: 16,
//             lineHeight: 20,
//           }}
//         >
//           {text}
//         </Text>
//         <View style={styles.timestampContainer}>
//           <Text
//             style={[
//               styles.timestamp,
//               { color: isMe ? '#fff' : colors.textSecondary },
//             ]}
//           >
//             {timeText}
//           </Text>
//           {edited && (
//             <Text
//               style={[
//                 styles.editedIndicator,
//                 { color: isMe ? '#43b94dff' : '#0ba073ff' },
//               ]}
//             >
//               • edited
//             </Text>
//           )}
//         </View>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   bubble: {
//     padding: 12,
//     marginVertical: 4,
//     borderRadius: 18,
//     maxWidth: '75%',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   senderName: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: colors.textSecondary,
//     marginBottom: 4,
//   },
//   timestampContainer: {
//     flexDirection: 'row',
//     alignSelf: 'flex-end',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   timestamp: {
//     fontSize: 10,
//   },
//   editedIndicator: {
//     fontSize: 11,
//     fontStyle: 'italic',
//     marginLeft: 4,
//     opacity: 0.8,
//   },
// });

// export default MessageBubble;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles, colors } from '../utils/styles';

const MessageBubble = ({
  text,
  isMe,
  timestamp,
  senderName,
  edited = false,
  reactions = {},
  isSelected = false,
  senderNames = {},
  currentUid,
}: any) => {
  const timeText =
    timestamp
      ?.toDate?.()
      ?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';

  // Group reactions by emoji
  const groupedReactions: { [emoji: string]: string[] } = {};
  Object.entries(reactions).forEach(([uid, emoji]: [string, any]) => {
    if (emoji) {
      if (!groupedReactions[emoji]) {
        groupedReactions[emoji] = [];
      }
      groupedReactions[emoji].push(uid);
    }
  });

  const hasReactions = Object.keys(groupedReactions).length > 0;

  return (
    <View
      style={{
        marginVertical: 4,
        backgroundColor: isSelected ? '#60df5427' : 'transparent',
        borderRadius: isSelected ? 18 : 0,
        padding: isSelected ? 4 : 0,
      }}
    >
      <View
        style={[
          styles.bubble,
          isMe
            ? { alignSelf: 'flex-end', backgroundColor: '#6968a3ff' }
            : { alignSelf: 'flex-start', backgroundColor: '#E5E5EA' },
          // isSelected && styles.selectedBubble,
        ]}
      >
        {!isMe && senderName && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}
        <Text
          style={{
            color: isMe ? '#fff' : colors.text,
            fontSize: 16,
            lineHeight: 20,
          }}
        >
          {text}
        </Text>
        <View style={styles.timestampContainer}>
          <Text
            style={[
              styles.timestamp,
              { color: isMe ? '#fff' : colors.textSecondary },
            ]}
          >
            {timeText}
          </Text>
          {edited && (
            <Text
              style={[
                styles.editedIndicator,
                { color: isMe ? '#43b94dff' : '#0ba073ff' },
              ]}
            >
              • edited
            </Text>
          )}
        </View>
      </View>

      {hasReactions && (
        <View
          style={[
            styles.reactionsContainer,
            isMe ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
          ]}
        >
          {Object.entries(groupedReactions).map(
            ([emoji, uids]: [string, string[]]) => (
              <View key={emoji} style={styles.reactionPill}>
                <Text style={styles.reactionEmoji}>{emoji}</Text>
                {uids.length > 1 && (
                  <Text style={styles.reactionCount}>{uids.length}</Text>
                )}
                {/* {uids.includes(currentUid) && (
                  <View style={styles.reactionIndicator} />
                )} */}
              </View>
            ),
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedBubble: {
    backgroundColor: '#d0d0d0 !important',
    opacity: 0.8,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
  },
  editedIndicator: {
    fontSize: 11,
    fontStyle: 'italic',
    marginLeft: 4,
    opacity: 0.8,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -8,
    marginHorizontal: 8,
    gap: 4,
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 3,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  reactionIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});

export default MessageBubble;
