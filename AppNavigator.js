import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer} from '@react-navigation/native';

import DiaryScreen from './screens/DiaryScreen';
import GoalScreen from './screens/GoalScreen';
import CustomHeader from './components/CustomHeader';
import HeaderDropdown from './components/HeaderDropdown';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function AppTabs() {
	return (
		<Tab.Navigator
			initialRouteName="Goals"
			tabBarOptions={{
				activeTintColor: '#F25757',
				indicatorStyle: {backgroundColor: '#F25757'},
			}}>
			<Tab.Screen name="Goals" component={GoalScreen} />
			<Tab.Screen name="Diary" component={DiaryScreen} />
		</Tab.Navigator>
	);
}

function AppStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Tabs"
				component={AppTabs}
				options={{
					headerStyle: {height: 100},
					headerTitle: props => <CustomHeader {...props} />,
				}}
			/>
		</Stack.Navigator>
	);
}

function AppContainer() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name="Home"
					options={{
						title: 'Retrospect',
					}}
					component={AppStack}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default AppContainer;
