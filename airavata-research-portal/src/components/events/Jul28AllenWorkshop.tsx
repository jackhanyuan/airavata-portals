import {Heading, VStack} from "@chakra-ui/react";
import {KeyPair} from "../typography/KeyPair";

export const Jul28AllenWorkshop = () => {
  return (
      <>
        <Heading fontSize="3xl" lineHeight={1.2}>
          2025 Allen Institute Modeling Software Workshop (July 28-30, 2025)
        </Heading>
        <VStack gap={1} align="start" mt={2}>
          <KeyPair
              keyStr="Workshop Details"
              valueStr="https://alleninstitute.org/events/2025-modeling-software-workshop"
          />
          <KeyPair
              keyStr="User Instructions"
              valueStr="Cybershuttle Instructions for Allen Workshop.pdf"
              href="https://drive.google.com/file/d/1MzkMzdHrJCxj0_zSUcjclj_4jRVFZh7L/view?usp=sharing"
          />
          <KeyPair
              keyStr="FAQ"
              valueStr="Cybershuttle FAQ for Allen Workshop.pdf"
              href="https://drive.google.com/file/d/1h01m-eOLp88S6p0RA4uppg37LWQM6toL/view?usp=sharing"
          />
        </VStack>
      </>
  );
};
