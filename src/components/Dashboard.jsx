import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  collection,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { setItems, deleteItem } from "../features/items/itemsSlice";
import { setCosts, deleteCost } from "../features/costs/costsSlice";
import { logout } from "../features/auth/authSlice";
import ItemForm from "./items/ItemForm";
import CostForm from "./costs/CostForm";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.items);
  const { costs } = useSelector((state) => state.costs);
  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCost, setSelectedCost] = useState(null);
  const {
    isOpen: isItemModalOpen,
    onOpen: onItemModalOpen,
    onClose: onItemModalClose,
  } = useDisclosure();
  const {
    isOpen: isCostModalOpen,
    onOpen: onCostModalOpen,
    onClose: onCostModalClose,
  } = useDisclosure();

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const boxBgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    if (user) {
      // Subscribe to items
      const itemsQuery = query(collection(db, "users", user.uid, "items"));
      const unsubscribeItems = onSnapshot(itemsQuery, (snapshot) => {
        const itemsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setItems(itemsList));
      });

      // Subscribe to costs
      const costsQuery = query(collection(db, "users", user.uid, "costs"));
      const unsubscribeCosts = onSnapshot(costsQuery, (snapshot) => {
        const costsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setCosts(costsList));
      });

      return () => {
        unsubscribeItems();
        unsubscribeCosts();
      };
    }
  }, [user, dispatch]);

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "items", itemId));
      dispatch(deleteItem(itemId));
      alert("✅ Item deleted successfully");
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  const handleDeleteCost = async (costId) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "costs", costId));
      dispatch(deleteCost(costId));
      alert("✅ Cost deleted successfully");
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  const totalItemsCost = items.reduce((sum, item) => sum + item.cost, 0);
  const totalOtherCosts = costs.reduce((sum, cost) => sum + cost.amount, 0);
  const totalProjectCost = totalItemsCost + totalOtherCosts;

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="7xl">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg">Project Cost Tracker</Heading>
          <Button
            colorScheme="red"
            variant="outline"
            onClick={() => dispatch(logout())}
          >
            Logout
          </Button>
        </Flex>

        <Box
          bg={boxBgColor}
          borderRadius="lg"
          boxShadow="sm"
          borderWidth={1}
          borderColor={borderColor}
          mb={8}
          p={6}
        >
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Total Project Cost
            </Text>
            <Heading size="xl" mb={2}>
              ${totalProjectCost.toFixed(2)}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Items: ${totalItemsCost.toFixed(2)} | Other Costs: $
              {totalOtherCosts.toFixed(2)}
            </Text>
          </Box>
        </Box>

        <Box
          bg={boxBgColor}
          borderRadius="lg"
          boxShadow="sm"
          borderWidth={1}
          borderColor={borderColor}
          mb={8}
          p={6}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Items</Heading>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => {
                setSelectedItem(null);
                onItemModalOpen();
              }}
            >
              Add Item
            </Button>
          </Flex>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th isNumeric>Cost</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {items.map((item) => (
                  <Tr key={item.id} _hover={{ bg: "gray.50" }}>
                    <Td>{item.name}</Td>
                    <Td isNumeric>${item.cost.toFixed(2)}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => {
                            setSelectedItem(item);
                            onItemModalOpen();
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>

        <Box
          bg={boxBgColor}
          borderRadius="lg"
          boxShadow="sm"
          borderWidth={1}
          borderColor={borderColor}
          p={6}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md">Other Costs</Heading>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => {
                setSelectedCost(null);
                onCostModalOpen();
              }}
            >
              Add Cost
            </Button>
          </Flex>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Description</Th>
                  <Th isNumeric>Amount</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {costs.map((cost) => (
                  <Tr key={cost.id} _hover={{ bg: "gray.50" }}>
                    <Td>{cost.description}</Td>
                    <Td isNumeric>${cost.amount.toFixed(2)}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => {
                            setSelectedCost(cost);
                            onCostModalOpen();
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDeleteCost(cost.id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>

        <Modal isOpen={isItemModalOpen} onClose={onItemModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedItem ? "Edit Item" : "Add Item"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <ItemForm
                item={selectedItem}
                onClose={onItemModalClose}
                userId={user.uid}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal isOpen={isCostModalOpen} onClose={onCostModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedCost ? "Edit Cost" : "Add Cost"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <CostForm
                cost={selectedCost}
                onClose={onCostModalClose}
                userId={user.uid}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default Dashboard;
