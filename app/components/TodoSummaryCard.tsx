import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TodoSummaryCardProps {
  total: number;
  completed: number;
}

const TodoSummaryCard = ({ total, completed }: TodoSummaryCardProps) => {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryItem}>
        <MaterialIcons name="list" size={24} color="#007bff" />
        <Text style={styles.summaryText}>Total: {total}</Text>
      </View>
      <View style={styles.summaryItem}>
        <MaterialIcons name="check-circle" size={24} color="green" />
        <Text style={styles.summaryText}>Completed: {completed}</Text>
      </View>
      <View style={styles.summaryItem}>
        <MaterialIcons name="hourglass-empty" size={24} color="orange" />
        <Text style={styles.summaryText}>Pending: {total - completed}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'column', // Stack items vertically
    alignItems: 'flex-start', // Align items to the left
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // Add spacing between items
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default TodoSummaryCard;