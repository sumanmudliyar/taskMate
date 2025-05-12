import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/store';
import { addTodos } from '../../store/todosSlice';

export default function TabTwoScreen() {
  const [newTodo, setNewTodo] = useState(''); // State for the new TODO text
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const todos = useSelector((state: RootState) => state.todos.todos); // Access todos from Redux store

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: todos.length + 1, // Generate ID based on the current count of todos
        title: newTodo,
        completed: false,
        createdAt: new Date().toISOString(), // Add createdAt timestamp
        updatedAt: new Date().toISOString(), // Add updatedAt timestamp
      };
      dispatch(addTodos([todo])); // Dispatch the new TODO to the Redux store
      setNewTodo(''); // Clear the input field
      Alert.alert('TODO Added', `Your new TODO "${newTodo}" has been added.`); // Show success message
      Alert.alert('Success', 'New TODO added successfully!'); // Show a popup message
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new TODO"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddTodo}>
          <Text style={styles.buttonText}>Add TODO</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16, // Add padding for additional spacing
    paddingTop: 40,
        backgroundColor: '#f9f9f9',

  },
  text: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


