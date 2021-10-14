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
import {systemWeights, human} from 'react-native-typography';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DeviceInfo from 'react-native-device-info';

import ModalAlert from './../components/ModalAlert';
import {updateLogs} from './../redux/actions';
import {store} from './../redux/store';

class DiaryScreen extends React.Component {
  state = {
    successes: [],
    failures: [],
    isModalVisible: false,
  };

  componentDidMount = () => {
    this.setup();
  };

  setup = async () => {
    let d = new Date();
    let date = d.toISOString().slice(0, 10);

    await store.dispatch(updateLogs({currentDate: d}));
    await store.dispatch(updateLogs({selectedDate: d}));
    await store.dispatch(updateLogs({logsDate: date}));
    const id = DeviceInfo.getUniqueId();

    let doc = await firestore().collection(`Users/${id}/logs`).doc(date).get();

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

      // show success modal
      this.setState({
        alertMessage: `Well done! You've logged this day's successes and failures. In the future, you can look back and see how to improve.`,
      });
      this.changeModalVisible();
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

  addSuccess = async () => {
    let successes = this.props.successes;
    await store.dispatch(updateLogs({successes: [...successes, '']}));
  };

  addFailure = async () => {
    let failures = this.props.failures;
    await store.dispatch(
      updateLogs({failures: [...failures, {failure: '', lesson: ''}]}),
    );
  };

  removeSuccess = async id => {
    let successes = [...this.props.successes];
    successes.splice(id, 1);
    await store.dispatch(updateLogs({successes}));
  };

  removeFailure = async id => {
    let failures = [...this.props.failures];
    failures.splice(id, 1);
    await store.dispatch(updateLogs({failures}));
  };

  changeModalVisible = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <ModalAlert
            title={this.state.alertTitle}
            message={this.state.alertMessage}
            isModalVisible={this.state.isModalVisible}
            onDismiss={this.changeModalVisible}
            icon={this.state.alertIcon}
          />
          <View style={styles.box}>
            <Text style={styles.subHeading}>Successes</Text>
            {this.props.successes.map((success, id) => {
              return (
                <View
                  style={[
                    styles.horizontalView,
                    {
                      justifyContent: 'space-between',
                    },
                  ]}
                  key={id}>
                  <TextInput
                    value={success}
                    onChangeText={async text => {
                      let successes = [...this.props.successes];
                      successes[id] = text;
                      await store.dispatch(updateLogs({successes}));
                    }}
                    placeholder="What went well today?"></TextInput>
                  <TouchableOpacity
                    style={styles.close}
                    onPress={() => this.removeSuccess(id)}>
                    <Ionicons name="close-circle" size={25} color="#F25757" />
                  </TouchableOpacity>
                </View>
              );
            })}
            <TouchableOpacity
              style={styles.horizontalView}
              onPress={this.addSuccess}>
              <Ionicons name="add-circle" size={35} color="#F25757" />
              <Text>Add something that went well</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <Text style={styles.subHeading}>Mistakes</Text>
            {this.props.failures.map((failure, id) => {
              return (
                <View
                  style={[
                    styles.horizontalView,
                    {
                      borderRadius: 10,
                      borderWidth: failure.error ? 1 : 0,
                      borderColor: failure.error ? '#F25757' : '#fff',
                      justifyContent: 'space-between',
                      padding: 3,
                    },
                  ]}
                  key={id}>
                  <View>
                    <View style={styles.horizontalView}>
                      <Text style={styles.label}>Mistake:</Text>
                      <TextInput
                        value={failure.failure}
                        onChangeText={text => {
                          let failures = [...this.props.failures];
                          failures[id].failure = text;
                          store.dispatch(updateLogs({failures}));
                        }}
                        style={styles.textInput}
                        placeholder="What went wrong?"></TextInput>
                    </View>
                    <View style={styles.horizontalView}>
                      <Text style={styles.label}>Lesson:</Text>
                      <TextInput
                        value={failure.lesson}
                        onChangeText={text => {
                          let failures = [...this.props.failures];
                          failures[id].lesson = text;
                          store.dispatch(updateLogs({failures}));
                        }}
                        style={styles.textInput}
                        placeholder="What lesson can you learn?"></TextInput>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => this.removeFailure(id)}>
                    <Ionicons name="close-circle" size={25} color="#F25757" />
                  </TouchableOpacity>
                </View>
              );
            })}
            <TouchableOpacity
              style={styles.horizontalView}
              onPress={this.addFailure}>
              <Ionicons name="add-circle" size={35} color="#F25757" />
              <Text>Add something that went wrong</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.postButton}
            onPress={this.publishPost}>
            <View style={styles.horizontalView}>
              <Text style={styles.postText}>Complete Diary</Text>
              <Ionicons
                style={styles.postIcon}
                name="send"
                size={25}
                color="#fff"
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
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
  contentContainer: {
    justifyContent: 'center',
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  horizontalView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  subHeading: {
    ...human.title2Object,
  },
  label: {
    ...human.subheadObject,
    ...systemWeights.semibold,
  },
  box: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 1,
    backgroundColor: '#fff',
  },
  postIcon: {
    marginLeft: 5,
  },
  postText: {
    color: '#fff',
  },
  postButton: {
    elevation: 1,
    backgroundColor: '#F25757',
    borderRadius: 50,
    padding: 10,
  },
  textInput: {
    paddingTop: 0,
    paddingBottom: 0,
  },
});

const mapStateToProps = state => ({
  selectedDate: state.logs.selectedDate,
  logsDate: state.logs.logsDate,
  successes: state.logs.successes,
  failures: state.logs.failures,
});

export default connect(mapStateToProps)(DiaryScreen);
