import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, remove, ref, onValue } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpAXunJCReRG4_oaaOsEDNoDVu5BJNwJo",
  authDomain: "ostoslista-96984.firebaseapp.com",
  databaseURL: "https://ostoslista-96984-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ostoslista-96984",
  storageBucket: "ostoslista-96984.appspot.com",
  messagingSenderId: "993062206781",
  appId: "1:993062206781:web:cc57f26012f2bbb9401954",
  measurementId: "G-LHM1M5HWYC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);

  // Load items from Firebase on component mount
  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemList = Object.entries(data).map(([key, value]) => ({ ...value, key }));
        setItems(itemList);
      } else {
        setItems([]);
      }
    });
  }, []);

  // Save item to Firebase
  const saveItem = () => {
    if (product && amount) {
      const itemsRef = ref(database, 'items/');
      push(itemsRef, { product, amount });
      setProduct('');
      setAmount('');
    }
  };

  // Delete item from Firebase
  const deleteItem = (itemKey) => {
    remove(ref(database, `items/${itemKey}`))
      .then(() => {
        const updatedItems = items.filter((item) => item.key !== itemKey);
        setItems(updatedItems);
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  };

// Separator component for FlatList
const listSeparator = () => <View style={styles.separator} />;

return (
  <View style={styles.container}>
    <Text style={styles.title}>Ostoslista</Text>
    <View style={styles.inputContainer}>
      <TextInput
        placeholder='Product'
        style={styles.input}
        value={product}
        onChangeText={(text) => setProduct(text)}
      />
      <TextInput
        placeholder='Amount'
        style={styles.input}
        value={amount}
        onChangeText={(text) => setAmount(text)}
        keyboardType="numeric"
      />
      <Button onPress={saveItem} title="Lisää" />
    </View>
    <FlatList
      style={styles.itemList}
      data={items}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.product}, {item.amount}</Text>
          <Button title="Poista" onPress={() => deleteItem(item.key)} />
        </View>
      )}
      ItemSeparatorComponent={listSeparator}
    />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
  },
});