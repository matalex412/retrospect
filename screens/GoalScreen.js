import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {human} from 'react-native-typography';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';

import {updateLogs} from './../redux/actions';
import {store} from './../redux/store';

class GoalScreen extends React.Component {
  state = {
    goals: [],
    newGoal: '',
  };

  addGoal = async () => {
    let goals = [...this.props.goals];
    await store.dispatch(updateLogs({goals: [...goals, this.state.newGoal]}));
    this.setState({newGoal: ''});
  };

  goalDone = async id => {
    let successes = this.props.successes;
    await store.dispatch(
      updateLogs({successes: [...successes, this.props.goals[id]]}),
    );

    let goals = [...this.props.goals];
    goals.splice(id, 1);
    await store.dispatch(updateLogs({goals}));
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.subHeading}>Your Goals</Text>
          <View style={styles.horizontalView}>
            <TextInput
              value={this.state.newGoal}
              onChangeText={newGoal => {
                this.setState({newGoal});
              }}
              placeholder="What do you aim to achieve today?"></TextInput>

            <TouchableOpacity
              disabled={this.state.newGoal.length == 0}
              onPress={this.addGoal}>
              <Ionicons name="add-circle" size={35} color="#F25757" />
            </TouchableOpacity>
          </View>
          {this.props.goals.map((goal, id) => {
            return (
              <View key={id} style={styles.horizontalView}>
                <Text>{goal}</Text>
                <TouchableOpacity onPress={() => this.goalDone(id)}>
                  <Ionicons name="checkmark" size={35} color="#F25757" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingVertical: 30,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  horizontalView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    elevation: 1,
    backgroundColor: '#fff',
    marginVertical: 5,
    paddingHorizontal: 5,
  },
  subHeading: {
    ...human.title2Object,
  },
  inputText: {
    ...human.title3Object,
  },
  box: {
    width: '90%',
  },
});

const mapStateToProps = state => ({
  successes: state.logs.successes,
  goals: state.logs.goals,
});

export default connect(mapStateToProps)(GoalScreen);
