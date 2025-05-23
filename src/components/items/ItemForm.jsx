import { useState, useEffect } from "react";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import { db } from "../../services/firebase";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  VStack,
} from "@chakra-ui/react";

const ItemForm = ({ item, onClose, userId }) => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCost(item.cost);
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      if (item) {
        // Update existing item
        const itemRef = doc(db, "users", userId, "items", item.id);
        await updateDoc(itemRef, {
          name,
          cost: Number(cost),
        });
        alert("✅ Item updated successfully");
      } else {
        // Add new item
        await addDoc(collection(db, "users", userId, "items"), {
          name,
          cost: Number(cost),
        });
        alert("✅ Item added successfully");
      }
      onClose();
    } catch (error) {
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Item Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Cost</FormLabel>
          <NumberInput min={0} precision={2}>
            <NumberInputField
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Enter cost"
            />
          </NumberInput>
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={loading}
        >
          {item ? "Update Item" : "Add Item"}
        </Button>
      </VStack>
    </form>
  );
};

export default ItemForm;
