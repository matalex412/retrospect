import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarStrip from 'react-native-calendar-strip';
import {connect} from 'react-redux';

import {updateLogs} from './../redux/actions';
import {store} from './../redux/store';

class CustomHeader extends React.Component {
  state = {
    isModalVisible: false,
  };

  publishPost = async () => {
    let isValid = await this.validateDiary();
    if (isValid) {
      const id = DeviceInfo.getUniqueId();

      // upload to firestore
      await firestore()
        .collection(`Users/${id}/logs`)
        .doc(this.props.logsDate)
        .set({
          successes: this.props.successes,
          failures: this.props.failures,
        });
    }
  };

  validateDiary = async () => {
    let valid = true;

    // delete empty fields
    let successes = [...this.props.successes];
    successes = successes.filter(s => s !== '');

    let failures = [...this.props.failures];
    failures = failures.filter(f => f.failure !== '' || f.lesson !== '');

    // do some validation of lengths
    for (let failure of failures) {
      if (failure.failure == '' || failure.lesson == '') {
        failure.error = true;
        valid = false;
      } else {
        delete failure.error;
      }
    }

    // ensure fields aren't completely empty
    if (successes.length == 0 && failures.length == 0) {
      valid = false;
    }

    // update variables
    await store.dispatch(updateLogs({successes}));
    await store.dispatch(updateLogs({failures}));

    return valid;
  };

  onDateChange = async date => {
    await this.publishPost();
    let logsDate = date.format('YYYY[-]MM[-]DD').toString();
    await store.dispatch(updateLogs({goals: []}));

    const id = DeviceInfo.getUniqueId();

    // upload to firestore
    let doc = await firestore()
      .collection(`Users/${id}/logs`)
      .doc(logsDate)
      .get();

    await store.dispatch(updateLogs({selectedDate: date}));
    await store.dispatch(updateLogs({logsDate}));

    if (doc.exists) {
      let data = doc.data();
      if (!data.goals) {
        data.goals = [];
      }
      if (!data.successes) {
        data.successes = [];
      }
      if (!data.failures) {
        data.failures = [];
      }
      store.dispatch(updateLogs({goals: data.goals}));
      store.dispatch(updateLogs({successes: data.successes}));
      store.dispatch(updateLogs({failures: data.failures}));
    } else {
      store.dispatch(updateLogs({goals: []}));
      store.dispatch(updateLogs({successes: []}));
      store.dispatch(updateLogs({failures: []}));
    }
  };

  render() {
    return (
      <View>
        <CalendarStrip
          startingDate={this.props.selectedDate}
          selectedDate={this.props.selectedDate}
          maxDate={this.props.currentDate}
          onDateSelected={this.onDateChange}
          scrollable
          style={{height: 100, paddingTop: 10}}
          daySelectionAnimation={{
            type: 'border',
            duration: 200,
            borderWidth: 1,
            borderHighlightColor: '#F25757',
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
  },
  calendar: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});

const mapStateToProps = state => ({
  selectedDate: state.logs.selectedDate,
  currentDate: state.logs.currentDate,
  successes: state.logs.successes,
  failures: state.logs.failures,
});

export default connect(mapStateToProps)(CustomHeader);
