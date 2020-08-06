/** @jsx jsx */

import xlsx from "xlsx";
import { saveAs } from "file-saver";
import { jsx, css } from "@emotion/core";
import { FileDrop } from "react-file-drop";
import { Box, Flex } from "@chakra-ui/core";
import { useState } from "react";
import { handleMigrations, newBook, s2ab } from "./scripts";

const actionButtonStyle = {
  background: "#ffffff",
  border: "1px solid rgb(29, 202, 184)",
  margin: "10px auto",
  color: "rgb(29, 202, 184)",
  padding: "4px 10px ",
  borderRadius: "5px",
  cursor: "pointer",
};

export const Drop = () => {
  const [withFile, setWithFile] = useState(false);
  const [currentFile, setCurrentFile] = useState({});
  const [workBookOut, setWorkBookOut] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

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
    setIsLoading(true);
    if (currentFile === {}) return alert("You haven't dropped any file");
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
      const { newData, errorData } = handleMigrations(d);
      const wbout = newBook(newData, errorData);
      setWorkBookOut(wbout);
    };
    reader.readAsArrayBuffer(currentFile);
  };

  const getFile = () => {
    saveAs(
      new Blob([s2ab(workBookOut)], { type: "application/octet-stream" }),
      "migrations.xlsx"
    );
    setCurrentFile({});
    setWorkBookOut(null);
    setWithFile(false);
    setIsLoading(false);
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
          border: "1px solid rgb(29, 202, 184)",
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
          border: 1px solid rgb(29, 202, 184);
          background: rgb(29, 202, 184);
          color: #ffffff;
          transition: all 0.5s;
          border-radius: 5px;
          &:hover {
            background: #ffffff;
            color: rgb(29, 202, 184);
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
      {!isLoading && (
        <Box {...actionButtonStyle} onClick={handleSubmit}>
          Run
        </Box>
      )}
      {isLoading && !workBookOut && <span>Loading...</span>}
      {workBookOut && (
        <Box {...actionButtonStyle} onClick={() => getFile()}>
          Get File
        </Box>
      )}
    </Flex>
  );
};
