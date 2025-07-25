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
              href="https://drive.google.com/file/d/1SxGttJkyTTyYxs_9lNPxbabJ2AjDssor/view?usp=sharing"
          />
          <KeyPair
              keyStr="FAQ"
              valueStr="Common Cybershuttle FAQ.pdf"
              href="https://drive.google.com/file/d/119Xhc9_yvm20DKulaFEU6k8PNwnWcPow/view?usp=sharing"
          />
        </VStack>
      </>
  );
};
