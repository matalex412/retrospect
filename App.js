import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Provider} from 'react-redux';
import AppContainer from './AppNavigator';
//import AppIntroSlider from 'react-native-app-intro-slider';
import {human} from 'react-native-typography';
import SplashScreen from 'react-native-splash-screen';
import {PersistGate} from 'redux-persist/integration/react';

import {store, persistor} from './redux/store';

/*const slides = [
	{
		key: 'one',
		title: 'Step 1',
		text: 'Set goals you want to achieve today',
		backgroundColor: '#59b2ab',
	},
	{
		key: 'two',
		title: 'Step 2',
		text: 'Log the successes and mistakes from your day',
		backgroundColor: '#90DAFD',
	},
	{
		key: 'three',
		title: 'Step 3',
		text: 'Track your success to your aims',
		backgroundColor: '#F25757',
	},
];*/

export default class App extends React.Component {
	componentDidMount() {
		SplashScreen.hide();
	}

	/*state = {
		showRealApp: false,
	};

	_renderItem = ({item}) => {
		return (
			<View style={[styles.slide, {backgroundColor: item.backgroundColor}]}>
				<Text style={styles.title}>{item.title}</Text>
				<Text style={styles.text}>{item.text}</Text>
			</View>
		);
	};

	_onDone = () => {
		// User finished the introduction. Show real app through
		// navigation or simply by controlling state
		this.setState({showRealApp: true});
	};*/

	render() {
		//if (this.state.showRealApp) {
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<AppContainer />
				</PersistGate>
			</Provider>
		);
		/*} else {
			return (
				<AppIntroSlider
					renderItem={this._renderItem}
					data={slides}
					onDone={this._onDone}
				/>
			);
		}*/
	}
}

const styles = StyleSheet.create({
	slide: {
		backgroundColor: 'red',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	title: {
		...human.title2WhiteObject,
	},
	text: {
		...human.title3WhiteObject,
		textAlign: 'center',
	},
});
