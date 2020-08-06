import xlsx from "xlsx";

const validations = {
  isEmail: function matchEmail(str) {
    const testregex = str.match(/(.+)@(.*)\.(.*)/);
    return testregex ? true : false;
  },
  isOnlyText: function matchPhone(phone) {
    const testregex = phone.match(/\d+/);
    return testregex ? true : false;
  },
  isValid: function matchValue(str) {
    return str !== "";
  },
};

const emails = [];
export function s2ab(s) {
  var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  var view = new Uint8Array(buf); //create uint8array as viewer
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
  return buf;
}

const newBook = (newData, errorData) => {
  const wb = xlsx.utils.book_new();
  wb.Props = {
    Title: "Quick Migrations",
    Subject: "Fast validate migrations",
    Author: "Robert Medina",
    CreatedDate: new Date(),
  };
  wb.SheetNames.push("DATA VALIDATED");
  wb.SheetNames.push("DATA REJECTED");
  const wsv = xlsx.utils.json_to_sheet(newData);
  const wsr = xlsx.utils.json_to_sheet(errorData);
  wb.Sheets["DATA VALIDATED"] = wsv;
  wb.Sheets["DATA REJECTED"] = wsr;
  const wbout = xlsx.write(wb, { bookType: "xlsx", type: "binary" });
  return wbout;
};

const handleMigrations = (data) => {
  const newData = [];
  const errorData = [];
  data.forEach((row) => {
    const lastname = row["Apellido"] || "";

    const newRow = {
      "Codigo(opcional)": row["Codigo(opcional)"] || "",
      Nombre: row["Nombre"] || "",
      Apellido: row["Apellido"] || "",
      "Numero de Documento de Identidad":
        row["Numero de Documento de Identidad"] || "",
      Email: row["Email"] || "",
      "Contacto de emergencia": row["Contacto de emergencia"] || "",
      "Telefono de emergencia": row["Telefono de emergencia"] || "",
      "Fecha de Nacimiento": row["Fecha de Nacimiento"] || "",
      Direccion: row["Direccion"] || "",
      Genero: row["Genero"] || "",
      "Telefono Movil": row["Telefono Movil"] || "",
    };
    // row["Codigo(opcional)"] = row["Codigo(opcional)"] || "";
    // row["Nombre"] = row["Nombre"] || "";
    // row["Apellido"] = row["Apellido"] || "";
    // row["Numero de Documento de Identidad"] =
    //   row["Numero de Documento de Identidad"] || "";
    // row["Email"] = row["Email"] || "";
    // row["Contacto de emergencia"] = row["Contacto de emergencia"] || "";
    // row["Telefono de emergencia"] = row["Telefono de emergencia"] || "";
    // row["Fecha de Nacimiento"] = row["Fecha de Nacimiento"] || "";
    // row["Genero"] = row["Genero"] || "";
    // row["Telefono Movil"] = row["Telefono Movil"] || "";

    const email = newRow["Email"] || "";
    const name = newRow["Nombre"] || "";

    if (!validations.isValid(name)) {
      newRow["error"] = "Nombre inválido";
      return errorData.push(newRow);
    }
    if (!validations.isValid(lastname)) {
      newRow["error"] = "Apellido inválido";
      return errorData.push(newRow);
    }
    if (!validations.isEmail(email)) {
      newRow["error"] = "Email inválido";
      return errorData.push(newRow);
    }
    const duplicateRow = newData.findIndex((row2) => row2["Email"] === email);
    if (duplicateRow !== -1) {
      newData[duplicateRow]["error"] = "Email se repite";
      errorData.push(newData[duplicateRow]);
      newData.splice(duplicateRow, 1);
      newRow["error"] = "Email se repite";
      errorData.push(newRow);
      return;
    }
    const dateBirthday =
      typeof newRow["Fecha de Nacimiento"] !== "object"
        ? parseInt(newRow["Fecha de Nacimiento"])
        : newRow["Fecha de Nacimiento"];
    if (typeof dateBirthday !== "object") {
      if (typeof dateBirthday === "number" || dateBirthday === 0) {
        const thisYear = new Date().getFullYear();
        let year = thisYear - dateBirthday;
        const date = new Date(`${year}/01/01`);
        newRow["Fecha de Nacimiento"] = date;
        if (date === "Invalid Date") {
          newRow["Fecha de Nacimiento"] = date;
          newRow["error"] = "Fecha inválida";
          return errorData.push(newRow);
        } else {
          newRow["Fecha de Nacimiento"] = date;
        }
      } else {
        newRow["error"] = "Fecha inválida";
        return errorData.push(newRow);
      }
    }
    const isPhone = newRow["Telefono Movil"];
    const phone = isPhone.toString();
    const newphone = phone.replace(/\D*/g, "");
    newRow["Telefono Movil"] = newphone;
    newData.push(newRow);
    emails.push(email);
  });

  console.log({ newData, errorData });
  return { newData, errorData };
};

export { handleMigrations, newBook };
