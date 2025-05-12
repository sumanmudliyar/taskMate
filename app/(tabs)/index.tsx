import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addTodos, updateTodoStatus, deleteTodo } from '../../store/todosSlice';
import { Picker } from '@react-native-picker/picker';
import TodoItem from '../components/TodoItem';
import TodoSummaryCard from '../components/TodoSummaryCard';

// Define the type for a TODO item
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at?: string;
}

// const TodoSummaryCard = ({ total, completed }: { total: number; completed: number }) => {
//   return (
//     <View style={styles.summaryCard}>
//       <View style={styles.summaryItem}>
//         <MaterialIcons name="list" size={24} color="#007bff" />
//         <Text style={styles.summaryText}>Total: {total}</Text>
//       </View>
//       <View style={styles.summaryItem}>
//         <MaterialIcons name="check-circle" size={24} color="green" />
//         <Text style={styles.summaryText}>Completed: {completed}</Text>
//       </View>
//     </View>
//   );
// };

export default function TodoListScreen() {
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
  const [page, setPage] = useState<number>(1); // Current page number
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false); // State for pagination loading
  const [sortOption, setSortOption] = useState<'mostRecent' | 'byId'>('mostRecent'); // Default to "Most Recent"
  const [filterOption, setFilterOption] = useState<'all' | 'completed' | 'pending'>('all'); // Default to "All"
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null); // State for the TODO being edited
  const [newTitle, setNewTitle] = useState<string>(''); // State for the new title
  const itemsPerPage = 10; // Number of items per page
  const dispatch = useDispatch(); // Initialize Redux dispatch

  // Access todos from Redux store
  const allTodos = useSelector((state: RootState) => state.todos.todos);

  // Paginate todos based on the current page
  const todos = allTodos.slice(0, page * itemsPerPage);

  // Sort todos by created_at in descending order (most recent first)
  const sortedTodos = [...todos].sort((a, b) => {
    if (sortOption === 'mostRecent') {
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime(); // Most recent first
    } else if (sortOption === 'byId') {
      return a.id - b.id; // Sort by ID
    }
    return 0;
  });

  // Filter todos based on the selected filter option
  const filteredTodos = sortedTodos.filter((todo) => {
    if (filterOption === 'completed') {
      return todo.completed; // Show only completed TODOs
    } else if (filterOption === 'pending') {
      return !todo.completed; // Show only pending TODOs
    }
    return true; // Show all TODOs
  });

  // Fetch TODO items
  const fetchTodos = async () => {
    try {
      setLoading(true); // Show loader while fetching
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos?_limit=24` // Limit the results to 24
      );

      const data = await response.json();

      // Add a created_at field to each TODO
      let baseDate = new Date(); // Start with the current date
      const todosWithTimestamp = data.map((todo: Todo, index: number) => {
        // Decrement the date for each TODO
        if (index > 0) {
          baseDate.setDate(baseDate.getDate() - 1); // Decrement by 1 day for each TODO
        }

        return {
          ...todo,
          created_at: todo.created_at || baseDate.toISOString(), // Ensure created_at exists
        };
      });

      // Dispatch the fetched TODOs with the created_at field to the Redux store
      dispatch(addTodos(todosWithTimestamp));
    } catch (error) {
      console.error('Error fetching TODOs:', error);
    } finally {
      // Ensure the loader is shown for at least 2 seconds
      setTimeout(() => {
        setLoading(false); // Hide loader after fetching
        setIsFetchingMore(false); // Reset fetching more state
      }, 2000); // 2-second delay
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Load more TODOs when the user scrolls to the end
  const loadMoreTodos = () => {
    if (!isFetchingMore && todos.length < allTodos.length) {
      setIsFetchingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Trigger fetchTodos when the page changes
  useEffect(() => {
    if (page > 1) {
      fetchTodos();
    }
  }, [page]);

  // Function to update the status of a TODO
  const updateStatus = (id: number, completed: boolean) => {
    dispatch(updateTodoStatus({ id, completed }));
  };

  // Function to delete a TODO
  const handleDelete = (id: number) => {
    dispatch(deleteTodo(id)); // Dispatch the delete action
  };

  // Function to handle editing a TODO
  const handleEditTodo = () => {
    if (editingTodo && newTitle.trim()) {
      dispatch(updateTodoStatus({ id: editingTodo.id, title: newTitle })); // Dispatch the updated title
      setEditingTodo(null); // Clear the editing state
      setNewTitle(''); // Clear the input field
    }
  };

  // Render a single TODO item
  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TodoItem
      id={item.id}
      title={item.title}
      completed={item.completed}
      createdAt={item.created_at || new Date().toISOString()} // Fallback to current date
      onUpdateStatus={updateStatus}
      onDelete={handleDelete}
      onEdit={() => {
        setEditingTodo(item); // Set the TODO being edited
        setNewTitle(item.title); // Populate the input field with the TODO title
      }}
    />
  );

  // Calculate the total and completed TODOs for the summary
  const totalTodos = allTodos.length;
  const completedTodos = allTodos.filter((todo) => todo.completed).length;

  console.log('Todos:', todos); // Log the TODOs to the console

  return (
    <SafeAreaView style={styles.container}>
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Sorting Dropdown */}
          <Picker
            selectedValue={sortOption}
            onValueChange={(value) => setSortOption(value)}
            style={styles.picker}
          >
            <Picker.Item label="Sort by Most Recent" value="mostRecent" />
            <Picker.Item label="Sort by ID" value="byId" />
          </Picker>

          {/* Filtering Dropdown */}
          <Picker
            selectedValue={filterOption}
            onValueChange={(value) => setFilterOption(value)}
            style={styles.picker}
          >
            <Picker.Item label="Show All" value="all" />
            <Picker.Item label="Show Completed" value="completed" />
            <Picker.Item label="Show Pending" value="pending" />
          </Picker>

          {/* TODO Summary Card */}
          <TodoSummaryCard total={totalTodos} completed={completedTodos} />

          {/* TODO List */}
          <FlatList
            data={filteredTodos} // Use filteredTodos here
            keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
            renderItem={renderTodoItem}
            onEndReached={loadMoreTodos} // Trigger loadMoreTodos when the end is reached
            onEndReachedThreshold={0.5} // Load more when 50% of the list is scrolled
            ListFooterComponent={
              isFetchingMore ? <ActivityIndicator size="small" color="#0000ff" /> : null
            } // Show a loading indicator at the bottom while fetching more
          />

          {/* Editing TODO */}
          {editingTodo ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                placeholder="Edit TODO title"
                value={newTitle}
                onChangeText={setNewTitle}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleEditTodo}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEditingTodo(null); // Cancel editing
                  setNewTitle(''); // Clear the input field
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#f9f9f9',
  },
  todoItem: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
  deleteButton: {
    marginTop: 8,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  summaryCard: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    marginLeft: 8,
  },
  editContainer: {
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
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
