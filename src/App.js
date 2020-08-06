/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/core";
import { Box, Flex } from "@chakra-ui/core";
import Drop from "./Drop";

function App() {
  const titleSyle = {
    textAlign: "center",
    margin: "50px auto",
  };

  return (
    <div className="App">
      <h1 style={titleSyle}>Quick Win Migrations</h1>
      <Box
        mx="auto"
        textAlign="center"
        maxWidth="400px"
        width="80%"
        margin="0 auto"
      >
        <h3 css={{}}>Things to do:</h3>
        <ol
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <li css={{ margin: "10px auto" }}>Upload your file (.xlsx, .xlsb)</li>
          <li css={{ margin: "10px auto" }}>
            Run and wait for button "Get File" appear
          </li>
          <li css={{ margin: "10px auto" }}>
            Done! Your migrations are clean now
          </li>
        </ol>
      </Box>
      <Drop></Drop>
    </div>
  );
}

export default App;
