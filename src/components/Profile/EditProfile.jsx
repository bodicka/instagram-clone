import {
  Avatar,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import {useRef, useState } from "react";
import useAuthStore from "../../store/authStore";
import usePreviewImg from "../hooks/usePreviewImg";
import useEditProfile from "../hooks/useEditProfile";
import useShowToast from "../hooks/useShowToast";

export default function EditProfile({ isOpen, onClose }) {
  const authUser = useAuthStore((state) => state.user);
  const fileRef = useRef(null)
  const {handleImageChange, selectedFile, setSelectedFile} = usePreviewImg();
  const {isUpdating, editProfile} = useEditProfile();
  const showToast = useShowToast();

  const [inputs, setInputs] = useState({
    fullName: authUser.fullName,
    username: authUser.username,
    bio:authUser.bio,
  });

  const handleFullNameChange = (event) => {
    const value = event.target.value;
    setInputs({ ...inputs, fullName: value });
  };
  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setInputs({ ...inputs, username: value });
  };

  const handleBioChange = (event) => {
    const value = event.target.value;
    setInputs({ ...inputs, bio: value });
  }

  const handleEditProfile = async () => {
    try {
      await editProfile(inputs, selectedFile)
      setSelectedFile(null)
      onClose();
    } 
    catch (error) {
      showToast("Error", error.message, "error")
    }
  }


  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg={"black"}
          boxShadow={"xl"}
          border={"1px solid gray"}
          mx={3}
        >
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            {/* Container Flex */}
            <Flex bg={"black"}>
              <Stack
                spacing={4}
                w={"full"}
                maxW={"md"}
                bg={"black"}
                p={6}
                my={0}
              >
                <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
                  {" "}
                  Edit Profile
                </Heading>
                <FormControl>
                  <Stack direction={["column", "row"]} spacing={6}>
                    <Center>
                      <Avatar size="xl" src={selectedFile || authUser.profilePicURL} border={"2px solid white "} />
                    </Center>{" "}
                    <Center w="full">
                      <Button w="full" onClick={() => fileRef.current.click()}>Edit Profile Picture</Button>
                    </Center>
                    <Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
                  </Stack>{" "}
                </FormControl>

                <FormControl>
                  <FormLabel fontSize={"sm"}>Full Name</FormLabel>
                  <Input 
                  value={inputs.fullName} 
                  // onChange={(e) => setInputs({...inputs, fullName:e.target.value})}
                  onChange={handleFullNameChange}
                  placeholder={"Full Name"} 
                  size={"sm"} 
                  type={"text"} 
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEditProfile()
                    }
                  }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize={"sm"}>Username</FormLabel>
                  <Input 
                  value={inputs.username}
                  // onChange={(e) => setInputs({...inputs, username:e.target.value})}
                  onChange={handleUsernameChange} 
                  placeholder={"Username"} 
                  size={"sm"} 
                  type={"text"} />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize={"sm"}>Bio</FormLabel>
                  <Input 
                  value={inputs.bio}
                  // onChange={(e) => setInputs({...inputs, bio:e.target.value})}
                  onChange={handleBioChange}
                   placeholder={"Bio"} 
                   size={"sm"} 
                   type={"text"} />
                </FormControl>

                <Stack spacing={6} direction={["column", "row"]}>
                  <Button
                    bg={"red.400"}
                    color={"white"}
                    w="full"
                    size="sm"
                    _hover={{ bg: "red.500" }}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    size="sm"
                    w="full"
                    _hover={{ bg: "blue.500" }}
                    onClick={handleEditProfile}
                    isLoading={isUpdating}
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>{" "}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}


