// import React from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import DotIcon from 'react-native-vector-icons/Entypo';
// import { colors } from '../utils/styles';

// const ChatHeader = ({
//   name,
//   lastSeen,
//   isOnline,
//   typing,
//   profileImage,
//   onBack,
// }: any) => {
//   return (
//     <View style={styles.container}>
//       {/* Left Section */}
//       <View style={styles.leftSection}>
//         <TouchableOpacity onPress={onBack} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>

//         {/* Profile Image */}
//         {profileImage ? (
//           <Image source={{ uri: profileImage }} style={styles.avatar} />
//         ) : (
//           <View style={[styles.avatar, styles.defaultAvatar]}>
//             <Icon name="person-outline" size={22} color="#fff" />
//           </View>
//         )}

//         {/* Name + Status */}
//         <View>
//           <View style={styles.nameRow}>
//             <Text numberOfLines={1} style={styles.nameText}>
//               {name || 'Chat'}
//             </Text>
//             {isOnline && <View style={styles.onlineDot} />}
//           </View>

//           <Text style={styles.statusText}>
//             {typing
//               ? 'Typing...'
//               : isOnline
//               ? 'Online'
//               : lastSeen
//               ? `Last seen ${lastSeen}`
//               : ''}
//           </Text>
//         </View>
//       </View>

//       {/* Right Icons */}
//       <View style={styles.rightIcons}>
//         <TouchableOpacity style={styles.iconButton}>
//           <DotIcon name="dots-three-vertical" size={22} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.primary,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     paddingBottom: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',

//     borderBottomLeftRadius: 28,
//     borderBottomRightRadius: 28,
//   },
//   leftSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   backButton: {
//     marginRight: 8,
//     padding: 4,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//     backgroundColor: '#ccc',
//   },
//   defaultAvatar: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   nameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   nameText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#fff',
//     maxWidth: 150,
//   },
//   onlineDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#34C759',
//     marginLeft: 6,
//   },
//   statusText: {
//     fontSize: 12,
//     color: '#E8E8E8',
//   },
//   rightIcons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconButton: {
//     marginHorizontal: 6,
//     padding: 4,
//   },
// });

// export default ChatHeader;

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DotIcon from 'react-native-vector-icons/Entypo';
import { colors } from '../utils/styles';

const ChatHeader = ({
  name,
  lastSeen,
  isOnline,
  typing,
  profileImage,
  onBack,
  onOptionsPress,
}: any) => {
  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Profile Image */}
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.defaultAvatar]}>
            <Icon name="person-outline" size={22} color="#fff" />
          </View>
        )}

        {/* Name + Status */}
        <View>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={styles.nameText}>
              {name || 'Chat'}
            </Text>
            {isOnline && <View style={styles.onlineDot} />}
          </View>

          <Text style={styles.statusText}>
            {typing
              ? 'Typing...'
              : isOnline
              ? 'Online'
              : lastSeen
              ? `Last seen ${lastSeen}`
              : ''}
          </Text>
        </View>
      </View>

      {/* Right Icons */}
      <View style={styles.rightIcons}>
        {onOptionsPress && (
          <TouchableOpacity style={styles.iconButton} onPress={onOptionsPress}>
            <DotIcon name="dots-three-vertical" size={22} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#ccc',
  },
  defaultAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    maxWidth: 150,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginLeft: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#E8E8E8',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 6,
    padding: 4,
  },
});

export default ChatHeader;
