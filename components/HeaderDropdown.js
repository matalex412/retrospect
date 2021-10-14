import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {connect} from 'react-redux';

import {updateLogs} from './../redux/actions';
import {store} from './../redux/store';

class HeaderDropdown extends React.Component {
  state = {
    open: false,
    value: null,
  };

  changeValue = async itemValue => {
    await store.dispatch(updateLogs({timeframe: itemValue}));
    this.setState({value: itemValue});
  };

  render() {
    return (
      <View>
        <Picker
          style={{width: 150}}
          selectedValue={this.state.value}
          onValueChange={this.changeValue}>
          <Picker.Item label="Day" value="day" />
          <Picker.Item label="Week" value="week" />
          <Picker.Item label="Month" value="month" />
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  selectedDate: state.logs.selectedDate,
});

export default connect(mapStateToProps)(HeaderDropdown);
