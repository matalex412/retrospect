import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {human, systemWeights} from 'react-native-typography';

export default class LearnModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal isVisible={this.props.isModalVisible}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <View
            style={{
              width: '80%',
              backgroundColor: 'white',
              borderRadius: 5,
              padding: 20,
              alignItems: 'center',
            }}>
            <Ionicons
              name={this.props.icon ? this.props.icon : 'md-happy'}
              size={70}
              color="#F25757"
            />
            <Text
              style={[
                human.body,
                {color: '#000', textAlign: 'center', marginVertical: 5},
              ]}>
              {this.props.message}
            </Text>
            <TouchableOpacity
              onPress={this.props.onDismiss}
              style={{
                margin: 5,
                width: '80%',
                alignItems: 'center',
                backgroundColor: '#F25757',
                padding: 5,
                borderRadius: 10,
              }}>
              <Text style={human.headlineWhite}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
