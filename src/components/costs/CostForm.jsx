import { useState, useEffect } from "react";
import { addDoc, updateDoc, doc, collection } from "firebase/firestore";
import { db } from "../../services/firebase";
import { addCost, updateCost } from "../../features/costs/costsSlice";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  VStack,
} from "@chakra-ui/react";

const CostForm = ({ cost, onClose, userId }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cost) {
      setDescription(cost.description);
      setAmount(cost.amount);
    }
  }, [cost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (cost) {
        // Update existing cost
        const costRef = doc(db, "users", userId, "costs", cost.id);
        await updateDoc(costRef, {
          description,
          amount: Number(amount),
        });

        alert("✅ Cost updated successfully");
      } else {
        // Add new cost
        const docRef = await addDoc(collection(db, "users", userId, "costs"), {
          description,
          amount: Number(amount),
        });
        alert("✅ Cost added successfully");
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
          <FormLabel>Description</FormLabel>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter cost description"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Amount</FormLabel>
          <NumberInput min={0} precision={2}>
            <NumberInputField
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </NumberInput>
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          isLoading={loading}
        >
          {cost ? "Update Cost" : "Add Cost"}
        </Button>
      </VStack>
    </form>
  );
};

export default CostForm;
