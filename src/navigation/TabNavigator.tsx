import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/styles';
import HomeScreen from '../screens/TabScreens/HomeScreen';
import UsersScreen from '../screens/TabScreens/UsersScreen';
import MessagesScreen from '../screens/TabScreens/MessagesScreen';
import ProfileScreen from '../screens/TabScreens/ProfileScreen';
import GroupsScreen from '../screens/TabScreens/GroupsScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Users')
          iconName = focused ? 'people' : 'people-outline';
        else if (route.name === 'Messages')
          iconName = focused ? 'chatbubble' : 'chatbubble-outline';
        else if (route.name === 'Groups')
          iconName = focused ? 'people-sharp' : 'people-outline';
        // Groups icon
        else if (route.name === 'Profile')
          iconName = focused ? 'person' : 'person-outline';
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.background,
        borderTopWidth: 0,
        borderTopColor: colors.textSecondary,
        height: 60,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Users" component={UsersScreen} />
    <Tab.Screen name="Messages" component={MessagesScreen} />
    <Tab.Screen name="Groups" component={GroupsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
