import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/styles';
import { useNavigation } from '@react-navigation/native';

const ChatHeader = ({
  name,
  lastSeen,
  isOnline,
  profileImage,
  onBack,
}: any) => {
  const navigation: any = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 8,
      }}
    >
      {/* Left Section */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={onBack} style={{ marginRight: 10 }}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Profile Image */}
        {/* <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../assets/default-avatar.png")
          }
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
          }}
        /> */}

        {/* Name + Status */}
        <View>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
            {name || 'Chat'}
          </Text>
          <Text style={{ fontSize: 12, color: isOnline ? '#34C759' : '#fff' }}>
            {isOnline ? 'Online' : lastSeen ? `Last seen ${lastSeen}` : ''}
          </Text>
        </View>
      </View>

      {/* Right Icons */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ marginHorizontal: 8 }}>
          <Icon name="call-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="videocam-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;
