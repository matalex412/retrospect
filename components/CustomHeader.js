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

  onDateChange = async date => {
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
      store.dispatch(updateLogs({successes: data.successes}));
      store.dispatch(updateLogs({failures: data.failures}));
    } else {
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
});

export default connect(mapStateToProps)(CustomHeader);
