import xlsx from "xlsx";

const newData = [];
const errorData = [];

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
  data.forEach((row) => {
    const email = row["Email"] || "";
    const name = row["Nombre"] || "";
    const lastname = row["Apellido"] || "";
    const dateBirthday =
      typeof row["Fecha de Nacimiento"] !== "object"
        ? parseInt(row["Fecha de Nacimiento"])
        : row["Fecha de Nacimiento"];
    row = row
      ? row
      : {
          "Codigo(opcional)": "",
          Nombre: "",
          Apellido: "",
          Email: "",
          "Fecha de Nacimiento": "",
          Genero: "",
          Telefono: "",
          Movil: "",
        };

    if (!validations.isValid(name)) {
      return errorData.push(row);
    }
    if (!validations.isValid(lastname)) {
      console.log(lastname);
      return errorData.push(row);
    }
    if (!validations.isEmail(email)) {
      return errorData.push(row);
    }
    const duplicateRow = newData.findIndex((row) => row["Email"] === email);
    if (duplicateRow !== -1) {
      errorData.push(newData[duplicateRow]);
      newData.splice(duplicateRow, 1);
      errorData.push(row);
      return;
    }
    if (typeof dateBirthday !== "object") {
      if (typeof dateBirthday === "number" || dateBirthday === 0) {
        const thisYear = new Date().getFullYear();
        const year = thisYear - dateBirthday;
        row["Fecha de Nacimiento"] = new Date(`01/01/${year}`);
      } else {
        return errorData.push(row);
      }
    }
    const isPhone = row["Telefono Movil"] || "";
    const phone = isPhone.toString();
    const newphone = phone.replace(/\D*/g, "");
    row["Telefono Movil"] = newphone;
    newData.push(row);
    emails.push(email);
  });
  console.log({ newData, errorData });
  return { newData, errorData };
};

export { handleMigrations, newBook };
