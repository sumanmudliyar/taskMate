import React, { memo } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  onUpdateStatus: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const TodoItem = memo(
  ({ id, title, completed, createdAt, onUpdateStatus, onDelete, onEdit }: TodoItemProps) => {
    return (
      <View style={[styles.todoItem, completed ? styles.completedCard : styles.pendingCard]}>
        <View style={styles.iconAndTitleContainer}>
          <MaterialIcons
            name={completed ? 'task-alt' : 'assignment'} // Task-related icons
            size={24}
            color={completed ? 'green' : 'orange'}
          />
          <Text style={styles.todoTitle}>{title}</Text>
        </View>
        <Text style={styles.todoDate}>
          Created At: {new Date(createdAt).toLocaleDateString()}
        </Text>
        <View style={styles.statusContainer}>
          <Text style={styles.todoStatus}>
            {completed ? 'Completed' : 'Pending'}
          </Text>
          <Switch
            value={completed}
            onValueChange={(value) => onUpdateStatus(id, value)}
          />
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => onEdit(id)}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(id)}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  todoItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#d4edda', // Light green for completed TODOs
    borderColor: '#c3e6cb', // Green border
    borderWidth: 1,
  },
  pendingCard: {
    backgroundColor: '#f8d7da', // Light red for pending TODOs
    borderColor: '#f5c6cb', // Red border
    borderWidth: 1,
  },
  iconAndTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8, // Add space between the icon and the title
  },
  todoDate: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  todoStatus: {
    fontSize: 14,
    color: '#555',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  editButton: {
    color: '#007BFF',
    fontWeight: 'bold',
    marginRight: 16,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default TodoItem;