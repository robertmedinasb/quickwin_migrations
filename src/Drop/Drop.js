/** @jsx jsx */

import xlsx from "xlsx";
import { jsx, css } from "@emotion/core";
import { FileDrop } from "react-file-drop";
import { Box, Flex } from "@chakra-ui/core";
import { useState } from "react";
import { handleMigrations } from "./scripts";

export const Drop = () => {
  const [withFile, setWithFile] = useState(false);
  const [currentFile, setCurrentFile] = useState({});

  const validateExtension = (fileName) => {
    const test = fileName.match(/((\w+)\.((xlsx)|(xlsb)|(xls)|(ods)))/);
    return test ? true : false;
  };
  const handleDrop = (files) => {
    if (validateExtension(files[0].name)) {
      setCurrentFile(files[0]);
      return setWithFile(true);
    }
    return alert("Must be a spreadsheet file");
  };
  const handleUpload = (event) => {
    let file = event.target.files[0];
    if (file && validateExtension(file.name)) {
      setCurrentFile(file);
      return setWithFile(true);
    }
    return alert("Must be a spreadsheet file");
  };
  const handleSubmit = () => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = xlsx.read(data, {
        type: "array",
        cellDates: true,
      });
      const nameSheets = workbook.SheetNames;
      const d = xlsx.utils.sheet_to_json(workbook.Sheets[nameSheets[0]], {
        cellDates: true,
      });
      localStorage.setItem("data", d);
      handleMigrations(d);
    };
    reader.readAsArrayBuffer(currentFile);
  };

  return (
    <Flex
      direction="column"
      w="80%"
      maxW="350px"
      mx="auto"
      justifyContent="center"
      alignItems="center"
    >
      <FileDrop
        css={{
          padding: "40px 20px",
          border: "1px solid #000000",
          borderRadius: "10px",
          width: "90%",
          display: "flex",
          justifyContent: "center",
          margin: "20px auto",
          marginBottom: "0",
        }}
        onDrop={(files, event) => handleDrop(files, event)}
      >
        {!withFile && <div>Drop your excel file here!</div>}
        {withFile && (
          <div css={{ color: "blue", fontWeight: "600" }}>
            {currentFile.name}
          </div>
        )}
      </FileDrop>
      <div css={{ textAlign: "center", margin: "10px auto" }}>or...</div>
      <label
        css={css`
          cursor: pointer;
          padding: 6px 8px;
          border: 1px solid #000000;
          background: blue;
          color: #ffffff;
          transition: all 0.5s;
          border-radius: 5px;
          &:hover {
            background: #ffffff;
            color: blue;
          }
        `}
      >
        Choose File here
        <input
          type="file"
          name="files"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          css={{ display: "none" }}
          onChange={(event) => handleUpload(event)}
        />
      </label>
      <Box onClick={handleSubmit}>Run </Box>
    </Flex>
  );
};
