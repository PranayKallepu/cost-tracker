import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { setUser, logout } from "./features/auth/authSlice";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/Dashboard";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const boxBgColor = useColorModeValue("white", "gray.700");
  const tabColor = useColorModeValue("gray.700", "gray.200");
  const tabHoverColor = useColorModeValue("blue.600", "blue.300");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (user) {
    return <Dashboard />;
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.sm" py={10}>
        <Box
          p={8}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          bg={boxBgColor}
        >
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab
                color={tabColor}
                _hover={{ color: tabHoverColor }}
                _selected={{
                  color: tabHoverColor,
                  borderColor: tabHoverColor,
                }}
              >
                Login
              </Tab>
              <Tab
                color={tabColor}
                _hover={{ color: tabHoverColor }}
                _selected={{
                  color: tabHoverColor,
                  borderColor: tabHoverColor,
                }}
              >
                Register
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Register />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
