// import React from 'react';
// import { View, Text, TouchableOpacity, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../utils/styles';
// import { useNavigation } from '@react-navigation/native';

// const ChatHeader = ({
//   name,
//   lastSeen,
//   isOnline,
//   profileImage,
//   onBack,
// }: any) => {
//   const navigation: any = useNavigation();
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         backgroundColor: colors.primary,
//         paddingHorizontal: 10,
//         paddingVertical: 8,
//       }}
//     >
//       {/* Left Section */}
//       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//         <TouchableOpacity onPress={onBack} style={{ marginRight: 10 }}>
//           <Icon name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>

//         {/* Profile Image */}
//         {/* <Image
//           source={
//             profileImage
//               ? { uri: profileImage }
//               : require("../assets/default-avatar.png")
//           }
//           style={{
//             width: 40,
//             height: 40,
//             borderRadius: 20,
//             marginRight: 10,
//           }}
//         /> */}

//         {/* Name + Status */}
//         <View>
//           <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
//             {name || 'Chat'}
//           </Text>
//           <Text style={{ fontSize: 12, color: isOnline ? '#34C759' : '#fff' }}>
//             {isOnline ? 'Online' : lastSeen ? `Last seen ${lastSeen}` : ''}
//           </Text>
//         </View>
//       </View>

//       {/* Right Icons */}
//       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//         <TouchableOpacity style={{ marginHorizontal: 8 }}>
//           <Icon name="call-outline" size={22} color="#fff" />
//         </TouchableOpacity>
//         <TouchableOpacity>
//           <Icon name="videocam-outline" size={22} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default ChatHeader;

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/styles';

const ChatHeader = ({
  name,
  lastSeen,
  isOnline,
  typing,
  profileImage,
  onBack,
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
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="call-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="videocam-outline" size={22} color="#fff" />
        </TouchableOpacity>
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
    // elevation: 4,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // shadowOffset: { width: 0, height: 2 },
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
